# Validation Guide: pkg-003 — Cloud Control Plane Hijack

## Test Scenarios

### 1. IAM Privilege Escalation
- **Input**: Simulate AttachUserPolicy with AdministratorAccess
- **Expected**: Sigma `iam_privilege_escalation` fires at CRITICAL
- **Expected**: Wazuh rule 100201 triggers

### 2. Logging Disruption
- **Input**: Simulate StopLogging and DeleteFlowLogs events
- **Expected**: `control_plane_logging_disruption` Sentinel rule at CRITICAL
- **Expected**: Wazuh rule 100202 triggers

### 3. Cross-Account Pivot
- **Input**: Simulate 3+ AssumeRole calls to different accounts in 30 minutes
- **Expected**: `cross_account_pivot` Sigma rule fires at HIGH
- **Expected**: Wazuh rule 100203 triggers

### 4. Network Exposure
- **Input**: Simulate AuthorizeSecurityGroupIngress with 0.0.0.0/0
- **Expected**: Wazuh rule 100204 triggers

### 5. End-to-End Cloud Hijack
- **Input**: Full attack chain from credential compromise through control plane takeover
- **Expected**: CLAW playbook triggers, revokes sessions, restores logging
