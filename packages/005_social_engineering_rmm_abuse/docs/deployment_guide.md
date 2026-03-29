# Deployment Guide: pkg-005 — SaaS OAuth & Integration Risk Defense

## Prerequisites
- Microsoft Sentinel with Azure AD audit logs and Office 365 connectors
- Microsoft Cloud App Security (MCAS) or Defender for Cloud Apps
- Splunk with Azure AD and O365 add-ons
- Wazuh with Azure integration module

## Detection Deployment

### Sigma Rules
```bash
sigma convert -t kusto detections/sigma/oauth_token_abuse.yml
sigma convert -t kusto detections/sigma/saas_data_exfiltration.yml
sigma convert -t kusto detections/sigma/illicit_consent_grant.yml
```

### Microsoft Sentinel
Import 3 KQL rules from `detections/sentinel/`:
- `oauth_consent_abuse`: Run every 15 minutes
- `saas_bulk_data_access`: Run every 5 minutes
- `saas_integration_anomaly`: Run every 1 hour

### Wazuh
```bash
sudo cp detections/wazuh/saas_oauth_rules.xml /var/ossec/etc/rules/
sudo systemctl restart wazuh-manager
```

## Validation
```bash
soac validate --package pkg-005 --evidence validation/evidence_bundle.json
```
