# Exploit Chain Disruption: Web Exploit → Sandbox Escape → AWS Metadata (Mythos Pattern) — Validation Guide

## Schema Validation
This package conforms to SOaC Harness v3.0 schema.

## Package Type Validation
- [x] `package_type` = "instance" (specific attack chain, not abstract framework)
- [x] `framework_parent` = "mythos_disruption_framework"
- [x] `attack_intent` present with entry/pivot/objective/pattern fields

## Required Checks
1. `manifest.json` — All required v3.0 fields present, including package_type and attack_intent
2. `detection.yaml` — kind: DetectionRule, inline_rules populated
3. `playbook.yaml` — CLAW v1 compliant, steps defined
4. `policy.yaml` — Environments and controls defined
5. Evidence bundle — L3 replay passes

## MITRE Technique Validation (3 Techniques — Cross-Domain)
- [x] T1190 — Initial Access (Web Application Exploitation) — validated against evt-001
- [x] T1055 — Defense Evasion (Process Injection / Sandbox Escape) — validated against evt-002
- [x] T1552.005 — Credential Access (AWS Metadata Credential Theft) — validated against evt-003

## Exploit Chain Disruption Validation
- [x] Minimum 3 attack chain stages (has 3)
- [x] Distinct MITRE technique per stage (T1190, T1055, T1552.005)
- [x] Includes Initial Access technique (T1190)
- [x] Includes Execution/Evasion technique (T1055)
- [x] Includes Credential Access/Cloud pivot technique (T1552.005)
- [x] Minimum 2 breakpoints (BP-01: process injection, BP-02: metadata access)
- [x] Semantic action labels (no generic body_action_X patterns)
- [x] Non-generic title (chain-specific, not framework name)
- [x] Hunt artifact present (hunt.yaml)

## Breakpoint Validation
- [x] BP-01 (Stage 2): Process injection detection → endpoint quarantine within 15s window
- [x] BP-02 (Stage 3): Metadata access detection → credential rotation within 30s window

## Cross-Domain Correlation Validation
- [x] Sentinel → MDE correlation via host identity
- [x] MDE → CloudTrail correlation via instance-to-role mapping
- [x] Full chain attribution with attack session correlation ID
