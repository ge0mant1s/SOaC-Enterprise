# Supply Chain Package Compromise Defense — L3 Replay Report

## Package: pkg-014
## Generated: 2026-04-01T19:57:12.214Z
## Verdict: PASS ✅

### Attack Chain
1. **npm account compromise and malicious package injection** — T1195.002
2. **Postinstall dropper execution via npm lifecycle hook** — T1204.005, T1027
3. **C2 communication with platform detection** — T1082, T1071.001, T1105
4. **Platform-specific RAT payload deployment** — T1105, T1036.005
5. **Cross-platform RAT execution and persistence** — T1547.001, T1036.005, T1059.001, T1059.006
6. **Remote access and command execution capabilities** — T1219, T1059, T1083, T1105
7. **Anti-forensic cleanup and evidence destruction** — T1070.004, T1070.006

### MITRE Coverage
- [x] T1195.002 — exercised
- [x] T1204.005 — exercised
- [x] T1027 — exercised
- [x] T1071.001 — exercised
- [x] T1105 — exercised
- [x] T1036.005 — exercised
- [x] T1547.001 — exercised
- [x] T1219 — exercised
- [x] T1070.004 — exercised

### Detection Rule Matches
All expected detection rules matched synthetic telemetry events.

### Pillar Distribution
Balanced across BODY / BRAIN / PURPOSE / EDGE pillars.
