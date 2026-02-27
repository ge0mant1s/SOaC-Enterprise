# SOAC-SIM-002-001: AWS IAM Backdoor Creation Simulation

## Goal
Validate detection and containment of IAM backdoor creation.

## Steps
1. Use a test IAM user with limited permissions.
2. Create a new IAM user: aws iam create-user --user-name soac-test-backdoor
3. Attach a policy: aws iam attach-user-policy --user-name soac-test-backdoor --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess
4. Confirm SOAC-DET-002-001 fires in Sentinel.
5. Validate Tier 1 playbook disables the user.

## Expected evidence
- CloudTrail: CreateUser + AttachUserPolicy events
- Sentinel alert with Actor + TargetEntity
