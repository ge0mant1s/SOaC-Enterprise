# WordPress WP2Shell Chained Takeover (CVE-2026-60137 + CVE-2026-63030)

**Package ID:** pkg-031
**Package Type:** instance
**Schema Version:** 3.0
**Difficulty:** Advanced

A chained WordPress takeover ("WP2Shell") combining CVE-2026-60137 and CVE-2026-63030, reported by Talos. Attackers chain the two vulnerabilities to exploit externally facing WordPress sites. Public evidence is sparse: the only concrete indicators are the "WP2Shell" name and the two CVE identifiers, so all post-exploitation behavior is modeled as behavioral rather than asserted.

## MITRE ATT&CK Coverage
- T1190

> MITRE techniques are **SOaC engineering mappings** derived from documented behavior unless a source explicitly reports the technique. See `docs/threat_context.md` for source-supported behavior vs. engineering mappings.

## Attack Chain (6 Stages)
1. **Reconnaissance and vulnerability probing** — T1190
2. **Chained exploitation (CVE-2026-60137 + CVE-2026-63030)** — T1190
3. **Successful takeover (behavioral)** — behavioral
4. **Detect exploitation attempts** — T1190
5. **Detect post-takeover anomalies (behavioral)** — behavioral
6. **Contain and remediate** — behavioral

## Threat Intelligence Sources
- <https://blog.talosintelligence.com/dont-swing-at-everything/>

## Public IOCs and Artifacts

Public evidence is sparse. The only concrete indicators are:

| Indicator | Type | Note |
|-----------|------|------|
| `WP2Shell` | Campaign/tool name | Named by Talos |
| CVE-2026-60137 | Identifier | Chained vulnerability |
| CVE-2026-63030 | Identifier | Chained vulnerability |

No file hashes, domains or IPs have been publicly established. All post-takeover behavior is modeled as behavioral; only T1190 is asserted.

**Source:** Cisco Talos (2026).

## Target Platforms
Sigma, Sentinel, Splunk, Wazuh, Cloud, SaaS, Network

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
