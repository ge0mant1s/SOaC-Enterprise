# OpenClaw / ClawHub Malicious Skills & Control-UI RCE (CVE-2026-25253)

**Package ID:** pkg-030
**Package Type:** instance
**Schema Version:** 3.0
**Difficulty:** Advanced

A supply-chain and exploitation campaign against the OpenClaw AI agent ecosystem: malicious skills distributed via the ClawHub marketplace (typosquatting and poisoned SKILL.md prerequisites) deliver AMOS (Atomic macOS Stealer), while CVE-2026-25253 (CVSS 8.8) allows WebSocket hijacking of the Control UI gatewayUrl to achieve remote host command execution.

## MITRE ATT&CK Coverage
- T1195.002
- T1204.001
- T1204.002
- T1059.004
- T1105
- T1190
- T1555

> MITRE techniques are **SOaC engineering mappings** derived from documented behavior unless a source explicitly reports the technique. See `docs/threat_context.md` for source-supported behavior vs. engineering mappings.

## Attack Chain (8 Stages)
1. **Marketplace poisoning / typosquatting** — T1195.002
2. **User installs malicious skill** — T1204.002
3. **Encoded shell and archive staging** — T1059.004, T1105
4. **AMOS stealer deployment** — T1555
5. **Control UI WebSocket hijack (CVE-2026-25253)** — T1190
6. **Host command execution via hijacked gateway** — T1059.004
7. **Detect malicious skills and Control-UI abuse** — T1059.004, T1190
8. **Contain and remediate** — behavioral

## Threat Intelligence Sources
- <https://aviatrix.ai/threat-research-center/openclaw-clawhub-malicious-skills-supply-chain-attack-2026/>
- <https://www.trendmicro.com/en_us/research/26/b/openclaw-skills-used-to-distribute-atomic-macos-stealer.html>
- <https://docs.openclaw.ai/clawhub>

## Public IOCs and Artifacts

No reliable public file hashes, domains or IPs have been established for this campaign. The following are **generic artifacts/identifiers**, not standalone IOCs:

| Artifact | Type | Note |
|----------|------|------|
| `SKILL.md` prerequisites | Skill metadata | Can be abused to trigger execution; legitimate feature |
| Base64-encoded shell | Technique | Dual-use; not malicious alone |
| Password-protected archive | Technique | Dual-use; used to evade inspection |
| AMOS (Atomic macOS Stealer) | Malware family | Delivered payload |
| CVE-2026-25253 | Identifier | Control UI gatewayUrl WebSocket hijack (CVSS 8.8) |

Detection relies on behavioral correlation; patch to OpenClaw v2026.1.29.

**Sources:** Aviatrix Threat Research, Trend Micro, OpenClaw documentation (2026).

## Target Platforms
Sigma, Sentinel, Splunk, CrowdStrike, Wazuh, MDE, GitHub, CI/CD, Endpoint, Cloud, Network

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
