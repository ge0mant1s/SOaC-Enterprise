# APT37 (Famous Chollima) - Operation HanKook Phantom Defense — Deployment Guide

## Prerequisites
- Access to Endpoint, SaaS environment
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
- T1566.001
- T1566.002
- T1059.001
- T1567.002
- T1573.001
