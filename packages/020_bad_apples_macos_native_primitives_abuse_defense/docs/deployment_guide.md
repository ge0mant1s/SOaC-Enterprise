# Bad Apples: macOS Native Primitives Abuse Defense — Deployment Guide

## Prerequisites
- Access to Endpoint environment
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
- T1072
- T1059.002
- T1027
- T1021.004
- T1570
- T1021
- T1059.004
- T1027.009
- T1564.004
- T1090.003
- T1046
- T1018
- T1082
- T1140
- T1543.001
- T1547.011
- T1547
- T1546
- T1098
- T1041
