# Package 001 — Identity Control Plane Defense

**SOaC (Security Operations as Code)** package for detecting and containing identity-led intrusions across **M365 / Entra ID**, **endpoints (MDE, CrowdStrike, Wazuh)**, **cloud (AWS)**, and **SaaS (Google Workspace)**.

This package operationalizes the **SOaC: Distributed Intelligence Architecture** model:

- 🏗️ **Body**: portable detection rules + policies + playbooks
- 🎯 **Purpose**: containment workflows that coordinate actions across domains
- 🧠 **Brain**: governed reasoning prompts + decision records
- ⚡ **Nervous System**: edge controls and rapid enforcement patterns

**Version:** 1.0.0  
**Last Updated:** 2026-02-27

## What’s inside

### Detections (multi-platform)
- Microsoft Sentinel (KQL)
- Microsoft Defender for Endpoint / Defender XDR (KQL Advanced Hunting)
- CrowdStrike Falcon (LogScale/Humio-style queries)
- Splunk SPL
- Sigma rules (portable)
- Wazuh rules (JSON + guidance)

### Policies / Guardrails
- Entra Conditional Access baselines (YAML guidance + JSON examples)
- Break-glass & emergency access patterns
- Token & session hygiene controls

### Purpose Playbooks (SOAR-ready logic)
- Identity takeover containment
- MFA fatigue response
- Suspicious OAuth app / consent response
- Cross-cloud pivot (Entra → AWS) containment

### Simulations (purple-team)
- MFA fatigue
- Impossible travel + token replay indicators
- OAuth consent abuse
- Entra→AWS role pivot attempts

## Deployment order (recommended)
1. Import Sentinel analytics + hunting queries
2. Enable Entra audit + sign-in logs, unified audit logging, and endpoint telemetry
3. Apply Conditional Access baselines in report-only → enforce
4. Run simulations and tune thresholds
5. Enable automated containment (Tier 1), then human-in-loop (Tier 2)

## Success metrics (evidence)
- **MTTD** for identity anomalies < 5 minutes (SIEM)
- **MTTC** (containment) < 15 minutes for high-confidence cases
- Reduced alert noise via correlation rules (goal: -30% noise)
- Measurable prevention: blocked risky sign-ins + blocked token/session reuse patterns

## Mapping
See `docs/mapping/attack_mapping.md`.
