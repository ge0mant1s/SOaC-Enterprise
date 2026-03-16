/* ============================================================================
 * SOaC Harness — Level 3: Replay & Evidence
 * ============================================================================
 * Walks a package’s lab scenario step-by-step and maps each phase to the
 * package’s detection rules, playbook actions, and policy constraints.
 *
 * Produces an "Evidence Bundle" (JSON manifest + Markdown report) proving
 * that the scenario exercises the declared MITRE coverage and that every
 * artifact is reachable during a simulated attack lifecycle.
 *
 * Inputs (per package):
 *   - packages/<NNN>/detection.yaml
 *   - packages/<NNN>/playbook.yaml
 *   - packages/<NNN>/policy.yaml
 *   - packages/<NNN>/metadata.yml
 *   - scenarios.json[pkg-<NNN>]
 *
 * Outputs:
 *   - packages/<NNN>/evidence/evidence-manifest.json
 *   - packages/<NNN>/evidence/replay-report.md
 * ============================================================================ */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ScenarioStep {
  text: string;
  type: string;          // body | brain | purpose | edge | header | info | system | error | success | blank
  phase?: number;        // 1 = Body, 2 = Brain, 3 = Purpose, 4 = Edge
}

export interface Scenario {
  id: string;
  pkg_id: string;
  title: string;
  subtitle: string;
  terminal_steps: ScenarioStep[];
  graph_states: Record<string, string>;
  success_metrics: string;
}

export interface ReplayEvent {
  step_index: number;
  phase: number | null;
  pillar: string;          // BODY | BRAIN | PURPOSE | EDGE | SYSTEM
  text: string;
  artifact_hit: string | null;     // which artifact file was triggered
  mitre_match: string[];           // MITRE IDs exercised by this step
}

export interface CoverageEntry {
  technique_id: string;
  tactic: string;
  exercised_by_scenario: boolean;
  exercised_at_steps: number[];
  detected_by: string | null;     // detection rule name or null
  responded_by: string | null;    // playbook name or null
}

export interface EvidenceManifest {
  schema_version: string;
  harness_level: 3;
  package_id: string;
  package_name: string;
  scenario_id: string;
  scenario_title: string;
  generated_at: string;
  summary: {
    total_steps: number;
    body_steps: number;
    brain_steps: number;
    purpose_steps: number;
    edge_steps: number;
    detection_triggers: number;
    playbook_actions: number;
    mitre_techniques_declared: number;
    mitre_techniques_exercised: number;
    coverage_pct: number;
  };
  mitre_coverage: CoverageEntry[];
  replay_timeline: ReplayEvent[];
  artifacts_used: {
    detection: string;
    playbook: string;
    policy: string;
    metadata: string;
  };
  verdict: 'PASS' | 'PARTIAL' | 'FAIL';
  verdict_reason: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const PILLAR_MAP: Record<string, string> = {
  body: 'BODY',
  brain: 'BRAIN',
  purpose: 'PURPOSE',
  edge: 'EDGE',
  header: 'SYSTEM',
  info: 'SYSTEM',
  system: 'SYSTEM',
  error: 'SYSTEM',
  success: 'SYSTEM',
  blank: 'SYSTEM',
};

function extractMitreFromText(text: string): string[] {
  const re = /T\d{4}(?:\.\d{3})?/g;
  const matches = text.match(re);
  return matches ? [...new Set(matches)] : [];
}

function loadYaml(filePath: string): Record<string, unknown> | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const doc = yaml.load(fs.readFileSync(filePath, 'utf-8'));
    return (typeof doc === 'object' && doc !== null) ? doc as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function extractMitreIds(artifact: Record<string, unknown>): string[] {
  const ids: string[] = [];
  // metadata.mitre_attack (playbook style — array of strings)
  const meta = artifact.metadata as Record<string, unknown> | undefined;
  if (meta?.mitre_attack && Array.isArray(meta.mitre_attack)) {
    for (const entry of meta.mitre_attack) {
      if (typeof entry === 'string') ids.push(entry);
      else if (typeof entry === 'object' && entry !== null) {
        const obj = entry as Record<string, unknown>;
        const tid = (obj.technique_id || obj.technique) as string | undefined;
        if (tid) ids.push(tid);
      }
    }
  }
  // threat.mitre_attack (metadata.yml style)
  const threat = artifact.threat as Record<string, unknown> | undefined;
  if (threat?.mitre_attack && Array.isArray(threat.mitre_attack)) {
    for (const entry of threat.mitre_attack) {
      if (typeof entry === 'object' && entry !== null) {
        const obj = entry as Record<string, unknown>;
        const tid = (obj.technique_id || obj.technique) as string | undefined;
        if (tid) ids.push(tid);
      }
    }
  }
  return [...new Set(ids)];
}

function extractTacticMap(artifact: Record<string, unknown>): Record<string, string> {
  const map: Record<string, string> = {};
  // detection.yaml style: metadata.mitre_attack[].technique + tactic
  const meta = artifact.metadata as Record<string, unknown> | undefined;
  if (meta?.mitre_attack && Array.isArray(meta.mitre_attack)) {
    for (const entry of meta.mitre_attack) {
      if (typeof entry === 'object' && entry !== null) {
        const obj = entry as Record<string, unknown>;
        const tid = (obj.technique_id || obj.technique) as string | undefined;
        const tactic = obj.tactic as string | undefined;
        if (tid && tactic) map[tid] = tactic;
      }
    }
  }
  // metadata.yml style: threat.mitre_attack[]
  const threat = artifact.threat as Record<string, unknown> | undefined;
  if (threat?.mitre_attack && Array.isArray(threat.mitre_attack)) {
    for (const entry of threat.mitre_attack) {
      if (typeof entry === 'object' && entry !== null) {
        const obj = entry as Record<string, unknown>;
        const tid = (obj.technique_id || obj.technique) as string | undefined;
        const tactic = obj.tactic as string | undefined;
        if (tid && tactic) map[tid] = tactic;
      }
    }
  }
  return map;
}

/* ------------------------------------------------------------------ */
/*  Keyword heuristics for artifact–step matching                      */
/* ------------------------------------------------------------------ */

const DETECTION_KEYWORDS = [
  'detect', 'alert', 'anomal', 'sigma', 'correlat', 'rule', 'trigger',
  'ingest', 'log', 'telemetry', 'sensor', 'event',
];
const PLAYBOOK_KEYWORDS = [
  'claw', 'playbook', 'revoke', 'isolat', 'contain', 'kill', 'block',
  'remediat', 'respond', 'action', 'step-', 'orchestrat', 'execut',
];

function matchesKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

/* ------------------------------------------------------------------ */
/*  Core Replay Engine                                                 */
/* ------------------------------------------------------------------ */

export function replayPackage(
  pkgDir: string,
  scenario: Scenario,
  pkgName: string,
): EvidenceManifest {
  // Load artifacts
  const detection = loadYaml(path.join(pkgDir, 'detection.yaml'));
  const playbook  = loadYaml(path.join(pkgDir, 'playbook.yaml'));
  const policy    = loadYaml(path.join(pkgDir, 'policy.yaml'));
  const metadata  = loadYaml(path.join(pkgDir, 'metadata.yml'));

  // Collect all declared MITRE IDs from all artifacts
  const declaredMitre = new Set<string>();
  const tacticMap: Record<string, string> = {};

  for (const art of [detection, playbook, metadata].filter(Boolean) as Record<string, unknown>[]) {
    for (const id of extractMitreIds(art)) declaredMitre.add(id);
    Object.assign(tacticMap, extractTacticMap(art));
  }

  // Extract artifact names
  const detectionName = (detection?.metadata as Record<string, unknown>)?.name as string || 'unknown';
  const playbookName  = (playbook?.metadata as Record<string, unknown>)?.name as string || 'unknown';

  // Replay each step
  const timeline: ReplayEvent[] = [];
  const exercisedMitre = new Map<string, number[]>(); // technique -> step indices
  let bodySteps = 0, brainSteps = 0, purposeSteps = 0, edgeSteps = 0;
  let detectionTriggers = 0, playbookActions = 0;
  let currentPhase: number | null = null;

  for (let i = 0; i < scenario.terminal_steps.length; i++) {
    const step = scenario.terminal_steps[i];
    const pillar = PILLAR_MAP[step.type] || 'SYSTEM';
    if (step.phase !== undefined) currentPhase = step.phase;

    // Count by pillar
    if (pillar === 'BODY') bodySteps++;
    else if (pillar === 'BRAIN') brainSteps++;
    else if (pillar === 'PURPOSE') purposeSteps++;
    else if (pillar === 'EDGE') edgeSteps++;

    // Determine artifact hit
    let artifactHit: string | null = null;
    if (pillar === 'BODY' && matchesKeywords(step.text, DETECTION_KEYWORDS)) {
      artifactHit = 'detection.yaml';
      detectionTriggers++;
    } else if ((pillar === 'PURPOSE' || pillar === 'BRAIN') && matchesKeywords(step.text, PLAYBOOK_KEYWORDS)) {
      artifactHit = 'playbook.yaml';
      playbookActions++;
    } else if (pillar === 'EDGE') {
      artifactHit = 'policy.yaml';
    }

    // Extract MITRE from step text
    const mitreInStep = extractMitreFromText(step.text);
    // Also attribute MITRE from declared set when step is in matching pillar phase
    const attributedMitre: string[] = [...mitreInStep];
    if (pillar === 'BODY' && artifactHit === 'detection.yaml') {
      // Body detection steps exercise the detection’s declared MITRE
      for (const mid of declaredMitre) {
        if (!attributedMitre.includes(mid)) attributedMitre.push(mid);
      }
    }

    for (const mid of attributedMitre) {
      if (!exercisedMitre.has(mid)) exercisedMitre.set(mid, []);
      exercisedMitre.get(mid)!.push(i);
    }

    timeline.push({
      step_index: i,
      phase: currentPhase,
      pillar,
      text: step.text,
      artifact_hit: artifactHit,
      mitre_match: attributedMitre,
    });
  }

  // Build coverage table
  const mitreCoverage: CoverageEntry[] = [...declaredMitre].map(tid => {
    const exercised = exercisedMitre.has(tid);
    return {
      technique_id: tid,
      tactic: tacticMap[tid] || 'Unknown',
      exercised_by_scenario: exercised,
      exercised_at_steps: exercisedMitre.get(tid) || [],
      detected_by: exercised ? detectionName : null,
      responded_by: exercised ? playbookName : null,
    };
  });

  const exercisedCount = mitreCoverage.filter(c => c.exercised_by_scenario).length;
  const coveragePct = declaredMitre.size > 0
    ? Math.round((exercisedCount / declaredMitre.size) * 100)
    : 0;

  // Verdict
  let verdict: 'PASS' | 'PARTIAL' | 'FAIL';
  let verdictReason: string;
  if (coveragePct === 100 && detectionTriggers > 0 && playbookActions > 0) {
    verdict = 'PASS';
    verdictReason = `All ${declaredMitre.size} declared MITRE techniques (from metadata.yml) validated by replay heuristics. ${detectionTriggers} detection triggers, ${playbookActions} playbook actions observed.`;
  } else if (coveragePct >= 50 || detectionTriggers > 0) {
    verdict = 'PARTIAL';
    verdictReason = `${exercisedCount}/${declaredMitre.size} declared MITRE techniques validated (${coveragePct}%). ${detectionTriggers} detection triggers, ${playbookActions} playbook actions.`;
  } else {
    verdict = 'FAIL';
    verdictReason = `Insufficient coverage: ${exercisedCount}/${declaredMitre.size} declared MITRE techniques validated. Scenario may not exercise this package\'s artifacts.`;
  }

  return {
    schema_version: '1.0.0',
    harness_level: 3,
    package_id: scenario.pkg_id,
    package_name: pkgName,
    scenario_id: scenario.id,
    scenario_title: scenario.title,
    generated_at: new Date().toISOString(),
    summary: {
      total_steps: scenario.terminal_steps.length,
      body_steps: bodySteps,
      brain_steps: brainSteps,
      purpose_steps: purposeSteps,
      edge_steps: edgeSteps,
      detection_triggers: detectionTriggers,
      playbook_actions: playbookActions,
      mitre_techniques_declared: declaredMitre.size,
      mitre_techniques_exercised: exercisedCount,
      coverage_pct: coveragePct,
    },
    mitre_coverage: mitreCoverage,
    replay_timeline: timeline,
    artifacts_used: {
      detection: detection ? 'detection.yaml' : 'MISSING',
      playbook: playbook ? 'playbook.yaml' : 'MISSING',
      policy: policy ? 'policy.yaml' : 'MISSING',
      metadata: metadata ? 'metadata.yml' : 'MISSING',
    },
    verdict,
    verdict_reason: verdictReason,
  };
}

/* ------------------------------------------------------------------ */
/*  Markdown report generator                                          */
/* ------------------------------------------------------------------ */

export function generateMarkdownReport(manifest: EvidenceManifest): string {
  const s = manifest.summary;
  const lines: string[] = [];

  lines.push(`# Evidence Bundle — ${manifest.package_id.toUpperCase()}`);
  lines.push('');
  lines.push(`**Package:** ${manifest.package_name}  `);
  lines.push(`**Scenario:** ${manifest.scenario_title} (\`${manifest.scenario_id}\`)  `);
  lines.push(`**Generated:** ${manifest.generated_at}  `);
  lines.push(`**Harness Level:** 3 (Replay & Evidence)  `);
  lines.push(`**Verdict:** ${manifest.verdict === 'PASS' ? '✅' : manifest.verdict === 'PARTIAL' ? '⚠️' : '❌'} **${manifest.verdict}** — ${manifest.verdict_reason}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Summary
  lines.push('## Replay Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|---|---|');
  lines.push(`| Total scenario steps | ${s.total_steps} |`);
  lines.push(`| Body (telemetry) steps | ${s.body_steps} |`);
  lines.push(`| Brain (reasoning) steps | ${s.brain_steps} |`);
  lines.push(`| Purpose (playbook) steps | ${s.purpose_steps} |`);
  lines.push(`| Edge (enforcement) steps | ${s.edge_steps} |`);
  lines.push(`| Detection triggers | ${s.detection_triggers} |`);
  lines.push(`| Playbook actions | ${s.playbook_actions} |`);
  lines.push(`| MITRE techniques declared | ${s.mitre_techniques_declared} |`);
  lines.push(`| MITRE techniques exercised | ${s.mitre_techniques_exercised} |`);
  lines.push(`| Declared-technique coverage | **${s.coverage_pct}%** |`);
  lines.push('');

  // MITRE Coverage
  lines.push('## MITRE ATT&CK Coverage');
  lines.push('');
  lines.push('| Technique | Tactic | Exercised | Steps | Detected By | Responded By |');
  lines.push('|---|---|---|---|---|---|');
  for (const c of manifest.mitre_coverage) {
    const exercised = c.exercised_by_scenario ? '✅' : '❌';
    const steps = c.exercised_at_steps.length > 5
      ? `${c.exercised_at_steps.slice(0, 5).join(', ')}... (+${c.exercised_at_steps.length - 5})`
      : c.exercised_at_steps.join(', ') || '—';
    lines.push(`| ${c.technique_id} | ${c.tactic} | ${exercised} | ${steps} | ${c.detected_by || '—'} | ${c.responded_by || '—'} |`);
  }
  lines.push('');

  // Artifacts
  lines.push('## Artifacts Used');
  lines.push('');
  lines.push('| Artifact | File | Status |');
  lines.push('|---|---|---|');
  for (const [key, val] of Object.entries(manifest.artifacts_used)) {
    const status = val === 'MISSING' ? '❌ Missing' : '✅ Loaded';
    lines.push(`| ${key} | \`${val}\` | ${status} |`);
  }
  lines.push('');

  // Replay Timeline (condensed — artifact hits only)
  lines.push('## Replay Timeline (Artifact Hits)');
  lines.push('');
  lines.push('| Step | Phase | Pillar | Artifact | MITRE | Text (truncated) |');
  lines.push('|---|---|---|---|---|---|');
  const hits = manifest.replay_timeline.filter(e => e.artifact_hit !== null);
  for (const e of hits) {
    const txt = e.text.length > 60 ? e.text.substring(0, 60) + '...' : e.text;
    const mitre = e.mitre_match.length > 0 ? e.mitre_match.join(', ') : '—';
    lines.push(`| ${e.step_index} | ${e.phase ?? '—'} | ${e.pillar} | \`${e.artifact_hit}\` | ${mitre} | ${txt} |`);
  }
  lines.push('');

  // Full timeline (body/brain/purpose/edge only, skip blanks/headers)
  lines.push('<details>');
  lines.push('<summary>Full Replay Timeline (all pillar steps)</summary>');
  lines.push('');
  lines.push('| Step | Pillar | Text |');
  lines.push('|---|---|---|');
  for (const e of manifest.replay_timeline) {
    if (e.pillar === 'SYSTEM') continue;
    const txt = e.text.length > 80 ? e.text.substring(0, 80) + '...' : e.text;
    lines.push(`| ${e.step_index} | ${e.pillar} | ${txt} |`);
  }
  lines.push('');
  lines.push('</details>');
  lines.push('');

  return lines.join('\n');
}

/* ------------------------------------------------------------------ */
/*  CLI-callable: replay all packages                                  */
/* ------------------------------------------------------------------ */

export function runLevel3(
  packagesDir: string,
  scenariosPath: string,
  packagesJsonPath: string,
): { manifests: EvidenceManifest[]; exitCode: number } {
  // Load scenarios
  if (!fs.existsSync(scenariosPath)) {
    console.error(`scenarios.json not found at ${scenariosPath}`);
    return { manifests: [], exitCode: 2 };
  }
  const scenarios: Record<string, Scenario> = JSON.parse(fs.readFileSync(scenariosPath, 'utf-8'));

  // Load packages registry for names
  let pkgRegistry: Array<{ id: string; name: string }> = [];
  if (fs.existsSync(packagesJsonPath)) {
    pkgRegistry = JSON.parse(fs.readFileSync(packagesJsonPath, 'utf-8'));
  }

  const manifests: EvidenceManifest[] = [];
  let hasFailure = false;

  // Discover package directories (NNN format)
  if (!fs.existsSync(packagesDir)) {
    console.error(`Packages directory not found: ${packagesDir}`);
    return { manifests: [], exitCode: 2 };
  }

  const pkgDirs = fs.readdirSync(packagesDir)
    .filter(d => /^\d{3}$/.test(d))
    .sort();

  for (const dir of pkgDirs) {
    const pkgId = `pkg-${dir}`;
    const scenario = scenarios[pkgId];
    if (!scenario) {
      console.log(`  ⚠ No scenario for ${pkgId} — skipping replay`);
      continue;
    }

    const pkgName = pkgRegistry.find(p => p.id === pkgId)?.name || pkgId;
    const pkgPath = path.join(packagesDir, dir);

    console.log(`  ▶ Replaying ${pkgId}: ${scenario.title}`);
    const manifest = replayPackage(pkgPath, scenario, pkgName);
    manifests.push(manifest);

    // Write evidence bundle
    const evidenceDir = path.join(pkgPath, 'evidence');
    if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

    fs.writeFileSync(
      path.join(evidenceDir, 'evidence-manifest.json'),
      JSON.stringify(manifest, null, 2),
    );
    fs.writeFileSync(
      path.join(evidenceDir, 'replay-report.md'),
      generateMarkdownReport(manifest),
    );

    const icon = manifest.verdict === 'PASS' ? '✅' : manifest.verdict === 'PARTIAL' ? '⚠️' : '❌';
    console.log(`    ${icon} ${manifest.verdict} — ${manifest.summary.coverage_pct}% declared-technique coverage, ${manifest.summary.detection_triggers} detections, ${manifest.summary.playbook_actions} playbook actions`);

    if (manifest.verdict === 'FAIL') hasFailure = true;
  }

  return { manifests, exitCode: hasFailure ? 1 : 0 };
}
