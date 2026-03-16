# SOaC Core Templates

This directory contains the **canonical schemas** that define the contract for all SOaC artifacts. Every detection rule, CLAW playbook, policy definition, and package metadata file across all Modular Threat Intelligence Packages (MTIPs) MUST conform to these templates.

## Templates

| Template | Version | Purpose | Harness Level |
|---|---|---|---|
| `claw_playbook_v1.0.yaml` | 1.0 | CLAW automated response workflow schema | Level 2 |
| `detection_rule_v1.0.yaml` | 1.0 | Detection rule schema (multi-platform) | Level 1 |
| `policy_v1.0.yaml` | 1.0 | Policy-as-Code constraint schema | Level 1 |
| `metadata_v1.0.yaml` | 1.0 | Package metadata manifest schema | Level 1 |

## How Templates Are Used

**Package authors:** When creating artifacts for any SOaC package (001–011), copy the relevant template and fill in all REQUIRED fields. Remove comments before committing.

**SOaC-Harness validation:** The Harness CLI validates artifacts against these templates at three levels:
- **Level 1 (Schema):** YAML structure matches the template. All REQUIRED fields are present and correctly typed.
- **Level 2 (Cross-Reference):** Playbook targets exist. Detection rules reference valid data sources. MITRE technique IDs are valid.
- **Level 3 (Replay):** End-to-end simulation. Detection fires, playbook triggers, enforcement propagates.

**Metadata requirement:** Every package directory MUST contain a `metadata.yml` at its root, conforming to `metadata_v1.0.yaml`. This file serves as the package manifest — it declares the package identity, threat coverage, artifact inventory, stakeholder relevance, signal requirements, and validation status.

## Naming Conventions

- All file names: `kebab-case` (e.g., `revoke-compromised-sessions.yaml`)
- All identifiers in YAML: `snake_case` (e.g., `package_id`, `mitre_attack`)
- Package IDs: `pkg-NNN` (e.g., `pkg-001`)
- Versions: Semantic versioning (e.g., `1.0.0`)

## Four Pillars Reference

| Pillar | Role | Template Relevance |
|---|---|---|
| The Body | Telemetry & Detection | `detection_rule_v1.0.yaml` |
| The Brain | AI Reasoning & Governance | governance fields in all templates |
| The Purpose | CLAW Automated Response | `claw_playbook_v1.0.yaml` |
| The Edge | Distributed Enforcement | `target: EDGE` in playbook steps |

## Versioning

Templates follow semantic versioning. Breaking changes increment the major version and require migration of all existing artifacts. The current version is **v1.0** across all templates.
