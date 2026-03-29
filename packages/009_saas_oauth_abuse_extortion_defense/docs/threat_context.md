# Threat Context: SaaS OAuth Abuse & Data Extortion — GTR-2025

## GTR-2025 Extortion Landscape

The CrowdStrike 2025 Global Threat Report documented a **150% increase**
in data extortion incidents where threat actors leverage SaaS platform
access to steal and threaten publication of sensitive data.

### Key Findings

- **Data Extortion Without Encryption**: A growing number of threat actors
  skip ransomware entirely, instead stealing data via SaaS APIs and
  threatening publication. This approach is harder to detect and leaves
  no encryption artifacts for defenders to find.

- **SaaS-Native Exfiltration**: Attackers use legitimate SaaS features
  (anonymous sharing links, email forwarding, API exports) to exfiltrate
  data, blending with normal business activity.

- **Double Extortion via OAuth**: Compromised OAuth applications provide
  persistent access for both data theft and continued monitoring, enabling
  repeated extortion attempts.

### MITRE ATT&CK Mapping

| Technique | Name | Usage |
|-----------|------|-------|
| T1567.002 | Exfiltration to Cloud Storage | Data staging via SaaS |
| T1213 | Data from Information Repositories | SharePoint/OneDrive theft |
| T1657 | Financial Theft | Data extortion for ransom |
| T1098.003 | Additional Cloud Roles | OAuth weaponization |
| T1530 | Data from Cloud Storage | Accessing stored files |

## References

1. CrowdStrike. "2025 Global Threat Report — Data Extortion Trends." 2025.
2. Microsoft. "Responding to data extortion attacks on Microsoft 365." 2024.
3. Mandiant. "M-Trends 2024 — Extortion Without Encryption." 2024.
4. Unit 42. "Ransomware and Extortion Report 2024." 2024.
