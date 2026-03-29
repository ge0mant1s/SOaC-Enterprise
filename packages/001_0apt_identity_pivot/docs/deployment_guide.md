# Deployment Guide: 0APT Identity Pivot (pkg-001)

## Prerequisites
- Okta tenant with System Log access OR Azure AD with Sign-in Logs
- At least one SIEM (Sentinel, Splunk, or Wazuh)
- CrowdStrike Falcon (optional, for endpoint IOAs)

## Deployment Steps

### 1. Sigma Rules
```bash
cp detections/sigma/*.yml /path/to/sigma-rules/identity/
sigma convert -t microsoft365defender detections/sigma/aitm_session_hijack.yml
```

### 2. Sentinel KQL
Deploy each `.kql` file as a Scheduled Analytics Rule:
- `aitm_multi_ip_session.kql` → Run every 5 min, lookup 1h
- `aitm_okta_session_anomaly.kql` → Run every 5 min, lookup 1h
- `identity_pivot_cloud_accounts.kql` → Run every 1h, lookup 24h

### 3. Splunk SPL
Import as correlation searches in Splunk Enterprise Security.

### 4. Wazuh Rules
```bash
sudo cp detections/wazuh/aitm_identity_rules.xml /var/ossec/etc/rules/
sudo systemctl restart wazuh-manager
```

### 5. CrowdStrike IOAs
Create Custom IOA Rule Group "SOaC Identity Defense" in Falcon Console.

### 6. CLAW Playbook
Upload via SOaC Admin → Packages → Import or API.

### 7. Conditional Access Policy
Deploy in Report-only mode first, monitor for 7 days.

## Validation
Run tests from `validation_guide.md` to confirm all detections fire correctly.

---
*SOaC Package pkg-001 | Version 1.0.0 | Apache-2.0*
