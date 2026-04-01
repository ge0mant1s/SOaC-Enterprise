# Supply Chain Package Compromise Defense — Deployment Guide

## Prerequisites
- Access to Supply Chain, CI/CD, Network, Endpoint environment
- SOaC runtime v2.0+

## Deployment Steps
1. Import package via SOaC Portal Package Manager
2. Validate detections against Harness v3.0 schema
3. Deploy detection rules to SIEM platforms
4. Configure CLAW playbook triggers
5. Enable policy enforcement in production

## Verification
- Run L3 Replay Engine against evidence bundle
- Verify detection rule matches
- Confirm playbook execution order

## MITRE Coverage
- T1195.002
- T1204.005
- T1027
- T1071.001
- T1105
- T1036.005
- T1547.001
- T1219
- T1070.004
