# GCP Organization Policy Guardrails -- SOaC Package 002

## Priority constraints
- constraints/iam.disableServiceAccountKeyCreation: Enforce
- constraints/iam.disableServiceAccountKeyUpload: Enforce
- constraints/compute.requireShieldedVm: Enforce
- constraints/storage.uniformBucketLevelAccess: Enforce
- constraints/compute.restrictCloudArmor: Enforce

## Audit logging
- Enable Data Access audit logs for all services
- Route to centralized log sink (BigQuery + SIEM)
