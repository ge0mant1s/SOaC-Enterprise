# WordPress WP2Shell Chained Takeover (CVE-2026-60137 + CVE-2026-63030) — Threat Context

## Overview
A chained WordPress takeover ("WP2Shell") combining CVE-2026-60137 and CVE-2026-63030, reported by Talos. Attackers chain the two vulnerabilities to exploit externally facing WordPress sites. Public evidence is sparse: the only concrete indicators are the "WP2Shell" name and the two CVE identifiers, so all post-exploitation behavior is modeled as behavioral rather than asserted.

## Threat Actor
Unattributed

## Source-Supported Behavior vs. Engineering Mappings
## Behavioral Context

WP2Shell chains **CVE-2026-60137** and **CVE-2026-63030** to take over externally facing WordPress sites (reported by Cisco Talos). Public evidence is **sparse**: the only concrete indicators are the "WP2Shell" name and the two CVE identifiers. Accordingly, this package asserts only **T1190 (Exploit Public-Facing Application)** and models all post-takeover activity (webshell, persistence, credential theft, exfiltration) as **behavioral** rather than asserting specific ATT&CK techniques that the source does not support. Source: Cisco Talos (2026).

## Attack Chain
1. **Reconnaissance and vulnerability probing** — Attackers probe externally facing WordPress sites for the chained vulnerabilities.
   - MITRE: T1190
   - Phase: Reconnaissance
   - Pillar: Offense
2. **Chained exploitation (CVE-2026-60137 + CVE-2026-63030)** — The two vulnerabilities are chained to exploit the public-facing application.
   - MITRE: T1190
   - Phase: Initial Access
   - Pillar: Offense
3. **Successful takeover (behavioral)** — Behavioral indicators of takeover follow: anomalous successful admin sessions, unexpected content changes and outbound connections. Specific post-exploitation techniques are not asserted due to sparse public evidence.
   - MITRE: behavioral (no source-reported technique)
   - Phase: Impact
   - Pillar: Offense
4. **Detect exploitation attempts** — Blue team detects anomalous request bursts and exploitation signatures against the WordPress attack surface.
   - MITRE: T1190
   - Phase: Detection
   - Pillar: Detect
5. **Detect post-takeover anomalies (behavioral)** — Blue team correlates successful admin sessions, content changes and outbound connections as behavioral takeover indicators.
   - MITRE: behavioral (no source-reported technique)
   - Phase: Detection
   - Pillar: Detect
6. **Contain and remediate** — SOC patches the vulnerabilities, isolates affected sites, resets credentials and restores from known-good backups.
   - MITRE: behavioral (no source-reported technique)
   - Phase: Response
   - Pillar: Respond

## Target Stack
Sigma, Sentinel, Splunk, Wazuh, Cloud, SaaS, Network

## Category
Cloud

## Intelligence Sources
- <https://blog.talosintelligence.com/dont-swing-at-everything/>
