# Package 002 -- Cloud Control Plane Defense

**SOaC (Security Operations as Code)** package for detecting and containing attacks
targeting the cloud control plane across **AWS**, **Azure (Entra ID / ARM)**, and **GCP**.

**Golden platforms (v1.0):**
- Microsoft Sentinel (KQL) -- analytics + correlation
- CrowdStrike Falcon LogScale -- high-scale hunting

**Version:** 1.0.0
**Last Updated:** 2026-02-27

## Why the cloud control plane?

The cloud control plane is the highest-value target in a modern enterprise.
Adversaries who compromise it can:
- Create persistent backdoor identities (IAM users, service principals, service accounts)
- Exfiltrate data at scale via storage/snapshot access
- Disable logging and monitoring
- Pivot laterally across every workload

This package operationalizes the SOaC Distributed Intelligence Architecture model:

- [Body]         Portable detection rules + policies + playbooks
- [Purpose]      Containment workflows coordinating actions across cloud domains
- [Brain]        Governed reasoning prompts + decision records
- [Nervous Sys]  Edge controls and rapid enforcement patterns

## What is inside

### Detections (multi-platform)
- Microsoft Sentinel (KQL): analytics + hunting
- CrowdStrike Falcon LogScale: hunting queries
- Sigma rules (portable)

### Policies / Guardrails
- AWS IAM guardrails (SCPs + IAM policy conditions)
- Azure RBAC + Defender for Cloud recommendations
- GCP IAM guardrails (Org Policy guidance)

### Purpose Playbooks (SOAR-ready logic)
- Cloud backdoor identity containment
- Logging/monitoring tampering response
- Storage/snapshot exfiltration response
- Cross-cloud pivot containment

### Simulations (purple-team)
- IAM backdoor creation
- CloudTrail/Diagnostic log disablement
- Snapshot/storage exfiltration
- Cross-cloud pivot (Entra -> AWS)

## Deployment order (recommended)
1. Enable cloud audit logs (CloudTrail, Azure Activity, GCP Audit Logs)
2. Ingest into Sentinel and/or LogScale
3. Import analytics rules (start with correlation)
4. Apply policy guardrails in audit mode -> enforce
5. Run simulations and tune thresholds
6. Enable Tier 1 automation, then Tier 2 human-in-loop

## Success metrics
- MTTD for cloud control plane anomalies < 5 minutes
- MTTC (containment) < 15 minutes for high-confidence cases
- Zero undetected IAM backdoor creations in simulation runs
- Logging tampering detected within 1 alert cycle

## Mapping
See docs/mapping/attack_mapping.md

This package includes an optional Claude reasoning layer under `brain/claude/`.
Use it to generate evidence-backed containment recommendations and executive summaries.

- Package ID: SOAC-PKG-002
- Package Version: 1.1.0
