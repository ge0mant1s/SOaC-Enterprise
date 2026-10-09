# Citrix NetScaler ADC/Gateway RCE and Web-Shell Activity

**Package ID:** pkg-025
**Package Type:** instance
**Schema Version:** 3.0
**Difficulty:** Elite

Citrix reported active exploitation of CVE-2026-88771 (critical unauthenticated RCE, CVSS 9.5) and CVE-2026-88772 against unmitigated NetScaler ADC and Gateway deployments. Related reporting describes command injection, memory overflow, PHP web shells, file exfiltration and tunneling via tools identified as WHIPSHOT and SLAPSHOT. This package provides web-service, web-shell and appliance-egress detection, hunting and response content.

## MITRE ATT&CK Coverage
- T1190
- T1059
- T1505.003
- T1105
- T1572
- T1083
- T1041

> MITRE techniques are **SOaC engineering mappings** derived from documented behavior unless a source explicitly reports the technique. See `docs/threat_context.md` for source-supported behavior vs. engineering mappings.

## Attack Chain (8 Stages)
1. **Send command-bearing request to NetScaler** — T1190
2. **Unauthenticated command execution** — T1190, T1059
3. **Deploy PHP web shell (WHIPSHOT)** — T1505.003
4. **Deploy SLAPSHOT Python tunneler** — T1105, T1572
5. **File and directory discovery** — T1083
6. **Exfiltrate over established channel** — T1041
7. **Detect web-service child process and new PHP** — T1505.003, T1059
8. **Rebuild and rotate secrets** — behavioral

## Threat Intelligence Sources
- <https://support.citrix.com/external/article/CTX697096/citrix-netscaler-adc-and-citrix-netscale.html>
- <https://community.citrix.com/forums/topic/259153-critical-update-citrix-netscaler-adc-and-citrix-netscaler-gateway-security-bulletin-for-cve-2026-88771-through-cve-2026-88778/>
- <https://cloud.google.com/blog/topics/threat-intelligence/defending-against-active-exploitation-of-citrix-netscaler-adc-and-gateway-appliances>
- <https://unit42.paloaltonetworks.com/netscaler-zero-days-exploited/>

## Public IOCs and Artifacts

Named public tooling artifacts: **WHIPSHOT** (PHP web shell) and **SLAPSHOT** (Python tunneler). No hashes, IP addresses, domains, paths or web-shell parameters are provided in the reviewed evidence; detection of new PHP files or tunnel processes is **behavioral detection logic — not an IOC**. Validate exact appliance paths against Citrix forensic guidance before production deployment.

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
