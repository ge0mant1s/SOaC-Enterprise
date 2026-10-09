# Dell RecoverPoint for Virtual Machines Hardcoded Credential Exploitation — Deployment Guide

## Prerequisites
- Access to Sigma, Sentinel, Splunk, Identity, Network environment/telemetry
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
- T1078
- T1133
- T1059
- T1543
- T1021
