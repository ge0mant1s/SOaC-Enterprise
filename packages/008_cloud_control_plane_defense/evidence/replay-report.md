# Evidence Bundle — PKG-008

**Package:** Lateral Movement & RDP Abuse  
**Scenario:** BlueRelay Lateral Movement Campaign (`pkg-008`)  
**Generated:** 2026-03-18T12:13:37.065Z  
**Harness Level:** 3 (Replay & Evidence)  
**Verdict:** ✅ **PASS** — All 3 declared MITRE techniques (from metadata.yml) validated by replay heuristics. 4 detection triggers, 9 playbook actions observed.

---

## Replay Summary

| Metric | Value |
|---|---|
| Total scenario steps | 63 |
| Body (telemetry) steps | 9 |
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
| T1021.001 | Lateral Movement | ✅ | 8, 12, 14, 16, 17 | lateral-movement-rdp-abuse | lateral-movement-containment |
| T1550.002 | Defense Evasion | ✅ | 8, 12, 14, 16, 17 | lateral-movement-rdp-abuse | lateral-movement-containment |
| T1570 | Lateral Movement | ✅ | 8, 12, 14, 16, 17 | lateral-movement-rdp-abuse | lateral-movement-containment |

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
| 12 | 1 | BODY | `detection.yaml` | T1021.001, T1550.002, T1570 | ━━━ PHASE 1: THE BODY — Windows & Network Telemetry ━━━━━━━━... |
| 14 | 1 | BODY | `detection.yaml` | T1021.001, T1550.002, T1570 | [BODY] Windows Security Event 4624: Network logon (Type 10 -... |
| 16 | 1 | BODY | `detection.yaml` | T1021.001, T1550.002, T1570 | [BODY] ⚡ Detection triggered: BODY-LATMOV-RDP-c8f1a3 |
| 17 | 1 | BODY | `detection.yaml` | T1021.001, T1550.002, T1570 | [BODY]   ├─ Event 4624: LogonType=10, AuthPkg=NTLM (not Kerb... |
| 34 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Recommended playbook: lateral-movement-containment v... |
| 37 | 3 | PURPOSE | `playbook.yaml` | — | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━... |
| 39 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Loading: lateral-movement-containment v1.0.0 |
| 40 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 1/3: block_rdp_lateral |
| 41 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: EDGE | action: block RDP from source subnet |
| 43 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 2/3: revoke_ntlm_sessions |
| 44 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: BODY | action: invalidate NTLM hashes |
| 46 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 3/3: segment_network |
| 47 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: EDGE | action: micro-segment affected subne... |
| 50 | 4 | EDGE | `policy.yaml` | — | ━━━ PHASE 4: THE EDGE — Enforcement ━━━━━━━━━━━━━━━━━━━━━━━━ |
| 52 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcing network segmentation... |
| 53 | 4 | EDGE | `policy.yaml` | — | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

<details>
<summary>Full Replay Timeline (all pillar steps)</summary>

| Step | Pillar | Text |
|---|---|---|
| 12 | BODY | ━━━ PHASE 1: THE BODY — Windows & Network Telemetry ━━━━━━━━━ |
| 14 | BODY | [BODY] Windows Security Event 4624: Network logon (Type 10 - RDP) |
| 15 | BODY | [BODY] Source: WKS-DEV-042 (10.1.5.42) → SRV-FILE-01 (10.1.10.11) |
| 16 | BODY | [BODY] ⚡ Detection triggered: BODY-LATMOV-RDP-c8f1a3 |
| 17 | BODY | [BODY]   ├─ Event 4624: LogonType=10, AuthPkg=NTLM (not Kerberos) |
| 18 | BODY | [BODY]   ├─ RDP tunnel: port 3389 forwarded over SSH (unusual) |
| 19 | BODY | [BODY]   ├─ Pass-the-hash: NTLM auth without prior password entry |
| 20 | BODY | [BODY]   ├─ SMB file transfer: C:\tools\mimikatz.exe → target host |
| 21 | BODY | [BODY]   └─ 4 lateral hops in 180 seconds (WKS→SRV→DC→BACKUP) |
| 25 | BRAIN | ━━━ PHASE 2: THE BRAIN — AI Threat Analysis ━━━━━━━━━━━━━━━━━ |
| 27 | BRAIN | [BRAIN] Receiving detection BODY-LATMOV-RDP-c8f1a3... |
| 28 | BRAIN | [BRAIN] Loading governance: ai_governance_baseline.yaml |
| 29 | BRAIN | [BRAIN]   ├─ NTLM-only auth: pass-the-hash confirmed (no Kerberos TGT) |
| 30 | BRAIN | [BRAIN]   ├─ Tool transfer: mimikatz.exe SHA256 matches known hash |
| 31 | BRAIN | [BRAIN]   ├─ Lateral path: dev workstation → file server → DC → backup |
| 32 | BRAIN | [BRAIN]   └─ Behavior: account svc_backup never used RDP before |
| 33 | BRAIN | [BRAIN] Confidence: 87% → 95% (PtH + lateral path + tool transfer) |
| 34 | BRAIN | [BRAIN] Recommended playbook: lateral-movement-containment v1.0.0 |
| 37 | PURPOSE | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━━ |
| 39 | PURPOSE | [CLAW] Loading: lateral-movement-containment v1.0.0 |
| 40 | PURPOSE | [CLAW] Step 1/3: block_rdp_lateral |
| 41 | PURPOSE | [CLAW]   target: EDGE | action: block RDP from source subnet |
| 43 | PURPOSE | [CLAW] Step 2/3: revoke_ntlm_sessions |
| 44 | PURPOSE | [CLAW]   target: BODY | action: invalidate NTLM hashes |
| 46 | PURPOSE | [CLAW] Step 3/3: segment_network |
| 47 | PURPOSE | [CLAW]   target: EDGE | action: micro-segment affected subnet |
| 50 | EDGE | ━━━ PHASE 4: THE EDGE — Enforcement ━━━━━━━━━━━━━━━━━━━━━━━━ |
| 52 | EDGE | [EDGE] Enforcing network segmentation... |
| 53 | EDGE | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

</details>
