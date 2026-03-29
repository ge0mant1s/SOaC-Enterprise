# Deployment Guide: pkg-003 — Cloud Control Plane Hijack

## Prerequisites

- Microsoft Sentinel with AWS CloudTrail and Azure Activity Log connectors
- AWS CloudTrail enabled in all regions with log validation
- CrowdStrike Falcon Cloud Security
- Splunk with AWS add-on configured
- Wazuh with AWS CloudTrail integration

## Detection Deployment

### Sigma Rules
```bash
sigma convert -t kusto detections/sigma/iam_privilege_escalation.yml
sigma convert -t kusto detections/sigma/control_plane_tampering.yml
sigma convert -t kusto detections/sigma/cross_account_pivot.yml
```

### Microsoft Sentinel
1. Import KQL rules from `detections/sentinel/`
2. Configure CloudTrail data connector
3. Set run frequency: 15 minutes for IAM escalation, 5 minutes for logging disruption

### Splunk
Deploy saved searches with AWS CloudTrail sourcetype configured.

### Wazuh
```bash
sudo cp detections/wazuh/cloud_control_plane_rules.xml /var/ossec/etc/rules/
sudo systemctl restart wazuh-manager
```

### CrowdStrike
Import cloud IOA definitions via Falcon Cloud Security console.

## Validation
```bash
soac validate --package pkg-003 --evidence validation/evidence_bundle.json
```
