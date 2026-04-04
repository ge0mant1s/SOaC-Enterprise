# UAT-8837: AD Recon, Identity Pivot & Reverse Tunnel Defense — Validation Guide

## Schema Validation
This package conforms to SOaC Harness v3.0 schema.

## Required Checks
1. `manifest.json` — All required v3.0 fields present
2. `detection.yaml` — kind: DetectionRule, inline_rules populated
3. `playbook.yaml` — CLAW v1 compliant, steps defined
4. `policy.yaml` — Environments and controls defined
5. Evidence bundle — L3 replay passes

## MITRE Technique Validation
- [x] T1190
- [x] T1078
- [x] T1082
- [x] T1033
- [x] T1049
- [x] T1112
- [x] T1021.001
- [x] T1105
- [x] T1027
- [x] T1090
- [x] T1572
- [x] T1087.002
- [x] T1069.002
- [x] T1018
- [x] T1134
- [x] T1558
- [x] T1550
- [x] T1136.002
- [x] T1098
- [x] T1560
- [x] T1556
- [x] T1005
