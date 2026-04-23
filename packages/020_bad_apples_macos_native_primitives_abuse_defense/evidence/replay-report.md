# Bad Apples: macOS Native Primitives Abuse Defense — L3 Replay Report

## Package: pkg-020
## Generated: 2026-04-23T10:40:58.012Z
## Verdict: PASS ✅

---

### Attack Narrative

This replay validates a 6-stage attack chain:

**Stage 1 — Remote Application Scripting for initial execution**
Attackers use Remote Application Scripting (RAS) to execute commands on remote macOS systems by leveraging Terminal.app as an execution proxy. Base64-encoded payloads are deployed and executed in a two-stage process to bypass Apple's -10016 Handler Error restrictions.

**Stage 2 — AppleScript execution over SSH for lateral movement**
Adversaries invoke osascript directly over SSH to execute AppleScript commands remotely, using 'do shell script' handlers for arbitrary command execution while bypassing traditional process execution telemetry through Apple Events IPC.

**Stage 3 — Socat remote shell establishment**
Attackers establish interactive shells using socat to create bidirectional data streams between endpoints, operating entirely outside the SSH ecosystem to avoid SSH-based detection mechanisms and logging.

**Stage 4 — Finder metadata abuse for payload staging**
Malicious payloads are stored within Spotlight metadata using the Finder Comment field (kMDItemFinderComment) rather than file contents, bypassing traditional file-based security scanners and static analysis tools that focus on executable code.

**Stage 5 — Metadata payload extraction and execution**
Stored payloads are extracted from Spotlight metadata using mdls command, Base64 decoded, and piped directly to bash for execution, allowing malicious code to run from metadata storage locations unexamined by standard EDR solutions.

**Stage 6 — LaunchAgent persistence establishment**
Attackers create LaunchAgent plists in ~/Library/LaunchAgents that execute metadata extraction chains at user login, using osascript to call Finder directly for reading comments and achieving automatic payload execution at startup.


### Attack Chain

| Step | Title | MITRE | Phase | Provider |
|------|-------|-------|-------|----------|
| 1 | Remote Application Scripting for initial execution | T1072, T1059.002, T1027 | Execution | — |
| 2 | AppleScript execution over SSH for lateral movement | T1021.004, T1059.002, T1570, T1021 | Lateral Movement | — |
| 3 | Socat remote shell establishment | T1021, T1059.004, T1021.004 | Lateral Movement | — |
| 4 | Finder metadata abuse for payload staging | T1027.009, T1564.004, T1090.003, T1046, T1018, T1082 | Defense Evasion | — |
| 5 | Metadata payload extraction and execution | T1140, T1059.004, T1090.003 | Execution | — |
| 6 | LaunchAgent persistence establishment | T1543.001, T1547.011, T1059.002, T1547, T1546, T1098, T1041 | Persistence | — |

### MITRE Coverage
- [x] T1072 — exercised
- [x] T1059.002 — exercised
- [x] T1027 — exercised
- [x] T1021.004 — exercised
- [x] T1570 — exercised
- [x] T1021 — exercised
- [x] T1059.004 — exercised
- [x] T1027.009 — exercised
- [x] T1564.004 — exercised
- [x] T1090.003 — exercised
- [x] T1046 — exercised
- [x] T1018 — exercised
- [x] T1082 — exercised
- [x] T1140 — exercised
- [x] T1543.001 — exercised
- [x] T1547.011 — exercised
- [x] T1547 — exercised
- [x] T1546 — exercised
- [x] T1098 — exercised
- [x] T1041 — exercised

### Detection Rule Validation
- `rule-020-001`: Triggered on Remote Application Scripting for initial execution indicators (T1072, T1059.002, T1027). **Validated: true positive.**
- `rule-020-002`: Triggered on AppleScript execution over SSH for lateral movement indicators (T1021.004, T1059.002, T1570, T1021). **Validated: true positive.**
- `rule-020-003`: Triggered on Socat remote shell establishment indicators (T1021, T1059.004, T1021.004). **Validated: true positive.**
- `rule-020-004`: Triggered on Finder metadata abuse for payload staging indicators (T1027.009, T1564.004, T1090.003, T1046, T1018, T1082). **Validated: true positive.**
- `rule-020-005`: Triggered on Metadata payload extraction and execution indicators (T1140, T1059.004, T1090.003). **Validated: true positive.**
- `rule-020-006`: Triggered on LaunchAgent persistence establishment indicators (T1543.001, T1547.011, T1059.002, T1547, T1546, T1098, T1041). **Validated: true positive.**

### Pillar Distribution
| Pillar | Steps | Key Actions |
|--------|-------|-------------|
| BODY | 15 | `t1072_telemetry_ingest`, `t1072_forensic_capture`, `t1072_process_tree_analysis` |
| BRAIN | 15 | `t1072_anomaly_scoring`, `t1072_correlation_engine`, `t1072_heuristic_eval` |
| PURPOSE | 15 | `t1072_isolation_trigger`, `t1072_notification_dispatch`, `lateral_playbook_execution` |
| EDGE | 15 | `t1072_access_audit`, `t1072_egress_monitor`, `lateral_cloud_posture_scan` |
