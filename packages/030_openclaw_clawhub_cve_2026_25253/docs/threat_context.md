# OpenClaw / ClawHub Malicious Skills & Control-UI RCE (CVE-2026-25253) — Threat Context

## Overview
A supply-chain and exploitation campaign against the OpenClaw AI agent ecosystem: malicious skills distributed via the ClawHub marketplace (typosquatting and poisoned SKILL.md prerequisites) deliver AMOS (Atomic macOS Stealer), while CVE-2026-25253 (CVSS 8.8) allows WebSocket hijacking of the Control UI gatewayUrl to achieve remote host command execution.

## Threat Actor
Multiple (marketplace abusers; AMOS operators)

## Source-Supported Behavior vs. Engineering Mappings
## Behavioral Context

This package covers two related OpenClaw threats: malicious **ClawHub** skills (typosquatting + poisoned `SKILL.md` prerequisites) delivering **AMOS** (Atomic macOS Stealer), and **CVE-2026-25253** (CVSS 8.8), a Control-UI `gatewayUrl` WebSocket hijack enabling host command execution (fixed in v2026.1.29). `SKILL.md`, Base64-encoded shell commands, password-protected archives and AMOS are **generic artifacts** that also appear in legitimate use, so detection logic is behavioral and must not treat any single artifact as malicious in isolation. Sources: Aviatrix, Trend Micro, OpenClaw docs (2026).

## Attack Chain
1. **Marketplace poisoning / typosquatting** — Malicious skills are published to ClawHub using typosquatted names and poisoned SKILL.md prerequisites.
   - MITRE: T1195.002
   - Phase: Resource Development
   - Pillar: Offense
2. **User installs malicious skill** — A user installs a malicious skill whose SKILL.md prerequisites trigger execution.
   - MITRE: T1204.002
   - Phase: Initial Access
   - Pillar: Offense
3. **Encoded shell and archive staging** — The skill runs Base64-encoded shell commands and fetches password-protected archives.
   - MITRE: T1059.004, T1105
   - Phase: Execution
   - Pillar: Offense
4. **AMOS stealer deployment** — AMOS (Atomic macOS Stealer) is deployed to harvest browser, Keychain and crypto credentials.
   - MITRE: T1555
   - Phase: Credential Access
   - Pillar: Offense
5. **Control UI WebSocket hijack (CVE-2026-25253)** — Alternatively, a malicious link abuses the Control UI gatewayUrl to hijack the WebSocket and execute host commands.
   - MITRE: T1190
   - Phase: Initial Access
   - Pillar: Offense
6. **Host command execution via hijacked gateway** — The hijacked WebSocket is used to run arbitrary commands on the host.
   - MITRE: T1059.004
   - Phase: Execution
   - Pillar: Offense
7. **Detect malicious skills and Control-UI abuse** — Blue team detects encoded shell execution from skills and anomalous WebSocket connections to the Control UI gatewayUrl.
   - MITRE: T1059.004, T1190
   - Phase: Detection
   - Pillar: Detect
8. **Contain and remediate** — SOC removes untrusted skills, upgrades to v2026.1.29, isolates hosts, revokes credentials and rebuilds agents.
   - MITRE: behavioral (no source-reported technique)
   - Phase: Response
   - Pillar: Respond

## Target Stack
Sigma, Sentinel, Splunk, CrowdStrike, Wazuh, MDE, GitHub, CI/CD, Endpoint, Cloud, Network

## Category
Endpoint

## Intelligence Sources
- <https://aviatrix.ai/threat-research-center/openclaw-clawhub-malicious-skills-supply-chain-attack-2026/>
- <https://www.trendmicro.com/en_us/research/26/b/openclaw-skills-used-to-distribute-atomic-macos-stealer.html>
- <https://docs.openclaw.ai/clawhub>
