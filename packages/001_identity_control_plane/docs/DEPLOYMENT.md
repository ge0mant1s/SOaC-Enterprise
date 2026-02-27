# Deployment Guide  Package 001 (v1.1)

## Golden platforms
- Microsoft Sentinel for analytics + correlation
- CrowdStrike Falcon LogScale for high-scale hunting

## Minimum telemetry
- Entra: Sign-in logs + Audit logs
- Endpoint: Falcon process telemetry and/or MDE
- Cloud: AWS CloudTrail (recommended)
- SaaS: Google Workspace / Salesforce / SAP logs where available (schema varies)

## Steps
1. Enable and ingest logs
2. Import Sentinel analytics rules (including `SOAC-CORR-001-001`)
3. Import LogScale queries and adapt schema mappings
4. Roll out CA baseline in report-only  enforce
5. Run simulations
6. Enable Tier 1 actions; define Tier 2 approvals

## Tuning
- Thresholds are starting points: tune per environment
- Maintain allowlists for automation IPs/UAs
- Use correlation scoring to reduce false positives
