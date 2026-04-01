# Supply Chain Package Compromise Defense

A sophisticated supply chain attack targeting the popular Axios JavaScript library through compromised npm maintainer accounts, resulting in malicious versions that deploy cross-platform RAT malware. The attack affects multiple sectors globally and shows overlap with DPRK operations, specifically the WAVESHAPER backdoor family.

## Package ID: pkg-014
## Schema Version: 3.0
## Difficulty: Advanced

## MITRE ATT&CK Coverage
- T1195.002
- T1204.005
- T1027
- T1071.001
- T1105
- T1036.005
- T1547.001
- T1219
- T1070.004

## Target Platforms
Supply Chain, CI/CD, Network, Endpoint

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
