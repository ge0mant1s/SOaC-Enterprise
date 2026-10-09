# Dell RecoverPoint for Virtual Machines Hardcoded Credential Exploitation — Threat Context

## Overview
CVE-2026-22769 is a critical hardcoded credential flaw (CVSS 10.0) in Dell RecoverPoint for Virtual Machines. An unauthenticated remote attacker who obtains the credential may access the underlying operating system and establish root-level persistence. Dell confirmed Google/Mandiant reports of limited active exploitation associated with UNC6201, a suspected PRC-nexus cluster deploying GRIMBOLT and BRICKSTORM backdoors. This package provides identity, appliance and virtualization-pivot detection, hunting and response.

## Threat Actor
UNC6201 (Google/Mandiant, suspected PRC-nexus; assessment, not definitive attribution)

## Source-Supported Behavior vs. Engineering Mappings
**Source-supported behavior:** use of a hardcoded credential; unauthorized operating-system access; root persistence; backdoors identified as GRIMBOLT and BRICKSTORM; pivoting toward VMware infrastructure.

**SOaC engineering mappings (behavioral, not IOCs):** T1078, T1133, T1059, T1543, T1021. **T1543 Create or Modify System Process must only be treated as confirmed if local validation establishes service creation.** No hashes, domains, IP addresses, file names, usernames or paths are established; detection of remote root access and unusual VMware connections is **behavioral detection logic — not an IOC**.

## Attack Chain
1. **Use hardcoded credential for remote access** — Attacker uses the hardcoded credential (CVE-2026-22769) to access a network-reachable RecoverPoint for VMs appliance.
   - MITRE: T1078, T1133
   - Phase: Initial Access
   - Pillar: Offense
2. **Obtain operating-system access** — Attacker reaches the underlying OS and executes commands as a privileged user.
   - MITRE: T1059
   - Phase: Execution
   - Pillar: Offense
3. **Establish root persistence** — Attacker establishes root-level persistence; GRIMBOLT/BRICKSTORM backdoors reported. (T1543 enabled only if local validation confirms service creation — behavioral.)
   - MITRE: T1543
   - Phase: Persistence
   - Pillar: Offense
4. **Pivot toward VMware infrastructure** — Attacker uses remote services to move into connected VMware virtual infrastructure.
   - MITRE: T1021
   - Phase: Lateral Movement
   - Pillar: Offense
5. **Detect root access without maintenance ticket** — Blue team alerts on RecoverPoint access from an unapproved identity path and root sessions without a corresponding maintenance ticket.
   - MITRE: T1078
   - Phase: Detection
   - Pillar: Detect
6. **Contain and rebuild appliance** — SOC blocks untrusted access, applies the fixed release / remediation script, treats root access as an integrity failure and rebuilds as appropriate.
   - MITRE: behavioral (no source-reported technique)
   - Phase: Response
   - Pillar: Respond

## Target Stack
Sigma, Sentinel, Splunk, Identity, Network

## Category
Cloud

## Intelligence Sources
- <https://www.dell.com/support/kbdoc/en-us/000426773/dsa-2026-079>
- <https://www.dell.com/support/kbdoc/en-us/000426742/recoverpoint-for-vms-apply-the-remediation-script-for-dsa>
- <https://cloud.google.com/blog/topics/threat-intelligence/unc6201-exploiting-dell-recoverpoint-zero-day>
