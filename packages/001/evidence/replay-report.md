# Evidence Bundle — PKG-001

**Package:** Identity-led Intrusion Defense  
**Scenario:** 0APT Identity Pivot (`pkg-001`)  
**Generated:** 2026-03-16T18:25:00.328Z  
**Harness Level:** 3 (Replay & Evidence)  
**Verdict:** ✅ **PASS** — All 3 declared MITRE techniques (from metadata.yml) validated by replay heuristics. 9 detection triggers, 17 playbook actions observed.

---

## Replay Summary

| Metric | Value |
|---|---|
| Total scenario steps | 99 |
| Body (telemetry) steps | 16 |
| Brain (reasoning) steps | 15 |
| Purpose (playbook) steps | 16 |
| Edge (enforcement) steps | 10 |
| Detection triggers | 9 |
| Playbook actions | 17 |
| MITRE techniques declared | 3 |
| MITRE techniques exercised | 3 |
| Declared-technique coverage | **100%** |

## MITRE ATT&CK Coverage

| Technique | Tactic | Exercised | Steps | Detected By | Responded By |
|---|---|---|---|---|---|
| T1557.001 | Credential Access | ✅ | 8, 12, 14, 15, 17... (+6) | aitm-session-hijack-detection | revoke-compromised-sessions |
| T1078.004 | Defense Evasion | ✅ | 8, 12, 14, 15, 17... (+6) | aitm-session-hijack-detection | revoke-compromised-sessions |
| T1539 | Credential Access | ✅ | 8, 12, 14, 15, 17... (+5) | aitm-session-hijack-detection | revoke-compromised-sessions |

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
| 12 | 1 | BODY | `detection.yaml` | T1557.001, T1078.004, T1539 | ━━━ PHASE 1: THE BODY — Identity Telemetry Ingestion ━━━━━━━... |
| 14 | 1 | BODY | `detection.yaml` | T1557.001, T1078.004, T1539 | [BODY] index=okta sourcetype=OktaIM2:log |
| 15 | 1 | BODY | `detection.yaml` | T1557.001, T1078.004, T1539 | [BODY] | spath output=eventType path=eventType |
| 17 | 1 | BODY | `detection.yaml` | T1557.001, T1078.004, T1539 | [BODY] | where eventType IN ("user.session.start", "user.aut... |
| 18 | 1 | BODY | `detection.yaml` | T1557.001, T1078.004, T1539 | [BODY] Correlation window: 300 seconds | Thresholds: unique_... |
| 20 | 1 | BODY | `detection.yaml` | T1557.001, T1078.004, T1539 | [BODY] ⚡ Detection triggered: BODY-AITM-OKTA-7f3a9b |
| 21 | 1 | BODY | `detection.yaml` | T1557.001, T1078.004, T1539 | [BODY] Actor: d.chen@corp.lab.soac | EventType: user.session... |
| 22 | 1 | BODY | `detection.yaml` | T1557.001, T1078.004, T1539 | [BODY] Anomaly detected: 5 unique IPs across 3 geolocations ... |
| 30 | 1 | BODY | `detection.yaml` | T1557.001, T1078.004, T1539 | [BODY] Detection hash: BODY-AITM-OKTA-e4a917c3f2b8 |
| 50 | 2 | BRAIN | `playbook.yaml` | — | [BRAIN] Recommended playbook: revoke-compromised-sessions v1... |
| 54 | 3 | PURPOSE | `playbook.yaml` | — | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━... |
| 56 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Loading: revoke-compromised-sessions v1.2.0 |
| 57 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] apiVersion: claw.soac.io/v1 | kind: Playbook |
| 58 | 3 | PURPOSE | `playbook.yaml` | T1557.001, T1078.004 | [CLAW] severity: CRITICAL | mitre_attack: [T1557.001, T1078.... |
| 59 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Trigger matched: detection_type=aitm_session_hijack, ... |
| 60 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Cooldown check: CLEAR (last execution >5m ago) |
| 62 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 1/5: enrich_user |
| 63 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: okta_api | action: GET /api/v1/users/{userI... |
| 65 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 2/5: revoke_okta_sessions |
| 66 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: okta_api | action: DELETE /api/v1/users/{us... |
| 68 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 3/5: revoke_azure_tokens |
| 69 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: ms_graph | action: POST /users/{userId}/rev... |
| 71 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 4/5: push_edge_enforcement |
| 72 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: edge_api | action: POST /enforce |
| 74 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW] Step 5/5: notify_soc |
| 75 | 3 | PURPOSE | `playbook.yaml` | — | [CLAW]   target: slack | channel: #soc-critical |
| 78 | 4 | EDGE | `policy.yaml` | — | ━━━ PHASE 4: THE NERVOUS SYSTEM — Edge Enforcement ━━━━━━━━━... |
| 80 | 4 | EDGE | `policy.yaml` | — | [EDGE] Receiving enforcement from CLAW playbook... |
| 81 | 4 | EDGE | `policy.yaml` | — | [EDGE] Verifying HMAC-SHA256 signature... |
| 82 | 4 | EDGE | `policy.yaml` | — | [EDGE]   headers: X-SOaC-Timestamp, X-SOaC-Signature, X-SOaC... |
| 83 | 4 | EDGE | `policy.yaml` | — | [EDGE]   signature_input = timestamp|POST|/enforce|body_sha2... |
| 84 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcing session block... |
| 85 | 4 | EDGE | `policy.yaml` | — | [EDGE] Action: block_session | Scope: user=d.chen@corp | TTL... |
| 86 | 4 | EDGE | `policy.yaml` | — | [EDGE] Propagating to edge fleet: |
| 90 | 4 | EDGE | `policy.yaml` | — | [EDGE] Enforcement ID: EDGE-ENF-2026-0APT-001 |
| 91 | 4 | EDGE | `policy.yaml` | — | [EDGE] Audit trail: sha256:f8c3b1... | Immutable log stored |

<details>
<summary>Full Replay Timeline (all pillar steps)</summary>

| Step | Pillar | Text |
|---|---|---|
| 12 | BODY | ━━━ PHASE 1: THE BODY — Identity Telemetry Ingestion ━━━━━━━━ |
| 14 | BODY | [BODY] index=okta sourcetype=OktaIM2:log |
| 15 | BODY | [BODY] | spath output=eventType path=eventType |
| 16 | BODY | [BODY] | spath output=actor_email path=actor.alternateId |
| 17 | BODY | [BODY] | where eventType IN ("user.session.start", "user.authentication.sso") |
| 18 | BODY | [BODY] Correlation window: 300 seconds | Thresholds: unique_ips>2, unique_geos>1 |
| 20 | BODY | [BODY] ⚡ Detection triggered: BODY-AITM-OKTA-7f3a9b |
| 21 | BODY | [BODY] Actor: d.chen@corp.lab.soac | EventType: user.session.start |
| 22 | BODY | [BODY] Anomaly detected: 5 unique IPs across 3 geolocations in 147s |
| 23 | BODY | [BODY]   ├─ 198.51.100.22 (Washington, US)  ← legitimate baseline |
| 24 | BODY | [BODY]   ├─ 203.0.113.44 (Frankfurt, DE)   ← new geolocation |
| 25 | BODY | [BODY]   ├─ 192.0.2.88 (Singapore, SG)     ← impossible travel |
| 26 | BODY | [BODY]   ├─ 100.64.0.17 (Tor exit node)    ← anonymizing proxy |
| 27 | BODY | [BODY]   └─ 198.18.0.5 (Unknown CDN)       ← AitM relay pattern |
| 28 | BODY | [BODY] User-Agent variance: Chrome/120 → Python-urllib/3.11 → curl/8.4 |
| 30 | BODY | [BODY] Detection hash: BODY-AITM-OKTA-e4a917c3f2b8 |
| 33 | BRAIN | ━━━ PHASE 2: THE BRAIN — AI Threat Analysis ━━━━━━━━━━━━━━━━━ |
| 35 | BRAIN | [BRAIN] Receiving detection BODY-AITM-OKTA-e4a917c3f2b8... |
| 36 | BRAIN | [BRAIN] Loading governance: ai_governance_baseline.yaml |
| 37 | BRAIN | [BRAIN] Prompt injection scan: CLEAN ✓ |
| 38 | BRAIN | [BRAIN] PII detection: actor email → REDACTED in logs |
| 39 | BRAIN | [BRAIN] Decision authority: CRITICAL → brain_oversight REQUIRED |
| 42 | BRAIN | [BRAIN]   ├─ IP 100.64.0.17 → Tor exit node (known AitM infrastructure) |
| 43 | BRAIN | [BRAIN]   ├─ IP 198.18.0.5 → matches Evilginx2 proxy fingerprint |
| 44 | BRAIN | [BRAIN]   ├─ Session token entropy: abnormal (replayed token detected) |
| 45 | BRAIN | [BRAIN]   ├─ User-Agent flip: browser → scripting tool → curl pipeline |
| 46 | BRAIN | [BRAIN]   ├─ Behavior baseline deviation: 99.7th percentile |
| 47 | BRAIN | [BRAIN]   └─ Threat actor correlation: 92% match → 0APT campaign TTPs |
| 49 | BRAIN | [BRAIN] Confidence: 94% → 98% (enrichment confirms AitM + token replay) |
| 50 | BRAIN | [BRAIN] Recommended playbook: revoke-compromised-sessions v1.2.0 |
| 52 | BRAIN | [BRAIN] Audit hash: sha256:e4f7a2c918b3d6...  | Immutable log stored |
| 54 | PURPOSE | ━━━ PHASE 3: THE PURPOSE — CLAW Playbook Execution ━━━━━━━━━━ |
| 56 | PURPOSE | [CLAW] Loading: revoke-compromised-sessions v1.2.0 |
| 57 | PURPOSE | [CLAW] apiVersion: claw.soac.io/v1 | kind: Playbook |
| 58 | PURPOSE | [CLAW] severity: CRITICAL | mitre_attack: [T1557.001, T1078.004] |
| 59 | PURPOSE | [CLAW] Trigger matched: detection_type=aitm_session_hijack, risk=CRITICAL |
| 60 | PURPOSE | [CLAW] Cooldown check: CLEAR (last execution >5m ago) |
| 62 | PURPOSE | [CLAW] Step 1/5: enrich_user |
| 63 | PURPOSE | [CLAW]   target: okta_api | action: GET /api/v1/users/{userId} |
| 65 | PURPOSE | [CLAW] Step 2/5: revoke_okta_sessions |
| 66 | PURPOSE | [CLAW]   target: okta_api | action: DELETE /api/v1/users/{userId}/sessions |
| 68 | PURPOSE | [CLAW] Step 3/5: revoke_azure_tokens |
| 69 | PURPOSE | [CLAW]   target: ms_graph | action: POST /users/{userId}/revokeSignInSessions |
| 71 | PURPOSE | [CLAW] Step 4/5: push_edge_enforcement |
| 72 | PURPOSE | [CLAW]   target: edge_api | action: POST /enforce |
| 74 | PURPOSE | [CLAW] Step 5/5: notify_soc |
| 75 | PURPOSE | [CLAW]   target: slack | channel: #soc-critical |
| 78 | EDGE | ━━━ PHASE 4: THE NERVOUS SYSTEM — Edge Enforcement ━━━━━━━━━━ |
| 80 | EDGE | [EDGE] Receiving enforcement from CLAW playbook... |
| 81 | EDGE | [EDGE] Verifying HMAC-SHA256 signature... |
| 82 | EDGE | [EDGE]   headers: X-SOaC-Timestamp, X-SOaC-Signature, X-SOaC-Node-ID |
| 83 | EDGE | [EDGE]   signature_input = timestamp|POST|/enforce|body_sha256|node_id |
| 84 | EDGE | [EDGE] Enforcing session block... |
| 85 | EDGE | [EDGE] Action: block_session | Scope: user=d.chen@corp | TTL: 24h |
| 86 | EDGE | [EDGE] Propagating to edge fleet: |
| 90 | EDGE | [EDGE] Enforcement ID: EDGE-ENF-2026-0APT-001 |
| 91 | EDGE | [EDGE] Audit trail: sha256:f8c3b1... | Immutable log stored |

</details>
