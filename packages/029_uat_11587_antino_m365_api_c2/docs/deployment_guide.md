# UAT-11587 Antino Backdoor & Microsoft 365 API C2 — Deployment Guide

## Prerequisites
- Access to Sigma, Sentinel, Splunk, CrowdStrike, MDE, Identity, Endpoint, SaaS, Network environment/telemetry
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
- T1566
- T1204
- T1059.005
- T1059.007
- T1218.005
- T1574.002
- T1620
- T1102
- T1059.001
