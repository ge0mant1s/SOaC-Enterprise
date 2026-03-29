# Threat Context: Callback Phishing & RMM Persistence — GTR-2025

## GTR-2025 Findings

CrowdStrike GTR-2025 documented a **312% increase** in callback phishing
(vishing) campaigns combined with RMM tool abuse. This social engineering
technique bypasses email security by directing victims to call fake
support numbers and install legitimate remote management tools.

### Key Trends

- **BazarCall Evolution**: Originally a BazarLoader delivery mechanism,
  callback phishing has been adopted by multiple threat groups including
  Luna Moth (Silent Ransom Group) for data extortion without ransomware.

- **RMM Tool Abuse**: Legitimate tools like AnyDesk, ConnectWise ScreenConnect,
  and TeamViewer are weaponized for persistent remote access. These tools are
  trusted by security software and bypass most endpoint detections.

- **CVE-2024-1709 (ScreenConnect)**: A critical authentication bypass in
  ConnectWise ScreenConnect was exploited within hours of disclosure,
  enabling attackers to create admin accounts on exposed instances.

### MITRE ATT&CK Mapping

| Technique | Name | Usage |
|-----------|------|-------|
| T1566.003 | Phishing: Spearphishing via Service | Callback phishing |
| T1219 | Remote Access Software | RMM tool abuse |
| T1543.003 | Windows Service | RMM persistence |
| T1053.005 | Scheduled Task | RMM persistence |
| T1204.001 | User Execution: Malicious Link | Victim installs RMM |

## References

1. CrowdStrike. "2025 Global Threat Report — Callback Phishing Surge." 2025.
2. CrowdStrike. "Luna Moth Callback Phishing Campaigns." 2024.
3. CISA. "Alert: Threat Actors Exploiting ConnectWise ScreenConnect." February 2024.
4. Proofpoint. "BazarCall: Call-back Phishing Evolution." 2024.
