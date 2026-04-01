# Supply Chain Package Compromise Defense — Threat Context

## Overview
A sophisticated supply chain attack targeting the popular Axios JavaScript library through compromised npm maintainer accounts, resulting in malicious versions that deploy cross-platform RAT malware. The attack affects multiple sectors globally and shows overlap with DPRK operations, specifically the WAVESHAPER backdoor family.

## Threat Actor
DPRK (Democratic People's Republic of Korea)

## Attack Chain
1. **npm account compromise and malicious package injection** — Attackers hijacked an Axios maintainer's npm account and released compromised versions (v1.14.1 and v0.30.4) that injected plain-crypto-js as a hidden dependency without modifying Axios source code
   - MITRE: T1195.002
   - Phase: Initial Access
   - Pillar: Offense
2. **Postinstall dropper execution via npm lifecycle hook** — When developers run npm install axios, the malicious plain-crypto-js dependency triggers npm's postinstall lifecycle hook, executing a heavily obfuscated Node.js dropper script (setup.js) using two-layer encoding with string reversal, Base64-decoding and XOR cipher
   - MITRE: T1204.005, T1027
   - Phase: Initial Access
   - Pillar: Offense
3. **C2 communication with platform detection** — The dropper queries the operating system and sends HTTP POST requests to C2 server sfrclak[.]com:8000, disguising traffic as benign npm registry requests with platform-specific paths (packages.npm[.]org/product0/1/2)
   - MITRE: T1082, T1071.001, T1105
   - Phase: Discovery
   - Pillar: Detect
4. **Platform-specific RAT payload deployment** — C2 server delivers different payloads per OS: macOS receives C++ Mach-O binary saved to /Library/Caches/com.apple.act.mond, Windows gets PowerShell RAT disguised as Windows Terminal (wt.exe), Linux receives Python RAT script (/tmp/ld.py)
   - MITRE: T1105, T1036.005
   - Phase: Command and Control
   - Pillar: Respond
5. **Cross-platform RAT execution and persistence** — All three RAT variants establish persistence using platform-specific methods: macOS via silent execution, Windows via registry Run keys and disguised PowerShell binary, Linux via nohup background execution. All use identical C2 protocol with 60-second beacons
   - MITRE: T1547.001, T1036.005, T1059.001, T1059.006
   - Phase: Persistence
   - Pillar: Offense
6. **Remote access and command execution capabilities** — The unified RAT framework accepts four commands: kill (self-terminate), runscript (execute shell/script commands), peinject (drop and execute binary payloads), and rundir (enumerate directories). All variants use anachronistic IE8/WinXP user-agent for evasion
   - MITRE: T1219, T1059, T1083, T1105
   - Phase: Lateral Movement
   - Pillar: Respond
7. **Anti-forensic cleanup and evidence destruction** — After successful payload deployment (15 seconds total), the Node.js dropper performs aggressive cleanup by deleting setup.js, removing postinstall hooks, and replacing tampered package.json with clean decoy file (package.md)
   - MITRE: T1070.004, T1070.006
   - Phase: Defense Evasion
   - Pillar: Offense

## Target Stack
Supply Chain, CI/CD, Network, Endpoint

## Category
Supply Chain
