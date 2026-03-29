# Evidence Bundle — PKG-002

**Package:** Ransomware Containment & Response  
**Scenario:** Qilin Ransomware Containment (`pkg-002`)  
**Generated:** 2026-03-18T12:13:36.887Z  
**Harness Level:** 3 (Replay & Evidence)  
**Verdict:** ✅ **PASS** — All 4 declared MITRE techniques (from metadata.yml) validated by replay heuristics. 3 detection triggers, 18 playbook actions observed.

---

## Replay Summary

| Metric | Value |
|---|---|
| Total scenario steps | 77 |
| Body (telemetry) steps | 9 |
| Brain (reasoning) steps | 10 |
| Purpose (playbook) steps | 13 |
| Edge (enforcement) steps | 6 |
| Detection triggers | 3 |
| Playbook actions | 18 |
| MITRE techniques declared | 4 |
| MITRE techniques exercised | 4 |
| Declared-technique coverage | **100%** |

## MITRE ATT&CK Coverage

| Technique | Tactic | Exercised | Steps | Detected By | Responded By |
|---|---|---|---|---|---|
| T1486 | Impact | ✅ | 8, 11, 13, 14, 30... (+1) | ransomware-encryption-detection | ransomware-containment-response |
| T1059 | Execution | ✅ | 8, 11, 13, 14, 30... (+1) | ransomware-encryption-detection | ransomware-containment-response |
| T1068 | Privilege Escalation | ✅ | 8, 11, 13, 14, 42 | ransomware-encryption-detection | ransomware-containment-response |
| T1490 | Impact | ✅ | 8, 11, 13, 14, 17 | ransomware-encryption-detection | ransomware-containment-response |

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
| 11 | 1 | BODY | `detection.yaml` | T1486, T1059, T1068, T1490 | ━━━ PHASE 1: THE BODY — Endpoint Telemetry Analysis ━━━━━━━━... |
| 13 | 1 | BODY | `detection.yaml` | T1486, T1059, T1068, T1490 | [BODY] CrowdStrike Falcon alert: HIGH severity detection |
| 14 | 1 | BODY | `detection.yaml` | T1486, T1059, T1068, T1490 | [BODY] DetectionType: RansomwareActivity | Host: WS-FIN-042 |
| 28 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Governance: CRITICAL severity → autonomous containme... |
| 30 | 2 | BRAIN | `playbook.yaml` | T1059, T1486 | [BRAIN]   ├─ Process tree: matches Qilin execution chain (T1... |
| 34 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN]   └─ No data exfiltration detected (yet) — containme... |
| 35 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Confidence: 99% | Blast radius: 1 host (containable) |
| 36 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Recommended playbook: isolate-compromised-host v1.1.... |
| 39 | 3 | PURPOSE | `playbook.yaml` | — | ━━━ PHASE 3: THE PURPOSE — Host Isolation Playbook ━━━━━━━━━... |
| 41 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Loading: isolate-compromised-host v1.1.0 |
| 42 | 3 | PURPOSE | `playbook.yaml` | T1486, T1059, T1068 | [CLAW] severity: CRITICAL | mitre_attack: [T1486, T1059, T10... |
| 44 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 1/5: verify_host_identity |
| 45 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: crowdstrike_api | GET /devices/entities/dev... |
| 47 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 2/5: network_containment |
| 48 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: crowdstrike_api | POST /devices/entities/de... |
| 50 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 3/5: kill_malicious_process |
| 51 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: crowdstrike_rtr | session: RTR-2026-042 |
| 53 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 4/5: capture_forensic_snapshot |
| 54 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: crowdstrike_rtr | action: memory_dump + dis... |
| 56 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 5/5: create_incident_ticket |
| 57 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: jira | project: SOC-IR |
| 60 | 4 | EDGE | `policy.yaml` | — | ━━━ PHASE 4: THE NERVOUS SYSTEM — Network Enforcement ━━━━━━... |
| 62 | 4 | EDGE | `policy.yaml` | — | [EDGE] Receiving host containment enforcement... |
| 63 | 4 | EDGE | `policy.yaml` | — | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |
| 64 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcing session block... |
| 65 | 4 | EDGE | `policy.yaml` | — | [EDGE] Action: block_host | Scope: WS-FIN-042 | Duration: in... |
| 69 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcement ID: EDGE-ENF-2026-QILIN-002 |

<details>
<summary>Full Replay Timeline (all pillar steps)</summary>

| Step | Pillar | Text |
|---|---|---|
| 11 | BODY | ━━━ PHASE 1: THE BODY — Endpoint Telemetry Analysis ━━━━━━━━━ |
| 13 | BODY | [BODY] CrowdStrike Falcon alert: HIGH severity detection |
| 14 | BODY | [BODY] DetectionType: RansomwareActivity | Host: WS-FIN-042 |
| 15 | BODY | [BODY] Process chain: outlook.exe → cmd.exe → powershell.exe → qilin.exe |
| 16 | BODY | [BODY]   ├─ powershell.exe -enc [Base64 payload] -nop -w hidden |
| 17 | BODY | [BODY]   ├─ vssadmin.exe delete shadows /all /quiet  (T1490) |
| 18 | BODY | [BODY]   ├─ bcdedit.exe /set {default} recoveryenabled no |
| 19 | BODY | [BODY]   └─ qilin.exe -encrypt -ext .qilin -note README_RESTORE.txt |
| 22 | BODY | [BODY] Risk Score: CRITICAL | Confidence: 99% |
| 25 | BRAIN | ━━━ PHASE 2: THE BRAIN — Ransomware Analysis ━━━━━━━━━━━━━━━━ |
| 27 | BRAIN | [BRAIN] CRITICAL detection received: RansomwareActivity |
| 28 | BRAIN | [BRAIN] Governance: CRITICAL severity → autonomous containment authorized |
| 30 | BRAIN | [BRAIN]   ├─ Process tree: matches Qilin execution chain (T1059 + T1486) |
| 31 | BRAIN | [BRAIN]   ├─ VSS deletion + recovery disable = pre-encryption preparation |
| 32 | BRAIN | [BRAIN]   ├─ File entropy analysis: encryption in progress (AES-256) |
| 33 | BRAIN | [BRAIN]   ├─ Lateral movement indicators: SMB scanning on port 445 |
| 34 | BRAIN | [BRAIN]   └─ No data exfiltration detected (yet) — containment window open |
| 35 | BRAIN | [BRAIN] Confidence: 99% | Blast radius: 1 host (containable) |
| 36 | BRAIN | [BRAIN] Recommended playbook: isolate-compromised-host v1.1.0 |
| 39 | PURPOSE | ━━━ PHASE 3: THE PURPOSE — Host Isolation Playbook ━━━━━━━━━━ |
| 41 | PURPOSE | [CLAW] Loading: isolate-compromised-host v1.1.0 |
| 42 | PURPOSE | [CLAW] severity: CRITICAL | mitre_attack: [T1486, T1059, T1068] |
| 44 | PURPOSE | [CLAW] Step 1/5: verify_host_identity |
| 45 | PURPOSE | [CLAW]   target: crowdstrike_api | GET /devices/entities/devices/v2 |
| 47 | PURPOSE | [CLAW] Step 2/5: network_containment |
| 48 | PURPOSE | [CLAW]   target: crowdstrike_api | POST /devices/entities/devices-actions/v2 |
| 50 | PURPOSE | [CLAW] Step 3/5: kill_malicious_process |
| 51 | PURPOSE | [CLAW]   target: crowdstrike_rtr | session: RTR-2026-042 |
| 53 | PURPOSE | [CLAW] Step 4/5: capture_forensic_snapshot |
| 54 | PURPOSE | [CLAW]   target: crowdstrike_rtr | action: memory_dump + disk_image |
| 56 | PURPOSE | [CLAW] Step 5/5: create_incident_ticket |
| 57 | PURPOSE | [CLAW]   target: jira | project: SOC-IR |
| 60 | EDGE | ━━━ PHASE 4: THE NERVOUS SYSTEM — Network Enforcement ━━━━━━━ |
| 62 | EDGE | [EDGE] Receiving host containment enforcement... |
| 63 | EDGE | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |
| 64 | EDGE | [EDGE] Enforcing session block... |
| 65 | EDGE | [EDGE] Action: block_host | Scope: WS-FIN-042 | Duration: indefinite |
| 69 | EDGE | [EDGE] Enforcement ID: EDGE-ENF-2026-QILIN-002 |

</details>
