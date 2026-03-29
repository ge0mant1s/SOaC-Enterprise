# Validation Guide: pkg-006 — EvilProxy Credential Harvest

## Test Scenarios

### 1. AitM Session Detection
- **Input**: Simulate sign-in with anomalousToken risk detail and multi-IP session
- **Expected**: Sigma/KQL fire; Wazuh 100501

### 2. MFA Fatigue Attack
- **Input**: Simulate 6+ MFA denials followed by success in 10 minutes
- **Expected**: Wazuh 100502, 100503; Sentinel mfa_fatigue_detection

### 3. Post-Phishing Account Takeover
- **Input**: Simulate inbox rule creation after risky sign-in
- **Expected**: Wazuh 100504; Sentinel post_phish_account_takeover

### 4. Full AitM Chain
- **Input**: Complete EvilProxy replay from phishing through data access
- **Expected**: CLAW playbook auto-triggers, sessions revoked within 5m SLA
