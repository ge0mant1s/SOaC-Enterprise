# AI Agent Governance: Prompt Injection & Multi-Domain Lateral Pivot Disruption — Deployment Guide

## Prerequisites
- Access to Sigma, Sentinel environment
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
- T1059
- T1059.004
- T1083
- T1565
- T1528
- T1071
- T1567
