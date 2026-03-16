# Evidence Bundle — PKG-004

**Package:** BYOVD & Kernel Exploit Defense  
**Scenario:** Lynx BYOVD Kernel Exploit (`pkg-004`)  
**Generated:** 2026-03-16T18:25:00.443Z  
**Harness Level:** 3 (Replay & Evidence)  
**Verdict:** ✅ **PASS** — All 3 declared MITRE techniques (from metadata.yml) validated by replay heuristics. 1 detection triggers, 9 playbook actions observed.

---

## Replay Summary

| Metric | Value |
|---|---|
| Total scenario steps | 68 |
| Body (telemetry) steps | 9 |
| Brain (reasoning) steps | 8 |
| Purpose (playbook) steps | 9 |
| Edge (enforcement) steps | 4 |
| Detection triggers | 1 |
| Playbook actions | 9 |
| MITRE techniques declared | 3 |
| MITRE techniques exercised | 3 |
| Declared-technique coverage | **100%** |

## MITRE ATT&CK Coverage

| Technique | Tactic | Exercised | Steps | Detected By | Responded By |
|---|---|---|---|---|---|
| T1068 | Privilege Escalation | ✅ | 8, 13 | byovd-kernel-exploit-detection | byovd-containment-response |
| T1014 | Defense Evasion | ✅ | 8, 13, 21 | byovd-kernel-exploit-detection | byovd-containment-response |
| T1547.006 | Persistence | ✅ | 8, 13 | byovd-kernel-exploit-detection | byovd-containment-response |

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
| 13 | 1 | BODY | `detection.yaml` | T1068, T1014, T1547.006 | [BODY] Sysmon EventID 6: Driver loaded |
| 35 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Recommended: emergency-driver-unload + endpoint-isol... |
| 40 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Loading: emergency-byovd-response v1.0.0 |
| 41 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 1/4: unload_vulnerable_driver |
| 42 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: crowdstrike_rtr | cmd: sc stop RTCore64 && ... |
| 44 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 2/4: restore_edr_hooks |
| 45 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: crowdstrike_api | action: force sensor reco... |
| 47 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 3/4: update_driver_blocklist |
| 48 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: gpo_api | action: add RTCore64.sys hash to ... |
| 50 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 4/4: isolate_and_alert |
| 53 | 4 | EDGE | `policy.yaml` | — | ━━━ PHASE 4: THE NERVOUS SYSTEM — Org-Wide Driver Defense ━━... |
| 55 | 4 | EDGE | `policy.yaml` | — | [EDGE] Receiving BYOVD enforcement... |
| 56 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcing session block... |
| 57 | 4 | EDGE | `policy.yaml` | — | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

<details>
<summary>Full Replay Timeline (all pillar steps)</summary>

| Step | Pillar | Text |
|---|---|---|
| 11 | BODY | ━━━ PHASE 1: THE BODY — Driver Load Monitoring ━━━━━━━━━━━━━━ |
| 13 | BODY | [BODY] Sysmon EventID 6: Driver loaded |
| 14 | BODY | [BODY] Driver: C:\Windows\Temp\RTCore64.sys |
| 15 | BODY | [BODY] Signer: Micro-Star International (MSI) — VALID but KNOWN VULNERABLE |
| 16 | BODY | [BODY] BYOVD database match: CVE-2019-16098 (RTCore64.sys) |
| 17 | BODY | [BODY]   ├─ Allows arbitrary kernel memory read/write |
| 18 | BODY | [BODY]   ├─ Used by: Lynx, BlackByte, AvosLocker, Lazarus |
| 20 | BODY | [BODY] Parent process: svchost.exe → sc.exe create RTCore64 binPath=... |
| 22 | BODY | [BODY] Risk Score: CRITICAL | Confidence: 97% |
| 25 | BRAIN | ━━━ PHASE 2: THE BRAIN — BYOVD Analysis ━━━━━━━━━━━━━━━━━━━━ |
| 27 | BRAIN | [BRAIN] CRITICAL kernel-level detection received |
| 29 | BRAIN | [BRAIN]   ├─ RTCore64.sys: known BYOVD weapon (CVE-2019-16098) |
| 30 | BRAIN | [BRAIN]   ├─ Driver loaded from Temp directory: staging technique |
| 31 | BRAIN | [BRAIN]   ├─ IOCTL pattern: kernel callback patching → EDR blinding |
| 32 | BRAIN | [BRAIN]   ├─ Post-patch: CrowdStrike kernel hooks NULLIFIED |
| 33 | BRAIN | [BRAIN]   └─ Threat actor fingerprint: 94% match → Lynx group |
| 35 | BRAIN | [BRAIN] Recommended: emergency-driver-unload + endpoint-isolation |
| 38 | PURPOSE | ━━━ PHASE 3: THE PURPOSE — Driver Removal & Lockdown ━━━━━━━━ |
| 40 | PURPOSE | [CLAW] Loading: emergency-byovd-response v1.0.0 |
| 41 | PURPOSE | [CLAW] Step 1/4: unload_vulnerable_driver |
| 42 | PURPOSE | [CLAW]   target: crowdstrike_rtr | cmd: sc stop RTCore64 && sc delete RTCore64 |
| 44 | PURPOSE | [CLAW] Step 2/4: restore_edr_hooks |
| 45 | PURPOSE | [CLAW]   target: crowdstrike_api | action: force sensor reconnect |
| 47 | PURPOSE | [CLAW] Step 3/4: update_driver_blocklist |
| 48 | PURPOSE | [CLAW]   target: gpo_api | action: add RTCore64.sys hash to WDAC policy |
| 50 | PURPOSE | [CLAW] Step 4/4: isolate_and_alert |
| 53 | EDGE | ━━━ PHASE 4: THE NERVOUS SYSTEM — Org-Wide Driver Defense ━━━ |
| 55 | EDGE | [EDGE] Receiving BYOVD enforcement... |
| 56 | EDGE | [EDGE] Enforcing session block... |
| 57 | EDGE | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

</details>
