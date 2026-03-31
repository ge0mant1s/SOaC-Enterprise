# Deployment Guide: CI/CD Supply Chain Defense

## Prerequisites

- GitHub Enterprise or GitHub.com with audit log streaming enabled
- Microsoft Sentinel workspace OR Splunk instance
- Endpoint detection (MDE or CrowdStrike Falcon)
- Container registry with audit logging (GHCR, ACR, or ECR)

## Detection Deployment

1. Deploy KQL-001 (Forced Tag Push) to Sentinel Analytics Rules
2. Deploy Sigma-002 (SSH Key Creation) via sigma-converter for your SIEM
3. Deploy Splunk-003 (Curl Exfiltration) as a Splunk correlation search
4. Deploy Wazuh-005 (File Integrity) rule ID 101301
5. Deploy CrowdStrike-004 via custom IOA rule

## Playbook Deployment

Import `playbook.yaml` into your SOAR platform. Map trigger conditions to detection output.
