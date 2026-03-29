# Evidence Bundle — PKG-009

**Package:** Data Exfiltration & Staging  
**Scenario:** DarkVault Data Exfiltration (`pkg-009`)  
**Generated:** 2026-03-18T12:13:37.096Z  
**Harness Level:** 3 (Replay & Evidence)  
**Verdict:** ✅ **PASS** — All 3 declared MITRE techniques (from metadata.yml) validated by replay heuristics. 4 detection triggers, 9 playbook actions observed.

---

## Replay Summary

| Metric | Value |
|---|---|
| Total scenario steps | 62 |
| Body (telemetry) steps | 8 |
| Brain (reasoning) steps | 9 |
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
| T1560 | Collection | ✅ | 8, 12, 14, 16, 18 | data-exfiltration-staging-detection | data-exfiltration-containment |
| T1041 | Exfiltration | ✅ | 8, 12, 14, 16, 18 | data-exfiltration-staging-detection | data-exfiltration-containment |
| T1567 | Exfiltration | ✅ | 8, 12, 14, 16, 18 | data-exfiltration-staging-detection | data-exfiltration-containment |

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
| 12 | 1 | BODY | `detection.yaml` | T1560, T1041, T1567 | ━━━ PHASE 1: THE BODY — DLP & Network Telemetry ━━━━━━━━━━━━ |
| 14 | 1 | BODY | `detection.yaml` | T1560, T1041, T1567 | [BODY] DLP alert: Large archive creation on SRV-DB-03 |
| 16 | 1 | BODY | `detection.yaml` | T1560, T1041, T1567 | [BODY] ⚡ Detection triggered: BODY-EXFIL-STAGE-d9a4b7 |
| 18 | 1 | BODY | `detection.yaml` | T1560, T1041, T1567 | [BODY]   ├─ Sensitivity: CONFIDENTIAL labels detected in pay... |
| 33 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Recommended playbook: data-exfiltration-containment ... |
| 36 | 3 | PURPOSE | `playbook.yaml` | — | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━... |
| 38 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Loading: data-exfiltration-containment v1.0.0 |
| 39 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 1/3: block_exfil_channel |
| 40 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: EDGE | action: block outbound to mega.nz |
| 42 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 2/3: quarantine_staging_host |
| 43 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: EDGE | action: network isolate SRV-DB-03 |
| 45 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 3/3: escalate_to_ciso |
| 46 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: INTERNAL | action: CISO escalation with evi... |
| 49 | 4 | EDGE | `policy.yaml` | — | ━━━ PHASE 4: THE EDGE — Enforcement ━━━━━━━━━━━━━━━━━━━━━━━━ |
| 51 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcing exfiltration block... |
| 52 | 4 | EDGE | `policy.yaml` | — | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

<details>
<summary>Full Replay Timeline (all pillar steps)</summary>

| Step | Pillar | Text |
|---|---|---|
| 12 | BODY | ━━━ PHASE 1: THE BODY — DLP & Network Telemetry ━━━━━━━━━━━━ |
| 14 | BODY | [BODY] DLP alert: Large archive creation on SRV-DB-03 |
| 15 | BODY | [BODY] File: C:\staging\export_20260316.7z (2.4 GB, password-protected) |
| 16 | BODY | [BODY] ⚡ Detection triggered: BODY-EXFIL-STAGE-d9a4b7 |
| 17 | BODY | [BODY]   ├─ Archive created: 2.4 GB from 14,000 database records |
| 18 | BODY | [BODY]   ├─ Sensitivity: CONFIDENTIAL labels detected in payload |
| 19 | BODY | [BODY]   ├─ Outbound: 2.4 GB upload to mega.nz (unauthorized service) |
| 20 | BODY | [BODY]   └─ Transfer rate: 45 MB/s sustained (abnormal for user) |
| 24 | BRAIN | ━━━ PHASE 2: THE BRAIN — AI Threat Analysis ━━━━━━━━━━━━━━━━━ |
| 26 | BRAIN | [BRAIN] Receiving detection BODY-EXFIL-STAGE-d9a4b7... |
| 27 | BRAIN | [BRAIN] Decision authority: CRITICAL → brain_oversight REQUIRED |
| 28 | BRAIN | [BRAIN]   ├─ Staging: password-protected 7z (anti-forensic technique) |
| 29 | BRAIN | [BRAIN]   ├─ Destination: mega.nz (not on approved cloud services) |
| 30 | BRAIN | [BRAIN]   ├─ Volume: 2.4 GB exceeds user's 30-day average (47 MB) |
| 31 | BRAIN | [BRAIN]   └─ Time: 02:47 UTC (outside user's normal working hours) |
| 32 | BRAIN | [BRAIN] Confidence: 92% → 98% (volume + destination + time anomaly) |
| 33 | BRAIN | [BRAIN] Recommended playbook: data-exfiltration-containment v1.0.0 |
| 36 | PURPOSE | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━━ |
| 38 | PURPOSE | [CLAW] Loading: data-exfiltration-containment v1.0.0 |
| 39 | PURPOSE | [CLAW] Step 1/3: block_exfil_channel |
| 40 | PURPOSE | [CLAW]   target: EDGE | action: block outbound to mega.nz |
| 42 | PURPOSE | [CLAW] Step 2/3: quarantine_staging_host |
| 43 | PURPOSE | [CLAW]   target: EDGE | action: network isolate SRV-DB-03 |
| 45 | PURPOSE | [CLAW] Step 3/3: escalate_to_ciso |
| 46 | PURPOSE | [CLAW]   target: INTERNAL | action: CISO escalation with evidence |
| 49 | EDGE | ━━━ PHASE 4: THE EDGE — Enforcement ━━━━━━━━━━━━━━━━━━━━━━━━ |
| 51 | EDGE | [EDGE] Enforcing exfiltration block... |
| 52 | EDGE | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

</details>
