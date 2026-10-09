# AsyncAPI npm Supply-Chain Compromise & Miasma RAT — Threat Context

## Overview
A supply-chain compromise of the AsyncAPI npm ecosystem in which a privileged `pull_request_target` workflow was abused to steal a maintainer PAT, push malicious commits and publish trojanized `@asyncapi/*` packages that deploy the Miasma RAT on module import. The RAT harvests credentials, establishes persistence and uses decentralized (IPFS / Nostr / BitTorrent DHT) infrastructure for command and control.

## Threat Actor
Unattributed supply-chain threat actor

## Source-Supported Behavior vs. Engineering Mappings
## Behavioral Context

This package combines **publicly reported IOCs** (specific compromised `@asyncapi/*` versions, the `sync.js` payload path, IPFS CIDs, the C2 IP `85.137.53.71` on ports 8080/8081/8091, an ETH contract address and decentralized relay endpoints) with behavioral logic for post-install script execution and decentralized C2. The IOCs are sourced from SafeDep, StepSecurity and Palo Alto Unit 42 reporting (July 2026). Decentralized-C2 detections (Nostr/IPFS/BitTorrent DHT) are behavioral because those services also have legitimate uses.

## Attack Chain
1. **Abuse privileged pull_request_target workflow** — The attacker abuses a misconfigured, privileged GitHub Actions `pull_request_target` workflow to obtain secrets from an untrusted fork PR.
   - MITRE: T1195.002
   - Phase: Initial Access
   - Pillar: Offense
2. **Steal maintainer PAT and push malicious commits** — Using the stolen PAT, the attacker pushes malicious commits to the next branch and triggers trusted publishing.
   - MITRE: T1552
   - Phase: Execution
   - Pillar: Offense
3. **Publish trojanized @asyncapi/* packages** — Trojanized package versions are published to the public npm registry.
   - MITRE: T1195.002
   - Phase: Resource Development
   - Pillar: Offense
4. **Code execution on module import** — On install/import, `sync.js` spawns a detached Node process that fetches second-stage payloads.
   - MITRE: T1059.007, T1105
   - Phase: Execution
   - Pillar: Offense
5. **Deploy Miasma RAT and harvest credentials** — The Miasma RAT is deployed, harvesting environment variables, tokens and cloud credentials.
   - MITRE: T1552
   - Phase: Credential Access
   - Pillar: Offense
6. **Establish persistence** — The RAT establishes persistence via systemd services, cron/scheduled tasks or registry run keys.
   - MITRE: T1543.002, T1053.003
   - Phase: Persistence
   - Pillar: Offense
7. **Decentralized C2 and lateral discovery** — C2 is conducted over IPFS / Nostr relays / BitTorrent DHT while the RAT performs remote-system discovery.
   - MITRE: T1102, T1018
   - Phase: Command and Control
   - Pillar: Offense
8. **Detect trojanized package execution** — Blue team detects post-install script execution spawning detached Node processes and connections to known C2 infrastructure.
   - MITRE: T1195.002, T1105
   - Phase: Detection
   - Pillar: Detect
9. **Contain and remediate supply-chain compromise** — SOC quarantines runners/endpoints, removes affected versions, revokes credentials and rebuilds from verified commits.
   - MITRE: behavioral (no source-reported technique)
   - Phase: Response
   - Pillar: Respond

## Target Stack
Sigma, Sentinel, Splunk, CrowdStrike, Wazuh, MDE, AWS, GitHub, CI/CD, Endpoint, Cloud

## Category
CI/CD

## Intelligence Sources
- <https://safedep.io/asyncapi-generator-supply-chain-attack-miasma-rat/>
- <https://www.stepsecurity.io/blog/compromised-next-branch-pushes-malicious-asyncapi-generator-generator-helpers-and-generator-components-to-npm>
- <https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/>
