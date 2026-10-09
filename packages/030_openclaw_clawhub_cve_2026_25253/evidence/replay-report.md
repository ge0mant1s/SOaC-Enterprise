# OpenClaw / ClawHub Malicious Skills & Control-UI RCE (CVE-2026-25253) — L3 Replay Report

## Package: pkg-030
## Generated: 2026-10-09T12:00:00Z
## Verdict: PASS ✅

---

### Attack Narrative

This replay validates a 8-stage attack chain:

**Stage 1 — Marketplace poisoning / typosquatting**
Malicious skills are published to ClawHub using typosquatted names and poisoned SKILL.md prerequisites.

**Stage 2 — User installs malicious skill**
A user installs a malicious skill whose SKILL.md prerequisites trigger execution.

**Stage 3 — Encoded shell and archive staging**
The skill runs Base64-encoded shell commands and fetches password-protected archives.

**Stage 4 — AMOS stealer deployment**
AMOS (Atomic macOS Stealer) is deployed to harvest browser, Keychain and crypto credentials.

**Stage 5 — Control UI WebSocket hijack (CVE-2026-25253)**
Alternatively, a malicious link abuses the Control UI gatewayUrl to hijack the WebSocket and execute host commands.

**Stage 6 — Host command execution via hijacked gateway**
The hijacked WebSocket is used to run arbitrary commands on the host.

**Stage 7 — Detect malicious skills and Control-UI abuse**
Blue team detects encoded shell execution from skills and anomalous WebSocket connections to the Control UI gatewayUrl.

**Stage 8 — Contain and remediate**
SOC removes untrusted skills, upgrades to v2026.1.29, isolates hosts, revokes credentials and rebuilds agents.


### Attack Chain

| Step | Title | MITRE | Phase | Provider |
|------|-------|-------|-------|----------|
| 1 | Marketplace poisoning / typosquatting | T1195.002 | Resource Development | — |
| 2 | User installs malicious skill | T1204.002 | Initial Access | — |
| 3 | Encoded shell and archive staging | T1059.004, T1105 | Execution | — |
| 4 | AMOS stealer deployment | T1555 | Credential Access | — |
| 5 | Control UI WebSocket hijack (CVE-2026-25253) | T1190 | Initial Access | — |
| 6 | Host command execution via hijacked gateway | T1059.004 | Execution | — |
| 7 | Detect malicious skills and Control-UI abuse | T1059.004, T1190 | Detection | — |
| 8 | Contain and remediate | behavioral | Response | — |

### MITRE Coverage
- [x] T1195.002 — exercised
- [x] T1204.001 — exercised
- [x] T1204.002 — exercised
- [x] T1059.004 — exercised
- [x] T1105 — exercised
- [x] T1190 — exercised
- [x] T1555 — exercised

### Detection Rule Validation
- `rule-030-001`: OpenClaw skill spawning Base64-encoded shell (T1059.004, T1204.002). **Validated: true positive.**
- `rule-030-002`: Anomalous WebSocket to OpenClaw Control UI gatewayUrl (T1190). **Validated: true positive.**
- `rule-030-003`: AMOS post-exploitation credential access on macOS (T1555). **Validated: true positive.**

