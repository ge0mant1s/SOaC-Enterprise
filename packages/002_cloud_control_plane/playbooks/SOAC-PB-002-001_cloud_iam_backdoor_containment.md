# SOAC-PB-002-001: Cloud IAM Backdoor Containment

## Trigger
- SOAC-DET-002-001 (AWS IAM backdoor creation)
- SOAC-DET-002-004 (Azure ARM privileged role assignment)
- SOAC-CORR-002-001 (Cloud control plane takeover score >= High)

## Tier 1 (Automatic)
1. Disable newly created IAM user / access key (AWS: iam:UpdateAccessKey, iam:UpdateLoginProfile)
2. Revoke newly assigned Azure ARM role (remove role assignment)
3. Quarantine source identity (revoke Entra sessions if cross-cloud pivot detected)

## Tier 2 (Human-in-loop)
4. Delete backdoor IAM user/role/service principal after confirmation
5. Rotate all access keys for the compromised actor
6. Review and revert all IAM/RBAC changes in the incident window

## Evidence
- CloudTrail event IDs + request parameters
- Azure Activity Log correlation IDs
- Source IP + User Agent
