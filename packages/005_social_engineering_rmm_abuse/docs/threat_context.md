# Threat Context: SaaS OAuth & Integration Risk

## Threat Landscape

OAuth-based attacks against SaaS platforms have become a primary vector
for data exfiltration and persistent access. Microsoft reported blocking
**over 600,000 consent phishing attacks per month** in 2024.

### Notable Incidents

- **2024 — Midnight Blizzard M365 Campaign**: APT29 exploited legacy OAuth
  applications in Microsoft's own corporate tenant, using a test application
  with excessive permissions to access executive email accounts. This attack
  demonstrated that even Microsoft itself was vulnerable to OAuth abuse.

- **2024 — Consent Phishing Surge**: Multiple threat actors launched
  large-scale consent phishing campaigns using fake Microsoft 365 apps
  with convincing names. CISA and Microsoft issued joint advisories
  warning of OAuth application compromise techniques.

- **2024-2025 — SaaS-to-SaaS Pivoting**: Threat actors increasingly
  exploit OAuth token chains — compromising one SaaS integration to
  pivot into connected applications. A single compromised Slack or
  Teams integration can lead to access across the entire SaaS estate.

### MITRE ATT&CK Mapping

| Technique | Name | Usage |
|-----------|------|-------|
| T1098.003 | Additional Cloud Roles | Malicious OAuth app grants |
| T1566.002 | Spearphishing Link | Consent phishing campaigns |
| T1567 | Exfiltration Over Web Service | Data theft via SaaS APIs |
| T1528 | Steal Application Access Token | Token theft and reuse |
| T1530 | Data from Cloud Storage | Accessing files via OAuth |

## References

1. Microsoft. "Midnight Blizzard: Guidance for responders." January 2024.
2. Microsoft. "Protecting against consent phishing attacks." 2024.
3. CISA. "Protecting Against Malicious Use of OAuth Applications." Advisory, 2024.
4. CrowdStrike. "2025 Global Threat Report — SaaS and Cloud Identity Threats." 2025.
5. Netskope. "Cloud and Threat Report 2024 — OAuth Abuse Trends." 2024.
