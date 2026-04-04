# UAT-8837: AD Recon, Identity Pivot & Reverse Tunnel Defense — L3 Replay Report

## Package: pkg-016
## Generated: 2026-04-04T08:23:06.838Z
## Verdict: PASS ✅

### Attack Chain
1. **Initial access via vulnerability exploitation** — T1190, T1078
2. **System reconnaissance and discovery** — T1082, T1033, T1049
3. **RDP configuration modification** — T1112, T1021.001
4. **Tool deployment and staging** — T1105, T1027
5. **Network tunneling establishment** — T1090, T1572
6. **Active Directory reconnaissance** — T1087.002, T1069.002, T1018
7. **Credential harvesting and privilege escalation** — T1134, T1558, T1550
8. **Persistence through backdoor accounts** — T1136.002, T1098, T1560, T1556, T1005

### MITRE Coverage
- [x] T1190 — exercised
- [x] T1078 — exercised
- [x] T1082 — exercised
- [x] T1033 — exercised
- [x] T1049 — exercised
- [x] T1112 — exercised
- [x] T1021.001 — exercised
- [x] T1105 — exercised
- [x] T1027 — exercised
- [x] T1090 — exercised
- [x] T1572 — exercised
- [x] T1087.002 — exercised
- [x] T1069.002 — exercised
- [x] T1018 — exercised
- [x] T1134 — exercised
- [x] T1558 — exercised
- [x] T1550 — exercised
- [x] T1136.002 — exercised
- [x] T1098 — exercised
- [x] T1560 — exercised
- [x] T1556 — exercised
- [x] T1005 — exercised

### Detection Rule Matches
All expected detection rules matched synthetic telemetry events.

### Pillar Distribution
Balanced across BODY / BRAIN / PURPOSE / EDGE pillars.
