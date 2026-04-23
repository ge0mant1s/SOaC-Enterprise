# Bad Apples: macOS Native Primitives Abuse Defense — Threat Context

## Overview
Bad Apples is a macOS living-off-the-land attack pattern that weaponizes native Remote Application Scripting, AppleScript, SSH, Finder metadata, and LaunchAgents to execute payloads, establish persistence, and move laterally while evading traditional file-based detection. The campaign targets developer and DevOps environments with privileged access to source code repositories, build systems, and cloud infrastructure. This package provides detection coverage for metadata-based payload staging, native execution chains, stealthy shell establishment via socat, and post-pivot lateral movement across enterprise macOS endpoints.

## Threat Actor
Unknown / Generic

## Attack Chain
1. **Remote Application Scripting for initial execution** — Attackers use Remote Application Scripting (RAS) to execute commands on remote macOS systems by leveraging Terminal.app as an execution proxy. Base64-encoded payloads are deployed and executed in a two-stage process to bypass Apple's -10016 Handler Error restrictions.
   - MITRE: T1072, T1059.002, T1027
   - Phase: Execution
   - Pillar: Offense
2. **AppleScript execution over SSH for lateral movement** — Adversaries invoke osascript directly over SSH to execute AppleScript commands remotely, using 'do shell script' handlers for arbitrary command execution while bypassing traditional process execution telemetry through Apple Events IPC.
   - MITRE: T1021.004, T1059.002, T1570, T1021
   - Phase: Lateral Movement
   - Pillar: Respond
3. **Socat remote shell establishment** — Attackers establish interactive shells using socat to create bidirectional data streams between endpoints, operating entirely outside the SSH ecosystem to avoid SSH-based detection mechanisms and logging.
   - MITRE: T1021, T1059.004, T1021.004
   - Phase: Lateral Movement
   - Pillar: Respond
4. **Finder metadata abuse for payload staging** — Malicious payloads are stored within Spotlight metadata using the Finder Comment field (kMDItemFinderComment) rather than file contents, bypassing traditional file-based security scanners and static analysis tools that focus on executable code.
   - MITRE: T1027.009, T1564.004, T1090.003, T1046, T1018, T1082
   - Phase: Defense Evasion
   - Pillar: Offense
5. **Metadata payload extraction and execution** — Stored payloads are extracted from Spotlight metadata using mdls command, Base64 decoded, and piped directly to bash for execution, allowing malicious code to run from metadata storage locations unexamined by standard EDR solutions.
   - MITRE: T1140, T1059.004, T1090.003
   - Phase: Execution
   - Pillar: Offense
6. **LaunchAgent persistence establishment** — Attackers create LaunchAgent plists in ~/Library/LaunchAgents that execute metadata extraction chains at user login, using osascript to call Finder directly for reading comments and achieving automatic payload execution at startup.
   - MITRE: T1543.001, T1547.011, T1059.002, T1547, T1546, T1098, T1041
   - Phase: Persistence
   - Pillar: Offense

## Target Stack
Endpoint

## Category
Endpoint
