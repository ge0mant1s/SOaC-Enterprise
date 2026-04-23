# Bad Apples: macOS Native Primitives Abuse Defense

**Package ID:** pkg-020
**Package Type:** instance
**Schema Version:** 3.0
**Difficulty:** Advanced

Bad Apples is a macOS living-off-the-land attack pattern that weaponizes native Remote Application Scripting, AppleScript, SSH, Finder metadata, and LaunchAgents to execute payloads, establish persistence, and move laterally while evading traditional file-based detection. The campaign targets developer and DevOps environments with privileged access to source code repositories, build systems, and cloud infrastructure. This package provides detection coverage for metadata-based payload staging, native execution chains, stealthy shell establishment via socat, and post-pivot lateral movement across enterprise macOS endpoints.

## MITRE ATT&CK Coverage
- T1072
- T1059.002
- T1027
- T1021.004
- T1570
- T1021
- T1059.004
- T1027.009
- T1564.004
- T1090.003
- T1046
- T1018
- T1082
- T1140
- T1543.001
- T1547.011
- T1547
- T1546
- T1098
- T1041

## Attack Chain (6 Stages)
1. **Remote Application Scripting for initial execution** — T1072, T1059.002, T1027
2. **AppleScript execution over SSH for lateral movement** — T1021.004, T1059.002, T1570, T1021
3. **Socat remote shell establishment** — T1021, T1059.004, T1021.004
4. **Finder metadata abuse for payload staging** — T1027.009, T1564.004, T1090.003, T1046, T1018, T1082
5. **Metadata payload extraction and execution** — T1140, T1059.004, T1090.003
6. **LaunchAgent persistence establishment** — T1543.001, T1547.011, T1059.002, T1547, T1546, T1098, T1041

## Target Platforms
Endpoint

## Contents
- `manifest.json` — Package manifest
- `detection.yaml` — Detection rules (Sigma/KQL/SPL/Wazuh)
- `playbook.yaml` — CLAW response playbook
- `policy.yaml` — Governance policy
- `scenario.json` — Lab simulation data
- `evidence.json` — L3 replay evidence
- `evidence/` — Evidence manifest and replay report
- `detections/` — Per-platform detection rule files
- `playbooks/` — CLAW and SOAR playbooks
- `policies/` — Environment-specific policies
- `docs/` — Deployment guide, threat context, validation guide
