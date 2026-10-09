# Citrix NetScaler ADC/Gateway RCE and Web-Shell Activity — Threat Context

## Overview
Citrix reported active exploitation of CVE-2026-88771 (critical unauthenticated RCE, CVSS 9.5) and CVE-2026-88772 against unmitigated NetScaler ADC and Gateway deployments. Related reporting describes command injection, memory overflow, PHP web shells, file exfiltration and tunneling via tools identified as WHIPSHOT and SLAPSHOT. This package provides web-service, web-shell and appliance-egress detection, hunting and response content.

## Threat Actor
Not established in reviewed sources

## Source-Supported Behavior vs. Engineering Mappings
**Source-supported behavior:** unauthenticated command execution; packet-handling/memory-overflow exploitation; PHP web-shell placement; file exfiltration; Python tunneling and reconnaissance. Named artifacts: WHIPSHOT web shell and SLAPSHOT Python tunneler.

**SOaC engineering mappings (behavioral, not IOCs):** T1190, T1059, T1505.003, T1105, T1572, T1083, T1041. No hashes, IP addresses, domains, paths or web-shell parameters are provided in the reviewed evidence; detection of new PHP files or tunnel processes is **behavioral detection logic — not an IOC**. Exact appliance paths must be supplied from validated Citrix forensic guidance before production use.

## Attack Chain
1. **Send command-bearing request to NetScaler** — Attacker sends abnormal command-bearing or malformed requests to an unmitigated NetScaler ADC/Gateway.
   - MITRE: T1190
   - Phase: Initial Access
   - Pillar: Offense
2. **Unauthenticated command execution** — CVE-2026-88771/88772 yield unauthenticated command execution / memory-overflow exploitation.
   - MITRE: T1190, T1059
   - Phase: Execution
   - Pillar: Offense
3. **Deploy PHP web shell (WHIPSHOT)** — Attacker writes a PHP web shell into appliance web-serving locations for persistent access.
   - MITRE: T1505.003
   - Phase: Persistence
   - Pillar: Offense
4. **Deploy SLAPSHOT Python tunneler** — Attacker transfers and runs the SLAPSHOT Python tunneler for reconnaissance and tunneling.
   - MITRE: T1105, T1572
   - Phase: Command and Control
   - Pillar: Offense
5. **File and directory discovery** — Reconnaissance examines appliance data and configuration.
   - MITRE: T1083
   - Phase: Discovery
   - Pillar: Offense
6. **Exfiltrate over established channel** — Files are removed through the established C2/tunnel channel.
   - MITRE: T1041
   - Phase: Exfiltration
   - Pillar: Offense
7. **Detect web-service child process and new PHP** — Blue team flags appliance web-service processes spawning a shell/Python interpreter and new PHP content in web roots.
   - MITRE: T1505.003, T1059
   - Phase: Detection
   - Pillar: Detect
8. **Rebuild and rotate secrets** — SOC upgrades to fixed releases, rebuilds compromised appliances, revokes sessions and rotates appliance-held secrets.
   - MITRE: behavioral (no source-reported technique)
   - Phase: Response
   - Pillar: Respond

## Target Stack
Sigma, Sentinel, Splunk, Network, Endpoint

## Category
Network

## Intelligence Sources
- <https://support.citrix.com/external/article/CTX697096/citrix-netscaler-adc-and-citrix-netscale.html>
- <https://community.citrix.com/forums/topic/259153-critical-update-citrix-netscaler-adc-and-citrix-netscaler-gateway-security-bulletin-for-cve-2026-88771-through-cve-2026-88778/>
- <https://cloud.google.com/blog/topics/threat-intelligence/defending-against-active-exploitation-of-citrix-netscaler-adc-and-gateway-appliances>
- <https://unit42.paloaltonetworks.com/netscaler-zero-days-exploited/>
