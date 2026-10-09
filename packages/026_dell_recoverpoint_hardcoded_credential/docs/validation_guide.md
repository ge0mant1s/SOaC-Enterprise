# Dell RecoverPoint for Virtual Machines Hardcoded Credential Exploitation — Validation Guide

## Schema Validation
This package conforms to the SOaC Harness v3.0 schema and passes the Manifest v3.0 compliance check.

## Required Checks
1. `manifest.json` — All required v3.0 fields present; tier, roles, mitre, stacks valid
2. `detection.yaml` — kind: DetectionRule, inline_rules populated
3. `playbook.yaml` — CLAW v1 compliant, trigger + steps defined
4. `policy.yaml` — Environments and controls defined
5. Evidence bundle — L3 replay passes

## MITRE Technique Validation
- [x] T1078
- [x] T1133
- [x] T1059
- [x] T1543
- [x] T1021
