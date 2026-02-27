# Deployment Guide — Package 001

## Minimum telemetry
- Entra: Sign-in logs + Audit logs
- Endpoint: MDE and/or CrowdStrike and/or Wazuh
- Optional: AWS CloudTrail (if Entra SSO into AWS)

## Steps
1. Enable and ingest logs
2. Import detections
3. Apply CA policies in report-only
4. Run simulations
5. Enable Tier 1 automation, then Tier 2
