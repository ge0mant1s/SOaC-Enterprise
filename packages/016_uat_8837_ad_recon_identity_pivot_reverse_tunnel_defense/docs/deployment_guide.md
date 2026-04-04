# UAT-8837: AD Recon, Identity Pivot & Reverse Tunnel Defense — Deployment Guide

## Prerequisites
- Access to SaaS, Endpoint, Network, Entra environment
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
- T1190
- T1078
- T1082
- T1033
- T1049
- T1112
- T1021.001
- T1105
- T1027
- T1090
- T1572
- T1087.002
- T1069.002
- T1018
- T1134
- T1558
- T1550
- T1136.002
- T1098
- T1560
- T1556
- T1005
