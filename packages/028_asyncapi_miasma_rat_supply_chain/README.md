# AsyncAPI npm Supply-Chain Compromise & Miasma RAT

**Package ID:** pkg-028
**Package Type:** instance
**Schema Version:** 3.0
**Difficulty:** Elite

A supply-chain compromise of the AsyncAPI npm ecosystem in which a privileged `pull_request_target` workflow was abused to steal a maintainer PAT, push malicious commits and publish trojanized `@asyncapi/*` packages that deploy the Miasma RAT on module import. The RAT harvests credentials, establishes persistence and uses decentralized (IPFS / Nostr / BitTorrent DHT) infrastructure for command and control.

## MITRE ATT&CK Coverage
- T1195.002
- T1552
- T1059.007
- T1105
- T1543.002
- T1053.003
- T1018
- T1102

> MITRE techniques are **SOaC engineering mappings** derived from documented behavior unless a source explicitly reports the technique. See `docs/threat_context.md` for source-supported behavior vs. engineering mappings.

## Attack Chain (9 Stages)
1. **Abuse privileged pull_request_target workflow** — T1195.002
2. **Steal maintainer PAT and push malicious commits** — T1552
3. **Publish trojanized @asyncapi/* packages** — T1195.002
4. **Code execution on module import** — T1059.007, T1105
5. **Deploy Miasma RAT and harvest credentials** — T1552
6. **Establish persistence** — T1543.002, T1053.003
7. **Decentralized C2 and lateral discovery** — T1102, T1018
8. **Detect trojanized package execution** — T1195.002, T1105
9. **Contain and remediate supply-chain compromise** — behavioral

## Threat Intelligence Sources
- <https://safedep.io/asyncapi-generator-supply-chain-attack-miasma-rat/>
- <https://www.stepsecurity.io/blog/compromised-next-branch-pushes-malicious-asyncapi-generator-generator-helpers-and-generator-components-to-npm>
- <https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/>

## Public IOCs and Artifacts

The following indicators are **publicly reported** (SafeDep, StepSecurity, Palo Alto Unit 42; July 2026):

### Compromised npm packages
| Package | Version |
|---------|---------|
| `@asyncapi/generator` | 3.3.1 |
| `@asyncapi/specs` | 6.11.2 |
| `@asyncapi/generator-helpers` | (compromised release) |
| `@asyncapi/generator-components` | (compromised release) |

### Files
- `sync.js` (dropped at `~/.local/share/NodeJS/sync.js`)

### Network / C2
| Indicator | Type |
|-----------|------|
| `85.137.53.71` (ports 8080, 8081, 8091) | C2 IP |
| `QmQobZSp1wRPrpSEQ56qnyq7ecZh5Bg5k1fnjt4SUwwHb9` | IPFS CID |
| `Qmet4fhsAaWMBUxNDfREHwgiyDeSWy4YSYs9wiKUW5jGyf` | IPFS CID |
| `0x12c37A86a0Ed0beBe5d1d6a43E42f07860eAc710` | Ethereum contract |
| `relay.damus.io`, `relay.nostr.com`, `router.bittorrent.com:6881` | Decentralized relays (dual-use) |

**Sources:** SafeDep, StepSecurity, Palo Alto Networks Unit 42 (July 2026).

## Target Platforms
Sigma, Sentinel, Splunk, CrowdStrike, Wazuh, MDE, AWS, GitHub, CI/CD, Endpoint, Cloud

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
