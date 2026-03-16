# SOaC Harness CLI

Validation engine for SOaC artifacts. Checks CLAW playbooks, detection rules, policies, and package metadata against canonical schema contracts.

## Validation Levels

| Level | Name | What It Checks |
|---|---|---|
| **1** | Schema | YAML parses. Required fields present. Enum values valid. Banned terms absent. |
| **2** | Cross-Reference | MITRE ATT&CK IDs valid (T####.###). package_id format (pkg-NNN). Step targets valid. CRITICAL playbooks have rollback + brain oversight. Detection rules have real implementations (not placeholders). Policy action lists non-contradictory. Metadata threat entries have required sub-fields. |
| **3** | Replay | *(M4 — not yet implemented)* End-to-end simulation: detection fires, playbook triggers, enforcement propagates. |

## Installation

```bash
cd tools/soac-harness
npm install
npm run build
```

## Usage

```bash
# Validate all YAML files in a directory (Level 2)
soac-harness validate --path ./packages --level 2

# Validate a single file (Level 1 only)
soac-harness validate --path ./packages/001/metadata.yml --level 1

# JSON output (for CI parsing)
soac-harness validate --path ./packages --level 2 --format json
```

## Exit Codes

| Code | Meaning |
|---|---|
| `0` | All files passed |
| `1` | One or more files failed |
| `2` | No YAML files found or invalid arguments |

## CI Integration

The harness runs automatically via `.github/workflows/soac-ci.yml` on every push and PR to `main`. See the workflow file for the full pipeline.

```yaml
- name: Run SOaC Harness
  run: |
    cd tools/soac-harness
    npm install
    npx ts-node src/index.ts validate --path ../../packages --level 2
```

## Banned Terms

The harness enforces terminology governance. The following terms are banned from all artifacts:

- `OpenCLAW` (any casing)
- `Open-CLAW` / `Open CLAW`
- `open_claw`

Any file containing these terms will fail Level 1 validation.

## Extending

To add a new artifact kind:

1. Add the kind to `VALID_KINDS` in `src/types.ts`
2. Create a Level 1 validator function in `src/level1.ts`
3. Create a Level 2 validator function in `src/level2.ts`
4. Register both in the dispatch maps

## Template Contracts

The canonical schemas that this harness validates against live in `core/templates/`:

- `claw_playbook_v1.0.yaml`
- `detection_rule_v1.0.yaml`
- `policy_v1.0.yaml`
- `metadata_v1.0.yaml`
