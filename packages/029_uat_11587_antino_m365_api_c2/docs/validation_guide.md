# UAT-11587 Antino Backdoor & Microsoft 365 API C2 — Validation Guide

## Schema Validation
This package conforms to the SOaC Harness v3.0 schema and passes the Manifest v3.0 compliance check.

## Required Checks
1. `manifest.json` — All required v3.0 fields present; tier, roles, mitre, stacks valid
2. `detection.yaml` — kind: DetectionRule, inline_rules populated
3. `playbook.yaml` — CLAW v1 compliant, trigger + steps defined
4. `policy.yaml` — Environments and controls defined
5. Evidence bundle — L3 replay passes

## MITRE Technique Validation
- [x] T1566
- [x] T1204
- [x] T1059.005
- [x] T1059.007
- [x] T1218.005
- [x] T1574.002
- [x] T1620
- [x] T1102
- [x] T1059.001
