# Evidence Bundle — PKG-003

**Package:** Supply Chain & npm Compromise  
**Scenario:** Shai-Hulud Supply Chain Attack (`pkg-003`)  
**Generated:** 2026-03-16T18:25:00.406Z  
**Harness Level:** 3 (Replay & Evidence)  
**Verdict:** ✅ **PASS** — All 3 declared MITRE techniques (from metadata.yml) validated by replay heuristics. 2 detection triggers, 8 playbook actions observed.

---

## Replay Summary

| Metric | Value |
|---|---|
| Total scenario steps | 68 |
| Body (telemetry) steps | 9 |
| Brain (reasoning) steps | 8 |
| Purpose (playbook) steps | 9 |
| Edge (enforcement) steps | 4 |
| Detection triggers | 2 |
| Playbook actions | 8 |
| MITRE techniques declared | 3 |
| MITRE techniques exercised | 3 |
| Declared-technique coverage | **100%** |

## MITRE ATT&CK Coverage

| Technique | Tactic | Exercised | Steps | Detected By | Responded By |
|---|---|---|---|---|---|
| T1195.002 | Initial Access | ✅ | 8, 13, 16 | supply-chain-npm-compromise | supply-chain-quarantine |
| T1059.007 | Execution | ✅ | 8, 13, 16, 20 | supply-chain-npm-compromise | supply-chain-quarantine |
| T1027 | Defense Evasion | ✅ | 8, 13, 16, 21 | supply-chain-npm-compromise | supply-chain-quarantine |

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
| 13 | 1 | BODY | `detection.yaml` | T1195.002, T1059.007, T1027 | [BODY] GitHub Advanced Security alert: Critical vulnerabilit... |
| 16 | 1 | BODY | `detection.yaml` | T1195.002, T1059.007, T1027 | [BODY] Dependency confusion pattern detected: |
| 40 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Loading: quarantine-malicious-package v1.0.0 |
| 41 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 1/4: block_package_registry |
| 42 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: artifactory | action: BLOCK @internal-corp/... |
| 44 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 2/4: scan_ci_artifacts |
| 45 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: github_api | action: scan last 24h builds |
| 47 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 3/4: revoke_ci_tokens |
| 48 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: github_api | action: revoke PATs for affect... |
| 50 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 4/4: notify_security_team |
| 53 | 4 | EDGE | `policy.yaml` | — | ━━━ PHASE 4: THE NERVOUS SYSTEM — Build Pipeline Lockdown ━━... |
| 55 | 4 | EDGE | `policy.yaml` | — | [EDGE] Receiving pipeline enforcement... |
| 56 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcing session block... |
| 57 | 4 | EDGE | `policy.yaml` | — | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

<details>
<summary>Full Replay Timeline (all pillar steps)</summary>

| Step | Pillar | Text |
|---|---|---|
| 11 | BODY | ━━━ PHASE 1: THE BODY — Package Registry Monitoring ━━━━━━━━━ |
| 13 | BODY | [BODY] GitHub Advanced Security alert: Critical vulnerability |
| 14 | BODY | [BODY] Package: @internal-corp/auth-utils v2.0.1 (SUSPICIOUS) |
| 15 | BODY | [BODY] Registry: npmjs.com (public) — name collision with private scope |
| 16 | BODY | [BODY] Dependency confusion pattern detected: |
| 17 | BODY | [BODY]   ├─ Private: @internal-corp/auth-utils v1.8.3 (internal registry) |
| 18 | BODY | [BODY]   └─ Public:  @internal-corp/auth-utils v2.0.1 (npmjs — MALICIOUS) |
| 19 | BODY | [BODY] postinstall script analysis: |
| 23 | BODY | [BODY] Risk Score: CRITICAL | Confidence: 96% |
| 26 | BRAIN | ━━━ PHASE 2: THE BRAIN — Supply Chain Analysis ━━━━━━━━━━━━━━ |
| 28 | BRAIN | [BRAIN] CRITICAL supply chain detection received |
| 30 | BRAIN | [BRAIN]   ├─ Package publish timestamp: 2h ago — too new, no community usage |
| 31 | BRAIN | [BRAIN]   ├─ Maintainer account: created 24h ago — throwaway identity |
| 32 | BRAIN | [BRAIN]   ├─ postinstall payload: reverse shell → Shai-Hulud infrastructure |
| 33 | BRAIN | [BRAIN]   ├─ Dependency confusion: private scope name squatted on public registr... |
| 34 | BRAIN | [BRAIN]   └─ CI/CD pipeline at risk: 3 build servers may have pulled this packag... |
| 35 | BRAIN | [BRAIN] Recommended: quarantine-malicious-package + scan-ci-artifacts |
| 38 | PURPOSE | ━━━ PHASE 3: THE PURPOSE — Package Quarantine ━━━━━━━━━━━━━━━ |
| 40 | PURPOSE | [CLAW] Loading: quarantine-malicious-package v1.0.0 |
| 41 | PURPOSE | [CLAW] Step 1/4: block_package_registry |
| 42 | PURPOSE | [CLAW]   target: artifactory | action: BLOCK @internal-corp/auth-utils@2.0.1 |
| 44 | PURPOSE | [CLAW] Step 2/4: scan_ci_artifacts |
| 45 | PURPOSE | [CLAW]   target: github_api | action: scan last 24h builds |
| 47 | PURPOSE | [CLAW] Step 3/4: revoke_ci_tokens |
| 48 | PURPOSE | [CLAW]   target: github_api | action: revoke PATs for affected service accounts |
| 50 | PURPOSE | [CLAW] Step 4/4: notify_security_team |
| 53 | EDGE | ━━━ PHASE 4: THE NERVOUS SYSTEM — Build Pipeline Lockdown ━━━ |
| 55 | EDGE | [EDGE] Receiving pipeline enforcement... |
| 56 | EDGE | [EDGE] Enforcing session block... |
| 57 | EDGE | [EDGE] HMAC-SHA256 signature: VERIFIED ✓ |

</details>
