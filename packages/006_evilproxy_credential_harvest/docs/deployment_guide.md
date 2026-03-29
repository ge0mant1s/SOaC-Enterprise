# Deployment Guide: pkg-006 — EvilProxy Credential Harvest

## Prerequisites
- Microsoft Sentinel with Azure AD Sign-in Logs and Audit Logs
- Azure AD Premium P2 for risk-based conditional access
- Splunk with Azure AD add-on
- Wazuh with Azure integration

## Detection Deployment

### Sigma Rules
```bash
sigma convert -t kusto detections/sigma/evilproxy_reverse_proxy.yml
sigma convert -t kusto detections/sigma/mfa_fatigue_bombing.yml
sigma convert -t kusto detections/sigma/stolen_session_token_reuse.yml
```

### Microsoft Sentinel
Import 3 KQL rules:
- `evilproxy_aitm_detection`: Run every 5 minutes
- `mfa_fatigue_detection`: Run every 5 minutes
- `post_phish_account_takeover`: Run every 15 minutes

### Wazuh
```bash
sudo cp detections/wazuh/evilproxy_credential_rules.xml /var/ossec/etc/rules/
sudo systemctl restart wazuh-manager
```

## Validation
```bash
soac validate --package pkg-006 --evidence validation/evidence_bundle.json
```
