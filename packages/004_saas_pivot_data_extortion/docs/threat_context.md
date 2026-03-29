# Threat Context: Rapid Vulnerability Exploitation

## Threat Landscape

The CrowdStrike 2025 Global Threat Report documented that the average
time from vulnerability disclosure to active exploitation dropped to
**under 24 hours** for critical flaws, with some zero-days exploited
before patches were even available.

### Key Vulnerabilities (2024-2025)

| CVE | Product | CVSS | Impact | KEV Listed |
|-----|---------|------|--------|------------|
| CVE-2024-3400 | Palo Alto PAN-OS | 10.0 | OS command injection via GlobalProtect | Yes |
| CVE-2023-46805 | Ivanti Connect Secure | 8.2 | Authentication bypass | Yes |
| CVE-2024-21887 | Ivanti Connect Secure | 9.1 | Command injection (chained with above) | Yes |
| CVE-2024-47575 | FortiManager | 9.8 | Missing authentication | Yes |
| CVE-2024-1709 | ConnectWise ScreenConnect | 10.0 | Authentication bypass | Yes |

### Attack Patterns

**Perimeter Device Exploitation**: Threat actors increasingly target
network perimeter devices (VPNs, firewalls, load balancers) as these
often lack EDR coverage and provide direct network access. In 2024,
Volt Typhoon and other China-nexus actors maintained persistent access
through compromised network appliances for months before detection.

**Exploitation Speed**: CISA added 186 vulnerabilities to the Known
Exploited Vulnerabilities (KEV) catalog in 2024. The gap between
patch availability and exploitation is shrinking, with ransomware
operators routinely exploiting new CVEs within days of disclosure.

**Web Shell Persistence**: Post-exploitation persistence via web shells
remains the dominant technique, with sophisticated actors using
encrypted, polymorphic web shells that evade signature-based detection.

### MITRE ATT&CK Mapping

| Technique | Name | Usage |
|-----------|------|-------|
| T1190 | Exploit Public-Facing Application | Primary initial access |
| T1059 | Command and Scripting Interpreter | Post-exploit execution |
| T1505.003 | Web Shell | Persistence mechanism |
| T1203 | Exploitation for Client Execution | Browser/client exploits |
| T1210 | Exploitation of Remote Services | Internal service exploitation |

## References

1. CrowdStrike. "2025 Global Threat Report." February 2025.
2. CISA. "Known Exploited Vulnerabilities Catalog." Ongoing 2024-2025.
3. CISA. "BOD 22-01: Reducing the Significant Risk of Known Exploited Vulnerabilities." 2022.
4. Mandiant. "M-Trends 2024 — Perimeter Device Exploitation." April 2024.
5. Palo Alto Unit 42. "Threat Brief: CVE-2024-3400." April 2024.
