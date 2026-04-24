# AI-Assisted AWS Cloud Intrusion with 8-Minute Admin Access — Deployment Guide

## Prerequisites
- Access to AWS, Sentinel, Sigma environment
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
- T1552.001
- T1526
- T1580
- T1134.001
- T1059.006
- T1484.002
- T1078.004
- T1021.007
- T1530
