# Threat Context: EvilProxy Credential Harvest

## Threat Actor Profile

**EvilProxy** is a phishing-as-a-service (PhaaS) platform that provides
adversary-in-the-middle (AitM) reverse proxy capabilities. It allows
threat actors to intercept credentials AND session tokens, effectively
bypassing multi-factor authentication.

### Notable Incidents

- **September 2023 — Executive Targeting Campaign**: Proofpoint documented
  a campaign using EvilProxy to target C-suite executives at Fortune 500
  companies. The attack achieved a 39% MFA bypass rate by intercepting
  session cookies through reverse proxy infrastructure.

- **2024 — Microsoft 365 Mass Harvesting**: Multiple threat actors used
  EvilProxy to harvest Microsoft 365 credentials at scale, targeting
  organizations in financial services and healthcare. Attacks combined
  AitM phishing with MFA fatigue to compromise accounts resistant to
  standard phishing.

- **2024 — Scattered Spider + EvilProxy**: CrowdStrike tracked Scattered
  Spider adopting EvilProxy infrastructure for initial access, combining
  it with social engineering of help desks to bypass MFA. This combination
  proved highly effective against even security-mature organizations.

### Technical Capabilities

| Capability | Detail |
|-----------|--------|
| MFA Bypass | Intercepts session cookies post-authentication |
| Real-time Proxy | Transparently proxies legitimate login pages |
| Token Capture | Captures access and refresh tokens |
| Automation | API-driven campaign management |
| Anti-Detection | Dynamic infrastructure, short-lived domains |

### MITRE ATT&CK Mapping

| Technique | Name | Usage |
|-----------|------|-------|
| T1557.001 | LLMNR/NBT-NS Poisoning (AitM) | Reverse proxy credential interception |
| T1539 | Steal Web Session Cookie | Session token capture |
| T1621 | Multi-Factor Authentication Request Generation | MFA fatigue attacks |
| T1566.002 | Spearphishing Link | Phishing email delivery |
| T1114.003 | Email Collection: Email Forwarding Rule | Post-compromise persistence |

## References

1. Proofpoint. "Cloud Account Takeover Campaign Leveraging EvilProxy." September 2023.
2. Microsoft. "Token tactics: How to prevent, detect, and respond to cloud token theft." 2024.
3. CrowdStrike. "2025 Global Threat Report — Identity-Based Attacks." February 2025.
4. Sekoia. "EvilProxy PhaaS Platform Analysis." 2024.
5. CISA. "Implementing Phishing-Resistant MFA." Guidance Document, 2024.
