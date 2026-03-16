# Evidence Bundle — PKG-011

**Package:** Insider Threat & Anomalous Behavior  
**Scenario:** Midnight Raven Insider Threat (`pkg-011`)  
**Generated:** 2026-03-16T18:25:00.682Z  
**Harness Level:** 3 (Replay & Evidence)  
**Verdict:** ✅ **PASS** — All 3 declared MITRE techniques (from metadata.yml) validated by replay heuristics. 3 detection triggers, 9 playbook actions observed.

---

## Replay Summary

| Metric | Value |
|---|---|
| Total scenario steps | 65 |
| Body (telemetry) steps | 9 |
| Brain (reasoning) steps | 11 |
| Purpose (playbook) steps | 8 |
| Edge (enforcement) steps | 3 |
| Detection triggers | 3 |
| Playbook actions | 9 |
| MITRE techniques declared | 3 |
| MITRE techniques exercised | 3 |
| Declared-technique coverage | **100%** |

## MITRE ATT&CK Coverage

| Technique | Tactic | Exercised | Steps | Detected By | Responded By |
|---|---|---|---|---|---|
| T1078 | Defense Evasion | ✅ | 8, 12, 14, 16 | insider-threat-anomaly-detection | insider-threat-response |
| T1530 | Collection | ✅ | 8, 12, 14, 16 | insider-threat-anomaly-detection | insider-threat-response |
| T1213 | Collection | ✅ | 8, 12, 14, 16 | insider-threat-anomaly-detection | insider-threat-response |

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
| 12 | 1 | BODY | `detection.yaml` | T1078, T1530, T1213 | ━━━ PHASE 1: THE BODY — Behavioral Telemetry ━━━━━━━━━━━━━━━ |
| 14 | 1 | BODY | `detection.yaml` | T1078, T1530, T1213 | [BODY] UEBA alert: Risk score spike for user r.martinez |
| 16 | 1 | BODY | `detection.yaml` | T1078, T1530, T1213 | [BODY] ⚡ Detection triggered: BODY-INSIDER-ANON-f2a7c4 |
| 36 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Recommended playbook: insider-threat-response v1.0.0 |
| 39 | 3 | PURPOSE | `playbook.yaml` | — | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━... |
| 41 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Loading: insider-threat-response v1.0.0 |
| 42 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 1/3: increase_monitoring |
| 43 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: BODY | action: elevate monitoring for user |
| 45 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 2/3: restrict_access |
| 46 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: EDGE | action: reduce to read-only, block e... |
| 48 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 3/3: escalate_to_ciso |
| 49 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: INTERNAL | action: CISO escalation with evi... |
| 52 | 4 | EDGE | `policy.yaml` | — | ━━━ PHASE 4: THE EDGE — Enforcement ━━━━━━━━━━━━━━━━━━━━━━━━ |
| 54 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcing access restrictions... |
| 55 | 4 | EDGE | `policy.yaml` | — | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

<details>
<summary>Full Replay Timeline (all pillar steps)</summary>

| Step | Pillar | Text |
|---|---|---|
| 12 | BODY | ━━━ PHASE 1: THE BODY — Behavioral Telemetry ━━━━━━━━━━━━━━━ |
| 14 | BODY | [BODY] UEBA alert: Risk score spike for user r.martinez |
| 15 | BODY | [BODY] Current risk score: 92/100 (baseline: 15) |
| 16 | BODY | [BODY] ⚡ Detection triggered: BODY-INSIDER-ANON-f2a7c4 |
| 17 | BODY | [BODY]   ├─ Access time: 02:15 UTC (user's normal: 08:00-18:00) |
| 18 | BODY | [BODY]   ├─ SharePoint: 847 documents downloaded in 45 minutes |
| 19 | BODY | [BODY]   ├─ Confluence: 23 restricted wiki pages exported to PDF |
| 20 | BODY | [BODY]   ├─ Badge: no physical building entry today (remote VPN) |
| 21 | BODY | [BODY]   └─ HR signal: resignation submitted 3 days ago |
| 25 | BRAIN | ━━━ PHASE 2: THE BRAIN — AI Threat Analysis ━━━━━━━━━━━━━━━━━ |
| 27 | BRAIN | [BRAIN] Receiving detection BODY-INSIDER-ANON-f2a7c4... |
| 28 | BRAIN | [BRAIN] Loading governance: ai_governance_baseline.yaml |
| 29 | BRAIN | [BRAIN] PII detection: employee name → REDACTED in analysis logs |
| 30 | BRAIN | [BRAIN]   ├─ Bulk download: 847 docs (user's 90-day avg: 12/day) |
| 31 | BRAIN | [BRAIN]   ├─ Off-hours: 02:15 UTC, no prior off-hours access in 180d |
| 32 | BRAIN | [BRAIN]   ├─ HR context: resignation + 3-day notice period remaining |
| 33 | BRAIN | [BRAIN]   ├─ Access pattern: sequential page downloads (scraping) |
| 34 | BRAIN | [BRAIN]   └─ Risk composite: HR + behavioral + volume → 98th percentile |
| 35 | BRAIN | [BRAIN] Confidence: 88% → 96% (HR signal + behavioral anomaly) |
| 36 | BRAIN | [BRAIN] Recommended playbook: insider-threat-response v1.0.0 |
| 39 | PURPOSE | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━━ |
| 41 | PURPOSE | [CLAW] Loading: insider-threat-response v1.0.0 |
| 42 | PURPOSE | [CLAW] Step 1/3: increase_monitoring |
| 43 | PURPOSE | [CLAW]   target: BODY | action: elevate monitoring for user |
| 45 | PURPOSE | [CLAW] Step 2/3: restrict_access |
| 46 | PURPOSE | [CLAW]   target: EDGE | action: reduce to read-only, block exports |
| 48 | PURPOSE | [CLAW] Step 3/3: escalate_to_ciso |
| 49 | PURPOSE | [CLAW]   target: INTERNAL | action: CISO escalation with evidence |
| 52 | EDGE | ━━━ PHASE 4: THE EDGE — Enforcement ━━━━━━━━━━━━━━━━━━━━━━━━ |
| 54 | EDGE | [EDGE] Enforcing access restrictions... |
| 55 | EDGE | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

</details>
