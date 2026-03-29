# Validation Guide: pkg-008 — Cloud Control Plane Defense GTR-2025

## Test Scenarios
### 1. Federation Tampering
- **Input**: Simulate Set federation settings on domain
- **Expected**: Wazuh 100601, Sigma cloud_identity_threat_hunting fires

### 2. Serverless Backdoor
- **Input**: Simulate CreateFunction from non-IaC source
- **Expected**: Wazuh 100602, Sentinel cloud_persistence_detection

### 3. Resource Hijacking
- **Input**: Simulate RunInstances with p4 GPU instance type
- **Expected**: Wazuh 100603, Sentinel cloud_resource_abuse_detection

### 4. Storage Exposure
- **Input**: Simulate PutBucketPolicy with Principal:*
- **Expected**: Wazuh 100604

### 5. Full GTR-2025 Defense Chain
- **Input**: Multi-stage attack combining persistence and resource abuse
- **Expected**: CLAW playbook auto-triggers, guardrails deployed
