<!--
  SOaC-Enterprise: CLAW Playbook Schema v1.0 (Markdown)
  Publisher:  SOaC Core Team | Version: 1.0.0 | Date: March 2026
  License:    Apache 2.0
  Repository: github.com/ge0mant1s/SOaC-Enterprise
-->

# CLAW Playbook Schema v1.0
**Continuous, Logic-Adaptive Workflow Engine**

> **Publisher:** SOaC Core Team | **Version:** 1.0.0 | **Date:** March 2026
> **License:** Apache 2.0 | **Repository:** [github.com/ge0mant1s/SOaC-Enterprise](https://github.com/ge0mant1s/SOaC-Enterprise)

---

## Table of Contents

| # | Section | 
|---|---|
| 1 | [Introduction](#1-introduction) |
| 2 | [Schema Definition](#2-schema-definition) |
| 3 | [Field Reference](#3-field-reference) |
| 4 | [Execution Lifecycle](#4-execution-lifecycle) |
| 5 | [Governance & Blast Radius](#5-governance--blast-radius) |
| 6 | [Example: Revoke Compromised Sessions](#6-example-revoke-compromised-sessions) |
| 7 | [Example: Isolate Compromised Host](#7-example-isolate-compromised-host) |
| 8 | [Detection Schema Reference](#8-detection-schema-reference) |
| 9 | [Versioning & Changelog](#9-versioning--changelog) |

---

## 1. Introduction

The **CLAW Engine** (Continuous, Logic-Adaptive Workflow) is the automated response layer of the SOaC Distributed Intelligence Architecture. It sits at the intersection of **The Body** (detection telemetry), **The Brain** (AI-driven reasoning), and **The Nervous System** (edge enforcement).

CLAW playbooks are **YAML contracts** that define exactly how the system responds to a threat — what steps to execute, what approvals are required, how failures are handled, and when to roll back. Every playbook is version-controlled, peer-reviewed, and immutably audited.

> **Design Principle:** A CLAW playbook should be readable by a SOC analyst, reviewable by an engineer, and auditable by a compliance team — all from the same YAML file.

### Audience

| Role | How to use this spec |
|:---|:---|
| SOC Analyst / IR | Understand playbook behavior, failure modes, and rollback triggers |
| Detection Engineer | Write detection rules that trigger CLAW playbooks correctly |
| Platform Engineer | Implement CLAW execution engine, integrate with APIs |
| CISO / Compliance | Review governance controls, blast radius, and audit guarantees |

---

## 2. Schema Definition

Every CLAW playbook must conform to the following YAML structure. Fields marked `required` must be present for the playbook to validate.

```yaml
# CLAW Playbook Schema v1.0
apiVersion: claw.soac.io/v1       # required
kind: Playbook                     # required

metadata:
  name: string                     # required - unique kebab-case identifier
  version: string                  # required - semver (e.g. "1.2.0")
  author: string                   # required - author ID
  created: datetime                # ISO 8601 timestamp
  tags: string[]                   # classification tags
  mitre_attack: string[]           # required - MITRE ATT&CK IDs
  severity: CRITICAL | HIGH | MEDIUM | LOW

spec:
  description: string              # human-readable description

  trigger:
    source: BODY | BRAIN | MANUAL | SCHEDULED
    conditions:
      - field: string
        operator: eq | neq | gt | lt | contains | regex
        value: any
    cooldown: duration             # e.g. "5m", "1h"

  inputs:
    - name: string
      type: string | number | boolean | array | object
      required: boolean
      source: detection | enrichment | manual | config
      default: any

  steps:
    - id: string                   # required - unique step ID
      name: string                 # human-readable name
      action: api_call | script | decision | notify
      target: string               # target system
      params: object               # action-specific parameters
      timeout: duration            # max execution time
      retry:
        max_attempts: number
        backoff: linear | exponential
      on_failure: continue | abort | rollback | escalate
      conditions:
        - when: string             # condition expression
          then: string             # step to execute

  outputs:
    - name: string
      type: string | number | boolean | array | object
      source: string               # step ID that produces output

  rollback:
    enabled: boolean
    steps: []                      # same structure as spec.steps

  governance:
    requires_approval: boolean
    approval_timeout: duration
    max_blast_radius: single_user | team | org | global
    audit_level: minimal | standard | verbose
    brain_oversight: boolean       # AI must validate before execution
```

---

## 3. Field Reference

### 3.1 Metadata

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `apiVersion` | string | ✅ | Must be `claw.soac.io/v1` |
| `kind` | string | ✅ | Must be `Playbook` |
| `metadata.name` | string | ✅ | Unique kebab-case identifier |
| `metadata.version` | string | ✅ | Semantic versioning (MAJOR.MINOR.PATCH) |
| `metadata.mitre_attack` | string[] | ✅ | MITRE ATT&CK technique IDs (e.g. `T1557.001`) |
| `metadata.severity` | enum | ✅ | `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW` |

### 3.2 Trigger

| Field | Type | Description |
|:---|:---|:---|
| `trigger.source` | enum | Which SOaC component initiates: `BODY`, `BRAIN`, `MANUAL`, `SCHEDULED` |
| `trigger.conditions` | array | All conditions must match (AND logic). Operators: `eq`, `neq`, `gt`, `lt`, `contains`, `regex` |
| `trigger.cooldown` | duration | Minimum time between executions. Prevents rapid re-triggering (e.g. `"5m"`, `"1h"`) |

### 3.3 Steps

| Field | Type | Description |
|:---|:---|:---|
| `steps[].action` | enum | `api_call`: HTTP call. `script`: Execute command. `decision`: Branch logic. `notify`: Send alert. |
| `steps[].on_failure` | enum | `continue`: skip and proceed. `abort`: halt. `rollback`: execute rollback steps. `escalate`: alert human. |
| `steps[].retry` | object | `max_attempts` (1–10) and `backoff` (`linear` or `exponential`) |
| `steps[].timeout` | duration | Per-step timeout. Example: `"30s"`, `"2m"` |

### 3.4 Governance

| Field | Type | Description |
|:---|:---|:---|
| `brain_oversight` | boolean | When `true`, The Brain (AI) must validate before execution begins |
| `max_blast_radius` | enum | `single_user` (safest) → `team` → `org` → `global` (most impact) |
| `requires_approval` | boolean | If `true`, human approval required before execution |
| `audit_level` | enum | `verbose`: full I/O logging. `standard`: summary. `minimal`: status only. |

---

## 4. Execution Lifecycle

Every CLAW playbook execution follows a deterministic **6-phase lifecycle**:

```
TRIGGER → VALIDATE → EXECUTE → ENFORCE → REPORT → ROLLBACK (conditional)
```

| Phase | Description |
|:---|:---|
| **1. TRIGGER** | Detection event matches `trigger.conditions`. Cooldown window is checked. |
| **2. VALIDATE** | If `brain_oversight: true`, The Brain evaluates risk and returns `APPROVE` or `DENY` with audit hash. If `requires_approval: true`, execution blocks for human approval. |
| **3. EXECUTE** | Steps run sequentially. Conditions evaluated per step. Retry logic applies. |
| **4. ENFORCE** | Steps targeting `edge_enforcement` trigger The Nervous System. Actions are HMAC-signed. |
| **5. REPORT** | Outputs collected, immutable audit record generated (SHA-256), notifications dispatched. |
| **6. ROLLBACK** | If a step with `on_failure: rollback` fails, `rollback.steps` execute in reverse order. |

---

## 5. Governance & Blast Radius

### 5.1 Blast Radius Matrix

| Level | Scope | Example Actions | Brain Oversight |
|:---|:---|:---|:---|
| `single_user` | One user account | Revoke sessions, reset MFA | Optional |
| `team` | Group / OU | Quarantine shared mailbox, disable group | Recommended |
| `org` | Entire organization | Block IP range, disable OAuth app | Required |
| `global` | Cross-tenant / infra | DNS sinkhole, global firewall rule | Required + Human approval |

### 5.2 Failure Handling Strategy

| `on_failure` | Behavior | Use When |
|:---|:---|:---|
| `continue` | Log failure, skip step, proceed | Non-critical enrichment or notification steps |
| `abort` | Halt playbook immediately | Verification steps where failure = invalid context |
| `rollback` | Execute `rollback.steps` in reverse | Containment steps where partial execution is dangerous |
| `escalate` | Halt + alert human operator | Critical enforcement steps requiring manual intervention |

---

## 6. Example: Revoke Compromised Sessions

> **Severity:** CRITICAL | **MITRE:** T1557.001, T1078.004 | **Tags:** identity, aitm

```yaml
apiVersion: claw.soac.io/v1
kind: Playbook
metadata:
  name: revoke-compromised-sessions
  version: "1.2.0"
  author: soac-core-team
  created: "2026-01-15T00:00:00Z"
  tags: [session-hijack, identity, aitm]
  mitre_attack: [T1557.001, T1078.004]
  severity: CRITICAL
spec:
  description: Revokes all active sessions for a compromised user detected via AitM phishing or session token theft.
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
  steps:
    - id: enrich_user
      name: Enrich User Context
      action: api_call
      target: okta
      params: { endpoint: /api/v1/users/${actor_email}, method: GET }
      timeout: 10s
      retry: { max_attempts: 3, backoff: exponential }
      on_failure: abort
    - id: revoke_okta_sessions
      name: Revoke All Okta Sessions
      action: api_call
      target: okta
      params: { endpoint: /api/v1/users/${user_id}/sessions, method: DELETE }
      timeout: 15s
      on_failure: escalate
    - id: revoke_azure_tokens
      name: Revoke Azure AD Refresh Tokens
      action: api_call
      target: microsoft_graph
      params: { endpoint: /v1.0/users/${actor_email}/revokeSignInSessions, method: POST }
      on_failure: continue
    - id: notify_edge
      name: Push Block to Edge Enforcement
      action: api_call
      target: edge_enforcement
      params: { action: block_session, scope: user, duration: 24h, hmac_signed: true }
      on_failure: escalate
    - id: notify_soc
      name: Alert SOC Team
      action: notify
      target: slack
      params: { channel: "#soc-critical" }
      on_failure: continue
  rollback:
    enabled: true
    steps:
      - id: restore_sessions
        action: api_call
        target: okta
        params: { endpoint: /api/v1/users/${user_id}/lifecycle/activate, method: POST }
  governance:
    requires_approval: false
    max_blast_radius: single_user
    audit_level: verbose
    brain_oversight: true
```

---

## 7. Example: Isolate Compromised Host

> **Severity:** CRITICAL | **MITRE:** T1486, T1059, T1068 | **Tags:** endpoint, ransomware

```yaml
apiVersion: claw.soac.io/v1
kind: Playbook
metadata:
  name: isolate-compromised-host
  version: "1.1.0"
  author: soac-core-team
  mitre_attack: [T1486, T1059, T1068]
  severity: CRITICAL
spec:
  description: Isolates a compromised endpoint. Applies network containment, kills malicious processes, and preserves forensic artifacts.
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
    - name: hostname
      type: string
      required: true
    - name: malicious_pids
      type: array
      required: false
  steps:
    - id: verify_host
      name: Verify Host Identity
      action: api_call
      target: crowdstrike
      params: { endpoint: /devices/entities/devices/v2, method: GET }
      on_failure: abort
    - id: contain_host
      name: Network Isolation via CrowdStrike
      action: api_call
      target: crowdstrike
      params: { action_name: contain, ids: ["${host_id}"] }
      timeout: 30s
      retry: { max_attempts: 3, backoff: exponential }
      on_failure: escalate
    - id: kill_processes
      name: Terminate Malicious PIDs
      action: script
      target: crowdstrike_rtr
      params: { command: kill, pids: "${malicious_pids}" }
      conditions: [{ when: "malicious_pids != null", then: execute }]
      on_failure: continue
    - id: snapshot_memory
      name: Forensic Memory Capture
      action: script
      target: crowdstrike_rtr
      params: { command: memdump }
      timeout: 120s
      on_failure: continue
    - id: push_edge_block
      name: Edge Firewall Enforcement
      action: api_call
      target: edge_enforcement
      params: { action: block_host, scope: network, duration: 48h, hmac_signed: true }
      on_failure: escalate
    - id: create_ticket
      name: Create JIRA Incident Ticket
      action: api_call
      target: jira
      params: { project: SOC, issue_type: Incident, priority: Critical }
      on_failure: continue
  rollback:
    enabled: true
    steps:
      - id: lift_containment
        action: api_call
        target: crowdstrike
        params: { action_name: lift_containment, ids: ["${host_id}"] }
      - id: remove_edge_block
        action: api_call
        target: edge_enforcement
        params: { action: unblock_host, identifier: "${host_id}" }
  governance:
    requires_approval: false
    max_blast_radius: single_user
    audit_level: verbose
    brain_oversight: true
```

---

## 8. Detection Schema Reference

### 8.1 Required Detection Output Fields

| Field | Type | Description |
|:---|:---|:---|
| `detection_id` | string | Unique ID: `BODY-{TYPE}-{PLATFORM}-{hash}` |
| `detection_type` | string | Classification key matching CLAW `trigger.conditions` |
| `risk_score` | enum | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` |
| `confidence` | number | 0–100 detection confidence percentage |
| `mitre_attack` | string[] | Mapped MITRE ATT&CK technique IDs |
| `actor_email` | string | Affected user (identity-based playbooks) |
| `host_id` | string | Affected host (endpoint-based playbooks) |
| `timestamp` | datetime | ISO 8601 detection timestamp |

### 8.2 Example: Splunk Detection Output (AitM)

```spl
index=okta sourcetype=OktaIM2:log
| spath output=eventType path=eventType
| spath output=actor_email path=actor.alternateId
| spath output=client_ip path=client.ipAddress
| spath output=client_geo path=client.geographicalContext.country
| where eventType IN ("user.session.start", "user.authentication.sso")
| stats dc(client_ip) as unique_ips,
        dc(client_geo) as unique_geos,
        values(client_ip) as ip_list
  by actor_email
| where unique_ips > 2 AND unique_geos > 1
| eval risk_score = case(
    unique_geos > 3, "CRITICAL",
    unique_ips > 4,  "HIGH",
    1=1,             "MEDIUM")
| eval detection_id = "BODY-AITM-OKTA-" . md5(actor_email)
| table detection_id, actor_email, risk_score, unique_ips, unique_geos
```

---

## 9. Versioning & Changelog

### 9.1 Schema Versioning Policy

| Change Type | Version Bump | Examples |
|:---|:---|:---|
| Breaking schema change | MAJOR | Removing a required field, changing `apiVersion` |
| New optional field | MINOR | Adding `steps[].conditions`, new `on_failure` mode |
| Documentation fix | PATCH | Typo corrections, clarifying field descriptions |

### 9.2 Changelog

| Version | Date | Changes |
|:---|:---|:---|
| 1.0.0 | March 2026 | Initial release. Full schema, 2 examples, detection contract, governance controls. |

---

*SOaC-Enterprise — Security Operations as Code. Stop Triage. Start Programming.*
*[github.com/ge0mant1s/SOaC-Enterprise](https://github.com/ge0mant1s/SOaC-Enterprise)*
