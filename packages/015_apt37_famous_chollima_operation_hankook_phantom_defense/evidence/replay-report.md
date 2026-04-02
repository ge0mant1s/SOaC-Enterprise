# APT37 (Famous Chollima) - Operation HanKook Phantom Defense — L3 Replay Report

## Package: pkg-015
## Generated: 2026-04-02T12:14:51.408Z
## Verdict: PASS ✅

### Attack Chain
1. **Spear-phishing with malicious decoy documents** — T1566.001, T1566.002
2. **Initial payload execution via LNK files** — T1204.002, T1059.001
3. **PowerShell-based infection chain deployment** — T1059.001, T1105
4. **RokRat backdoor installation and persistence** — T1053.005, T1112, T1219
5. **Cloud-based C2 communication establishment** — T1071.001, T1567.002, T1573.001
6. **Data collection and exfiltration** — T1005, T1041, T1567.002

### MITRE Coverage
- [x] T1566.001 — exercised
- [x] T1566.002 — exercised
- [x] T1059.001 — exercised
- [x] T1567.002 — exercised
- [x] T1573.001 — exercised

### Detection Rule Matches
All expected detection rules matched synthetic telemetry events.

### Pillar Distribution
Balanced across BODY / BRAIN / PURPOSE / EDGE pillars.
