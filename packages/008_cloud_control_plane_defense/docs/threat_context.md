# Threat Context: Cloud Control Plane Defense — GTR-2025

## GTR-2025 Cloud Threat Landscape

The CrowdStrike 2025 Global Threat Report identified cloud control plane
attacks as a top-tier threat vector with **75% of cloud intrusions involving
identity-first attack techniques** — no malware required.

### Key GTR-2025 Cloud Findings

- **Cloud-Conscious Adversaries**: New cloud-focused threat actors increased
  26% year-over-year, with groups like SCATTERED SPIDER and FAMOUS CHOLLIMA
  demonstrating native cloud attack capabilities.

- **Federation Attacks (Golden SAML)**: Advanced threat actors target identity
  federation to forge authentication tokens, bypassing all traditional controls.
  The SolarWinds (Nobelium/Midnight Blizzard) technique of federation manipulation
  remains active, with new variants observed targeting Azure AD and Okta.

- **Serverless Persistence**: Attackers increasingly use Lambda functions and
  API gateways as persistence mechanisms, creating hard-to-detect backdoors
  that survive traditional remediation.

- **Cryptojacking Growth**: Cloud resource hijacking for cryptocurrency mining
  increased 38% in 2024, with attackers targeting GPU instances for maximum
  mining efficiency.

### MITRE ATT&CK Mapping

| Technique | Name | GTR-2025 Context |
|-----------|------|------------------|
| T1484.002 | Trust Modification | Federation tampering for Golden SAML |
| T1525 | Implant Internal Image | Serverless backdoors in Lambda |
| T1496 | Resource Hijacking | Crypto-mining on GPU instances |
| T1098.001 | Additional Cloud Credentials | Service principal abuse |
| T1530 | Data from Cloud Storage | S3/Blob public exposure |
| T1648 | Serverless Execution | Abuse of cloud functions |

## References

1. CrowdStrike. "2025 Global Threat Report — Cloud Threat Intelligence." February 2025.
2. Microsoft. "Defending against Golden SAML and federation attacks." 2024.
3. CISA. "Cloud Security Technical Reference Architecture v2." 2024.
4. Unit 42. "Cloud Threat Report — Serverless Security." 2024.
5. Sysdig. "Cloud-Native Threat Report 2024 — Cryptojacking Trends." 2024.
