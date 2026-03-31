# pkg-013 · CI/CD Supply Chain Defense

**Tier 4 — Elite** | MITRE ATT&CK: T1195.002, T1059.004, T1552.001, T1496, T1588.001, T1105, T1071.001

## Overview

Detect and contain CI/CD pipeline supply chain attacks. Covers forced tag mutations on upstream dependencies, build runner secret harvesting, data exfiltration via compromised runners, and unauthorized container image publication.

## Gold Standard — L3 Evidence Bundle

This is the first SOaC package with a complete Level 3 (L3) evidence bundle. The `evidence.json` file contains synthetic telemetry events that are replayed against the detection rules in `detection.yaml` to verify detection coverage.

### L3 Replay Results
- **5 synthetic events** → **3 expected detection matches**
- KQL-001: Forced Tag Push (Sentinel) ✓
- Sigma-002: SSH Key on CI Runner ✓  
- Splunk-003: Curl Secret Exfiltration ✓

## Files

| File | Description |
|---|---|
| `manifest.json` | Package metadata, MITRE mappings, difficulty rating |
| `scenario.json` | 10-step attack simulation from tag mutation to hardening |
| `detection.yaml` | 5-platform detection rules (KQL, Sigma, Splunk, CrowdStrike, Wazuh) |
| `playbook.yaml` | CLAW 7-step containment (freeze → revoke → rotate → quarantine → audit → investigate → P1) |
| `policy.yaml` | SLSA L3, NIST SSDF, CIS Supply Chain compliance |
| `evidence.json` | L3 synthetic telemetry — 5 events, 3 expected detection matches |
