# Evidence Bundle — PKG-005

**Package:** SEO Poisoning & Gootloader Defense  
**Scenario:** Gootloader SEO Poisoning Campaign (`pkg-005`)  
**Generated:** 2026-03-16T18:25:00.481Z  
**Harness Level:** 3 (Replay & Evidence)  
**Verdict:** ✅ **PASS** — All 3 declared MITRE techniques (from metadata.yml) validated by replay heuristics. 2 detection triggers, 12 playbook actions observed.

---

## Replay Summary

| Metric | Value |
|---|---|
| Total scenario steps | 71 |
| Body (telemetry) steps | 9 |
| Brain (reasoning) steps | 9 |
| Purpose (playbook) steps | 10 |
| Edge (enforcement) steps | 4 |
| Detection triggers | 2 |
| Playbook actions | 12 |
| MITRE techniques declared | 3 |
| MITRE techniques exercised | 3 |
| Declared-technique coverage | **100%** |

## MITRE ATT&CK Coverage

| Technique | Tactic | Exercised | Steps | Detected By | Responded By |
|---|---|---|---|---|---|
| T1189 | Initial Access | ✅ | 8, 13, 23 | seo-poisoning-gootloader-detection | seo-poisoning-containment |
| T1059.007 | Execution | ✅ | 8, 13, 23 | seo-poisoning-gootloader-detection | seo-poisoning-containment |
| T1071.001 | Command and Control | ✅ | 8, 13, 23 | seo-poisoning-gootloader-detection | seo-poisoning-containment |

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
| 13 | 1 | BODY | `detection.yaml` | T1189, T1059.007, T1071.001 | [BODY] Web proxy alert: Suspicious download pattern |
| 23 | 1 | BODY | `detection.yaml` | T1189, T1059.007, T1071.001 | [BODY] DNS correlation: 4 domains resolving to same Gootload... |
| 35 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN]   └─ Execution status: NOT YET EXECUTED (download on... |
| 36 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Window of opportunity: payload downloaded but not ex... |
| 37 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Recommended: remove-payload + block-c2 + user-awaren... |
| 42 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Loading: neutralize-seo-payload v1.0.0 |
| 43 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 1/4: quarantine_file |
| 44 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: defender_api | action: quarantine employee_... |
| 46 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 2/4: scan_downloads_folder |
| 47 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: crowdstrike_rtr | action: recursive scan C:... |
| 49 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 3/4: block_c2_domains |
| 50 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: dns_firewall | action: sinkhole Gootloader ... |
| 52 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 4/4: user_notification |
| 53 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: teams | action: notify user + security awar... |
| 56 | 4 | EDGE | `policy.yaml` | — | ━━━ PHASE 4: THE NERVOUS SYSTEM — Domain & URL Blocking ━━━━... |
| 58 | 4 | EDGE | `policy.yaml` | — | [EDGE] Receiving SEO poisoning enforcement... |
| 59 | 4 | EDGE | `policy.yaml` | — | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |
| 60 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcing session block... |

<details>
<summary>Full Replay Timeline (all pillar steps)</summary>

| Step | Pillar | Text |
|---|---|---|
| 11 | BODY | ━━━ PHASE 1: THE BODY — Web Proxy & DNS Analysis ━━━━━━━━━━━━ |
| 13 | BODY | [BODY] Web proxy alert: Suspicious download pattern |
| 14 | BODY | [BODY] User: m.torres@corp | Search: 'free employee agreement template' |
| 15 | BODY | [BODY] Click path: |
| 16 | BODY | [BODY]   ├─ Google SERP → compromised-legal-docs[.]com (SEO rank #3) |
| 17 | BODY | [BODY]   ├─ Redirect chain: 3 hops → landing-page-7f3a.netlify.app |
| 19 | BODY | [BODY] File analysis: |
| 23 | BODY | [BODY] DNS correlation: 4 domains resolving to same Gootloader infra |
| 24 | BODY | [BODY] Risk Score: CRITICAL | Confidence: 93% |
| 27 | BRAIN | ━━━ PHASE 2: THE BRAIN — Gootloader Analysis ━━━━━━━━━━━━━━━━ |
| 29 | BRAIN | [BRAIN] Receiving SEO poisoning detection... |
| 31 | BRAIN | [BRAIN]   ├─ Search query pattern: legal/business document template |
| 32 | BRAIN | [BRAIN]   ├─ SEO keyword stuffing detected on landing page |
| 33 | BRAIN | [BRAIN]   ├─ JS payload: Gootloader Stage 1 — matches known signatures |
| 34 | BRAIN | [BRAIN]   ├─ C2 beacon pattern: check-in interval = 47min (Gootloader default) |
| 35 | BRAIN | [BRAIN]   └─ Execution status: NOT YET EXECUTED (download only) |
| 36 | BRAIN | [BRAIN] Window of opportunity: payload downloaded but not executed |
| 37 | BRAIN | [BRAIN] Recommended: remove-payload + block-c2 + user-awareness |
| 40 | PURPOSE | ━━━ PHASE 3: THE PURPOSE — Payload Neutralization ━━━━━━━━━━━ |
| 42 | PURPOSE | [CLAW] Loading: neutralize-seo-payload v1.0.0 |
| 43 | PURPOSE | [CLAW] Step 1/4: quarantine_file |
| 44 | PURPOSE | [CLAW]   target: defender_api | action: quarantine employee_agreement_template.j... |
| 46 | PURPOSE | [CLAW] Step 2/4: scan_downloads_folder |
| 47 | PURPOSE | [CLAW]   target: crowdstrike_rtr | action: recursive scan C:\Users\*\Downloads\ |
| 49 | PURPOSE | [CLAW] Step 3/4: block_c2_domains |
| 50 | PURPOSE | [CLAW]   target: dns_firewall | action: sinkhole Gootloader IOCs |
| 52 | PURPOSE | [CLAW] Step 4/4: user_notification |
| 53 | PURPOSE | [CLAW]   target: teams | action: notify user + security awareness link |
| 56 | EDGE | ━━━ PHASE 4: THE NERVOUS SYSTEM — Domain & URL Blocking ━━━━━ |
| 58 | EDGE | [EDGE] Receiving SEO poisoning enforcement... |
| 59 | EDGE | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |
| 60 | EDGE | [EDGE] Enforcing session block... |

</details>
