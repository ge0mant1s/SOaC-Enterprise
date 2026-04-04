# UAT-8837: AD Recon, Identity Pivot & Reverse Tunnel Defense

UAT-8837, a China-nexus APT group, targets critical infrastructure sectors in North America using zero-day and n-day vulnerabilities for initial access. The group deploys various open-source tools including Earthworm, SharpHound, and Certipy to harvest credentials and establish persistence. Their operations focus on obtaining initial access to high-value organizations and creating multiple channels of access through credential theft and backdoor accounts.

## Package ID: pkg-016
## Schema Version: 3.0
## Difficulty: Advanced

## MITRE ATT&CK Coverage
- T1190
- T1078
- T1082
- T1033
- T1049
- T1112
- T1021.001
- T1105
- T1027
- T1090
- T1572
- T1087.002
- T1069.002
- T1018
- T1134
- T1558
- T1550
- T1136.002
- T1098
- T1560
- T1556
- T1005

## Target Platforms
SaaS, Endpoint, Network, Entra

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
