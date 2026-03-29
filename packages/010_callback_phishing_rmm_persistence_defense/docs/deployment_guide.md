# Deployment Guide: pkg-010 — Callback Phishing & RMM Persistence Defense

## Prerequisites
- Microsoft Sentinel with Defender for Endpoint and Exchange connectors
- CrowdStrike Falcon with process and network monitoring
- Application control/whitelisting solution
- Splunk with Endpoint data model

## Detection Deployment
Import Sigma, KQL, SPL, Wazuh rules per standard procedure.
Key: rmm_abuse_detection every 15m, callback_phishing_chain every 1h.

### Wazuh
```bash
sudo cp detections/wazuh/callback_phishing_rmm_rules.xml /var/ossec/etc/rules/
sudo systemctl restart wazuh-manager
```

## Validation
```bash
soac validate --package pkg-010 --evidence validation/evidence_bundle.json
```
