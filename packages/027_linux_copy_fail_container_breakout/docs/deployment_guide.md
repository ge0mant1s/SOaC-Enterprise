# Linux Copy Fail Privilege Escalation and Container Breakout — Deployment Guide

## Prerequisites
- Access to Sigma, Sentinel, Splunk, CrowdStrike, Wazuh, MDE, Endpoint, Cloud, CI/CD environment/telemetry
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
- T1068
- T1611
- T1059
