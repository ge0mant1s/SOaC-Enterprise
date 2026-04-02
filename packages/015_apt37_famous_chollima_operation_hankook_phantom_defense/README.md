# APT37 (Famous Chollima) - Operation HanKook Phantom Defense

APT37 (Famous Chollima) is a North Korean state-sponsored threat actor conducting sophisticated cyber espionage campaigns since 2012. In 2025, they launched Operation HanKook Phantom, targeting South Korean academics and think tanks with spear-phishing attacks deploying RokRat malware. The group has evolved to use AI-driven social engineering, fraudulent recruitment campaigns, and multi-stage attacks for both espionage and financial gain.

## Package ID: pkg-015
## Schema Version: 3.0
## Difficulty: Advanced

## MITRE ATT&CK Coverage
- T1566.001
- T1566.002
- T1059.001
- T1567.002
- T1573.001

## Target Platforms
Endpoint, SaaS

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
