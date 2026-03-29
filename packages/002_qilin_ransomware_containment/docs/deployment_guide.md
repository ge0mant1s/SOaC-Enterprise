# Deployment Guide: pkg-002 — Qilin Ransomware Containment

## Prerequisites

- Microsoft Sentinel workspace with Defender for Endpoint connector
- CrowdStrike Falcon with RTR enabled
- Splunk Enterprise with Endpoint and Network_Traffic data models
- Wazuh manager v4.7+ with active Windows agent enrollment

## Detection Deployment

### Sigma Rules
Import the three Sigma rules via your Sigma converter:
```bash
sigma convert -t splunk detections/sigma/ransomware_encryption_activity.yml
sigma convert -t kusto detections/sigma/lateral_movement_smb_ransomware.yml
sigma convert -t kusto detections/sigma/vss_deletion_anti_recovery.yml
```

### Microsoft Sentinel
Import KQL analytics rules:
1. Navigate to Sentinel > Analytics > Create > Scheduled query rule
2. Import each `.kql` file from `detections/sentinel/`
3. Set run frequency: 5 minutes for encryption detection, 15 minutes for lateral movement

### Splunk
Deploy saved searches:
```bash
cp detections/splunk/*.spl $SPLUNK_HOME/etc/apps/soac_ransomware/local/savedsearches.conf
```

### Wazuh
```bash
sudo cp detections/wazuh/ransomware_containment_rules.xml /var/ossec/etc/rules/
sudo systemctl restart wazuh-manager
sudo /var/ossec/bin/wazuh-logtest
```

### CrowdStrike
Import IOA definitions via Falcon API or Custom IOA console.

## Playbook Integration

1. Import `playbooks/claw/isolate_and_contain_ransomware.yaml` into your CLAW engine
2. Configure trigger integration with Sentinel alert rules
3. Validate CrowdStrike RTR API credentials in CLAW connector settings

## Validation

Run the evidence bundle against your detection stack:
```bash
soac validate --package pkg-002 --evidence validation/evidence_bundle.json
```
