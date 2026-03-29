# Threat Context: 0APT Identity Pivot

> **Package:** pkg-001 | **Severity:** CRITICAL | **MITRE ATT&CK:** T1557.001, T1078.004, T1539

## Executive Summary

0APT represents a class of advanced persistent threat actors specializing in identity-based attacks. Their primary technique — Adversary-in-the-Middle (AitM) phishing — bypasses traditional MFA by intercepting authentication flows in real-time, capturing both credentials and session tokens simultaneously.

This package simulates the full 0APT attack lifecycle: from initial AitM phishing through session hijack, identity pivot across cloud services, and data exfiltration via compromised accounts.

## Real-World Attack Patterns & References

### Identity-Based Attacks: The #1 Threat Vector

According to CrowdStrike's 2025 Global Threat Report:
- **79% of initial access** now uses identity-based techniques (no malware)
- **AitM phishing increased 300%** between 2023-2025
- **Session token theft** replaced credential theft as the primary objective

### Known AitM Campaigns

| Campaign | Date | Technique | Impact |
|----------|------|-----------|--------|
| **Storm-1167 (Microsoft)** | 2023-2024 | AitM via custom phishing kit | 10,000+ Azure AD accounts compromised |
| **Star Blizzard** | 2023-2025 | EvilProxy AitM | Government and defense sector targeting |
| **Scattered Spider** | 2023-2025 | Social engineering + AitM | MGM Resorts, Caesars — $100M+ impact |
| **0ktapus** | 2022-2023 | Okta-targeting AitM | 130+ organizations, 10,000 credentials |

### CVE References

- **CVE-2023-20269** (Cisco ASA): VPN session hijacking enabling identity pivot
- **CVE-2024-0204** (GoAnywhere): Authentication bypass used in post-AitM lateral movement
- **Okta October 2023 Breach**: Support system compromise used to steal session tokens

### Attack Chain Modeled

```
1. INITIAL ACCESS (T1566.002)
   └─ AitM phishing email with link to reverse proxy (EvilProxy/Evilginx2)
   
2. CREDENTIAL INTERCEPTION (T1557.001)
   └─ Proxy captures credentials + MFA token in real-time
   
3. SESSION HIJACK (T1539)
   └─ Stolen session cookie replayed from attacker infrastructure
   
4. IDENTITY PIVOT (T1078.004)
   └─ Compromised identity used to access new cloud applications
   
5. DATA ACCESS
   └─ SharePoint, Exchange, Teams, OneDrive accessed via stolen session
   
6. PERSISTENCE
   └─ Attacker registers own MFA device on compromised account
```

## Indicators of Compromise (IOCs)

### Behavioral IOCs
- Same user authenticating from 3+ unique IPs within 15 minutes
- Authentication from impossible travel locations (>500 km/h)
- Non-browser User-Agent strings in authentication flows
- Access to 5+ new cloud applications within 24 hours (baseline deviation)
- MFA factor registration from new device immediately after sign-in

### Network IOCs
- DNS queries to known AitM proxy infrastructure
- TLS certificate anomalies on authentication endpoints
- HTTP POST to `/api/v1/authn` from unexpected referrers

## Defensive Recommendations

1. **Deploy phishing-resistant MFA** (FIDO2/WebAuthn) — eliminates AitM effectiveness
2. **Enable Continuous Access Evaluation (CAE)** in Azure AD
3. **Implement token binding** where supported
4. **Monitor authentication anomalies** with the detections in this package
5. **Conditional Access policies** requiring compliant devices from trusted locations
6. **User security awareness** focused on AitM phishing recognition

## References

1. [MITRE ATT&CK T1557.001 — LLMNR/NBT-NS Poisoning and SMB Relay](https://attack.mitre.org/techniques/T1557/001/)
2. [CrowdStrike 2025 Global Threat Report — Identity Threats](https://www.crowdstrike.com/resources/reports/global-threat-report/)
3. [Microsoft — AitM Phishing Analysis](https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/)
4. [CISA Advisory — Scattered Spider](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-320a)
5. [Okta October 2023 Support System Breach](https://sec.okta.com/articles/2023/10/tracking-unauthorized-access-oktas-support-system)

---
*SOaC Package pkg-001 | Version 1.0.0 | Apache-2.0*
