# PAN-OS User-ID Authentication Portal Root RCE — Threat Context

## Overview
CVE-2026-0300 is a critical buffer overflow in the PAN-OS User-ID Authentication Portal (Captive Portal) that allowed an unauthenticated attacker to execute code with root privileges on affected PA-Series and VM-Series firewalls. Unit 42 reported exploitation by CL-STA-1132, followed by EarthWorm and ReverseSocks5 deployment, Active Directory enumeration, lateral movement and log cleanup. This package provides network and post-exploitation detection, hunting and response content.

## Threat Actor
CL-STA-1132 (Unit 42, assessed state-sponsored; named sponsor not established)

## Source-Supported Behavior vs. Engineering Mappings
**Source-supported behavior:** crafted traffic to an exposed portal; unauthenticated root RCE; EarthWorm and ReverseSocks5 deployment; tunneling; Active Directory enumeration; lateral movement; log cleanup. Palo Alto provided Threat ID 510019 for Advanced Threat Prevention customers.

**SOaC engineering mappings (behavioral, not IOCs):** T1190, T1059, T1105, T1572, T1087, T1018, T1070. No hashes, domains, IP addresses, file names or paths are established; portal-exploitation and tunnel analytics are **behavioral detection logic — not an IOC**.

## Attack Chain
1. **Send crafted traffic to exposed portal** — Attacker sends crafted requests to an internet-exposed User-ID Authentication Portal.
   - MITRE: T1190
   - Phase: Initial Access
   - Pillar: Offense
2. **Unauthenticated root RCE** — Buffer overflow (CVE-2026-0300) yields unauthenticated code execution as root on the firewall.
   - MITRE: T1190, T1059
   - Phase: Execution
   - Pillar: Offense
3. **Deploy EarthWorm and ReverseSocks5** — Attacker transfers and runs EarthWorm and ReverseSocks5 tunneling tools on the appliance.
   - MITRE: T1105, T1572
   - Phase: Command and Control
   - Pillar: Offense
4. **Active Directory enumeration** — From the firewall, the attacker enumerates Active Directory and internal systems.
   - MITRE: T1087, T1018
   - Phase: Discovery
   - Pillar: Offense
5. **Lateral movement and log cleanup** — Attacker pivots to internal systems and removes logs to hinder investigation.
   - MITRE: T1070
   - Phase: Defense Evasion
   - Pillar: Offense
6. **Detect appliance-originated tunnels** — Blue team flags the firewall initiating sustained encrypted/SOCKS connections to previously unseen destinations.
   - MITRE: T1572, T1105
   - Phase: Detection
   - Pillar: Detect
7. **Isolate and remediate firewall** — SOC isolates the firewall, preserves evidence, removes tooling, upgrades PAN-OS and rotates exposed credentials.
   - MITRE: behavioral (no source-reported technique)
   - Phase: Response
   - Pillar: Respond

## Target Stack
Sigma, Sentinel, Splunk, Network, Endpoint

## Category
Network

## Intelligence Sources
- <https://unit42.paloaltonetworks.com/captive-portal-zero-day/>
- <https://security.paloaltonetworks.com/CVE-2026-0300>
