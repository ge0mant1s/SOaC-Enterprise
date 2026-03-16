'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileText, ChevronRight, ChevronDown, Shield, Brain, Workflow, Radio, Scale, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { GITHUB_REPO } from '@/lib/constants';
import { trackGithubPivot } from '@/lib/analytics';

// Build a GitHub URL for a file path within the repo
const GITHUB_BASE = GITHUB_REPO.replace('/tree/main', '/blob/main');

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  icon?: React.ElementType;
  color?: string;
  children?: FileNode[];
  content?: string;
  /** relative path from repo root, e.g. "01_The_Body_Artifacts/splunk_sample_detection.spl" */
  repoPath?: string;
}

const fileTree: FileNode[] = [
  {
    name: '01_The_Body_Artifacts',
    type: 'folder',
    icon: Shield,
    color: 'text-green-400',
    children: [
      {
        name: 'splunk_sample_detection.spl',
        type: 'file',
        repoPath: '01_The_Body_Artifacts/splunk_sample_detection.spl',
        content: `| SOaC Detection Rule: AitM Phishing - Okta Session Hijack
| Platform: Splunk Enterprise Security
| MITRE ATT&CK: T1557.001 (AitM), T1078.004 (Cloud Accounts)
| Threat Actors: 0APT, Crimson Collective

index=okta sourcetype=OktaIM2:log
| spath output=eventType path=eventType
| spath output=actor_email path=actor.alternateId
| spath output=client_ip path=client.ipAddress
| spath output=client_geo path=client.geographicalContext.country
| where eventType IN ("user.session.start", "user.authentication.sso")
| stats dc(client_ip) as unique_ips, dc(client_geo) as unique_geos,
        values(client_ip) as ip_list, values(client_geo) as geo_list
        by actor_email, auth_provider
| eval time_window = last_seen - first_seen
| where unique_ips > 2 AND unique_geos > 1 AND time_window < 300
| eval risk_score = case(
    unique_geos >= 3, "CRITICAL",
    unique_ips >= 4, "HIGH",
    1=1, "MEDIUM"
  )`,
      },
    ],
  },
  {
    name: '02_The_Purpose_CLAW_Engine',
    type: 'folder',
    icon: Workflow,
    color: 'text-purple-400',
    children: [
      {
        name: 'claw_schema_v1.md',
        type: 'file',
        repoPath: '02_The_Purpose_CLAW_Engine/claw_schema_v1.md',
        content: `# CLAW Playbook Schema v1.0
## Continuous, Logic-Adaptive Workflow Engine

apiVersion: claw.soac.io/v1
kind: Playbook
metadata:
  name: string        # Unique playbook identifier
  version: string     # Semantic version
  mitre_attack: []    # MITRE ATT&CK technique IDs
  severity: enum      # CRITICAL | HIGH | MEDIUM | LOW

spec:
  trigger:
    source: BODY | BRAIN | MANUAL | SCHEDULED
    conditions: [...]
    cooldown: duration
  steps:
    - id, name, action, target, params, timeout
    - retry: { max_attempts, backoff }
    - on_failure: continue | abort | rollback | escalate
  rollback:
    enabled: boolean
    steps: [...]
  governance:
    brain_oversight: boolean
    max_blast_radius: single_user | team | org | global`,
      },
      {
        name: 'playbooks/',
        type: 'folder',
        children: [
          {
            name: 'revoke_sessions.yaml',
            type: 'file',
            repoPath: '02_The_Purpose_CLAW_Engine/playbooks/revoke_sessions.yaml',
            content: `# CLAW Playbook: Revoke Compromised Sessions
apiVersion: claw.soac.io/v1
kind: Playbook
metadata:
  name: revoke-compromised-sessions
  version: "1.2.0"
  severity: CRITICAL
  mitre_attack: [T1557.001, T1078.004]

spec:
  trigger:
    source: BODY
    conditions:
      - field: detection_type
        operator: eq
        value: "aitm_session_hijack"
  steps:
    - id: enrich_user (Okta API)
    - id: revoke_okta_sessions (DELETE /sessions)
    - id: revoke_azure_tokens (POST /revokeSignInSessions)
    - id: notify_edge (Push to edge enforcement)
    - id: notify_soc (Slack #soc-critical)
  governance:
    brain_oversight: true
    max_blast_radius: single_user`,
          },
          {
            name: 'isolate_host.yaml',
            type: 'file',
            repoPath: '02_The_Purpose_CLAW_Engine/playbooks/isolate_host.yaml',
            content: `# CLAW Playbook: Isolate Compromised Host
apiVersion: claw.soac.io/v1
kind: Playbook
metadata:
  name: isolate-compromised-host
  version: "1.1.0"
  severity: CRITICAL
  mitre_attack: [T1486, T1059, T1068]

spec:
  trigger:
    source: BODY
    conditions:
      - field: detection_type
        operator: contains
        value: "ransomware"
  steps:
    - id: verify_host (CrowdStrike API)
    - id: contain_host (Network containment)
    - id: kill_processes (RTR kill PIDs)
    - id: snapshot_memory (Forensic capture)
    - id: push_edge_block (Firewall rules)
    - id: create_ticket (JIRA incident)
  governance:
    brain_oversight: true
    max_blast_radius: single_user`,
          },
        ],
      },
    ],
  },
  {
    name: 'brain',
    type: 'folder',
    icon: Brain,
    color: 'text-cyan-400',
    children: [
      {
        name: 'ai_governance_baseline.yaml',
        type: 'file',
        repoPath: 'brain/ai/governance/ai_governance_baseline.yaml',
        content: `# SOaC AI Governance Baseline
apiVersion: brain.soac.io/v1
kind: GovernancePolicy

llm_security:
  prompt_injection:
    detection_enabled: true
    methods: [input_sanitization, semantic_analysis, canary_token]
    actions:
      on_detect: block_and_log
  data_leakage:
    prevention_enabled: true
    pii_detection: true
    redaction_method: mask

decision_authority:
  autonomous: { max_risk: MEDIUM, scope: read_only }
  supervised: { min_risk: HIGH, requires: [human_approval, audit] }
  restricted: { risk: CRITICAL, requires: [dual_approval, rollback_plan] }

audit:
  logging: { level: verbose, retention: 365d, immutable: true }
  transparency: { explainability: required, confidence_threshold: 0.85 }`,
      },
    ],
  },
  {
    name: 'edge',
    type: 'folder',
    icon: Radio,
    color: 'text-amber-400',
    children: [
      {
        name: 'edge_api_spec_v1.md',
        type: 'file',
        repoPath: 'edge/specs/edge_api_spec_v1.md',
        content: `# Edge Enforcement API Specification v1.0
# HMAC-SHA256 Authenticated REST Endpoints

Base URL: https://edge.soac.io/api/v1

Authentication:
  X-SOaC-Timestamp: <unix_timestamp>
  X-SOaC-Signature: HMAC-SHA256(<timestamp>.<method>.<path>.<body_hash>)
  X-SOaC-Node-ID: <edge_node_id>

Endpoints:
  POST /enforce    - Push enforcement action
  GET  /enforce/id - Query enforcement status
  DELETE /enforce  - Revoke enforcement (dual-approval for CRITICAL)
  GET  /health     - Edge node health check
  POST /sync       - Force node synchronization

Actions: block_session | block_host | block_ip | rate_limit | quarantine
Scopes: user | host | network | global`,
      },
    ],
  },
  {
    name: 'brain/policy',
    type: 'folder',
    icon: Scale,
    color: 'text-pink-400',
    children: [
      {
        name: 'lab_safety_policy.yaml',
        type: 'file',
        repoPath: 'brain/policy/lab_safety_policy.yaml',
        content: `# SOaC Lab Safety Policy
apiVersion: policy.soac.io/v1
kind: SafetyPolicy

environments:
  lab:
    enforcement_mode: simulate
    data_source: synthetic
    network_access: isolated
    persistence: ephemeral
  staging:
    enforcement_mode: dry_run
    data_source: sanitized_production
    requires_approval: true
  production:
    enforcement_mode: enforce
    data_source: live
    dual_control: true

simulation_rules:
  allowed: [generate_alerts, simulate_playbook, test_detections]
  blocked: [modify_production, access_credentials, execute_containment]

access_control:
  roles: [lab_user, lab_admin, security_engineer]
  authentication: sso + mfa
  session_binding: ip_and_user_agent`,
      },
    ],
  },
  {
    name: 'core/templates',
    type: 'folder',
    icon: FileText,
    color: 'text-terminal',
    children: [
      {
        name: 'README.md',
        type: 'file',
        repoPath: 'core/templates/README.md',
        content: `# SOaC Core Templates

Canonical schemas that define the contract for all SOaC artifacts.
Every detection rule, CLAW playbook, policy definition, and package
metadata file across all MTIPs MUST conform to these templates.

Templates:
  claw_playbook_v1.0.yaml   — CLAW automated response workflow (Level 2)
  detection_rule_v1.0.yaml  — Detection rule schema (Level 1)
  policy_v1.0.yaml          — Policy-as-Code constraint schema (Level 1)
  metadata_v1.0.yaml        — Package metadata manifest (Level 1)

Four Pillars:
  The Body   → detection_rule_v1.0.yaml
  The Brain  → governance fields in all templates
  The Purpose → claw_playbook_v1.0.yaml
  The Edge   → target: EDGE in playbook steps`,
      },
      {
        name: 'claw_playbook_v1.0.yaml',
        type: 'file',
        repoPath: 'core/templates/claw_playbook_v1.0.yaml',
        content: `# SOaC CLAW Playbook Template v1.0
apiVersion: claw.soac.io/v1
kind: Playbook

metadata:
  name: ""                   # REQUIRED — unique kebab-case identifier
  version: "1.0.0"           # REQUIRED — semver
  mitre_attack: []           # REQUIRED — at least one technique
  severity: ""               # REQUIRED — CRITICAL | HIGH | MEDIUM | LOW
  package_id: ""             # REQUIRED — parent package (e.g. pkg-001)

spec:
  trigger:
    source: ""               # BODY | BRAIN | MANUAL | SCHEDULED
    conditions:
      - field: ""
        operator: ""         # eq | neq | gt | lt | contains | regex
        value: ""
  steps:
    - id: "step-1"
      action: ""             # api_call | containment | notification
      target: ""             # BODY | BRAIN | EDGE | INTERNAL
      on_failure: "halt"     # halt | skip | rollback
  rollback:
    steps: []                # REQUIRED for CRITICAL | HIGH
  governance:
    requires_brain_oversight: true
    max_blast_radius: ""     # single_user | team | org | global`,
      },
      {
        name: 'detection_rule_v1.0.yaml',
        type: 'file',
        repoPath: 'core/templates/detection_rule_v1.0.yaml',
        content: `# SOaC Detection Rule Template v1.0
apiVersion: soac.io/v1
kind: DetectionRule

metadata:
  name: ""                   # REQUIRED — unique kebab-case identifier
  version: "1.0.0"           # REQUIRED — semver
  package_id: ""             # REQUIRED — parent package
  mitre_attack:
    - technique: ""          # e.g. T1557.001
      tactic: ""             # e.g. Credential Access
  severity: ""               # CRITICAL | HIGH | MEDIUM | LOW
  confidence: ""             # HIGH | MEDIUM | LOW

spec:
  data_sources:
    - name: ""               # e.g. Okta System Log
      type: ""               # log | api | endpoint | network | cloud
  logic:
    type: ""                 # correlation | threshold | anomaly | signature
    timewindow: "5m"
    implementations:
      splunk: { spl: "" }    # At least ONE platform required
      sentinel: { kql: "" }
      sigma: { rule: "" }
  test_cases:
    - name: ""
      expected_result: ""    # alert | no_alert`,
      },
      {
        name: 'policy_v1.0.yaml',
        type: 'file',
        repoPath: 'core/templates/policy_v1.0.yaml',
        content: `# SOaC Policy-as-Code Template v1.0
apiVersion: soac.io/v1
kind: Policy

metadata:
  name: ""                   # REQUIRED — unique kebab-case identifier
  version: "1.0.0"           # REQUIRED — semver
  scope: ""                  # global | package | environment

spec:
  environments:
    - name: ""               # lab | staging | production
      mode: ""               # enforce | simulate | audit
      data_handling: ""      # synthetic | anonymized | live
  actions:
    allowed: []
    blocked: []
    requires_approval: []
  access_control:
    roles:
      - name: ""
        permissions: []      # read | write | execute | admin
  compliance:
    frameworks: []           # e.g. NIST CSF, ISO 27001
    review_frequency: ""     # quarterly | monthly | on_change`,
      },
      {
        name: 'metadata_v1.0.yaml',
        type: 'file',
        repoPath: 'core/templates/metadata_v1.0.yaml',
        content: `# SOaC Package Metadata Template v1.0
apiVersion: soac.io/v1
kind: PackageMetadata

package:
  id: ""                     # REQUIRED — e.g. pkg-001
  name: ""                   # REQUIRED — human-readable name
  version: "1.0.0"           # REQUIRED — semver
  description: ""            # REQUIRED — one-line summary
  status: ""                 # draft | review | released | deprecated

threat:
  mitre_attack:
    - technique_id: ""       # e.g. T1557.001
      tactic: ""             # e.g. Credential Access
  severity: ""               # CRITICAL | HIGH | MEDIUM | LOW

artifacts:
  detections: []             # paths to detection rule files
  playbooks: []              # paths to CLAW playbook files
  policies: []               # paths to policy files
  simulations: []            # lab scenario references

stakeholders:
  - role: ""                 # ciso | detection | soc | platform
    relevance: ""            # primary | secondary

signals_required:
  - name: ""                 # e.g. Okta System Log
    type: ""                 # log | api | endpoint | network | cloud

validation:
  harness_level: 1           # minimum harness level passed
  last_validated: ""         # ISO 8601`,
      },
    ],
  },
  {
    name: 'tools/soac-harness',
    type: 'folder',
    icon: Shield,
    color: 'text-cyan-400',
    children: [
      {
        name: 'README.md',
        type: 'file',
        repoPath: 'tools/soac-harness/README.md',
        content: `# SOaC Harness — CLI Validation & Replay Engine

Offline, CI-ready validator and scenario replay engine for all SOaC artifact types.

## Validation Levels

  Level 1 — Schema   : Structure, required fields, enum values
  Level 2 — Cross-Ref: MITRE ID format, package_id consistency,
                        CRITICAL severity → rollback + brain_oversight
  Level 3 — Replay   : Scenario replay maps lab steps to detection
                        triggers & playbook actions. Produces Evidence
                        Bundles (JSON manifest + Markdown report) per
                        package with MITRE ATT&CK coverage metrics.

## Supported Schemas

  Playbook        (apiVersion: claw.soac.io/v1, kind: Playbook)
  DetectionRule   (apiVersion: soac.io/v1, kind: DetectionRule)
  Policy          (apiVersion: soac.io/v1, kind: Policy)
  PackageMetadata (apiVersion: soac.io/v1, kind: PackageMetadata)

## Usage

  # Validate artifacts (Level 1 + 2)
  npx soac-harness validate --path packages/ --level 2 --format text

  # Replay scenarios → generate Evidence Bundles (Level 3)
  npx soac-harness replay \\
    --packages-dir packages/ \\
    --scenarios data/scenarios.json \\
    --registry data/packages.json

## Evidence Bundles

  After replay, each package gets:
    packages/NNN/evidence/evidence-manifest.json  — machine-readable
    packages/NNN/evidence/replay-report.md      — human-readable

  Verdict logic:
    PASS    — 100% of declared MITRE techniques validated + detection triggers + playbook actions
    PARTIAL — ≥50% coverage or at least one detection trigger
    FAIL    — below threshold

## Exit Codes

  0 — all checks pass
  1 — one or more packages/files failed
  2 — invalid arguments or missing paths

## CI Integration

  See .github/workflows/soac-ci.yml for a ready-made
  GitHub Actions pipeline that runs L1 + L2 validation
  followed by Level 3 replay with evidence artifact upload.`,
      },
      {
        name: 'src/',
        type: 'folder',
        children: [
          {
            name: 'types.ts',
            type: 'file',
            repoPath: 'tools/soac-harness/src/types.ts',
            content: `// SOaC Harness — Type Definitions
export type Kind = 'Playbook' | 'DetectionRule' | 'Policy' | 'PackageMetadata';
export type Severity = 'error' | 'warning';
export interface Finding {
  level: 1 | 2 | 3;
  severity: Severity;
  field: string;
  message: string;
  line?: number;
}
export interface FileResult {
  file: string;
  kind: Kind | null;
  findings: Finding[];
  pass: boolean;
}
export interface HarnessResult {
  level: number;
  files: FileResult[];
  pass: boolean;
}`,
          },
          {
            name: 'level1.ts',
            type: 'file',
            repoPath: 'tools/soac-harness/src/level1.ts',
            content: `// Level 1 — Schema Validation
// Validates structure, required fields, and enum values
// for Playbook, DetectionRule, Policy, and PackageMetadata.
// ~350 lines — see full source in the repository.`,
          },
          {
            name: 'level2.ts',
            type: 'file',
            repoPath: 'tools/soac-harness/src/level2.ts',
            content: `// Level 2 — Cross-Reference Validation
// Validates MITRE ATT&CK ID format (TNNNN / TNNNN.NNN),
// package_id consistency (pkg-NNN), CRITICAL severity
// requires rollback + brain_oversight, and more.
// ~120 lines — see full source in the repository.`,
          },
          {
            name: 'level3.ts',
            type: 'file',
            repoPath: 'tools/soac-harness/src/level3.ts',
            content: `// Level 3 — Replay & Evidence
// Walks a package's lab scenario step-by-step, mapping each phase
// to detection triggers (The Body), playbook actions (The Purpose),
// reasoning events (The Brain), and policy enforcement (The Edge).
//
// Produces an Evidence Bundle per package:
//   evidence-manifest.json — machine-readable coverage + timeline
//   replay-report.md     — human-readable Markdown with tables
//
// Key functions:
//   replayPackage()          — Core replay engine per package
//   generateMarkdownReport() — Renders manifest as Markdown
//   runLevel3()              — CLI-callable: discover & replay all packages
//
// Keyword heuristics map step text to artifacts:
//   DETECTION_KEYWORDS → detection.yaml (body/telemetry steps)
//   PLAYBOOK_KEYWORDS  → playbook.yaml  (purpose/brain steps)
//   Edge steps         → policy.yaml
//
// MITRE coverage: extracts technique IDs from artifacts + step text,
// computes coverage percentage, determines verdict (PASS/PARTIAL/FAIL).
// ~520 lines — see full source in the repository.`,
          },
          {
            name: 'index.ts',
            type: 'file',
            repoPath: 'tools/soac-harness/src/index.ts',
            content: `#!/usr/bin/env node
// SOaC Harness — CLI Entry Point
//
// Commands:
//   validate  — Level 1/2 schema & cross-reference validation
//     Usage: soac-harness validate --path <dir|file> [--level 1|2] [--format text|json]
//
//   replay    — Level 3 scenario replay & evidence generation
//     Usage: soac-harness replay --packages-dir <dir> --scenarios <file>
//                                --registry <file> [--format text|json]
//
// Exit codes: 0 = pass, 1 = fail, 2 = invalid args / missing paths`,
          },
        ],
      },
      {
        name: 'package.json',
        type: 'file',
        repoPath: 'tools/soac-harness/package.json',
        content: `{
  "name": "soac-harness",
  "version": "2.0.0",
  "description": "SOaC validation & replay harness — schema checks + evidence generation",
  "bin": { "soac-harness": "./dist/index.js" },
  "scripts": {
    "build": "tsc",
    "validate": "ts-node src/index.ts validate",
    "replay": "ts-node src/index.ts replay --packages-dir ../../packages --scenarios ../../data/scenarios.json --registry ../../data/packages.json",
    "test": "ts-node src/index.ts validate --path ../../packages --level 2"
  }
}`,
      },
    ],
  },
];

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [copied, setCopied] = useState(false);

  const Icon = node?.icon ?? (node?.type === 'folder' ? Folder : FileText);
  const hasChildren = (node?.children?.length ?? 0) > 0;
  const isFolder = node?.type === 'folder';

  const handleCopy = () => {
    if (selectedFile?.content) {
      navigator?.clipboard?.writeText?.(selectedFile.content)?.catch?.(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const githubUrl = node?.repoPath ? `${GITHUB_BASE}/${node.repoPath}` : null;

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder && hasChildren) setIsOpen(!isOpen);
          if (!isFolder && node?.content) setSelectedFile(selectedFile?.name === node?.name ? null : node);
        }}
        className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-left font-mono text-sm hover:bg-muted/50 transition-all group ${
          selectedFile?.name === node?.name ? 'bg-muted/50' : ''
        }`}
        style={{ paddingLeft: `${(depth ?? 0) * 16 + 8}px` }}
      >
        {isFolder ? (
          isOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <span className="w-3.5" />
        )}
        <Icon className={`w-4 h-4 ${node?.color ?? (isFolder ? 'text-terminal/60' : 'text-muted-foreground')}`} />
        <span className={`${isFolder ? (node?.color ?? 'text-foreground') : 'text-muted-foreground group-hover:text-foreground'} text-xs`}>
          {node?.name ?? ''}
        </span>
      </button>

      <AnimatePresence>
        {!isFolder && selectedFile?.name === node?.name && selectedFile?.content ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-4 my-2 rounded-md bg-muted/50 border border-border overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 bg-muted/80 border-b border-border">
                <span className="font-mono text-[10px] text-muted-foreground">{node?.name ?? ''}</span>
                <div className="flex items-center gap-3">
                  {githubUrl ? (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-terminal transition-colors"
                      onClick={(e) => { e.stopPropagation(); if (githubUrl) trackGithubPivot(githubUrl); }}
                    >
                      <ExternalLink className="w-3 h-3" /> View on GitHub
                    </a>
                  ) : null}
                  <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-terminal transition-colors">
                    {copied ? <><CheckCircle className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
              </div>
              <pre className="p-3 overflow-x-auto text-[11px] font-mono text-muted-foreground leading-relaxed">
                {selectedFile?.content ?? ''}
              </pre>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && hasChildren ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {node?.children?.map?.((child, i) => (
              <FileTreeNode key={child?.name ?? i} node={child} depth={(depth ?? 0) + 1} />
            )) ?? null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function DocsExplorer() {
  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
        <Folder className="w-4 h-4 text-terminal" />
        <span className="font-mono text-sm text-foreground">soac-architecture/</span>
      </div>
      <div className="p-2">
        {fileTree?.map?.((node, i) => (
          <FileTreeNode key={node?.name ?? i} node={node} />
        )) ?? null}
      </div>
    </div>
  );
}