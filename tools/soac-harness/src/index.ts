#!/usr/bin/env node
/* ============================================================================
 * SOaC Harness CLI — Entry Point
 * ============================================================================
 * Usage:
 *   soac-harness validate --path <dir|file> [--level 1|2] [--format text|json]
 *   soac-harness replay   --packages-dir <dir> --scenarios <file> --registry <file>
 *                         [--format text|json]
 *
 * Commands:
 *   validate  — Level 1/2 schema & semantic validation of individual YAML files
 *   replay    — Level 3 scenario replay: maps scenario steps to detection/playbook
 *               triggers, computes MITRE coverage, and writes Evidence Bundles
 *               (evidence-manifest.json + replay-report.md) per package.
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more packages/files failed
 *   2 — invalid arguments or missing paths
 * ============================================================================ */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { runLevel1 } from './level1';
import { runLevel2 } from './level2';
import { runLevel3 } from './level3';
import { FileResult, HarnessResult, Finding } from './types';

/* ── Argument types ──────────────────────────────────────── */
interface ValidateArgs {
  command: 'validate';
  targetPath: string;
  level: 1 | 2;
  format: 'text' | 'json';
}

interface ReplayArgs {
  command: 'replay';
  packagesDir: string;
  scenariosPath: string;
  registryPath: string;
  format: 'text' | 'json';
}

type CliArgs = ValidateArgs | ReplayArgs;

/* ── Argument parsing ────────────────────────────────────── */
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === 'validate') {
    let targetPath = '.';
    let level: 1 | 2 = 2;
    let format: 'text' | 'json' = 'text';

    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--path' && args[i + 1]) { targetPath = args[++i]; }
      else if (args[i] === '--level' && args[i + 1]) { level = parseInt(args[++i], 10) as 1 | 2; }
      else if (args[i] === '--format' && args[i + 1]) { format = args[++i] as 'text' | 'json'; }
    }
    return { command: 'validate', targetPath, level, format };
  }

  if (cmd === 'replay') {
    let packagesDir = '';
    let scenariosPath = '';
    let registryPath = '';
    let format: 'text' | 'json' = 'text';

    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--packages-dir' && args[i + 1]) { packagesDir = args[++i]; }
      else if (args[i] === '--scenarios' && args[i + 1]) { scenariosPath = args[++i]; }
      else if (args[i] === '--registry' && args[i + 1]) { registryPath = args[++i]; }
      else if (args[i] === '--format' && args[i + 1]) { format = args[++i] as 'text' | 'json'; }
    }

    if (!packagesDir || !scenariosPath || !registryPath) {
      console.error('Usage: soac-harness replay --packages-dir <dir> --scenarios <file> --registry <file> [--format text|json]');
      process.exit(2);
    }
    return { command: 'replay', packagesDir, scenariosPath, registryPath, format };
  }

  console.error('Usage:');
  console.error('  soac-harness validate --path <dir|file> [--level 1|2] [--format text|json]');
  console.error('  soac-harness replay   --packages-dir <dir> --scenarios <file> --registry <file> [--format text|json]');
  process.exit(2);
}

/* ── File discovery ──────────────────────────────────────── */
function findYamlFiles(targetPath: string): string[] {
  const resolved = path.resolve(targetPath);
  if (!fs.existsSync(resolved)) {
    console.error(`Path not found: ${resolved}`);
    process.exit(2);
  }

  const stat = fs.statSync(resolved);
  if (stat.isFile()) return [resolved];

  const files: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        walk(full);
      } else if (/\.ya?ml$/i.test(entry.name)) {
        files.push(full);
      }
    }
  }
  walk(resolved);
  return files.sort();
}

/* ── Validate single file ───────────────────────────────── */
function validateFile(filePath: string, level: 1 | 2): FileResult {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const rel = path.relative(process.cwd(), filePath);

  // Parse YAML
  let parsed: Record<string, unknown>;
  try {
    const doc = yaml.load(raw);
    if (typeof doc !== 'object' || doc === null) {
      return {
        file: rel, kind: null, level1: 'SKIP', level2: 'SKIP',
        findings: [{ file: rel, line: null, field: 'root', message: 'Not a YAML object (might be a list or scalar)', severity: 'info', level: 1 }],
      };
    }
    parsed = doc as Record<string, unknown>;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'YAML parse error';
    return {
      file: rel, kind: null, level1: 'FAIL', level2: 'SKIP',
      findings: [{ file: rel, line: null, field: 'root', message: `YAML parse error: ${msg}`, severity: 'error', level: 1 }],
    };
  }

  // Skip files without kind (not SOaC artifacts)
  if (!parsed.kind && !parsed.apiVersion) {
    return {
      file: rel, kind: null, level1: 'SKIP', level2: 'SKIP',
      findings: [{ file: rel, line: null, field: 'root', message: 'No apiVersion/kind — not a SOaC artifact, skipping', severity: 'info', level: 1 }],
    };
  }

  // Level 1
  const { kind, findings: l1findings } = runLevel1(parsed, raw, rel);
  const l1errors = l1findings.filter(f => f.severity === 'error');
  const l1pass = l1errors.length === 0;

  const result: FileResult = {
    file: rel,
    kind,
    level1: l1pass ? 'PASS' : 'FAIL',
    level2: 'SKIP',
    findings: [...l1findings],
  };

  // Level 2 (only if L1 passed and level >= 2)
  if (l1pass && level >= 2 && kind) {
    const l2findings = runLevel2(parsed, raw, rel, kind);
    result.findings.push(...l2findings);
    const l2errors = l2findings.filter(f => f.severity === 'error');
    result.level2 = l2errors.length === 0 ? 'PASS' : 'FAIL';
  }

  return result;
}

/* ── Reporter ───────────────────────────────────────────── */
function printText(result: HarnessResult) {
  const bar = '═'.repeat(60);
  console.log(`\n${bar}`);
  console.log(`  SOaC Harness — Validation Report`);
  console.log(`  Level: ${result.maxLevel} | Files: ${result.totalFiles} | ${result.timestamp}`);
  console.log(`${bar}\n`);

  for (const fr of result.files) {
    if (fr.level1 === 'SKIP' && fr.level2 === 'SKIP') continue; // don't print skipped

    const l1badge = fr.level1 === 'PASS' ? '✓ L1' : fr.level1 === 'FAIL' ? '✗ L1' : '- L1';
    const l2badge = fr.level2 === 'PASS' ? '✓ L2' : fr.level2 === 'FAIL' ? '✗ L2' : '- L2';
    const status = (fr.level1 === 'FAIL' || fr.level2 === 'FAIL') ? 'FAIL' : 'PASS';
    const icon = status === 'PASS' ? '✅' : '❌';

    console.log(`${icon} ${fr.file}  [${l1badge}] [${l2badge}]  kind=${fr.kind || 'unknown'}`);

    const errs = fr.findings.filter(f => f.severity === 'error');
    const warns = fr.findings.filter(f => f.severity === 'warning');

    for (const f of errs) {
      console.log(`   ❌ L${f.level} ERROR  ${f.field}${f.line ? ` (line ${f.line})` : ''}: ${f.message}`);
    }
    for (const f of warns) {
      console.log(`   ⚠️  L${f.level} WARN   ${f.field}${f.line ? ` (line ${f.line})` : ''}: ${f.message}`);
    }
    if (errs.length === 0 && warns.length === 0) {
      console.log('   No issues found.');
    }
    console.log('');
  }

  console.log(`${bar}`);
  console.log(`  PASSED: ${result.passed}  FAILED: ${result.failed}  SKIPPED: ${result.skipped}`);
  console.log(`  Exit code: ${result.exitCode}`);
  console.log(`${bar}\n`);
}

/* ── Replay reporter ─────────────────────────────────────── */
function printReplayText(manifests: import('./level3').EvidenceManifest[], exitCode: number) {
  const bar = '═'.repeat(60);
  console.log(`\n${bar}`);
  console.log(`  SOaC Harness — Level 3 Replay Report`);
  console.log(`  Packages: ${manifests.length} | ${new Date().toISOString()}`);
  console.log(`${bar}\n`);

  for (const m of manifests) {
    const icon = m.verdict === 'PASS' ? '✅' : m.verdict === 'PARTIAL' ? '⚠️' : '❌';
    console.log(`${icon} ${m.package_id} — ${m.package_name}`);
    console.log(`    Verdict: ${m.verdict}`);
    console.log(`    MITRE coverage: ${m.summary.coverage_pct}% (${m.summary.mitre_techniques_exercised}/${m.summary.mitre_techniques_declared})`);
    console.log(`    Detection triggers: ${m.summary.detection_triggers}  |  Playbook actions: ${m.summary.playbook_actions}`);
    console.log(`    Steps: ${m.summary.total_steps} total (Body: ${m.summary.body_steps}, Brain: ${m.summary.brain_steps}, Purpose: ${m.summary.purpose_steps}, Edge: ${m.summary.edge_steps})`);
    console.log('');
  }

  const passed = manifests.filter(m => m.verdict === 'PASS').length;
  const partial = manifests.filter(m => m.verdict === 'PARTIAL').length;
  const failed = manifests.filter(m => m.verdict === 'FAIL').length;

  console.log(`${bar}`);
  console.log(`  PASS: ${passed}  PARTIAL: ${partial}  FAIL: ${failed}`);
  console.log(`  Exit code: ${exitCode}`);
  console.log(`${bar}\n`);
}

/* ── Main ───────────────────────────────────────────────── */
function main() {
  const cliArgs = parseArgs();

  /* ── replay command ──────────────────────────────────── */
  if (cliArgs.command === 'replay') {
    console.log('\n🔁 SOaC Harness — Level 3: Scenario Replay & Evidence Generation\n');
    const { manifests, exitCode } = runLevel3(
      cliArgs.packagesDir,
      cliArgs.scenariosPath,
      cliArgs.registryPath,
    );

    if (cliArgs.format === 'json') {
      console.log(JSON.stringify({ manifests, exitCode }, null, 2));
    } else {
      printReplayText(manifests, exitCode);
    }

    process.exit(exitCode);
  }

  /* ── validate command (default) ──────────────────────── */
  const { targetPath, level, format } = cliArgs;
  const files = findYamlFiles(targetPath);

  if (files.length === 0) {
    console.error('No YAML files found at', targetPath);
    process.exit(2);
  }

  const results: FileResult[] = files.map(f => validateFile(f, level));

  const nonSkipped = results.filter(r => r.level1 !== 'SKIP');
  const passed = nonSkipped.filter(r => r.level1 === 'PASS' && (r.level2 === 'PASS' || r.level2 === 'SKIP')).length;
  const failed = nonSkipped.filter(r => r.level1 === 'FAIL' || r.level2 === 'FAIL').length;
  const skipped = results.filter(r => r.level1 === 'SKIP').length;

  const harnessResult: HarnessResult = {
    files: results,
    totalFiles: files.length,
    passed,
    failed,
    skipped,
    maxLevel: level,
    timestamp: new Date().toISOString(),
    exitCode: failed > 0 ? 1 : 0,
  };

  if (format === 'json') {
    console.log(JSON.stringify(harnessResult, null, 2));
  } else {
    printText(harnessResult);
  }

  process.exit(harnessResult.exitCode);
}

main();
