# Evidence Bundle — PKG-006

**Package:** Credential Harvesting & Phishing Kit  
**Scenario:** EvilProxy Credential Harvest (`pkg-006`)  
**Generated:** 2026-03-16T18:25:00.515Z  
**Harness Level:** 3 (Replay & Evidence)  
**Verdict:** ✅ **PASS** — All 3 declared MITRE techniques (from metadata.yml) validated by replay heuristics. 6 detection triggers, 12 playbook actions observed.

---

## Replay Summary

| Metric | Value |
|---|---|
| Total scenario steps | 76 |
| Body (telemetry) steps | 12 |
| Brain (reasoning) steps | 12 |
| Purpose (playbook) steps | 11 |
| Edge (enforcement) steps | 5 |
| Detection triggers | 6 |
| Playbook actions | 12 |
| MITRE techniques declared | 3 |
| MITRE techniques exercised | 3 |
| Declared-technique coverage | **100%** |

## MITRE ATT&CK Coverage

| Technique | Tactic | Exercised | Steps | Detected By | Responded By |
|---|---|---|---|---|---|
| T1598 | Reconnaissance | ✅ | 8, 12, 14, 17, 18... (+3) | credential-harvest-phishing-kit | credential-harvest-response |
| T1566.002 | Initial Access | ✅ | 8, 12, 14, 17, 18... (+3) | credential-harvest-phishing-kit | credential-harvest-response |
| T1056.004 | Collection | ✅ | 8, 12, 14, 17, 18... (+3) | credential-harvest-phishing-kit | credential-harvest-response |

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
| 12 | 1 | BODY | `detection.yaml` | T1598, T1566.002, T1056.004 | ━━━ PHASE 1: THE BODY — Email & Web Telemetry ━━━━━━━━━━━━━━ |
| 14 | 1 | BODY | `detection.yaml` | T1598, T1566.002, T1056.004 | [BODY] Email gateway alert: Suspicious link in inbound messa... |
| 17 | 1 | BODY | `detection.yaml` | T1598, T1566.002, T1056.004 | [BODY] Link: https://c0rp-auth.top/login/verify?token=abc123 |
| 18 | 1 | BODY | `detection.yaml` | T1598, T1566.002, T1056.004 | [BODY] ⚡ Detection triggered: BODY-CRED-HARVEST-a4f2c1 |
| 21 | 1 | BODY | `detection.yaml` | T1598, T1566.002, T1056.004 | [BODY]   ├─ Page structure: EvilProxy template fingerprint d... |
| 25 | 1 | BODY | `detection.yaml` | T1598, T1566.002, T1056.004 | [BODY] Detection hash: BODY-CRED-HARVEST-a4f2c19e7d |
| 40 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Recommended playbook: credential-harvest-response v1... |
| 44 | 3 | PURPOSE | `playbook.yaml` | — | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━... |
| 46 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Loading: credential-harvest-response v1.0.0 |
| 47 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] apiVersion: claw.soac.io/v1 | kind: Playbook |
| 48 | 3 | PURPOSE | `playbook.yaml` | T1598, T1566.002, T1056.004 | [CLAW] severity: HIGH | mitre_attack: [T1598, T1566.002, T10... |
| 49 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Trigger matched: detection_type=credential_harvest_ph... |
| 51 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 1/3: block_phishing_domain |
| 52 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: EDGE | action: block_domain c0rp-auth.top |
| 54 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 2/3: reset_affected_credentials |
| 55 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: BODY | action: force_password_reset (3 user... |
| 57 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 3/3: submit_iocs |
| 58 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: INTERNAL | action: submit IOCs to threat in... |
| 61 | 4 | EDGE | `policy.yaml` | — | ━━━ PHASE 4: THE EDGE — Enforcement ━━━━━━━━━━━━━━━━━━━━━━━━ |
| 63 | 4 | EDGE | `policy.yaml` | — | [EDGE] Receiving enforcement from CLAW playbook... |
| 64 | 4 | EDGE | `policy.yaml` | — | [EDGE] Verifying HMAC-SHA256 signature: VERIFIED ✓ |
| 65 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcing domain block: c0rp-auth.top |
| 69 | 4 | EDGE | `policy.yaml` | — | [EDGE] Email gateway: Quarantined 12 additional messages fro... |

<details>
<summary>Full Replay Timeline (all pillar steps)</summary>

| Step | Pillar | Text |
|---|---|---|
| 12 | BODY | ━━━ PHASE 1: THE BODY — Email & Web Telemetry ━━━━━━━━━━━━━━ |
| 14 | BODY | [BODY] Email gateway alert: Suspicious link in inbound message |
| 15 | BODY | [BODY] Subject: "Urgent: Verify your account credentials" |
| 16 | BODY | [BODY] Sender: noreply@c0rp-auth.top (domain age: 2 days) |
| 17 | BODY | [BODY] Link: https://c0rp-auth.top/login/verify?token=abc123 |
| 18 | BODY | [BODY] ⚡ Detection triggered: BODY-CRED-HARVEST-a4f2c1 |
| 19 | BODY | [BODY]   ├─ Domain c0rp-auth.top → newly registered (48h) |
| 20 | BODY | [BODY]   ├─ Certificate: Let's Encrypt wildcard (common in phish kits) |
| 21 | BODY | [BODY]   ├─ Page structure: EvilProxy template fingerprint detected |
| 22 | BODY | [BODY]   └─ Form action: POST /collect → credential exfil endpoint |
| 23 | BODY | [BODY] DNS query: c0rp-auth.top → 185.234.xx.xx (known bulletproof hosting) |
| 25 | BODY | [BODY] Detection hash: BODY-CRED-HARVEST-a4f2c19e7d |
| 28 | BRAIN | ━━━ PHASE 2: THE BRAIN — Threat Analysis ━━━━━━━━━━━━━━━━━━━ |
| 30 | BRAIN | [BRAIN] Receiving detection BODY-CRED-HARVEST-a4f2c19e7d... |
| 31 | BRAIN | [BRAIN] Loading governance: ai_governance_baseline.yaml |
| 32 | BRAIN | [BRAIN] Prompt injection scan: CLEAN ✓ |
| 34 | BRAIN | [BRAIN]   ├─ Domain typosquat similarity: 94% match to corp-auth.com |
| 35 | BRAIN | [BRAIN]   ├─ SSL cert: wildcard *.c0rp-auth.top (Let's Encrypt) |
| 36 | BRAIN | [BRAIN]   ├─ EvilProxy kit signature: HTML form + JS keylogger |
| 37 | BRAIN | [BRAIN]   ├─ Credential exfil: POST to /collect with base64 encoding |
| 38 | BRAIN | [BRAIN]   └─ 3 users clicked link in past 15 minutes |
| 39 | BRAIN | [BRAIN] Confidence: 89% → 96% (kit fingerprint + domain intel) |
| 40 | BRAIN | [BRAIN] Recommended playbook: credential-harvest-response v1.0.0 |
| 42 | BRAIN | [BRAIN] Audit hash: sha256:c7d4e1... | Immutable log stored |
| 44 | PURPOSE | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━━ |
| 46 | PURPOSE | [CLAW] Loading: credential-harvest-response v1.0.0 |
| 47 | PURPOSE | [CLAW] apiVersion: claw.soac.io/v1 | kind: Playbook |
| 48 | PURPOSE | [CLAW] severity: HIGH | mitre_attack: [T1598, T1566.002, T1056.004] |
| 49 | PURPOSE | [CLAW] Trigger matched: detection_type=credential_harvest_phishing |
| 51 | PURPOSE | [CLAW] Step 1/3: block_phishing_domain |
| 52 | PURPOSE | [CLAW]   target: EDGE | action: block_domain c0rp-auth.top |
| 54 | PURPOSE | [CLAW] Step 2/3: reset_affected_credentials |
| 55 | PURPOSE | [CLAW]   target: BODY | action: force_password_reset (3 users) |
| 57 | PURPOSE | [CLAW] Step 3/3: submit_iocs |
| 58 | PURPOSE | [CLAW]   target: INTERNAL | action: submit IOCs to threat intel |
| 61 | EDGE | ━━━ PHASE 4: THE EDGE — Enforcement ━━━━━━━━━━━━━━━━━━━━━━━━ |
| 63 | EDGE | [EDGE] Receiving enforcement from CLAW playbook... |
| 64 | EDGE | [EDGE] Verifying HMAC-SHA256 signature: VERIFIED ✓ |
| 65 | EDGE | [EDGE] Enforcing domain block: c0rp-auth.top |
| 69 | EDGE | [EDGE] Email gateway: Quarantined 12 additional messages from c0rp-auth.top |

</details>
