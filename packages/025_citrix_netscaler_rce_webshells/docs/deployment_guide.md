# Citrix NetScaler ADC/Gateway RCE and Web-Shell Activity — Deployment Guide

## Prerequisites
- Access to Sigma, Sentinel, Splunk, Network, Endpoint environment/telemetry
- SOaC runtime v2.0+

## Deployment Steps
1. Import package via SOaC Portal Package Manager
2. Validate detections against Harness v3.0 schema
3. Deploy detection rules to the relevant SIEM/EDR platforms
4. Configure CLAW playbook triggers
5. Enable policy enforcement in production

## Verification
- Run L3 Replay Engine against the evidence bundle
- Verify detection rule matches
- Confirm playbook execution order

## MITRE Coverage
- T1190
- T1059
- T1505.003
- T1105
- T1572
- T1083
- T1041
