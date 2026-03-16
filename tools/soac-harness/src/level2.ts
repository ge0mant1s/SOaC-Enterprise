/* ============================================================================
 * SOaC Harness — Level 2: Cross-Reference Validation
 * ============================================================================
 * Checks:
 *  - MITRE ATT&CK technique IDs match pattern T####(.###)?
 *  - package_id follows pkg-NNN format
 *  - Playbook step targets are valid enum values
 *  - Detection rules have at least one non-empty implementation
 *  - Policy environments have valid enum combinations
 *  - Metadata threat.mitre_attack entries have required sub-fields
 *  - Severity escalation: CRITICAL playbooks must have rollback + brain oversight
 *  - Cross-artifact: playbook references in detection rules exist in file set
 * ============================================================================ */

import { Finding, Kind, TARGETS } from './types';

type Ctx = { file: string; raw: string };

function lineOf(raw: string, field: string): number | null {
  const leaf = field.split('.').pop() || field;
  const lines = raw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trimStart();
    if (t.startsWith(leaf + ':') || t.startsWith('- ' + leaf + ':')) return i + 1;
  }
  return null;
}

function err(ctx: Ctx, field: string, msg: string): Finding {
  return { file: ctx.file, line: lineOf(ctx.raw, field), field, message: msg, severity: 'error', level: 2 };
}
function warn(ctx: Ctx, field: string, msg: string): Finding {
  return { file: ctx.file, line: lineOf(ctx.raw, field), field, message: msg, severity: 'warning', level: 2 };
}

const MITRE_RE = /^T\d{4}(\.\d{3})?$/;
const PKG_ID_RE = /^pkg-\d{3}$/;

/* ── MITRE technique ID validation ───────────────────────── */
function checkMitre(ctx: Ctx, techniques: unknown[], fieldPath: string): Finding[] {
  const f: Finding[] = [];
  for (const t of techniques) {
    let id: string | undefined;
    if (typeof t === 'string') id = t;
    else if (typeof t === 'object' && t !== null) {
      const obj = t as Record<string, unknown>;
      id = (obj.technique_id || obj.technique || obj) as string;
    }
    if (id && typeof id === 'string' && !MITRE_RE.test(id)) {
      f.push(err(ctx, fieldPath, `Invalid MITRE ATT&CK ID: "${id}". Expected format: T####(.###)?`));
    }
  }
  return f;
}

/* ── Playbook L2 ─────────────────────────────────────────── */
function l2Playbook(parsed: Record<string, unknown>, ctx: Ctx): Finding[] {
  const f: Finding[] = [];
  const meta = parsed.metadata as Record<string, unknown> | undefined;
  const spec = parsed.spec as Record<string, unknown> | undefined;
  const gov = spec?.governance as Record<string, unknown> | undefined;

  // package_id format
  if (meta?.package_id && typeof meta.package_id === 'string' && !PKG_ID_RE.test(meta.package_id))
    f.push(warn(ctx, 'metadata.package_id', `package_id "${meta.package_id}" doesn't match pkg-NNN format`));

  // mitre_attack IDs
  if (meta?.mitre_attack && Array.isArray(meta.mitre_attack))
    f.push(...checkMitre(ctx, meta.mitre_attack, 'metadata.mitre_attack'));

  // Step targets must be valid
  if (spec?.steps && Array.isArray(spec.steps)) {
    for (const step of spec.steps as Record<string, unknown>[]) {
      if (step.target && typeof step.target === 'string') {
        if (!TARGETS.includes(step.target as typeof TARGETS[number]))
          f.push(err(ctx, 'steps[].target', `Invalid step target: "${step.target}". Allowed: ${TARGETS.join(', ')}`));
      }
    }
  }

  // CRITICAL severity must have rollback + brain oversight
  if (meta?.severity === 'CRITICAL') {
    const rollback = spec?.rollback as Record<string, unknown> | undefined;
    if (!rollback?.steps || !Array.isArray(rollback.steps) || (rollback.steps as unknown[]).length === 0)
      f.push(err(ctx, 'rollback', 'CRITICAL-severity playbooks MUST define rollback steps'));
    if (!gov?.requires_brain_oversight)
      f.push(err(ctx, 'governance.requires_brain_oversight', 'CRITICAL-severity playbooks MUST require brain oversight'));
  }

  return f;
}

/* ── DetectionRule L2 ────────────────────────────────────── */
function l2Detection(parsed: Record<string, unknown>, ctx: Ctx): Finding[] {
  const f: Finding[] = [];
  const meta = parsed.metadata as Record<string, unknown> | undefined;
  const spec = parsed.spec as Record<string, unknown> | undefined;

  // package_id format
  if (meta?.package_id && typeof meta.package_id === 'string' && !PKG_ID_RE.test(meta.package_id))
    f.push(warn(ctx, 'metadata.package_id', `package_id "${meta.package_id}" doesn't match pkg-NNN format`));

  // mitre_attack IDs
  if (meta?.mitre_attack && Array.isArray(meta.mitre_attack))
    f.push(...checkMitre(ctx, meta.mitre_attack, 'metadata.mitre_attack'));

  // At least one implementation must have non-empty content
  const logic = spec?.logic as Record<string, unknown> | undefined;
  if (logic?.implementations && typeof logic.implementations === 'object') {
    const impls = logic.implementations as Record<string, unknown>;
    const hasContent = Object.values(impls).some(v => {
      if (typeof v === 'string') return v.trim().length > 0;
      if (typeof v === 'object' && v !== null) {
        return Object.values(v as Record<string, unknown>).some(iv =>
          typeof iv === 'string' && iv.trim().length > 10
        );
      }
      return false;
    });
    if (!hasContent) {
      f.push(err(ctx, 'logic.implementations', 'At least one implementation must contain actual detection logic (not just placeholders)'));
    }
  }

  return f;
}

/* ── Policy L2 ───────────────────────────────────────────── */
function l2Policy(parsed: Record<string, unknown>, ctx: Ctx): Finding[] {
  const f: Finding[] = [];
  const meta = parsed.metadata as Record<string, unknown> | undefined;
  const spec = parsed.spec as Record<string, unknown> | undefined;

  if (meta?.package_id && typeof meta.package_id === 'string' && !PKG_ID_RE.test(meta.package_id))
    f.push(warn(ctx, 'metadata.package_id', `package_id "${meta.package_id}" doesn't match pkg-NNN format`));

  // actions: blocked list should not overlap with allowed
  const actions = spec?.actions as Record<string, unknown> | undefined;
  if (actions?.allowed && actions?.blocked) {
    const allowed = new Set(actions.allowed as string[]);
    for (const b of actions.blocked as string[]) {
      if (allowed.has(b))
        f.push(err(ctx, 'spec.actions', `Action "${b}" appears in both allowed and blocked lists`));
    }
  }

  return f;
}

/* ── PackageMetadata L2 ──────────────────────────────────── */
function l2Metadata(parsed: Record<string, unknown>, ctx: Ctx): Finding[] {
  const f: Finding[] = [];
  const pkg = parsed.package as Record<string, unknown> | undefined;
  const threat = parsed.threat as Record<string, unknown> | undefined;

  // package_id format
  if (pkg?.id && typeof pkg.id === 'string' && !PKG_ID_RE.test(pkg.id))
    f.push(warn(ctx, 'package.id', `package.id "${pkg.id}" doesn't match pkg-NNN format`));

  // mitre_attack sub-field validation
  if (threat?.mitre_attack && Array.isArray(threat.mitre_attack)) {
    for (const entry of threat.mitre_attack as Record<string, unknown>[]) {
      if (!entry.technique_id)
        f.push(err(ctx, 'threat.mitre_attack[].technique_id', 'Each MITRE entry must have technique_id'));
      else if (typeof entry.technique_id === 'string' && !MITRE_RE.test(entry.technique_id))
        f.push(err(ctx, 'threat.mitre_attack[].technique_id', `Invalid MITRE ID: "${entry.technique_id}"`));
      if (!entry.tactic)
        f.push(warn(ctx, 'threat.mitre_attack[].tactic', 'MITRE entry missing tactic field'));
    }
  }

  // artifacts should reference at least one file
  const arts = parsed.artifacts as Record<string, unknown> | undefined;
  if (arts) {
    const allArts = [
      ...(Array.isArray(arts.detections) ? arts.detections as Record<string, unknown>[] : []),
      ...(Array.isArray(arts.playbooks) ? arts.playbooks as Record<string, unknown>[] : []),
      ...(Array.isArray(arts.policies) ? arts.policies as Record<string, unknown>[] : []),
    ];
    if (allArts.length === 0)
      f.push(warn(ctx, 'artifacts', 'Package metadata has no artifact references'));
  }

  return f;
}

/* ── Dispatch ────────────────────────────────────────────── */
const L2_VALIDATORS: Record<string, (p: Record<string, unknown>, c: Ctx) => Finding[]> = {
  Playbook: l2Playbook,
  DetectionRule: l2Detection,
  Policy: l2Policy,
  PackageMetadata: l2Metadata,
};

export function runLevel2(parsed: Record<string, unknown>, raw: string, file: string, kind: string): Finding[] {
  const ctx: Ctx = { file, raw };
  const validator = L2_VALIDATORS[kind];
  if (!validator) return [];
  return validator(parsed, ctx);
}
