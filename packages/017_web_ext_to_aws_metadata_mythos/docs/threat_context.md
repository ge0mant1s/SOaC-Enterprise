# Exploit Chain Disruption: Web Exploit → Sandbox Escape → AWS Metadata (Mythos Pattern) — Threat Context

## Overview

Instance-level exploit chain package: Web application exploitation (T1190) chains to process injection sandbox escape (T1055), pivoting to AWS metadata credential theft (T1552.005). Implements the Mythos autonomous chain pattern with 2 defensive breakpoints and cross-domain correlation.

## Package Type
- **Type:** Instance (specific attack chain)
- **Framework Parent:** mythos_disruption_framework
- **Pattern:** Mythos Autonomous Chain

## Threat Actor
Multi-stage Threat Actor (Autonomous Exploit Chain)

This chain models threat actors who deploy automated exploitation toolkits capable of chaining web exploits through endpoint evasion into cloud credential theft without manual intervention. The attack completes in under 5 minutes from initial exploit to credential exfiltration.

## Attack Chain (3 Stages, 2 Breakpoints)

1. **Web Application Exploitation (T1190)** — Initial Access
   - MITRE: T1190
   - Phase: Initial Access
   - Detection: Sentinel WAF + web server logs
   - Intent: `web_exploit_entry` — Establish foothold via public-facing app vulnerability

2. **Process Injection / Sandbox Escape (T1055)** — [BREAKPOINT] Defense Evasion
   - MITRE: T1055
   - Phase: Defense Evasion
   - Detection: MDE endpoint telemetry
   - Intent: `sandbox_escape_execution` — Escape endpoint sandbox via process injection
   - **Containment:** Endpoint quarantine + process termination

3. **Credential Access from AWS Metadata (T1552.005)** — [BREAKPOINT] Credential Access
   - MITRE: T1552.005
   - Phase: Credential Access
   - Detection: AWS CloudTrail + Sentinel cloud connector
   - Intent: `cloud_metadata_pivot` — Steal IAM credentials from instance metadata service
   - **Containment:** Credential rotation + API gateway block

## Target Stack
MDE, CrowdStrike, Sentinel, AWS

## Category
Endpoint

## Cross-Domain Correlation

The Mythos pattern requires linking three security domains into a unified attack graph:

| From | To | Method | Key Entity |
|------|----|--------|------------|
| Sentinel (Web logs) | MDE (Endpoint) | Host identity + temporal sequence | Server hostname |
| MDE (Endpoint) | AWS CloudTrail (Cloud) | Instance-to-role mapping | EC2 instance ID |
| Full chain | Full chain | Source IP → host → IAM role | Attack session ID |

## Why Chain-Aware Detection Matters

Autonomous chains execute at machine speed. Each stage independently may appear as a low-severity alert. Only by correlating the full sequence — web exploit → process injection → metadata access — does the true severity become apparent. This package implements that correlation through hybrid graph analysis and automated breakpoint containment.
