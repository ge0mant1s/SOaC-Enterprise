# AI Agent Governance: Prompt Injection & Multi-Domain Lateral Pivot Disruption — Validation Guide

## Schema Validation
This package conforms to SOaC Harness v3.0 schema.

## Required Checks
1. `manifest.json` — All required v3.0 fields present
2. `detection.yaml` — kind: DetectionRule, inline_rules populated
3. `playbook.yaml` — CLAW v1 compliant, steps defined
4. `policy.yaml` — Environments and controls defined
5. Evidence bundle — L3 replay passes

## MITRE Technique Validation
- [x] T1059
- [x] T1059.004
- [x] T1083
- [x] T1565
- [x] T1528
- [x] T1071
- [x] T1567
