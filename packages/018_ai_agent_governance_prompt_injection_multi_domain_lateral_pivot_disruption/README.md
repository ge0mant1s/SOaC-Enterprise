# AI Agent Governance: Prompt Injection & Multi-Domain Lateral Pivot Disruption

**Package ID:** pkg-018
**Package Type:** instance
**Schema Version:** 3.0
**Difficulty:** Elite

AI coding agent governance package for AI Coding Agent (Claude Code / Cursor): interactive mode, critical risk

## MITRE ATT&CK Coverage
- T1059
- T1059.004
- T1083
- T1565
- T1528
- T1071
- T1567

## Attack Chain (5 Stages)
1. **Agent Task Prompt** — 
2. **Code Execution** — T1059, T1059.004
3. **Repository Access** — T1083, T1565, T1528
4. **External Resource Access** — T1071, T1567
5. **Governance Review** — 

## 📊 Intelligence Sources
This package was built using threat intelligence from:
- **https://www.bugcrowd.com/blog/a-guide-to-the-hidden-threat-of-prompt-injection/, https://www-cdn.anthropic.com/08ab9158070959f88f296514c21b7facce6f52bc.pdf, https://red.anthropic.com/2026/mythos-preview/** (Date: 2026-04-13)
- Key TTPs: T1190, T1059, T1068, T1055, T1078, T1552.005, T1083, T1005, T1041, T1046, T1018, T1082, T1021, T1570, T1003, T1110, T1566, T1204, T1567, T1195.002, T1078.004, T1098.001
- Attack Chain: Initial Access → Execution → Privilege Escalation → Credential Access → Discovery → Collection → Exfiltration
- Platforms: Windows, Linux, AWS, Web Applications, LLM Systems
- Detection Surfaces: Application Logs, CloudTrail, Network Monitoring, Container Logs, LLM Query Logs

## Target Platforms
Sigma, Sentinel

## Contents
- `manifest.json` — Package manifest
- `detection.yaml` — Detection rules (Sigma/KQL/SPL/Wazuh)
- `playbook.yaml` — CLAW response playbook
- `policy.yaml` — Governance policy
- \`intelligence.json\` — Intelligence analysis metadata\n- `scenario.json` — Lab simulation data
- `evidence.json` — L3 replay evidence
- `evidence/` — Evidence manifest and replay report
- `detections/` — Per-platform detection rule files
- `playbooks/` — CLAW and SOAR playbooks
- `policies/` — Environment-specific policies
- `docs/` — Deployment guide, threat context, validation guide
