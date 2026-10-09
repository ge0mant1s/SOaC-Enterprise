# UAT-11587 Antino Backdoor & Microsoft 365 API C2 — Threat Context

## Overview
A China-nexus espionage campaign (UAT-11587, high-confidence Talos attribution) that targets government and policy organizations with the Antino Rust backdoor. Spearphishing leads to HTA/WSF staging, in-memory .NET deserialization and DLL sideloading, with command-and-control conducted over legitimate Microsoft 365 Outlook and OneDrive APIs.

## Threat Actor
UAT-11587 (China-nexus, Talos high confidence)

## Source-Supported Behavior vs. Engineering Mappings
## Behavioral Context

UAT-11587 (China-nexus, high-confidence Talos attribution) deploys the **Antino** Rust backdoor using **legitimate Microsoft 365 Outlook and OneDrive APIs** for C2, which makes network-based detection difficult. The publicly named artifacts — `slc.dll`, `GatherOsState.exe`, `sdiagnhost.exe`, `TestAssembly.dll`, and mailbox task names prefixed `command_req_[session_id]` — include legitimate Windows binaries, so detection is driven by **anomalous usage** (unexpected sideloading paths, signed-utility PowerShell proxying, high-frequency API polling) rather than their mere presence. No concrete domains, IPs, hashes or OAuth application IDs have been publicly established. Sources: Cisco Talos; The Hacker News (2026).

## Attack Chain
1. **Spearphishing with HTML preview clones** — Targets receive spearphishing emails with HTML attachment-preview clones linking to Cloudflare-hosted files.
   - MITRE: T1566
   - Phase: Initial Access
   - Pillar: Offense
2. **User executes staged HTA/WSF** — User interaction launches HTA/WSF staging scripts.
   - MITRE: T1204, T1059.005
   - Phase: Execution
   - Pillar: Offense
3. **In-memory .NET deserialization** — Encrypted JavaScript/.NET payloads are deserialized and executed in memory.
   - MITRE: T1620, T1059.007
   - Phase: Defense Evasion
   - Pillar: Offense
4. **DLL sideloading via signed utility** — A signed utility (GatherOsState.exe) sideloads a malicious slc.dll.
   - MITRE: T1574.002, T1218.005
   - Phase: Defense Evasion
   - Pillar: Offense
5. **PowerShell proxying and sleep masking** — sdiagnhost.exe proxies PowerShell execution and the backdoor uses sleep masking to evade detection.
   - MITRE: T1059.001
   - Phase: Defense Evasion
   - Pillar: Offense
6. **Microsoft 365 API command-and-control** — The Antino backdoor polls Outlook (~every 10s) and OneDrive (~every minute) via OAuth for tasking.
   - MITRE: T1102
   - Phase: Command and Control
   - Pillar: Offense
7. **Detect sideloading and M365 API C2** — Blue team detects GatherOsState.exe loading an unexpected slc.dll and anomalous OAuth polling of Outlook/OneDrive.
   - MITRE: T1574.002, T1102
   - Phase: Detection
   - Pillar: Detect
8. **Contain and evict the backdoor** — SOC isolates hosts, revokes OAuth grants/tokens, removes persistence and hunts for lateral movement.
   - MITRE: behavioral (no source-reported technique)
   - Phase: Response
   - Pillar: Respond

## Target Stack
Sigma, Sentinel, Splunk, CrowdStrike, MDE, Identity, Endpoint, SaaS, Network

## Category
SaaS

## Intelligence Sources
- <https://blog.talosintelligence.com/china-nexus-uat-11587-targets-government-and-policy-organizations-across-asia-with-antino-backdoor/>
- <https://thehackernews.com/2026/10/antino-backdoor-uses-outlook-and.html>
