# Validation Guide: pkg-005 — SaaS OAuth & Integration Risk Defense

## Test Scenarios

### 1. Illicit Consent Grant
- **Input**: Simulate consent grant for unverified app with Mail.ReadWrite scope
- **Expected**: Sigma rules fire; Wazuh 100401, 100402

### 2. Bulk Data Access
- **Input**: Simulate 200+ file downloads via python-requests user agent
- **Expected**: `saas_bulk_data_access` triggers; Wazuh 100404

### 3. Integration Anomaly
- **Input**: Simulate 3+ app credential modifications in 1 hour
- **Expected**: `saas_integration_anomaly` triggers; Wazuh 100403

### 4. Consent Phishing Chain
- **Input**: Full consent phishing simulation through data exfiltration
- **Expected**: CLAW playbook auto-triggers, consent revoked
