# PAN-OS User-ID Authentication Portal Root RCE — L3 Replay Report

## Package: pkg-024
## Generated: 2026-10-09T12:00:00Z
## Verdict: PASS ✅

---

### Attack Narrative

This replay validates a 7-stage attack chain:

**Stage 1 — Send crafted traffic to exposed portal**
Attacker sends crafted requests to an internet-exposed User-ID Authentication Portal.

**Stage 2 — Unauthenticated root RCE**
Buffer overflow (CVE-2026-0300) yields unauthenticated code execution as root on the firewall.

**Stage 3 — Deploy EarthWorm and ReverseSocks5**
Attacker transfers and runs EarthWorm and ReverseSocks5 tunneling tools on the appliance.

**Stage 4 — Active Directory enumeration**
From the firewall, the attacker enumerates Active Directory and internal systems.

**Stage 5 — Lateral movement and log cleanup**
Attacker pivots to internal systems and removes logs to hinder investigation.

**Stage 6 — Detect appliance-originated tunnels**
Blue team flags the firewall initiating sustained encrypted/SOCKS connections to previously unseen destinations.

**Stage 7 — Isolate and remediate firewall**
SOC isolates the firewall, preserves evidence, removes tooling, upgrades PAN-OS and rotates exposed credentials.


### Attack Chain

| Step | Title | MITRE | Phase | Provider |
|------|-------|-------|-------|----------|
| 1 | Send crafted traffic to exposed portal | T1190 | Initial Access | Sentinel |
| 2 | Unauthenticated root RCE | T1190, T1059 | Execution | Sentinel |
| 3 | Deploy EarthWorm and ReverseSocks5 | T1105, T1572 | Command and Control | Sentinel |
| 4 | Active Directory enumeration | T1087, T1018 | Discovery | Sentinel |
| 5 | Lateral movement and log cleanup | T1070 | Defense Evasion | Sentinel |
| 6 | Detect appliance-originated tunnels | T1572, T1105 | Detection | Sentinel |
| 7 | Isolate and remediate firewall | behavioral | Response | Sentinel |

### MITRE Coverage
- [x] T1190 — exercised
- [x] T1059 — exercised
- [x] T1105 — exercised
- [x] T1572 — exercised
- [x] T1087 — exercised
- [x] T1018 — exercised
- [x] T1070 — exercised

### Detection Rule Validation
- `rule-024-001`: Firewall appliance initiating reverse SOCKS tunnel (T1572, T1105). **Validated: true positive.**
- `rule-024-002`: PAN-OS portal exploit alert followed by directory enumeration (T1190, T1087). **Validated: true positive.**
- `rule-024-003`: PAN-OS portal exploitation with Threat ID 510019 (T1190). **Validated: true positive.**

