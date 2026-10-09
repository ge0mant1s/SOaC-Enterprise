# AsyncAPI npm Supply-Chain Compromise & Miasma RAT — L3 Replay Report

## Package: pkg-028
## Generated: 2026-10-09T12:00:00Z
## Verdict: PASS ✅

---

### Attack Narrative

This replay validates a 9-stage attack chain:

**Stage 1 — Abuse privileged pull_request_target workflow**
The attacker abuses a misconfigured, privileged GitHub Actions `pull_request_target` workflow to obtain secrets from an untrusted fork PR.

**Stage 2 — Steal maintainer PAT and push malicious commits**
Using the stolen PAT, the attacker pushes malicious commits to the next branch and triggers trusted publishing.

**Stage 3 — Publish trojanized @asyncapi/* packages**
Trojanized package versions are published to the public npm registry.

**Stage 4 — Code execution on module import**
On install/import, `sync.js` spawns a detached Node process that fetches second-stage payloads.

**Stage 5 — Deploy Miasma RAT and harvest credentials**
The Miasma RAT is deployed, harvesting environment variables, tokens and cloud credentials.

**Stage 6 — Establish persistence**
The RAT establishes persistence via systemd services, cron/scheduled tasks or registry run keys.

**Stage 7 — Decentralized C2 and lateral discovery**
C2 is conducted over IPFS / Nostr relays / BitTorrent DHT while the RAT performs remote-system discovery.

**Stage 8 — Detect trojanized package execution**
Blue team detects post-install script execution spawning detached Node processes and connections to known C2 infrastructure.

**Stage 9 — Contain and remediate supply-chain compromise**
SOC quarantines runners/endpoints, removes affected versions, revokes credentials and rebuilds from verified commits.


### Attack Chain

| Step | Title | MITRE | Phase | Provider |
|------|-------|-------|-------|----------|
| 1 | Abuse privileged pull_request_target workflow | T1195.002 | Initial Access | — |
| 2 | Steal maintainer PAT and push malicious commits | T1552 | Execution | — |
| 3 | Publish trojanized @asyncapi/* packages | T1195.002 | Resource Development | — |
| 4 | Code execution on module import | T1059.007, T1105 | Execution | — |
| 5 | Deploy Miasma RAT and harvest credentials | T1552 | Credential Access | — |
| 6 | Establish persistence | T1543.002, T1053.003 | Persistence | — |
| 7 | Decentralized C2 and lateral discovery | T1102, T1018 | Command and Control | — |
| 8 | Detect trojanized package execution | T1195.002, T1105 | Detection | — |
| 9 | Contain and remediate supply-chain compromise | behavioral | Response | — |

### MITRE Coverage
- [x] T1195.002 — exercised
- [x] T1552 — exercised
- [x] T1059.007 — exercised
- [x] T1105 — exercised
- [x] T1543.002 — exercised
- [x] T1053.003 — exercised
- [x] T1018 — exercised
- [x] T1102 — exercised

### Detection Rule Validation
- `rule-028-001`: Installation of compromised @asyncapi/* package versions (T1195.002). **Validated: true positive.**
- `rule-028-002`: Miasma RAT C2 connection to 85.137.53.71 (T1105, T1102). **Validated: true positive.**
- `rule-028-003`: Detached Node process from npm post-install (sync.js) (T1059.007, T1105). **Validated: true positive.**

