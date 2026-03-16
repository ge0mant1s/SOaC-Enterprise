'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, AlertTriangle, FileCode, RotateCcw,
  Copy, Check, ChevronDown, Share2, ExternalLink, Loader2,
} from 'lucide-react';
import yaml from 'js-yaml';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import { GITHUB_DISCUSSIONS } from '@/lib/constants';
import { scanForBannedTerms } from '@/lib/banned-terms';

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */
type SchemaType = 'claw' | 'detection' | 'policy' | 'metadata';
type ValidationIssue = {
  line: number | null;
  field: string;
  message: string;
  severity: 'error' | 'warning';
};
type HarnessLevel = { level: 1 | 2; passed: boolean };
type ValidationResult = {
  valid: boolean;
  errors: ValidationIssue[];
  harnessLevels: HarnessLevel[];
};

/* ═══════════════════════════════════════════════════════════════
   CLAW Schema Constants
   ═══════════════════════════════════════════════════════════════ */
const CLAW_SEVERITY = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const CLAW_TRIGGER_SOURCE = ['BODY', 'BRAIN', 'MANUAL', 'SCHEDULED'];
const CLAW_PARAM_TYPES = ['string', 'number', 'boolean', 'array', 'object'];
const CLAW_ON_FAILURE = ['continue', 'abort', 'rollback', 'escalate'];
const CLAW_ACTIONS = ['api_call', 'script', 'decision', 'notify'];
const CLAW_BLAST_RADIUS = ['single_user', 'team', 'org', 'global'];
const CLAW_AUDIT_LEVEL = ['minimal', 'standard', 'verbose'];

/* ──── Line-number resolver ─────────────────────────────────── */
function findFieldLine(raw: string, fieldPath: string): number | null {
  const parts = fieldPath.replace(/\[\d+\]/g, '').split('.');
  const leaf = parts[parts.length - 1];
  const lines = raw.split('\n');
  // Walk from top to bottom, find first occurrence of the leaf key
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trimStart();
    if (trimmed.startsWith(leaf + ':') || trimmed.startsWith('- ' + leaf + ':')) {
      return i + 1;
    }
  }
  return null;
}

/* ──── CLAW Validator ───────────────────────────────────────── */
function validateCLAW(parsed: Record<string, unknown>, raw: string): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warn = (field: string, msg: string) =>
    errors.push({ line: findFieldLine(raw, field), field, message: msg, severity: 'warning' });
  const err = (field: string, msg: string) =>
    errors.push({ line: findFieldLine(raw, field), field, message: msg, severity: 'error' });

  if (!parsed.apiVersion) err('apiVersion', 'Missing required field: apiVersion');
  else if (parsed.apiVersion !== 'claw.soac.io/v1') warn('apiVersion', `Expected "claw.soac.io/v1", got "${parsed.apiVersion}"`);

  if (!parsed.kind) err('kind', 'Missing required field: kind');
  else if (parsed.kind !== 'Playbook') err('kind', `Expected "Playbook", got "${parsed.kind}"`);

  const meta = parsed.metadata as Record<string, unknown> | undefined;
  if (!meta || typeof meta !== 'object') {
    err('metadata', 'Missing required object: metadata');
  } else {
    if (!meta.name) err('metadata.name', 'Missing required field: metadata.name');
    if (!meta.version) warn('metadata.version', 'Missing metadata.version (recommended)');
    if (!meta.severity) err('metadata.severity', 'Missing required field: metadata.severity');
    else if (!CLAW_SEVERITY.includes(meta.severity as string))
      err('metadata.severity', `Invalid severity: "${meta.severity}". Must be: ${CLAW_SEVERITY.join(', ')}`);
    if (meta.mitre_attack && !Array.isArray(meta.mitre_attack)) err('metadata.mitre_attack', 'mitre_attack must be an array');
    if (meta.tags && !Array.isArray(meta.tags)) err('metadata.tags', 'tags must be an array');
  }

  const spec = parsed.spec as Record<string, unknown> | undefined;
  if (!spec || typeof spec !== 'object') {
    err('spec', 'Missing required object: spec');
  } else {
    if (!spec.description) warn('spec.description', 'Missing spec.description (recommended)');

    const trigger = spec.trigger as Record<string, unknown> | undefined;
    if (!trigger || typeof trigger !== 'object') {
      err('spec.trigger', 'Missing required object: spec.trigger');
    } else {
      if (!trigger.source) err('trigger.source', 'Missing required field: trigger_condition');
      else if (!CLAW_TRIGGER_SOURCE.includes(trigger.source as string))
        err('trigger.source', `Invalid trigger source: "${trigger.source}". Must be: ${CLAW_TRIGGER_SOURCE.join(', ')}`);
      if (trigger.conditions && !Array.isArray(trigger.conditions))
        err('trigger.conditions', 'trigger.conditions must be an array');
    }

    if (spec.inputs) {
      if (!Array.isArray(spec.inputs)) {
        err('spec.inputs', 'inputs must be an array');
      } else {
        (spec.inputs as Record<string, unknown>[]).forEach((inp, idx) => {
          if (!inp.name) err(`spec.inputs[${idx}].name`, `Input #${idx + 1}: missing "name"`);
          if (inp.type && !CLAW_PARAM_TYPES.includes(inp.type as string))
            warn(`spec.inputs[${idx}].type`, `Input "${inp.name || idx}": unknown type "${inp.type}"`);
        });
      }
    }

    if (!spec.steps || !Array.isArray(spec.steps) || (spec.steps as unknown[]).length === 0) {
      err('spec.steps', 'Missing or empty spec.steps — at least one step is required');
    } else {
      (spec.steps as Record<string, unknown>[]).forEach((step, idx) => {
        const prefix = `spec.steps[${idx}]`;
        if (!step.id) err(`${prefix}.id`, `Step #${idx + 1}: missing "id"`);
        if (!step.name) warn(`${prefix}.name`, `Step #${idx + 1}: missing "name" (recommended)`);
        if (!step.action) err(`${prefix}.action`, `Step #${idx + 1}: missing "action"`);
        else if (!CLAW_ACTIONS.includes(step.action as string))
          warn(`${prefix}.action`, `Step "${step.id || idx}": unknown action "${step.action}"`);
        if (!step.target) warn(`${prefix}.target`, `Step "${step.id || idx}": missing "target" (recommended)`);
        if (step.on_failure && !CLAW_ON_FAILURE.includes(step.on_failure as string))
          err(`${prefix}.on_failure`, `Step "${step.id || idx}": invalid on_failure "${step.on_failure}"`);
      });
    }

    const gov = spec.governance as Record<string, unknown> | undefined;
    if (gov && typeof gov === 'object') {
      if (gov.max_blast_radius && !CLAW_BLAST_RADIUS.includes(gov.max_blast_radius as string))
        warn('governance.max_blast_radius', `Unknown blast_radius: "${gov.max_blast_radius}"`);
      if (gov.audit_level && !CLAW_AUDIT_LEVEL.includes(gov.audit_level as string))
        warn('governance.audit_level', `Unknown audit_level: "${gov.audit_level}"`);
    }
  }

  const hasErrors = errors.filter(e => e.severity === 'error').length > 0;
  return { valid: !hasErrors, errors, harnessLevels: [{ level: 1, passed: !hasErrors }] };
}

/* ──── Detection Validator ──────────────────────────────────── */
function validateDetection(parsed: Record<string, unknown>, raw: string): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warn = (field: string, msg: string) =>
    errors.push({ line: findFieldLine(raw, field), field, message: msg, severity: 'warning' });
  const err = (field: string, msg: string) =>
    errors.push({ line: findFieldLine(raw, field), field, message: msg, severity: 'error' });

  if (!parsed.name && !parsed.detection_id && !parsed.rule_name && !parsed.title)
    err('name', 'Missing identifier — provide: "name", "detection_id", "rule_name", or "title"');
  if (!parsed.platform && !parsed.source)
    warn('platform', 'Missing "platform" or "source" (e.g. "splunk", "sentinel", "sigma")');
  if (!parsed.mitre_attack && !parsed.mitre && !parsed.techniques) {
    warn('mitre_attack', 'Missing MITRE ATT&CK mapping');
  } else {
    const m = (parsed.mitre_attack || parsed.mitre || parsed.techniques) as unknown;
    if (!Array.isArray(m)) err('mitre_attack', 'MITRE mapping must be an array');
    else (m as string[]).forEach((t, i) => {
      if (typeof t === 'string' && !/^T\d{4}/.test(t)) warn(`mitre[${i}]`, `"${t}" doesn't match MITRE format TXXXXx`);
    });
  }
  if (!parsed.severity && !parsed.risk_score) warn('severity', 'Missing "severity" or "risk_score"');
  else {
    const sev = (parsed.severity || parsed.risk_score) as string;
    if (typeof sev === 'string' && !CLAW_SEVERITY.includes(sev.toUpperCase()))
      warn('severity', `Unusual severity "${sev}" — expected CRITICAL, HIGH, MEDIUM, or LOW`);
  }
  if (!parsed.query && !parsed.detection_logic && !parsed.rule && !parsed.search)
    warn('query', 'No detection logic found — add "query", "detection_logic", or "rule"');
  if (!parsed.description) warn('description', 'Missing "description" (recommended)');
  if (!parsed.version) warn('version', 'Missing "version"');
  if (!parsed.threat_actors && !parsed.actors) warn('threat_actors', 'No threat actor mapping');

  const hasErrors = errors.filter(e => e.severity === 'error').length > 0;
  return { valid: !hasErrors, errors, harnessLevels: [{ level: 1, passed: !hasErrors }] };
}

/* ──── Policy Validator ──────────────────────────────────────── */
const POLICY_ENV_MODES = ['production', 'staging', 'development', 'testing'];
const POLICY_DATA_HANDLING = ['strict', 'standard', 'relaxed'];
const POLICY_AUTH_METHODS = ['mfa', 'sso', 'certificate', 'token', 'password'];
const POLICY_LOG_LEVELS = ['minimal', 'standard', 'verbose', 'debug'];

function validatePolicy(parsed: Record<string, unknown>, raw: string): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warn = (field: string, msg: string) =>
    errors.push({ line: findFieldLine(raw, field), field, message: msg, severity: 'warning' });
  const err = (field: string, msg: string) =>
    errors.push({ line: findFieldLine(raw, field), field, message: msg, severity: 'error' });

  if (!parsed.apiVersion) err('apiVersion', 'Missing required field: apiVersion');
  else if (parsed.apiVersion !== 'soac.io/v1') warn('apiVersion', `Expected "soac.io/v1", got "${parsed.apiVersion}"`);

  if (!parsed.kind) err('kind', 'Missing required field: kind');
  else if (parsed.kind !== 'Policy') err('kind', `Expected "Policy", got "${parsed.kind}"`);

  const meta = parsed.metadata as Record<string, unknown> | undefined;
  if (!meta || typeof meta !== 'object') {
    err('metadata', 'Missing required object: metadata');
  } else {
    if (!meta.name) err('metadata.name', 'Missing required field: metadata.name');
    if (!meta.version) warn('metadata.version', 'Missing metadata.version (recommended)');
    if (!meta.author) warn('metadata.author', 'Missing metadata.author (recommended)');
    if (!meta.scope) warn('metadata.scope', 'Missing metadata.scope (recommended)');
  }

  const spec = parsed.spec as Record<string, unknown> | undefined;
  if (!spec || typeof spec !== 'object') {
    err('spec', 'Missing required object: spec');
  } else {
    if (!spec.description) warn('spec.description', 'Missing spec.description (recommended)');

    if (spec.environments) {
      if (!Array.isArray(spec.environments)) {
        err('spec.environments', 'environments must be an array');
      } else {
        (spec.environments as Record<string, unknown>[]).forEach((env, idx) => {
          const prefix = `spec.environments[${idx}]`;
          if (!env.name) err(`${prefix}.name`, `Environment #${idx + 1}: missing "name"`);
          if (env.mode && !POLICY_ENV_MODES.includes(env.mode as string))
            warn(`${prefix}.mode`, `Environment "${env.name || idx}": unknown mode "${env.mode}"`);
          if (env.data_handling && !POLICY_DATA_HANDLING.includes(env.data_handling as string))
            warn(`${prefix}.data_handling`, `Environment "${env.name || idx}": unknown data_handling "${env.data_handling}"`);
        });
      }
    }

    const access = spec.access_control as Record<string, unknown> | undefined;
    if (access && typeof access === 'object') {
      if (access.roles && !Array.isArray(access.roles)) err('access_control.roles', 'access_control.roles must be an array');
      if (access.auth_methods) {
        if (!Array.isArray(access.auth_methods)) {
          err('access_control.auth_methods', 'auth_methods must be an array');
        } else {
          (access.auth_methods as string[]).forEach((m, i) => {
            if (!POLICY_AUTH_METHODS.includes(m))
              warn(`access_control.auth_methods[${i}]`, `Unknown auth method: "${m}"`);
          });
        }
      }
    }

    const audit = spec.audit as Record<string, unknown> | undefined;
    if (audit && typeof audit === 'object') {
      if (audit.log_level && !POLICY_LOG_LEVELS.includes(audit.log_level as string))
        warn('audit.log_level', `Unknown log_level: "${audit.log_level}"`);
    }
  }

  const hasErrors = errors.filter(e => e.severity === 'error').length > 0;
  return { valid: !hasErrors, errors, harnessLevels: [{ level: 1, passed: !hasErrors }] };
}

/* ──── Metadata Validator ────────────────────────────────────── */
const META_STATUS = ['draft', 'review', 'approved', 'deprecated', 'archived'];

function validateMetadata(parsed: Record<string, unknown>, raw: string): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warn = (field: string, msg: string) =>
    errors.push({ line: findFieldLine(raw, field), field, message: msg, severity: 'warning' });
  const err = (field: string, msg: string) =>
    errors.push({ line: findFieldLine(raw, field), field, message: msg, severity: 'error' });

  if (!parsed.apiVersion) err('apiVersion', 'Missing required field: apiVersion');
  else if (parsed.apiVersion !== 'soac.io/v1') warn('apiVersion', `Expected "soac.io/v1", got "${parsed.apiVersion}"`);

  if (!parsed.kind) err('kind', 'Missing required field: kind');
  else if (parsed.kind !== 'PackageMetadata') err('kind', `Expected "PackageMetadata", got "${parsed.kind}"`);

  const pkg = parsed.package as Record<string, unknown> | undefined;
  if (!pkg || typeof pkg !== 'object') {
    err('package', 'Missing required object: package');
  } else {
    if (!pkg.id) err('package.id', 'Missing required field: package.id');
    if (!pkg.name) err('package.name', 'Missing required field: package.name');
    if (!pkg.version) warn('package.version', 'Missing package.version (recommended)');
    if (!pkg.description) warn('package.description', 'Missing package.description (recommended)');
    if (!pkg.author) warn('package.author', 'Missing package.author (recommended)');
    if (pkg.status && !META_STATUS.includes(pkg.status as string))
      warn('package.status', `Unknown status: "${pkg.status}". Expected: ${META_STATUS.join(', ')}`);
  }

  const threat = parsed.threat as Record<string, unknown> | undefined;
  if (threat && typeof threat === 'object') {
    if (threat.severity && !['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes((threat.severity as string).toUpperCase()))
      warn('threat.severity', `Unusual severity: "${threat.severity}"`);
    if (threat.mitre_attack) {
      if (!Array.isArray(threat.mitre_attack)) err('threat.mitre_attack', 'mitre_attack must be an array');
      else (threat.mitre_attack as Record<string, unknown>[]).forEach((m, i) => {
        if (m.technique_id && typeof m.technique_id === 'string' && !/^T\d{4}/.test(m.technique_id))
          warn(`threat.mitre_attack[${i}].technique_id`, `"${m.technique_id}" doesn't match MITRE format TXXXXx`);
      });
    }
  }

  if (parsed.artifacts && !Array.isArray(parsed.artifacts)) err('artifacts', 'artifacts must be an array');
  if (parsed.stakeholders && !Array.isArray(parsed.stakeholders)) err('stakeholders', 'stakeholders must be an array');

  const validation = parsed.validation as Record<string, unknown> | undefined;
  if (validation && typeof validation === 'object') {
    if (validation.harness_level && ![1, 2, 3].includes(validation.harness_level as number))
      warn('validation.harness_level', `harness_level should be 1, 2, or 3`);
  }

  const hasErrors = errors.filter(e => e.severity === 'error').length > 0;
  return { valid: !hasErrors, errors, harnessLevels: [{ level: 1, passed: !hasErrors }] };
}

/* ═══════════════════════════════════════════════════════════════
   Level 2 — Cross-Reference Validation (Web UI)
   ═══════════════════════════════════════════════════════════════ */
const MITRE_RE = /^T\d{4}(\.\d{3})?$/;
const PKG_ID_RE = /^pkg-\d{3}$/;

function runLevel2(parsed: Record<string, unknown>, raw: string, kind: SchemaType): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const warn = (field: string, msg: string) =>
    issues.push({ line: findFieldLine(raw, field), field, message: msg, severity: 'warning' });
  const err = (field: string, msg: string) =>
    issues.push({ line: findFieldLine(raw, field), field, message: msg, severity: 'error' });

  if (kind === 'claw') {
    const meta = parsed.metadata as Record<string, unknown> | undefined;
    if (meta?.package_id && typeof meta.package_id === 'string' && !PKG_ID_RE.test(meta.package_id))
      warn('metadata.package_id', `Package ID "${meta.package_id}" should match pkg-NNN`);
    if (meta?.mitre_attack && Array.isArray(meta.mitre_attack)) {
      (meta.mitre_attack as string[]).forEach((t, i) => {
        if (typeof t === 'string' && !MITRE_RE.test(t.split(/\s/)[0]))
          warn(`mitre_attack[${i}]`, `"${t}" does not match strict MITRE ID format (TNNNN or TNNNN.NNN)`);
      });
    }
    const spec = parsed.spec as Record<string, unknown> | undefined;
    if (spec?.steps && Array.isArray(spec.steps)) {
      (spec.steps as Record<string, unknown>[]).forEach((s, i) => {
        if (!s.target) warn(`steps[${i}].target`, `Step "${s.id || i}": missing target (L2 cross-ref)`);
      });
    }
    if (meta?.severity === 'CRITICAL') {
      const hasRollback = !!(spec?.rollback);
      const gov = spec?.governance as Record<string, unknown> | undefined;
      const hasBrain = gov?.brain_oversight === true;
      if (!hasRollback) err('rollback', 'CRITICAL severity requires rollback section');
      if (!hasBrain) err('governance.brain_oversight', 'CRITICAL severity requires brain_oversight: true');
    }
  }

  if (kind === 'detection') {
    const mitreField = (parsed.mitre_attack || parsed.mitre || parsed.techniques) as unknown;
    if (Array.isArray(mitreField)) {
      (mitreField as string[]).forEach((t, i) => {
        if (typeof t === 'string' && !MITRE_RE.test(t.split(/\s/)[0]))
          warn(`mitre[${i}]`, `"${t}" does not match strict MITRE ID format`);
      });
    }
    const hasQuery = !!(parsed.query || parsed.detection_logic || parsed.rule || parsed.search);
    if (hasQuery) {
      const q = String(parsed.query || parsed.detection_logic || parsed.rule || parsed.search || '');
      if (!q.trim() || q.includes('TODO') || q.includes('PLACEHOLDER'))
        err('query', 'Detection logic appears to be a placeholder');
    }
  }

  if (kind === 'policy') {
    const meta = parsed.metadata as Record<string, unknown> | undefined;
    if (meta?.package_id && typeof meta.package_id === 'string' && !PKG_ID_RE.test(meta.package_id))
      warn('metadata.package_id', `Package ID "${meta.package_id}" should match pkg-NNN`);
  }

  if (kind === 'metadata') {
    const pkg = parsed.package as Record<string, unknown> | undefined;
    if (pkg?.id && typeof pkg.id === 'string' && !PKG_ID_RE.test(pkg.id))
      warn('package.id', `Package ID "${pkg.id}" should match pkg-NNN`);
    const threat = parsed.threat as Record<string, unknown> | undefined;
    if (threat?.mitre_attack && Array.isArray(threat.mitre_attack)) {
      (threat.mitre_attack as Record<string, unknown>[]).forEach((m, i) => {
        if (m.technique_id && typeof m.technique_id === 'string' && !MITRE_RE.test(m.technique_id))
          err(`threat.mitre_attack[${i}].technique_id`, `"${m.technique_id}" fails strict MITRE format`);
      });
    }
    if (parsed.artifacts && Array.isArray(parsed.artifacts)) {
      (parsed.artifacts as Record<string, unknown>[]).forEach((a, i) => {
        if (!a.path && !a.ref) warn(`artifacts[${i}]`, `Artifact #${i + 1}: missing "path" or "ref"`);
      });
    }
  }

  return issues;
}

/* ═══════════════════════════════════════════════════════════════
   Sample Playbook Templates
   ═══════════════════════════════════════════════════════════════ */
interface SampleTemplate {
  id: string;
  label: string;
  description: string;
  schema: SchemaType;
  code: string;
}

const SAMPLE_TEMPLATES: SampleTemplate[] = [
  {
    id: 'ransomware-isolation',
    label: 'Ransomware Isolation',
    description: 'Contain a ransomware-infected host via CrowdStrike + edge enforcement',
    schema: 'claw',
    code: `apiVersion: claw.soac.io/v1
kind: Playbook
metadata:
  name: isolate-compromised-host
  version: "1.1.0"
  author: soac-core-team
  severity: CRITICAL
  mitre_attack:
    - T1486   # Data Encrypted for Impact
    - T1059   # Command and Scripting Interpreter
    - T1068   # Exploitation for Privilege Escalation
  tags:
    - endpoint
    - containment
    - ransomware

spec:
  description: >
    Isolates a compromised endpoint detected by CrowdStrike or
    Microsoft Defender. Applies network containment, kills malicious
    processes, and preserves forensic artifacts.

  trigger:
    source: BODY
    conditions:
      - field: detection_type
        operator: contains
        value: "ransomware"
      - field: confidence
        operator: gt
        value: 85
    cooldown: 2m

  inputs:
    - name: host_id
      type: string
      required: true
      source: detection
    - name: hostname
      type: string
      required: true
      source: detection
    - name: malicious_pids
      type: array
      required: false
      source: detection

  steps:
    - id: verify_host
      name: Verify Host Identity
      action: api_call
      target: crowdstrike
      params:
        endpoint: /devices/entities/devices/v2
        method: GET
      timeout: 10s
      on_failure: abort

    - id: contain_host
      name: Network Contain Host
      action: api_call
      target: crowdstrike
      params:
        endpoint: /devices/entities/devices-actions/v2
        method: POST
        action_name: contain
      timeout: 30s
      retry:
        max_attempts: 3
        backoff: exponential
      on_failure: escalate

    - id: kill_processes
      name: Kill Malicious Processes
      action: script
      target: crowdstrike_rtr
      params:
        command: kill
        pids: \${malicious_pids}
      timeout: 20s
      on_failure: continue

    - id: push_edge_block
      name: Edge Firewall Block
      action: api_call
      target: edge_enforcement
      params:
        action: block_host
        scope: network
        duration: 48h
        hmac_signed: true
      timeout: 5s
      on_failure: escalate

    - id: create_ticket
      name: Create IR Ticket
      action: api_call
      target: jira
      params:
        project: SOC
        issue_type: Incident
        priority: Critical
      on_failure: continue

  rollback:
    enabled: true
    steps:
      - id: lift_containment
        name: Remove Network Containment
        action: api_call
        target: crowdstrike
        params:
          action_name: lift_containment
      - id: remove_edge_block
        name: Remove Edge Firewall Block
        action: api_call
        target: edge_enforcement
        params:
          action: unblock_host

  governance:
    requires_approval: false
    max_blast_radius: single_user
    audit_level: verbose
    brain_oversight: true`,
  },
  {
    id: 'identity-revocation',
    label: 'Identity Revocation',
    description: 'Revoke all sessions for a compromised identity after AitM phishing detection',
    schema: 'claw',
    code: `apiVersion: claw.soac.io/v1
kind: Playbook
metadata:
  name: revoke-compromised-sessions
  version: "1.2.0"
  author: soac-core-team
  severity: CRITICAL
  mitre_attack:
    - T1557.001   # Adversary-in-the-Middle
    - T1078.004   # Valid Accounts: Cloud
  tags:
    - session-hijack
    - identity
    - aitm

spec:
  description: >
    Revokes all active sessions for a compromised user account detected
    via AitM phishing or session token theft. Enforces re-authentication
    across all connected identity providers.

  trigger:
    source: BODY
    conditions:
      - field: detection_type
        operator: eq
        value: "aitm_session_hijack"
      - field: risk_score
        operator: eq
        value: "CRITICAL"
    cooldown: 5m

  inputs:
    - name: actor_email
      type: string
      required: true
      source: detection
    - name: session_ids
      type: array
      required: true
      source: detection
    - name: source_ips
      type: array
      required: false
      source: enrichment

  steps:
    - id: enrich_user
      name: Enrich User Context
      action: api_call
      target: okta
      params:
        endpoint: /api/v1/users/\${actor_email}
        method: GET
      timeout: 10s
      retry:
        max_attempts: 3
        backoff: exponential
      on_failure: abort

    - id: revoke_okta_sessions
      name: Revoke All Okta Sessions
      action: api_call
      target: okta
      params:
        endpoint: /api/v1/users/\${user_id}/sessions
        method: DELETE
      timeout: 15s
      retry:
        max_attempts: 2
        backoff: linear
      on_failure: escalate

    - id: revoke_azure_tokens
      name: Revoke Azure AD Refresh Tokens
      action: api_call
      target: microsoft_graph
      params:
        endpoint: /v1.0/users/\${actor_email}/revokeSignInSessions
        method: POST
      timeout: 15s
      on_failure: continue

    - id: notify_edge
      name: Push Block to Edge Enforcement
      action: api_call
      target: edge_enforcement
      params:
        action: block_session
        scope: user
        duration: 24h
        hmac_signed: true
      timeout: 5s
      on_failure: escalate

    - id: notify_soc
      name: Alert SOC Team
      action: notify
      target: slack
      params:
        channel: "#soc-critical"
      on_failure: continue

  outputs:
    - name: sessions_revoked
      type: number
      source: revoke_okta_sessions
    - name: enforcement_id
      type: string
      source: notify_edge

  rollback:
    enabled: true
    steps:
      - id: restore_sessions
        name: Re-enable User Sessions
        action: api_call
        target: okta
        params:
          endpoint: /api/v1/users/\${user_id}/lifecycle/activate
          method: POST

  governance:
    requires_approval: false
    max_blast_radius: single_user
    audit_level: verbose
    brain_oversight: true`,
  },
  {
    id: 'lateral-movement-block',
    label: 'Lateral Movement Block',
    description: 'Detect & block credential relay / lateral movement across the network',
    schema: 'claw',
    code: `apiVersion: claw.soac.io/v1
kind: Playbook
metadata:
  name: block-lateral-movement
  version: "1.0.0"
  author: soac-core-team
  severity: HIGH
  mitre_attack:
    - T1021.002   # Remote Services: SMB/Windows Admin Shares
    - T1550.002   # Use Alternate Authentication: Pass the Hash
    - T1003.001   # OS Credential Dumping: LSASS Memory
  tags:
    - lateral-movement
    - credential-relay
    - network

spec:
  description: >
    Blocks lateral movement when LSASS dumping or pass-the-hash
    activity is detected. Segments the affected subnet, revokes
    cached credentials, and alerts the SOC.

  trigger:
    source: BODY
    conditions:
      - field: detection_type
        operator: eq
        value: "credential_relay"
      - field: confidence
        operator: gt
        value: 75
    cooldown: 3m

  inputs:
    - name: source_host
      type: string
      required: true
      source: detection
    - name: target_hosts
      type: array
      required: true
      source: detection
    - name: compromised_account
      type: string
      required: true
      source: enrichment

  steps:
    - id: segment_subnet
      name: Micro-Segment Affected Subnet
      action: api_call
      target: network_controller
      params:
        action: isolate_segment
        scope: subnet
      timeout: 15s
      retry:
        max_attempts: 2
        backoff: linear
      on_failure: escalate

    - id: flush_credentials
      name: Flush Cached Kerberos Tickets
      action: script
      target: crowdstrike_rtr
      params:
        command: klist_purge
      timeout: 20s
      on_failure: continue

    - id: reset_password
      name: Force Password Reset
      action: api_call
      target: active_directory
      params:
        action: force_reset
        account: \${compromised_account}
      timeout: 10s
      on_failure: escalate

    - id: edge_enforce
      name: Block Host-to-Host Traffic
      action: api_call
      target: edge_enforcement
      params:
        action: block_lateral
        hmac_signed: true
        duration: 12h
      timeout: 5s
      on_failure: escalate

    - id: notify_soc
      name: Alert SOC Team
      action: notify
      target: slack
      params:
        channel: "#soc-high"
      on_failure: continue

  governance:
    requires_approval: false
    max_blast_radius: team
    audit_level: verbose
    brain_oversight: true`,
  },
  {
    id: 'data-exfil-block',
    label: 'Data Exfiltration Block',
    description: 'Block anomalous data exfiltration via DNS tunnelling or cloud storage abuse',
    schema: 'claw',
    code: `apiVersion: claw.soac.io/v1
kind: Playbook
metadata:
  name: block-data-exfiltration
  version: "1.0.0"
  author: soac-core-team
  severity: HIGH
  mitre_attack:
    - T1048.001   # Exfiltration Over C2 Channel
    - T1567.002   # Exfiltration to Cloud Storage
    - T1071.004   # Application Layer Protocol: DNS
  tags:
    - exfiltration
    - dns-tunnel
    - dlp

spec:
  description: >
    Blocks data exfiltration when DNS tunnelling or abnormal cloud
    storage uploads are detected. Terminates the offending process,
    blocks the destination, and creates a forensic snapshot.

  trigger:
    source: BODY
    conditions:
      - field: detection_type
        operator: eq
        value: "data_exfiltration"
      - field: bytes_out
        operator: gt
        value: 500000000
    cooldown: 5m

  inputs:
    - name: host_id
      type: string
      required: true
      source: detection
    - name: destination_domain
      type: string
      required: true
      source: detection
    - name: process_pid
      type: number
      required: false
      source: detection

  steps:
    - id: kill_process
      name: Terminate Exfil Process
      action: script
      target: crowdstrike_rtr
      params:
        command: kill
        pid: \${process_pid}
      timeout: 10s
      on_failure: continue

    - id: block_destination
      name: Block Destination Domain
      action: api_call
      target: edge_enforcement
      params:
        action: block_domain
        domain: \${destination_domain}
        scope: org
        hmac_signed: true
        duration: 72h
      timeout: 5s
      on_failure: escalate

    - id: snapshot
      name: Capture Forensic Snapshot
      action: script
      target: crowdstrike_rtr
      params:
        command: memdump
      timeout: 120s
      on_failure: continue

    - id: notify_soc
      name: Alert SOC + DLP Team
      action: notify
      target: slack
      params:
        channel: "#soc-high"
      on_failure: continue

  governance:
    requires_approval: false
    max_blast_radius: org
    audit_level: verbose
    brain_oversight: true`,
  },
  {
    id: 'aitm-detection',
    label: 'AitM Okta Detection',
    description: 'Splunk detection rule for AitM phishing via anomalous Okta sessions',
    schema: 'detection',
    code: `name: aitm-okta-session-hijack
detection_id: BODY-AITM-OKTA-001
platform: splunk
version: "1.2.0"
severity: CRITICAL
description: >
  Detect AitM phishing via anomalous Okta
  session patterns across multiple geolocations.
  Correlates session.start events with IP diversity
  and applies a risk score threshold.
mitre_attack:
  - T1557.001
  - T1078.004
threat_actors:
  - 0APT
  - Crimson Collective
query: |
  index=okta sourcetype=OktaIM2:log
  | where eventType IN ("user.session.start")
  | stats dc(client_ip) as unique_ips,
         dc(client_geo) as unique_geos
         by actor_email, _time span=1h
  | where unique_ips > 2 OR unique_geos > 1
  | eval risk_score = case(
      unique_ips > 5 AND unique_geos > 3, "CRITICAL",
      unique_ips > 3 OR unique_geos > 2, "HIGH",
      1=1, "MEDIUM")
  | where risk_score IN ("CRITICAL", "HIGH")`,
  },
  {
    id: 'env-governance-policy',
    label: 'Environment Governance',
    description: 'Define environment policies, access control, and audit requirements',
    schema: 'policy' as SchemaType,
    code: `apiVersion: soac.io/v1
kind: Policy
metadata:
  name: production-governance
  version: "1.0.0"
  author: soac-core-team
  scope: organization

spec:
  description: >
    Governance policy for production environments.
    Defines access controls, data handling, and
    audit requirements for all SOaC operations.

  environments:
    - name: production
      mode: production
      data_handling: strict
      network_access: restricted
      persistence: encrypted
    - name: staging
      mode: staging
      data_handling: standard
      network_access: internal
      persistence: standard

  access_control:
    roles:
      - name: soc-analyst
        permissions:
          - read:playbooks
          - execute:playbooks
          - read:detections
      - name: soc-lead
        permissions:
          - read:playbooks
          - write:playbooks
          - execute:playbooks
          - approve:critical
      - name: admin
        permissions:
          - "*"
    auth_methods:
      - mfa
      - sso
      - certificate

  compliance:
    review_frequency: quarterly
    frameworks:
      - NIST-CSF
      - SOC2
      - ISO-27001

  audit:
    log_level: verbose
    retention: 365d
    tamper_protection: true`,
  },
  {
    id: 'mtip-package-metadata',
    label: 'MTIP Package Metadata',
    description: 'Package metadata for a Modular Threat Intelligence Package (MTIP)',
    schema: 'metadata' as SchemaType,
    code: `apiVersion: soac.io/v1
kind: PackageMetadata
package:
  id: pkg-001
  name: Ransomware Containment Suite
  version: "2.0.0"
  description: >
    End-to-end ransomware detection, containment, and
    remediation package. Includes CLAW playbooks,
    detection rules, and governance policies.
  author: soac-core-team
  status: approved
  license: Apache-2.0

threat:
  severity: CRITICAL
  mitre_attack:
    - technique_id: T1486
      tactic: impact
      name: Data Encrypted for Impact
    - technique_id: T1059
      tactic: execution
      name: Command and Scripting Interpreter
    - technique_id: T1068
      tactic: privilege-escalation
      name: Exploitation for Privilege Escalation

artifacts:
  - path: playbooks/isolate-compromised-host.yaml
    type: playbook
  - path: detections/ransomware-behavior.yaml
    type: detection
  - path: policies/containment-governance.yaml
    type: policy

stakeholders:
  - role: soc-analyst
    responsibility: Execute containment playbooks
  - role: incident-commander
    responsibility: Approve CRITICAL escalations
  - role: threat-intel
    responsibility: Update MITRE mappings

signals_required:
  - crowdstrike_edr
  - network_telemetry
  - identity_logs

validation:
  harness_level: 2
  last_validated: "2025-12-01"
  ci_status: passing`,
  },
];

/* ═══════════════════════════════════════════════════════════════
   Prism highlighting helper
   ═══════════════════════════════════════════════════════════════ */
function highlightYaml(code: string) {
  return Prism.highlight(code, Prism.languages.yaml, 'yaml');
}

/* ──── Schema display helpers ────────────────────────────────── */
const SCHEMA_LABELS: Record<SchemaType, string> = {
  claw: 'CLAW Playbook Schema',
  detection: 'Detection Schema',
  policy: 'Policy Schema',
  metadata: 'Package Metadata Schema',
};
const SCHEMA_FILENAMES: Record<SchemaType, string> = {
  claw: 'playbook.yaml',
  detection: 'detection.yaml',
  policy: 'policy.yaml',
  metadata: 'metadata.yaml',
};

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */
export default function SchemaValidator() {
  const [input, setInput] = useState('');
  const [schemaType, setSchemaType] = useState<SchemaType>('claw');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [schemaDropdownOpen, setSchemaDropdownOpen] = useState(false);
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const schemaDropdownRef = useRef<HTMLDivElement>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);

  /* ── Real-time validation (debounced 500ms) ────────────── */
  const runValidation = useCallback((text: string, schema: SchemaType) => {
    if (!text.trim()) {
      setResult(null);
      setParseError(null);
      setIsValidating(false);
      return;
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      try {
        parsed = yaml.load(text) as Record<string, unknown>;
        if (typeof parsed !== 'object' || parsed === null) {
          setParseError('Parsed input is not a valid object — check your YAML structure.');
          setResult(null);
          setIsValidating(false);
          return;
        }
      } catch (yamlErr: unknown) {
        const msg = yamlErr instanceof Error ? yamlErr.message : 'Unknown parse error';
        const lineMatch = msg.match(/line (\d+)/);
        setParseError(`Syntax error${lineMatch ? ` at line ${lineMatch[1]}` : ''}: ${msg}`);
        setResult(null);
        setIsValidating(false);
        return;
      }
    }

    let res: ValidationResult;
    switch (schema) {
      case 'claw': res = validateCLAW(parsed, text); break;
      case 'detection': res = validateDetection(parsed, text); break;
      case 'policy': res = validatePolicy(parsed, text); break;
      case 'metadata': res = validateMetadata(parsed, text); break;
      default: res = validateCLAW(parsed, text);
    }

    // --- Level 2 Cross-Reference (only if L1 passed) ---
    const l1Passed = res.harnessLevels[0]?.passed ?? false;
    if (l1Passed) {
      const l2Issues = runLevel2(parsed, text, schema);
      const l2HasErrors = l2Issues.some(e => e.severity === 'error');
      res.errors.push(...l2Issues);
      res.harnessLevels.push({ level: 2, passed: !l2HasErrors });
      if (l2HasErrors) res.valid = false;
    }

    // --- Banned Term Lint (cross-cutting) ---
    const btViolations = scanForBannedTerms(text);
    for (const v of btViolations) {
      res.errors.push({
        line: v.line,
        field: `banned_term:${v.term}`,
        message: `Banned term "${v.term}" detected: "${v.context}"`,
        severity: 'error',
      });
    }
    if (btViolations.length > 0) res.valid = false;

    setResult(res);
    setParseError(null);
    setIsValidating(false);
  }, []);

  useEffect(() => {
    if (!input.trim()) {
      setResult(null);
      setParseError(null);
      return;
    }
    setIsValidating(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runValidation(input, schemaType);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, schemaType, runValidation]);

  /* ── Close dropdowns on outside click ────────────────────── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (schemaDropdownRef.current && !schemaDropdownRef.current.contains(e.target as Node)) setSchemaDropdownOpen(false);
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(e.target as Node)) setTemplateDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCopy = () => {
    navigator?.clipboard?.writeText?.(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadTemplate = (template: SampleTemplate) => {
    setInput(template.code);
    setSchemaType(template.schema);
    setTemplateDropdownOpen(false);
  };

  const handleShare = () => {
    const title = encodeURIComponent('[Playbook] Community contribution');
    const body = encodeURIComponent(`### Playbook\n\n\`\`\`yaml\n${input}\n\`\`\`\n\n### Validation\n\nThis playbook has been validated against the CLAW Playbook Schema v1.0.\n`);
    const url = `${GITHUB_DISCUSSIONS}/new?category=playbooks&title=${title}&body=${body}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const errorCount = result?.errors.filter(e => e.severity === 'error').length ?? 0;
  const warnCount = result?.errors.filter(e => e.severity === 'warning').length ?? 0;
  const filteredTemplates = SAMPLE_TEMPLATES.filter(t => t.schema === schemaType);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terminal/10 border border-terminal/20 mb-4">
          <FileCode className="w-3.5 h-3.5 text-terminal" />
          <span className="font-mono text-xs text-terminal">INTERACTIVE SCHEMA VALIDATOR</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Validate your <span className="text-terminal">SOaC Artifacts</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm">
          Paste or write YAML below with full syntax highlighting. Real-time Level 1 (Schema) + Level 2 (Cross-Reference)
          validation runs as you type. Supports Playbooks, Detections, Policies, and Package Metadata.
        </p>
      </motion.div>

      {/* Controls Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4"
      >
        {/* Schema Type Selector */}
        <div ref={schemaDropdownRef} className="relative">
          <button
            onClick={() => { setSchemaDropdownOpen(!schemaDropdownOpen); setTemplateDropdownOpen(false); }}
            className="flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs bg-muted/50 border border-border hover:border-terminal/30 transition-all"
          >
            <FileCode className="w-3.5 h-3.5 text-terminal" />
            {SCHEMA_LABELS[schemaType]}
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          {schemaDropdownOpen && (
            <div className="absolute top-full mt-1 left-0 z-20 bg-background border border-border rounded-md shadow-xl overflow-hidden min-w-[260px]">
              {(['claw', 'detection', 'policy', 'metadata'] as SchemaType[]).map((st) => (
                <button
                  key={st}
                  onClick={() => { setSchemaType(st); setSchemaDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 font-mono text-xs hover:bg-muted/50 transition-all ${schemaType === st ? 'text-terminal bg-terminal/10' : 'text-foreground'}`}
                >
                  {SCHEMA_LABELS[st]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sample Playbook Templates Dropdown */}
        <div ref={templateDropdownRef} className="relative">
          <button
            onClick={() => { setTemplateDropdownOpen(!templateDropdownOpen); setSchemaDropdownOpen(false); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md font-mono text-xs bg-purple-900/20 text-purple-400 border border-purple-400/20 hover:bg-purple-900/30 transition-all"
          >
            Sample Templates
            <ChevronDown className="w-3 h-3" />
          </button>
          {templateDropdownOpen && (
            <div className="absolute top-full mt-1 left-0 z-20 bg-background border border-border rounded-md shadow-xl overflow-hidden min-w-[320px]">
              {filteredTemplates.length === 0 ? (
                <div className="px-4 py-3 text-xs font-mono text-muted-foreground">No templates for this schema type</div>
              ) : (
                filteredTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => loadTemplate(t)}
                    className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-all border-b border-border/50 last:border-0"
                  >
                    <p className="font-mono text-xs font-semibold text-foreground">{t.label}</p>
                    <p className="font-mono text-[10px] text-gray-500 mt-0.5">{t.description}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Status badge */}
        {input.trim() && (
          <div className="flex items-center gap-1.5">
            {isValidating ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[10px] text-blue-400 bg-blue-900/20 border border-blue-400/20">
                <Loader2 className="w-3 h-3 animate-spin" />
                Validating...
              </span>
            ) : result ? (
              result.valid ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[10px] text-emerald-400 bg-emerald-900/20 border border-emerald-400/20">
                  <CheckCircle className="w-3 h-3" />
                  Valid
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[10px] text-red-400 bg-red-900/20 border border-red-400/20">
                  <XCircle className="w-3 h-3" />
                  {errorCount} error{errorCount !== 1 ? 's' : ''}
                </span>
              )
            ) : parseError ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[10px] text-red-400 bg-red-900/20 border border-red-400/20">
                <XCircle className="w-3 h-3" />
                Syntax Error
              </span>
            ) : null}
          </div>
        )}

        <button onClick={handleCopy} disabled={!input} className="flex items-center gap-1.5 px-3 py-2 rounded-md font-mono text-xs bg-muted/50 text-muted-foreground border border-border hover:border-terminal/30 disabled:opacity-30 transition-all">
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          Copy
        </button>
        <button onClick={() => { setInput(''); }} disabled={!input} className="flex items-center gap-1.5 px-3 py-2 rounded-md font-mono text-xs bg-muted/50 text-muted-foreground border border-border hover:border-terminal/30 disabled:opacity-30 transition-all">
          <RotateCcw className="w-3 h-3" /> Clear
        </button>
      </motion.div>

      {/* Editor + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="rounded-lg overflow-hidden border border-terminal/20 shadow-2xl shadow-terminal/5">
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-terminal/10">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-xs text-muted-foreground ml-2">
                  {SCHEMA_FILENAMES[schemaType]}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground/50">
                {input ? input.split('\n').length : 0} lines
              </span>
            </div>
            {/* Editor area with line numbers */}
            <div className="relative flex terminal-bg">
              {/* Line numbers gutter */}
              <div className="select-none pr-2 pl-3 py-[10px] text-right border-r border-terminal/10 bg-muted/30 min-w-[3rem]" aria-hidden>
                {(input || ' ').split('\n').map((_, i) => (
                  <div key={i} className="font-mono text-[13px] leading-[1.5] text-muted-foreground/30">
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Editor */}
              <div className="flex-1 overflow-auto max-h-[540px]">
                <Editor
                  value={input}
                  onValueChange={(code) => setInput(code)}
                  highlight={highlightYaml}
                  padding={10}
                  textareaClassName="focus:outline-none"
                  className="font-mono text-[13px] leading-[1.5] min-h-[540px]"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    background: 'transparent',
                    color: '#e2e8f0',
                  }}
                  placeholder={`# Paste your ${SCHEMA_LABELS[schemaType]} YAML here...\n# Or select a Sample Template above.`}
                />
              </div>
            </div>
          </div>

          {/* Share to Discussions CTA */}
          {result?.valid && (
            <motion.button
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleShare}
              className="mt-3 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-mono font-semibold text-sm transition-all bg-purple-900/20 text-purple-400 border border-purple-400/30 hover:bg-purple-900/30 hover:border-purple-400/50"
            >
              <Share2 className="w-4 h-4" />
              Share to Discussions
              <ExternalLink className="w-3 h-3 opacity-60" />
            </motion.button>
          )}
        </motion.div>

        {/* Results Panel */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="rounded-lg overflow-hidden border border-terminal/20 shadow-2xl shadow-terminal/5 h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-terminal/10">
              <span className="font-mono text-xs text-muted-foreground">Validation Results</span>
              {result && (
                <div className="flex items-center gap-3">
                  {errorCount > 0 && <span className="font-mono text-[10px] text-red-400">{errorCount} error{errorCount !== 1 ? 's' : ''}</span>}
                  {warnCount > 0 && <span className="font-mono text-[10px] text-amber-400">{warnCount} warning{warnCount !== 1 ? 's' : ''}</span>}
                </div>
              )}
            </div>
            <div className="terminal-bg p-4 flex-1 overflow-y-auto min-h-[540px]">
              <AnimatePresence mode="wait">
                {!result && !parseError ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-muted-foreground/40">
                    <FileCode className="w-12 h-12 mb-4" />
                    <p className="font-mono text-sm">Real-time validation</p>
                    <p className="font-mono text-xs mt-1">Start typing or load a sample template</p>
                  </motion.div>
                ) : parseError ? (
                  <motion.div key="parse-error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                    <div className="flex items-center gap-2 p-3 rounded-md bg-red-900/20 border border-red-400/20">
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <div>
                        <p className="font-mono text-sm font-semibold text-red-400">Syntax Error</p>
                        <p className="font-mono text-xs text-red-400/80 mt-1">{parseError}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                    {/* Overall Status */}
                    <div className={`flex items-center gap-2 p-3 rounded-md border ${result.valid ? 'bg-emerald-900/20 border-emerald-400/20' : 'bg-red-900/20 border-red-400/20'}`}>
                      {result.valid ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className={`font-mono text-sm font-semibold ${result.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                          {result.valid ? 'PASS — All Checks Passed' : 'FAIL — Validation Errors Found'}
                        </p>
                        <p className="font-mono text-[10px] text-gray-500 mt-0.5">
                          {SCHEMA_LABELS[schemaType]} · {errorCount} error{errorCount !== 1 ? 's' : ''} · {warnCount} warning{warnCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {/* Harness Level Badges */}
                      <div className="flex gap-1.5 shrink-0">
                        {result.harnessLevels.map((hl) => (
                          <span
                            key={hl.level}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-semibold border ${
                              hl.passed
                                ? 'text-emerald-400 bg-emerald-900/20 border-emerald-400/30'
                                : 'text-red-400 bg-red-900/20 border-red-400/30'
                            }`}
                          >
                            {hl.passed ? '✓' : '✗'} L{hl.level}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Individual issues */}
                    {result.errors.length > 0 && (
                      <div className="space-y-1.5">
                        {result.errors.map((e, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className={`flex items-start gap-2 p-2.5 rounded-md border text-xs font-mono ${
                              e.severity === 'error' ? 'bg-red-900/10 border-red-400/15 text-red-400' : 'bg-amber-900/10 border-amber-400/15 text-amber-400'
                            }`}
                          >
                            {e.severity === 'error' ? <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                            <div>
                              {e.line && <span className="text-blue-400 mr-1.5">Ln {e.line}</span>}
                              <span className="font-semibold">{e.field}</span>
                              <span className="text-gray-600 mx-1.5">·</span>
                              <span className="opacity-80">{e.message}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {result.valid && result.errors.length === 0 && (
                      <div className="text-center py-6">
                        <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                        <p className="font-mono text-sm text-emerald-400">No issues found</p>
                        <p className="font-mono text-xs text-gray-500 mt-1">Your artifact is fully compliant with the {SCHEMA_LABELS[schemaType]}. L1 + L2 passed.</p>
                        <p className="font-mono text-xs text-purple-400/70 mt-3">Share it with the community ↙</p>
                      </div>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Prism CSS — dark theme inline to match terminal aesthetic */}
      <style jsx global>{`
        .token.comment,
        .token.prolog { color: #6b7280; }
        .token.punctuation { color: #9ca3af; }
        .token.key,
        .token.atrule,
        .token.attr-name { color: #60a5fa; }
        .token.string,
        .token.attr-value { color: #34d399; }
        .token.number { color: #f59e0b; }
        .token.boolean { color: #c084fc; }
        .token.tag { color: #f472b6; }
        .token.important { color: #ef4444; font-weight: bold; }
        /* Editor overrides */
        textarea.npm__react-simple-code-editor__textarea {
          outline: none !important;
          caret-color: #22d3ee !important;
        }
        /* react-simple-code-editor container */
        .npm__react-simple-code-editor__textarea,
        pre.npm__react-simple-code-editor__editor {
          white-space: pre !important;
          font-family: 'JetBrains Mono', monospace !important;
        }
      `}</style>
    </div>
  );
}