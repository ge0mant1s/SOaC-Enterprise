# Storm-1175 High-Velocity Medusa Ransomware Campaign Defense — L3 Replay Report

## Package: pkg-019
## Generated: 2026-04-13T20:15:16.272Z
## Verdict: PASS ✅

---

### Attack Narrative

This replay validates a 5-stage attack chain:

**Stage 1 — Exploit Attempt**
Initial exploitation of disclosed vulnerability

**Stage 2 — Post-Exploitation Foothold**
Establish persistence after exploitation

**Stage 3 — Credential Harvesting**
Dump credentials for lateral movement

**Stage 4 — Lateral Movement**
Move to high-value targets

**Stage 5 — Objective Achievement**
Data exfiltration or ransomware deployment


### Attack Chain

| Step | Title | MITRE | Phase | Provider |
|------|-------|-------|-------|----------|
| 1 | Exploit Attempt | T1190 | Initial Access | — |
| 2 | Post-Exploitation Foothold | T1059, T1053 | Execution | — |
| 3 | Credential Harvesting | T1003, T1552 | Credential Access | — |
| 4 | Lateral Movement | T1021, T1570 | Lateral Movement | — |
| 5 | Objective Achievement | T1005, T1486 | Impact | — |

### MITRE Coverage
- [x] T1190 — exercised
- [x] T1059 — exercised
- [x] T1053 — exercised
- [x] T1003 — exercised
- [x] T1552 — exercised
- [x] T1021 — exercised
- [x] T1570 — exercised
- [x] T1005 — exercised
- [x] T1486 — exercised

### Detection Rule Validation
- `rule-019-001`: Triggered on Exploit Attempt indicators (T1190). **Validated: true positive.**
- `rule-019-002`: Triggered on Post-Exploitation Foothold indicators (T1059, T1053). **Validated: true positive.**
- `rule-019-003`: Triggered on Credential Harvesting indicators (T1003, T1552). **Validated: true positive.**
- `rule-019-004`: Triggered on Lateral Movement indicators (T1021, T1570). **Validated: true positive.**
- `rule-019-005`: Triggered on Objective Achievement indicators (T1005, T1486). **Validated: true positive.**

### Pillar Distribution
| Pillar | Steps | Key Actions |
|--------|-------|-------------|
| BODY | 13 | `exploit_telemetry_ingest`, `exploit_forensic_capture`, `exploit_process_tree_analysis` |
| BRAIN | 13 | `exploit_anomaly_scoring`, `exploit_correlation_engine`, `exploit_heuristic_eval` |
| PURPOSE | 12 | `exploit_isolation_trigger`, `exploit_notification_dispatch`, `exploit_playbook_execution` |
| EDGE | 12 | `exploit_access_audit`, `exploit_egress_monitor`, `exploit_cloud_posture_scan` |
