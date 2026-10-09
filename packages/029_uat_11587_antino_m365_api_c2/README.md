# UAT-11587 Antino Backdoor & Microsoft 365 API C2

**Package ID:** pkg-029
**Package Type:** instance
**Schema Version:** 3.0
**Difficulty:** Elite

A China-nexus espionage campaign (UAT-11587, high-confidence Talos attribution) that targets government and policy organizations with the Antino Rust backdoor. Spearphishing leads to HTA/WSF staging, in-memory .NET deserialization and DLL sideloading, with command-and-control conducted over legitimate Microsoft 365 Outlook and OneDrive APIs.

## MITRE ATT&CK Coverage
- T1566
- T1204
- T1059.005
- T1059.007
- T1218.005
- T1574.002
- T1620
- T1102
- T1059.001

> MITRE techniques are **SOaC engineering mappings** derived from documented behavior unless a source explicitly reports the technique. See `docs/threat_context.md` for source-supported behavior vs. engineering mappings.

## Attack Chain (8 Stages)
1. **Spearphishing with HTML preview clones** — T1566
2. **User executes staged HTA/WSF** — T1204, T1059.005
3. **In-memory .NET deserialization** — T1620, T1059.007
4. **DLL sideloading via signed utility** — T1574.002, T1218.005
5. **PowerShell proxying and sleep masking** — T1059.001
6. **Microsoft 365 API command-and-control** — T1102
7. **Detect sideloading and M365 API C2** — T1574.002, T1102
8. **Contain and evict the backdoor** — behavioral

## Threat Intelligence Sources
- <https://blog.talosintelligence.com/china-nexus-uat-11587-targets-government-and-policy-organizations-across-asia-with-antino-backdoor/>
- <https://thehackernews.com/2026/10/antino-backdoor-uses-outlook-and.html>

## Public IOCs and Artifacts

The following artifacts are **publicly named** (Cisco Talos; The Hacker News, 2026). Several are legitimate Windows binaries, so detection relies on **anomalous usage**, not presence alone:

| Artifact | Type | Note |
|----------|------|------|
| `slc.dll` | DLL | Malicious DLL sideloaded by GatherOsState.exe |
| `GatherOsState.exe` | Signed binary | Legitimate utility abused for sideloading |
| `sdiagnhost.exe` | Signed binary | Legitimate utility abused to proxy PowerShell |
| `TestAssembly.dll` | DLL | Staging component |
| `command_req_[session_id]` | Mailbox task naming | Antino tasking prefix in Outlook C2 |

No concrete domains, IPs, file hashes or OAuth application IDs have been publicly established. C2 uses legitimate Microsoft 365 Outlook (~10s polling) and OneDrive (~1min polling) APIs.

**Sources:** Cisco Talos; The Hacker News (2026).

## Target Platforms
Sigma, Sentinel, Splunk, CrowdStrike, MDE, Identity, Endpoint, SaaS, Network

## Contents
- `manifest.json` — Package manifest (Harness v3.0)
- `metadata.yml` — Package metadata mirror
- `detection.yaml` — Detection rules (KQL/Sigma)
- `playbook.yaml` — CLAW response playbook
- `policy.yaml` — Governance policy
- `hunt.yaml` — Proactive threat hunt
- `intelligence.json` — Intelligence analysis metadata
- `scenario.json` — Lab simulation data
- `evidence.json` — L3 replay evidence
- `evidence/` — Evidence manifest and replay report
- `detections/` — Per-platform detection rule files (Sentinel/Sigma/Splunk/Wazuh/CrowdStrike)
- `hunts/` — Hunt queries and analysis procedure
- `playbooks/` — CLAW/containment and SOAR/investigation playbooks
- `policies/` — Environment-specific policies
- `mappings/` — MITRE ATT&CK mapping
- `docs/` — Deployment guide, threat context, validation guide
