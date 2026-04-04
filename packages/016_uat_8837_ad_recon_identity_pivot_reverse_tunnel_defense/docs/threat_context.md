# UAT-8837: AD Recon, Identity Pivot & Reverse Tunnel Defense — Threat Context

## Overview
UAT-8837, a China-nexus APT group, targets critical infrastructure sectors in North America using zero-day and n-day vulnerabilities for initial access. The group deploys various open-source tools including Earthworm, SharpHound, and Certipy to harvest credentials and establish persistence. Their operations focus on obtaining initial access to high-value organizations and creating multiple channels of access through credential theft and backdoor accounts.

## Threat Actor
UAT-8837

## Attack Chain
1. **Initial access via vulnerability exploitation** — UAT-8837 exploits zero-day vulnerabilities like CVE-2025-53690 (ViewState Deserialization in SiteCore) or uses compromised credentials to gain initial access to target environments.
   - MITRE: T1190, T1078
   - Phase: Initial Access
   - Pillar: Offense
2. **System reconnaissance and discovery** — Conducts preliminary reconnaissance using commands like ping, tasklist, netstat, whoami, quser, and hostname to understand the compromised environment.
   - MITRE: T1082, T1033, T1049
   - Phase: Discovery
   - Pillar: Detect
3. **RDP configuration modification** — Disables RestrictedAdmin for Remote Desktop Protocol to facilitate credential harvesting and lateral movement by modifying registry settings.
   - MITRE: T1112, T1021.001
   - Phase: Lateral Movement
   - Pillar: Respond
4. **Tool deployment and staging** — Downloads and stages multiple tools including GoTokenTheft, Earthworm, DWAgent, and SharpHound to various directories for post-compromise activities.
   - MITRE: T1105, T1027
   - Phase: Command and Control
   - Pillar: Respond
5. **Network tunneling establishment** — Deploys Earthworm network tunneling tool to create reverse tunnels to attacker-controlled infrastructure, enabling persistent access and command execution.
   - MITRE: T1090, T1572
   - Phase: Execution
   - Pillar: Offense
6. **Active Directory reconnaissance** — Uses SharpHound, Certipy, and native Windows tools like dsquery/dsget to enumerate Active Directory structure, users, groups, and service principal names.
   - MITRE: T1087.002, T1069.002, T1018
   - Phase: Discovery
   - Pillar: Detect
7. **Credential harvesting and privilege escalation** — Deploys GoTokenTheft, Rubeus, and Impacket tools to steal access tokens, abuse Kerberos, and execute commands with elevated privileges across the network.
   - MITRE: T1134, T1558, T1550
   - Phase: Defense Evasion
   - Pillar: Offense
8. **Persistence through backdoor accounts** — Creates new user accounts and adds existing accounts to privileged groups to maintain persistent access to the compromised environment.
   - MITRE: T1136.002, T1098, T1560, T1556, T1005
   - Phase: Persistence
   - Pillar: Offense

## Target Stack
SaaS, Endpoint, Network, Entra

## Category
Endpoint
