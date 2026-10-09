# UAT-11587 Antino Backdoor & Microsoft 365 API C2 — L3 Replay Report

## Package: pkg-029
## Generated: 2026-10-09T12:00:00Z
## Verdict: PASS ✅

---

### Attack Narrative

This replay validates a 8-stage attack chain:

**Stage 1 — Spearphishing with HTML preview clones**
Targets receive spearphishing emails with HTML attachment-preview clones linking to Cloudflare-hosted files.

**Stage 2 — User executes staged HTA/WSF**
User interaction launches HTA/WSF staging scripts.

**Stage 3 — In-memory .NET deserialization**
Encrypted JavaScript/.NET payloads are deserialized and executed in memory.

**Stage 4 — DLL sideloading via signed utility**
A signed utility (GatherOsState.exe) sideloads a malicious slc.dll.

**Stage 5 — PowerShell proxying and sleep masking**
sdiagnhost.exe proxies PowerShell execution and the backdoor uses sleep masking to evade detection.

**Stage 6 — Microsoft 365 API command-and-control**
The Antino backdoor polls Outlook (~every 10s) and OneDrive (~every minute) via OAuth for tasking.

**Stage 7 — Detect sideloading and M365 API C2**
Blue team detects GatherOsState.exe loading an unexpected slc.dll and anomalous OAuth polling of Outlook/OneDrive.

**Stage 8 — Contain and evict the backdoor**
SOC isolates hosts, revokes OAuth grants/tokens, removes persistence and hunts for lateral movement.


### Attack Chain

| Step | Title | MITRE | Phase | Provider |
|------|-------|-------|-------|----------|
| 1 | Spearphishing with HTML preview clones | T1566 | Initial Access | — |
| 2 | User executes staged HTA/WSF | T1204, T1059.005 | Execution | — |
| 3 | In-memory .NET deserialization | T1620, T1059.007 | Defense Evasion | — |
| 4 | DLL sideloading via signed utility | T1574.002, T1218.005 | Defense Evasion | — |
| 5 | PowerShell proxying and sleep masking | T1059.001 | Defense Evasion | — |
| 6 | Microsoft 365 API command-and-control | T1102 | Command and Control | — |
| 7 | Detect sideloading and M365 API C2 | T1574.002, T1102 | Detection | — |
| 8 | Contain and evict the backdoor | behavioral | Response | — |

### MITRE Coverage
- [x] T1566 — exercised
- [x] T1204 — exercised
- [x] T1059.005 — exercised
- [x] T1059.007 — exercised
- [x] T1218.005 — exercised
- [x] T1574.002 — exercised
- [x] T1620 — exercised
- [x] T1102 — exercised
- [x] T1059.001 — exercised

### Detection Rule Validation
- `rule-029-001`: GatherOsState.exe sideloading unexpected slc.dll (T1574.002). **Validated: true positive.**
- `rule-029-002`: sdiagnhost.exe proxying PowerShell execution (T1218, T1059.001). **Validated: true positive.**
- `rule-029-003`: Anomalous M365 OAuth polling of Outlook/OneDrive (T1102). **Validated: true positive.**

