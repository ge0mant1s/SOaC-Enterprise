# Supply Chain Package Compromise Defense — Validation Guide

## Schema Validation
This package conforms to SOaC Harness v3.0 schema.

## Required Checks
1. `manifest.json` — All required v3.0 fields present
2. `detection.yaml` — kind: DetectionRule, inline_rules populated
3. `playbook.yaml` — CLAW v1 compliant, steps defined
4. `policy.yaml` — Environments and controls defined
5. Evidence bundle — L3 replay passes

## MITRE Technique Validation
- [x] T1195.002
- [x] T1204.005
- [x] T1027
- [x] T1071.001
- [x] T1105
- [x] T1036.005
- [x] T1547.001
- [x] T1219
- [x] T1070.004
