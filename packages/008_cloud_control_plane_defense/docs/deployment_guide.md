# Deployment Guide: pkg-008 — Cloud Control Plane Defense GTR-2025

## Prerequisites
- Microsoft Sentinel with Azure AD, CloudTrail, and Azure Activity connectors
- AWS CloudTrail in all regions + AWS Config enabled
- CrowdStrike Falcon Cloud Security with identity protection
- Splunk with AWS and Azure add-ons

## Detection Deployment
### Sigma Rules
Convert 3 rules for your SIEM platform.

### Microsoft Sentinel
Import 3 KQL analytics rules. Recommended frequencies:
- `gtr2025_cloud_identity_hunt`: Every 1 hour
- `cloud_resource_abuse_detection`: Every 15 minutes
- `cloud_persistence_detection`: Every 1 hour

### Wazuh
```bash
sudo cp detections/wazuh/gtr2025_cloud_defense_rules.xml /var/ossec/etc/rules/
sudo systemctl restart wazuh-manager
```

## Validation
```bash
soac validate --package pkg-008 --evidence validation/evidence_bundle.json
```
