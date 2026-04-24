# AI-Assisted AWS Cloud Intrusion with 8-Minute Admin Access — Validation Guide

## Schema Validation
This package conforms to SOaC Harness v3.0 schema.

## Required Checks
1. `manifest.json` — All required v3.0 fields present
2. `detection.yaml` — kind: DetectionRule, inline_rules populated
3. `playbook.yaml` — CLAW v1 compliant, steps defined
4. `policy.yaml` — Environments and controls defined
5. Evidence bundle — L3 replay passes

## MITRE Technique Validation
- [x] T1552.001
- [x] T1526
- [x] T1580
- [x] T1134.001
- [x] T1059.006
- [x] T1484.002
- [x] T1078.004
- [x] T1021.007
- [x] T1530
