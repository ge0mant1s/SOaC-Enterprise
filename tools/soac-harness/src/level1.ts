/* ============================================================================
 * SOaC Harness — Level 1: Schema Validation
 * ============================================================================
 * Checks:
 *  - YAML parses correctly
 *  - Has apiVersion and kind
 *  - kind matches a known SOaC artifact type
 *  - All REQUIRED fields are present and correctly typed
 *  - Enum values are within allowed sets
 *  - Banned terms are absent
 * ============================================================================ */

import {
  Finding, Kind, VALID_KINDS, SEVERITIES, TARGETS, TRIGGER_SOURCES,
  OPERATORS, FAILURE_MODES, BACKOFF_MODES, BLAST_RADIUS, AUDIT_LEVELS,
  DATA_SOURCE_TYPES, LOGIC_TYPES, ESCALATION_MODES, CONFIDENCE_LEVELS,
  POLICY_SCOPES, ENV_MODES, DATA_HANDLING, NETWORK_ACCESS, PERSISTENCE,
  PERMISSIONS, AUTH_METHODS, REVIEW_FREQUENCY, STATUS_VALUES,
  BANNED_PATTERNS,
} from './types';

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
  return { file: ctx.file, line: lineOf(ctx.raw, field), field, message: msg, severity: 'error', level: 1 };
}
function warn(ctx: Ctx, field: string, msg: string): Finding {
  return { file: ctx.file, line: lineOf(ctx.raw, field), field, message: msg, severity: 'warning', level: 1 };
}

function checkEnum(ctx: Ctx, field: string, value: unknown, allowed: readonly string[], findings: Finding[]) {
  if (value && typeof value === 'string' && !allowed.includes(value)) {
    findings.push(err(ctx, field, `Invalid value "${value}". Allowed: ${allowed.join(', ')}`));
  }
}
function requireField(ctx: Ctx, obj: Record<string, unknown> | undefined, field: string, path: string, findings: Finding[]) {
  if (!obj || obj[field] === undefined || obj[field] === null || obj[field] === '') {
    findings.push(err(ctx, path, `Missing required field: ${path}`));
    return false;
  }
  return true;
}
function requireArray(ctx: Ctx, obj: Record<string, unknown> | undefined, field: string, path: string, findings: Finding[]) {
  if (!obj || !Array.isArray(obj[field])) {
    findings.push(err(ctx, path, `${path} must be an array`));
    return false;
  }
  return true;
}

/* ── Banned Term Scan ──────────────────────────────────── */
function scanBanned(ctx: Ctx): Finding[] {
  const findings: Finding[] = [];
  const lines = ctx.raw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    for (const { pattern, label } of BANNED_PATTERNS) {
      const re = new RegExp(pattern.source, pattern.flags);
      let m: RegExpExecArray | null;
      while ((m = re.exec(lines[i])) !== null) {
        findings.push({
          file: ctx.file, line: i + 1, field: `banned:${label}`,
          message: `Banned term "${label}" found`, severity: 'error', level: 1,
        });
      }
    }
  }
  return findings;
}

/* ── Playbook Schema ──────────────────────────────────── */
function validatePlaybook(parsed: Record<string, unknown>, ctx: Ctx): Finding[] {
  const f: Finding[] = [];
  if (parsed.apiVersion !== 'claw.soac.io/v1')
    f.push(warn(ctx, 'apiVersion', `Expected "claw.soac.io/v1", got "${parsed.apiVersion}"`));

  const meta = parsed.metadata as Record<string, unknown> | undefined;
  if (!meta || typeof meta !== 'object') { f.push(err(ctx, 'metadata', 'Missing required object: metadata')); return f; }
  requireField(ctx, meta, 'name', 'metadata.name', f);
  requireField(ctx, meta, 'version', 'metadata.version', f);
  requireField(ctx, meta, 'author', 'metadata.author', f);
  requireField(ctx, meta, 'severity', 'metadata.severity', f);
  checkEnum(ctx, 'metadata.severity', meta.severity, SEVERITIES, f);
  requireField(ctx, meta, 'package_id', 'metadata.package_id', f);
  if (meta.mitre_attack !== undefined && !Array.isArray(meta.mitre_attack))
    f.push(err(ctx, 'metadata.mitre_attack', 'mitre_attack must be an array'));

  const spec = parsed.spec as Record<string, unknown> | undefined;
  if (!spec || typeof spec !== 'object') { f.push(err(ctx, 'spec', 'Missing required object: spec')); return f; }
  requireField(ctx, spec, 'description', 'spec.description', f);

  // trigger
  const trigger = spec.trigger as Record<string, unknown> | undefined;
  if (!trigger || typeof trigger !== 'object') {
    f.push(err(ctx, 'spec.trigger', 'Missing required object: spec.trigger'));
  } else {
    requireField(ctx, trigger, 'source', 'trigger.source', f);
    checkEnum(ctx, 'trigger.source', trigger.source, TRIGGER_SOURCES, f);
    if (trigger.conditions !== undefined && !Array.isArray(trigger.conditions))
      f.push(err(ctx, 'trigger.conditions', 'trigger.conditions must be an array'));
    if (Array.isArray(trigger.conditions)) {
      for (const cond of trigger.conditions as Record<string, unknown>[]) {
        checkEnum(ctx, 'trigger.conditions[].operator', cond.operator, OPERATORS, f);
      }
    }
  }

  // inputs
  if (spec.inputs !== undefined && !Array.isArray(spec.inputs))
    f.push(err(ctx, 'spec.inputs', 'spec.inputs must be an array'));

  // steps
  if (!Array.isArray(spec.steps) || (spec.steps as unknown[]).length === 0) {
    f.push(err(ctx, 'spec.steps', 'spec.steps must be a non-empty array'));
  } else {
    for (const step of spec.steps as Record<string, unknown>[]) {
      requireField(ctx, step, 'id', 'steps[].id', f);
      requireField(ctx, step, 'name', 'steps[].name', f);
      requireField(ctx, step, 'action', 'steps[].action', f);
      requireField(ctx, step, 'target', 'steps[].target', f);
      checkEnum(ctx, 'steps[].target', step.target, TARGETS, f);
      if (step.on_failure) checkEnum(ctx, 'steps[].on_failure', step.on_failure, FAILURE_MODES, f);
      const retry = step.retry as Record<string, unknown> | undefined;
      if (retry?.backoff) checkEnum(ctx, 'steps[].retry.backoff', retry.backoff, BACKOFF_MODES, f);
    }
  }

  // governance
  const gov = parsed.governance as Record<string, unknown> | undefined;
  if (gov) {
    checkEnum(ctx, 'governance.max_blast_radius', gov.max_blast_radius, BLAST_RADIUS, f);
    checkEnum(ctx, 'governance.audit_level', gov.audit_level, AUDIT_LEVELS, f);
  }

  return f;
}

/* ── DetectionRule Schema ────────────────────────────────── */
function validateDetection(parsed: Record<string, unknown>, ctx: Ctx): Finding[] {
  const f: Finding[] = [];
  if (parsed.apiVersion !== 'soac.io/v1')
    f.push(warn(ctx, 'apiVersion', `Expected "soac.io/v1", got "${parsed.apiVersion}"`));

  const meta = parsed.metadata as Record<string, unknown> | undefined;
  if (!meta || typeof meta !== 'object') { f.push(err(ctx, 'metadata', 'Missing required object: metadata')); return f; }
  requireField(ctx, meta, 'name', 'metadata.name', f);
  requireField(ctx, meta, 'version', 'metadata.version', f);
  requireField(ctx, meta, 'author', 'metadata.author', f);
  requireField(ctx, meta, 'package_id', 'metadata.package_id', f);
  requireField(ctx, meta, 'severity', 'metadata.severity', f);
  checkEnum(ctx, 'metadata.severity', meta.severity, SEVERITIES, f);
  requireField(ctx, meta, 'confidence', 'metadata.confidence', f);
  checkEnum(ctx, 'metadata.confidence', meta.confidence, CONFIDENCE_LEVELS, f);
  if (!meta.mitre_attack || !Array.isArray(meta.mitre_attack))
    f.push(err(ctx, 'metadata.mitre_attack', 'metadata.mitre_attack must be a non-empty array'));

  const spec = parsed.spec as Record<string, unknown> | undefined;
  if (!spec || typeof spec !== 'object') { f.push(err(ctx, 'spec', 'Missing required object: spec')); return f; }
  requireField(ctx, spec, 'description', 'spec.description', f);

  // data_sources
  if (!Array.isArray(spec.data_sources) || (spec.data_sources as unknown[]).length === 0) {
    f.push(err(ctx, 'spec.data_sources', 'spec.data_sources must be a non-empty array'));
  } else {
    for (const ds of spec.data_sources as Record<string, unknown>[]) {
      requireField(ctx, ds, 'name', 'data_sources[].name', f);
      checkEnum(ctx, 'data_sources[].type', ds.type, DATA_SOURCE_TYPES, f);
    }
  }

  // logic
  const logic = spec.logic as Record<string, unknown> | undefined;
  if (!logic || typeof logic !== 'object') {
    f.push(err(ctx, 'spec.logic', 'Missing required object: spec.logic'));
  } else {
    checkEnum(ctx, 'logic.type', logic.type, LOGIC_TYPES, f);
    const impls = logic.implementations as Record<string, unknown> | undefined;
    if (!impls || typeof impls !== 'object' || Object.keys(impls).length === 0) {
      f.push(err(ctx, 'logic.implementations', 'At least one platform implementation is required'));
    }
  }

  // response
  const resp = spec.response as Record<string, unknown> | undefined;
  if (resp) {
    checkEnum(ctx, 'response.escalation', resp.escalation, ESCALATION_MODES, f);
  }

  return f;
}

/* ── Policy Schema ───────────────────────────────────────── */
function validatePolicy(parsed: Record<string, unknown>, ctx: Ctx): Finding[] {
  const f: Finding[] = [];
  if (parsed.apiVersion !== 'soac.io/v1')
    f.push(warn(ctx, 'apiVersion', `Expected "soac.io/v1", got "${parsed.apiVersion}"`));

  const meta = parsed.metadata as Record<string, unknown> | undefined;
  if (!meta || typeof meta !== 'object') { f.push(err(ctx, 'metadata', 'Missing required object: metadata')); return f; }
  requireField(ctx, meta, 'name', 'metadata.name', f);
  requireField(ctx, meta, 'version', 'metadata.version', f);
  requireField(ctx, meta, 'author', 'metadata.author', f);
  requireField(ctx, meta, 'scope', 'metadata.scope', f);
  checkEnum(ctx, 'metadata.scope', meta.scope, POLICY_SCOPES, f);

  const spec = parsed.spec as Record<string, unknown> | undefined;
  if (!spec || typeof spec !== 'object') { f.push(err(ctx, 'spec', 'Missing required object: spec')); return f; }
  requireField(ctx, spec, 'description', 'spec.description', f);

  // environments
  if (spec.environments && Array.isArray(spec.environments)) {
    for (const env of spec.environments as Record<string, unknown>[]) {
      requireField(ctx, env, 'name', 'environments[].name', f);
      checkEnum(ctx, 'environments[].mode', env.mode, ENV_MODES, f);
      if (env.data_handling) checkEnum(ctx, 'environments[].data_handling', env.data_handling, DATA_HANDLING, f);
      if (env.network_access) checkEnum(ctx, 'environments[].network_access', env.network_access, NETWORK_ACCESS, f);
      if (env.persistence) checkEnum(ctx, 'environments[].persistence', env.persistence, PERSISTENCE, f);
    }
  }

  // access_control
  const ac = spec.access_control as Record<string, unknown> | undefined;
  if (ac) {
    if (ac.roles && Array.isArray(ac.roles)) {
      for (const role of ac.roles as Record<string, unknown>[]) {
        requireField(ctx, role, 'name', 'access_control.roles[].name', f);
        if (role.permissions && Array.isArray(role.permissions)) {
          for (const p of role.permissions as string[]) {
            if (!PERMISSIONS.includes(p as typeof PERMISSIONS[number]))
              f.push(err(ctx, 'access_control.roles[].permissions', `Invalid permission: "${p}". Allowed: ${PERMISSIONS.join(', ')}`));
          }
        }
      }
    }
    const auth = ac.authentication as Record<string, unknown> | undefined;
    if (auth?.methods && Array.isArray(auth.methods)) {
      for (const m of auth.methods as string[]) {
        if (!AUTH_METHODS.includes(m as typeof AUTH_METHODS[number]))
          f.push(err(ctx, 'access_control.authentication.methods', `Invalid auth method: "${m}". Allowed: ${AUTH_METHODS.join(', ')}`));
      }
    }
  }

  // compliance
  const comp = spec.compliance as Record<string, unknown> | undefined;
  if (comp) {
    if (comp.review_frequency) checkEnum(ctx, 'compliance.review_frequency', comp.review_frequency, REVIEW_FREQUENCY, f);
  }

  // audit
  const audit = spec.audit as Record<string, unknown> | undefined;
  if (audit) {
    checkEnum(ctx, 'audit.log_level', audit.log_level, AUDIT_LEVELS, f);
  }

  return f;
}

/* ── PackageMetadata Schema ──────────────────────────────── */
function validateMetadata(parsed: Record<string, unknown>, ctx: Ctx): Finding[] {
  const f: Finding[] = [];

  const pkg = parsed.package as Record<string, unknown> | undefined;
  if (!pkg || typeof pkg !== 'object') { f.push(err(ctx, 'package', 'Missing required object: package')); return f; }
  requireField(ctx, pkg, 'id', 'package.id', f);
  requireField(ctx, pkg, 'name', 'package.name', f);
  requireField(ctx, pkg, 'version', 'package.version', f);
  requireField(ctx, pkg, 'description', 'package.description', f);
  requireField(ctx, pkg, 'author', 'package.author', f);
  requireField(ctx, pkg, 'status', 'package.status', f);
  checkEnum(ctx, 'package.status', pkg.status, STATUS_VALUES, f);

  // threat
  const threat = parsed.threat as Record<string, unknown> | undefined;
  if (!threat || typeof threat !== 'object') {
    f.push(err(ctx, 'threat', 'Missing required object: threat'));
  } else {
    requireField(ctx, threat, 'severity', 'threat.severity', f);
    checkEnum(ctx, 'threat.severity', threat.severity, SEVERITIES, f);
    if (!threat.mitre_attack || !Array.isArray(threat.mitre_attack))
      f.push(err(ctx, 'threat.mitre_attack', 'threat.mitre_attack must be a non-empty array'));
  }

  // artifacts
  const arts = parsed.artifacts as Record<string, unknown> | undefined;
  if (!arts || typeof arts !== 'object') {
    f.push(warn(ctx, 'artifacts', 'Missing artifacts section'));
  }

  // stakeholders
  if (!parsed.stakeholders || !Array.isArray(parsed.stakeholders))
    f.push(err(ctx, 'stakeholders', 'stakeholders must be a non-empty array'));

  // signals_required
  if (!parsed.signals_required || !Array.isArray(parsed.signals_required))
    f.push(err(ctx, 'signals_required', 'signals_required must be a non-empty array'));

  // validation
  const val = parsed.validation as Record<string, unknown> | undefined;
  if (val) {
    if (val.harness_level !== undefined && ![1, 2, 3].includes(val.harness_level as number))
      f.push(err(ctx, 'validation.harness_level', 'harness_level must be 1, 2, or 3'));
  }

  return f;
}

/* ── Dispatch ────────────────────────────────────────────── */
const VALIDATORS: Record<Kind, (p: Record<string, unknown>, c: Ctx) => Finding[]> = {
  Playbook: validatePlaybook,
  DetectionRule: validateDetection,
  Policy: validatePolicy,
  PackageMetadata: validateMetadata,
};

export function runLevel1(parsed: Record<string, unknown>, raw: string, file: string): { kind: Kind | null; findings: Finding[] } {
  const ctx: Ctx = { file, raw };
  const findings: Finding[] = [];

  // Banned term scan
  findings.push(...scanBanned(ctx));

  // apiVersion
  if (!parsed.apiVersion) {
    findings.push(err(ctx, 'apiVersion', 'Missing required field: apiVersion'));
  }

  // kind
  const kind = parsed.kind as string | undefined;
  if (!kind) {
    findings.push(err(ctx, 'kind', 'Missing required field: kind'));
    return { kind: null, findings };
  }
  if (!VALID_KINDS.includes(kind as Kind)) {
    findings.push(err(ctx, 'kind', `Unknown kind "${kind}". Expected: ${VALID_KINDS.join(', ')}`));
    return { kind: null, findings };
  }

  // Kind-specific validation
  findings.push(...VALIDATORS[kind as Kind](parsed, ctx));

  return { kind: kind as Kind, findings };
}
