# APT37 (Famous Chollima) - Operation HanKook Phantom Defense — Threat Context

## Overview
APT37 (Famous Chollima) is a North Korean state-sponsored threat actor conducting sophisticated cyber espionage campaigns since 2012. In 2025, they launched Operation HanKook Phantom, targeting South Korean academics and think tanks with spear-phishing attacks deploying RokRat malware. The group has evolved to use AI-driven social engineering, fraudulent recruitment campaigns, and multi-stage attacks for both espionage and financial gain.

## Threat Actor
APT37 (Famous Chollima)

## Attack Chain
1. **Spear-phishing with malicious decoy documents** — APT37 sends targeted spear-phishing emails containing malicious decoy documents (HWP, PDF, LNK files) such as 'National Intelligence Research Society Newsletter' to South Korean academics, think tanks, and energy/security associations
   - MITRE: T1566.001, T1566.002
   - Phase: Initial Access
   - Pillar: Offense
2. **Initial payload execution via LNK files** — Malicious LNK files are executed on victim systems, initiating the infection chain and preparing for malware deployment
   - MITRE: T1204.002, T1059.001
   - Phase: Initial Access
   - Pillar: Offense
3. **PowerShell-based infection chain deployment** — The attack leverages PowerShell scripts to execute the infection chain, downloading and installing the RokRat backdoor on compromised systems
   - MITRE: T1059.001, T1105
   - Phase: Execution
   - Pillar: Offense
4. **RokRat backdoor installation and persistence** — RokRat malware is installed with persistence mechanisms including scheduled tasks, registry modifications, and remote management tools to maintain long-term access
   - MITRE: T1053.005, T1112, T1219
   - Phase: Execution
   - Pillar: Offense
5. **Cloud-based C2 communication establishment** — The malware establishes encrypted command and control communications using compromised cloud services including Dropbox, Yandex, and pCloud for data exfiltration and remote control
   - MITRE: T1071.001, T1567.002, T1573.001
   - Phase: Command and Control
   - Pillar: Respond
6. **Data collection and exfiltration** — Sensitive data is collected from compromised systems and exfiltrated through the established cloud-based C2 infrastructure to support DPRK espionage objectives
   - MITRE: T1005, T1041, T1567.002
   - Phase: Exfiltration
   - Pillar: Respond

## Target Stack
Endpoint, SaaS

## Category
SaaS
