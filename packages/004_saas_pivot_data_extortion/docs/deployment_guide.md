# Deployment Guide: pkg-004 — Rapid Vulnerability Exploit & Emergency Patch Defense

## Prerequisites
- Microsoft Sentinel with SecurityEvent and CommonSecurityLog connectors
- CrowdStrike Falcon with process monitoring enabled
- WAF with virtual patching capability
- Vulnerability scanner with API integration
- Splunk with Endpoint and IDS data models

## Detection Deployment

### Sigma Rules
```bash
sigma convert -t splunk detections/sigma/zero_day_exploit_indicators.yml
sigma convert -t kusto detections/sigma/emergency_patch_bypass_attempt.yml
sigma convert -t kusto detections/sigma/post_exploit_persistence.yml
```

### Microsoft Sentinel
Import 3 KQL rules from `detections/sentinel/`. Configure:
- `exploit_chain_rapid_response`: Run every 5 minutes
- `cisa_kev_exploit_correlation`: Run every 15 minutes
- `patch_gap_risk_assessment`: Run daily

### Wazuh
```bash
sudo cp detections/wazuh/exploit_detection_rules.xml /var/ossec/etc/rules/
sudo systemctl restart wazuh-manager
```

## Validation
```bash
soac validate --package pkg-004 --evidence validation/evidence_bundle.json
```
