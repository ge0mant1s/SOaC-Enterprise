# APT37 (Famous Chollima) - Operation HanKook Phantom Defense — Validation Guide

## Schema Validation
This package conforms to SOaC Harness v3.0 schema.

## Required Checks
1. `manifest.json` — All required v3.0 fields present
2. `detection.yaml` — kind: DetectionRule, inline_rules populated
3. `playbook.yaml` — CLAW v1 compliant, steps defined
4. `policy.yaml` — Environments and controls defined
5. Evidence bundle — L3 replay passes

## MITRE Technique Validation
- [x] T1566.001
- [x] T1566.002
- [x] T1059.001
- [x] T1567.002
- [x] T1573.001
