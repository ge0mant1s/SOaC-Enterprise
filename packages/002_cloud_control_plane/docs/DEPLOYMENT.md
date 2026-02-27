# Deployment Guide -- Package 002 (v1.0)

## Minimum telemetry
- AWS: CloudTrail (management events) ingested into Sentinel and/or LogScale
- Azure: Activity Logs + Entra Audit Logs ingested into Sentinel
- GCP: Audit Logs ingested (optional but recommended)

## Steps
1. Enable and ingest cloud audit logs
2. Import Sentinel analytics rules (start with SOAC-CORR-002-001)
3. Import LogScale queries and adapt schema mappings
4. Apply SCP guardrails (AWS) and Defender for Cloud recommendations (Azure)
5. Run simulations in order: IAM backdoor -> logging tampering -> snapshot exfil
6. Enable Tier 1 automation, then define Tier 2 approvals

## Tuning
- Adjust API enumeration thresholds per environment baseline
- Maintain allowlists for automation roles (CI/CD, Terraform, etc.)
- Use correlation scoring to reduce false positives
