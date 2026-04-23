# Bad Apples: macOS Native Primitives Abuse Defense — Validation Guide

## Schema Validation
This package conforms to SOaC Harness v3.0 schema.

## Required Checks
1. `manifest.json` — All required v3.0 fields present
2. `detection.yaml` — kind: DetectionRule, inline_rules populated
3. `playbook.yaml` — CLAW v1 compliant, steps defined
4. `policy.yaml` — Environments and controls defined
5. Evidence bundle — L3 replay passes

## MITRE Technique Validation
- [x] T1072
- [x] T1059.002
- [x] T1027
- [x] T1021.004
- [x] T1570
- [x] T1021
- [x] T1059.004
- [x] T1027.009
- [x] T1564.004
- [x] T1090.003
- [x] T1046
- [x] T1018
- [x] T1082
- [x] T1140
- [x] T1543.001
- [x] T1547.011
- [x] T1547
- [x] T1546
- [x] T1098
- [x] T1041
