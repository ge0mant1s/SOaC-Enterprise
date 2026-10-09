# PAN-OS User-ID Authentication Portal Root RCE

**Package ID:** pkg-024
**Package Type:** instance
**Schema Version:** 3.0
**Difficulty:** Elite

CVE-2026-0300 is a critical buffer overflow in the PAN-OS User-ID Authentication Portal (Captive Portal) that allowed an unauthenticated attacker to execute code with root privileges on affected PA-Series and VM-Series firewalls. Unit 42 reported exploitation by CL-STA-1132, followed by EarthWorm and ReverseSocks5 deployment, Active Directory enumeration, lateral movement and log cleanup. This package provides network and post-exploitation detection, hunting and response content.

## MITRE ATT&CK Coverage
- T1190
- T1059
- T1105
- T1572
- T1087
- T1018
- T1070

> MITRE techniques are **SOaC engineering mappings** derived from documented behavior unless a source explicitly reports the technique. See `docs/threat_context.md` for source-supported behavior vs. engineering mappings.

## Attack Chain (7 Stages)
1. **Send crafted traffic to exposed portal** — T1190
2. **Unauthenticated root RCE** — T1190, T1059
3. **Deploy EarthWorm and ReverseSocks5** — T1105, T1572
4. **Active Directory enumeration** — T1087, T1018
5. **Lateral movement and log cleanup** — T1070
6. **Detect appliance-originated tunnels** — T1572, T1105
7. **Isolate and remediate firewall** — behavioral

## Threat Intelligence Sources
- <https://unit42.paloaltonetworks.com/captive-portal-zero-day/>
- <https://security.paloaltonetworks.com/CVE-2026-0300>

## Public IOCs and Artifacts

Named public tooling artifacts: **EarthWorm** and **ReverseSocks5**. Palo Alto Networks provided **Threat ID 510019** for Advanced Threat Prevention customers. No hashes, domains, IP addresses, file names or paths are established in the reviewed sources; portal-exploitation and tunnel analytics are **behavioral detection logic — not an IOC**.

## Target Platforms
Sigma, Sentinel, Splunk, Network, Endpoint

## Contents
- `manifest.json` — Package manifest (Harness v3.0)
- `metadata.yml` — Package metadata mirror
- `detection.yaml` — Detection rules (KQL/Sigma)
- `playbook.yaml` — CLAW response playbook
- `policy.yaml` — Governance policy
- `hunt.yaml` — Proactive threat hunt
- `intelligence.json` — Intelligence analysis metadata
- `scenario.json` — Lab simulation data
- `evidence.json` — L3 replay evidence
- `evidence/` — Evidence manifest and replay report
- `detections/` — Per-platform detection rule files (Sentinel/Sigma/Splunk/Wazuh/CrowdStrike)
- `hunts/` — Hunt queries and analysis procedure
- `playbooks/` — CLAW/containment and SOAR/investigation playbooks
- `policies/` — Environment-specific policies
- `mappings/` — MITRE ATT&CK mapping
- `docs/` — Deployment guide, threat context, validation guide
