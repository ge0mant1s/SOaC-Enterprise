# Dell RecoverPoint for Virtual Machines Hardcoded Credential Exploitation

**Package ID:** pkg-026
**Package Type:** instance
**Schema Version:** 3.0
**Difficulty:** Elite

CVE-2026-22769 is a critical hardcoded credential flaw (CVSS 10.0) in Dell RecoverPoint for Virtual Machines. An unauthenticated remote attacker who obtains the credential may access the underlying operating system and establish root-level persistence. Dell confirmed Google/Mandiant reports of limited active exploitation associated with UNC6201, a suspected PRC-nexus cluster deploying GRIMBOLT and BRICKSTORM backdoors. This package provides identity, appliance and virtualization-pivot detection, hunting and response.

## MITRE ATT&CK Coverage
- T1078
- T1133
- T1059
- T1543
- T1021

> MITRE techniques are **SOaC engineering mappings** derived from documented behavior unless a source explicitly reports the technique. See `docs/threat_context.md` for source-supported behavior vs. engineering mappings.

## Attack Chain (6 Stages)
1. **Use hardcoded credential for remote access** — T1078, T1133
2. **Obtain operating-system access** — T1059
3. **Establish root persistence** — T1543
4. **Pivot toward VMware infrastructure** — T1021
5. **Detect root access without maintenance ticket** — T1078
6. **Contain and rebuild appliance** — behavioral

## Threat Intelligence Sources
- <https://www.dell.com/support/kbdoc/en-us/000426773/dsa-2026-079>
- <https://www.dell.com/support/kbdoc/en-us/000426742/recoverpoint-for-vms-apply-the-remediation-script-for-dsa>
- <https://cloud.google.com/blog/topics/threat-intelligence/unc6201-exploiting-dell-recoverpoint-zero-day>

## Public IOCs and Artifacts

Named public backdoors: **GRIMBOLT** and **BRICKSTORM**. No hashes, domains, IP addresses, file names, usernames or paths are established in the reviewed sources; detection of remote root access and unusual VMware connections is **behavioral detection logic — not an IOC**. **T1543** is enabled only where local validation confirms service creation.

## Target Platforms
Sigma, Sentinel, Splunk, Identity, Network

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
