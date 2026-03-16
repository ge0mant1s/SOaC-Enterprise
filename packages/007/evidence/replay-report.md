# Evidence Bundle — PKG-007

**Package:** Cloud IAM Privilege Escalation  
**Scenario:** SolarStorm Cloud Privilege Escalation (`pkg-007`)  
**Generated:** 2026-03-16T18:25:00.553Z  
**Harness Level:** 3 (Replay & Evidence)  
**Verdict:** ✅ **PASS** — All 3 declared MITRE techniques (from metadata.yml) validated by replay heuristics. 4 detection triggers, 9 playbook actions observed.

---

## Replay Summary

| Metric | Value |
|---|---|
| Total scenario steps | 64 |
| Body (telemetry) steps | 9 |
| Brain (reasoning) steps | 10 |
| Purpose (playbook) steps | 8 |
| Edge (enforcement) steps | 3 |
| Detection triggers | 4 |
| Playbook actions | 9 |
| MITRE techniques declared | 3 |
| MITRE techniques exercised | 3 |
| Declared-technique coverage | **100%** |

## MITRE ATT&CK Coverage

| Technique | Tactic | Exercised | Steps | Detected By | Responded By |
|---|---|---|---|---|---|
| T1078.004 | Defense Evasion | ✅ | 8, 12, 14, 17, 19 | cloud-iam-privesc-detection | cloud-iam-privesc-containment |
| T1548 | Privilege Escalation | ✅ | 8, 12, 14, 17, 19 | cloud-iam-privesc-detection | cloud-iam-privesc-containment |
| T1484 | Defense Evasion | ✅ | 8, 12, 14, 17, 19 | cloud-iam-privesc-detection | cloud-iam-privesc-containment |

## Artifacts Used

| Artifact | File | Status |
|---|---|---|
| detection | `detection.yaml` | ✅ Loaded |
| playbook | `playbook.yaml` | ✅ Loaded |
| policy | `policy.yaml` | ✅ Loaded |
| metadata | `metadata.yml` | ✅ Loaded |

## Replay Timeline (Artifact Hits)

| Step | Phase | Pillar | Artifact | MITRE | Text (truncated) |
|---|---|---|---|---|---|
| 12 | 1 | BODY | `detection.yaml` | T1078.004, T1548, T1484 | ━━━ PHASE 1: THE BODY — Cloud Audit Telemetry ━━━━━━━━━━━━━━ |
| 14 | 1 | BODY | `detection.yaml` | T1078.004, T1548, T1484 | [BODY] CloudTrail event: sts:AssumeRole from unusual source |
| 17 | 1 | BODY | `detection.yaml` | T1078.004, T1548, T1484 | [BODY] ⚡ Detection triggered: BODY-IAM-PRIVESC-b7e3d2 |
| 19 | 1 | BODY | `detection.yaml` | T1078.004, T1548, T1484 | [BODY]   ├─ Cross-account: dev → prod account pivot detected |
| 35 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Recommended playbook: cloud-iam-privesc-containment ... |
| 38 | 3 | PURPOSE | `playbook.yaml` | — | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━... |
| 40 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Loading: cloud-iam-privesc-containment v1.0.0 |
| 41 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 1/3: revoke_iam_sessions |
| 42 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: EDGE | action: revoke all active sessions |
| 44 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 2/3: detach_unauthorized_policies |
| 45 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: BODY | action: DetachRolePolicy Administrat... |
| 47 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 3/3: audit_cross_account_trust |
| 48 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: INTERNAL | action: enumerate trust policies |
| 51 | 4 | EDGE | `policy.yaml` | — | ━━━ PHASE 4: THE EDGE — Enforcement ━━━━━━━━━━━━━━━━━━━━━━━━ |
| 53 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcing IAM session revocation... |
| 54 | 4 | EDGE | `policy.yaml` | — | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

<details>
<summary>Full Replay Timeline (all pillar steps)</summary>

| Step | Pillar | Text |
|---|---|---|
| 12 | BODY | ━━━ PHASE 1: THE BODY — Cloud Audit Telemetry ━━━━━━━━━━━━━━ |
| 14 | BODY | [BODY] CloudTrail event: sts:AssumeRole from unusual source |
| 15 | BODY | [BODY] Principal: arn:aws:iam::123456789:role/dev-lambda-exec |
| 16 | BODY | [BODY] Target: arn:aws:iam::987654321:role/admin-cross-account |
| 17 | BODY | [BODY] ⚡ Detection triggered: BODY-IAM-PRIVESC-b7e3d2 |
| 18 | BODY | [BODY]   ├─ AssumeRole calls: 7 in 120 seconds (baseline: 1/hour) |
| 19 | BODY | [BODY]   ├─ Cross-account: dev → prod account pivot detected |
| 20 | BODY | [BODY]   ├─ AttachRolePolicy: AdministratorAccess attached |
| 21 | BODY | [BODY]   └─ Source IP: 203.0.113.99 (not in known CIDR) |
| 25 | BRAIN | ━━━ PHASE 2: THE BRAIN — AI Threat Analysis ━━━━━━━━━━━━━━━━━ |
| 27 | BRAIN | [BRAIN] Receiving detection BODY-IAM-PRIVESC-b7e3d2... |
| 28 | BRAIN | [BRAIN] Loading governance: ai_governance_baseline.yaml |
| 29 | BRAIN | [BRAIN] Decision authority: CRITICAL → brain_oversight REQUIRED |
| 30 | BRAIN | [BRAIN]   ├─ Role chain: dev-lambda → staging-deploy → admin-cross |
| 31 | BRAIN | [BRAIN]   ├─ Policy attachment: AdministratorAccess (over-privileged) |
| 32 | BRAIN | [BRAIN]   ├─ Source IP 203.0.113.99: VPN exit node, not employee range |
| 33 | BRAIN | [BRAIN]   └─ Blast radius: full admin on production account |
| 34 | BRAIN | [BRAIN] Confidence: 91% → 97% (3-hop chain + admin policy attach) |
| 35 | BRAIN | [BRAIN] Recommended playbook: cloud-iam-privesc-containment v1.0.0 |
| 38 | PURPOSE | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━━ |
| 40 | PURPOSE | [CLAW] Loading: cloud-iam-privesc-containment v1.0.0 |
| 41 | PURPOSE | [CLAW] Step 1/3: revoke_iam_sessions |
| 42 | PURPOSE | [CLAW]   target: EDGE | action: revoke all active sessions |
| 44 | PURPOSE | [CLAW] Step 2/3: detach_unauthorized_policies |
| 45 | PURPOSE | [CLAW]   target: BODY | action: DetachRolePolicy AdministratorAccess |
| 47 | PURPOSE | [CLAW] Step 3/3: audit_cross_account_trust |
| 48 | PURPOSE | [CLAW]   target: INTERNAL | action: enumerate trust policies |
| 51 | EDGE | ━━━ PHASE 4: THE EDGE — Enforcement ━━━━━━━━━━━━━━━━━━━━━━━━ |
| 53 | EDGE | [EDGE] Enforcing IAM session revocation... |
| 54 | EDGE | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

</details>
