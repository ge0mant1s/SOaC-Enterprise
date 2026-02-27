# SOAC-PB-001-003: EntraAWS Pivot Containment

## Trigger
- AssumeRole anomaly detected
- Identity takeover correlation score is High/Critical and AWS role assumption observed

## Tier 1 (automatic)
1. Revoke Entra sessions for the user
2. Temporarily block AWS role session creation for the principal (IAM policy condition / session tags)
3. Alert cloud security owner

## Tier 2 (human-in-loop)
4. Rotate AWS credentials and inspect CloudTrail for IAM changes
5. Revert any new IAM users/roles/policies

## Evidence
- CloudTrail event IDs
- Entra sign-in timeline
