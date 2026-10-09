# Citrix NetScaler ADC/Gateway RCE and Web-Shell Activity — L3 Replay Report

## Package: pkg-025
## Generated: 2026-10-09T12:00:00Z
## Verdict: PASS ✅

---

### Attack Narrative

This replay validates a 8-stage attack chain:

**Stage 1 — Send command-bearing request to NetScaler**
Attacker sends abnormal command-bearing or malformed requests to an unmitigated NetScaler ADC/Gateway.

**Stage 2 — Unauthenticated command execution**
CVE-2026-88771/88772 yield unauthenticated command execution / memory-overflow exploitation.

**Stage 3 — Deploy PHP web shell (WHIPSHOT)**
Attacker writes a PHP web shell into appliance web-serving locations for persistent access.

**Stage 4 — Deploy SLAPSHOT Python tunneler**
Attacker transfers and runs the SLAPSHOT Python tunneler for reconnaissance and tunneling.

**Stage 5 — File and directory discovery**
Reconnaissance examines appliance data and configuration.

**Stage 6 — Exfiltrate over established channel**
Files are removed through the established C2/tunnel channel.

**Stage 7 — Detect web-service child process and new PHP**
Blue team flags appliance web-service processes spawning a shell/Python interpreter and new PHP content in web roots.

**Stage 8 — Rebuild and rotate secrets**
SOC upgrades to fixed releases, rebuilds compromised appliances, revokes sessions and rotates appliance-held secrets.


### Attack Chain

| Step | Title | MITRE | Phase | Provider |
|------|-------|-------|-------|----------|
| 1 | Send command-bearing request to NetScaler | T1190 | Initial Access | Sentinel |
| 2 | Unauthenticated command execution | T1190, T1059 | Execution | Sentinel |
| 3 | Deploy PHP web shell (WHIPSHOT) | T1505.003 | Persistence | Sentinel |
| 4 | Deploy SLAPSHOT Python tunneler | T1105, T1572 | Command and Control | Sentinel |
| 5 | File and directory discovery | T1083 | Discovery | Sentinel |
| 6 | Exfiltrate over established channel | T1041 | Exfiltration | Sentinel |
| 7 | Detect web-service child process and new PHP | T1505.003, T1059 | Detection | Sentinel |
| 8 | Rebuild and rotate secrets | behavioral | Response | Sentinel |

### MITRE Coverage
- [x] T1190 — exercised
- [x] T1059 — exercised
- [x] T1505.003 — exercised
- [x] T1105 — exercised
- [x] T1572 — exercised
- [x] T1083 — exercised
- [x] T1041 — exercised

### Detection Rule Validation
- `rule-025-001`: NetScaler web-service process spawning interpreter (T1059, T1505.003). **Validated: true positive.**
- `rule-025-002`: New PHP file created in NetScaler web root (T1505.003). **Validated: true positive.**
- `rule-025-003`: NetScaler appliance outbound tunnel/exfiltration (T1572, T1041). **Validated: true positive.**

