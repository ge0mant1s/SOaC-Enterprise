# Milestone 2 — SOaC-Harness CLI

**Version:** v2.0  
**Status:** COMPLETE  
**Date:** 2026-03-16  
**Scope:** Validation harness (Level 1 Schema + Level 2 Cross-Reference), CI pipeline, web UI harness integration  

---

## Objective

Close GAP-009 (no validation harness) and GAP-010 (no CI pipeline) from the M0 Gap Register. Deliver a standalone TypeScript CLI that validates any SOaC artifact against the schema contracts established in M1, and a GitHub Actions workflow that runs the harness on every push and pull request. Surface the expanded validation capabilities in the soacframe.io web platform.

---

## Deliverables

### 1. `tools/soac-harness/` — CLI Validation Harness

**Location:** `public/tools/soac-harness/`

| File | Purpose |
|---|---|
| `package.json` | Package manifest — name `@soac/harness`, version `0.1.0`, dependencies: `yaml`, `glob` |
| `tsconfig.json` | TypeScript config — strict mode, ES2020 target |
| `README.md` | Installation, usage, level descriptions, exit codes, CI integration guide |
| `src/types.ts` | Shared type definitions — `Kind`, `Finding`, `ValidationResult`, `TARGETS`, `SEVERITY_LEVELS`, `FAILURE_MODES`, `BANNED_PATTERNS` |
| `src/level1.ts` | Level 1 Schema Validation — structural checks for all four artifact kinds |
| `src/level2.ts` | Level 2 Cross-Reference Validation — semantic checks across artifact fields |
| `src/index.ts` | CLI entry point — argument parsing, YAML file walking, colored terminal output, JSON reporter |

**Validation Levels:**

| Level | Name | Checks | Gate Behavior |
|---|---|---|---|
| 1 | Schema | `apiVersion`, `kind`, required fields, enum constraints, structural integrity | L1 FAIL → L2 skipped |
| 2 | Cross-Reference | MITRE ID format (`T####.###`), `package_id` format (`pkg-NNN`), target enum membership, CRITICAL-severity rollback + brain oversight, implementation content, action list conflicts, artifact manifest presence | L2 FAIL → exit 1 |
| 3 | Replay | *(Reserved — Milestone 4)* | — |

**Supported Artifact Kinds:**

| Kind | L1 Validator | L2 Validator |
|---|---|---|
| `Playbook` | apiVersion, kind, metadata (name, severity, mitre_attack, package_id), spec (trigger, steps with target + action + failure_mode), rollback, governance | MITRE ID regex, package_id regex, step target enum, CRITICAL→rollback+brain_oversight |
| `DetectionRule` | apiVersion, kind, metadata, spec.logic (query_language, implementations), spec.tuning | MITRE ID regex, package_id regex, implementation content depth |
| `Policy` | apiVersion, kind, metadata (name, environment), spec (mode, data_handling, auth_required, actions, logging) | package_id regex, allowed/blocked action overlap |
| `PackageMetadata` | apiVersion, kind, package (id, name, version, status, pillar, description), threat.mitre_attack, artifacts | package.id regex, MITRE sub-field validation (technique_id + tactic), artifact manifest presence |

**CLI Interface:**

```
soac-harness validate --path <dir|file> [--level 1|2] [--format text|json]
```

- `--path` — Single YAML file or directory (recursive `**/*.yaml` walk)
- `--level` — Maximum validation level to execute (default: 2)
- `--format` — Output format: `text` (colored terminal) or `json` (machine-readable)
- Exit code 0 = all files pass; exit code 1 = one or more errors

### 2. `.github/workflows/soac-ci.yml` — CI Pipeline

**Location:** `public/.github/workflows/soac-ci.yml`

**Trigger:** Push or pull request to `main` branch.

**Pipeline Steps:**

1. Checkout repository
2. Setup Node.js 20
3. Install harness dependencies (`cd tools/soac-harness && npm ci`)
4. Run Level 1 + Level 2 validation against all packages (`npx ts-node src/index.ts validate --path ../../packages --level 2 --format json`)
5. Upload JSON results as workflow artifact (`soac-validation-report`)

**Closes:** GAP-010 (no CI pipeline).

### 3. Web UI — Expanded Validate Page

**File:** `app/validate/_components/schema-validator.tsx`

**Changes:**

| Feature | Before (M1) | After (M2) |
|---|---|---|
| Schema types | `claw`, `detection` | `claw`, `detection`, `policy`, `metadata` |
| Validation depth | L1 only | L1 + L2 (cross-reference) |
| Results display | Pass/fail | Pass/fail with L1/L2 harness-level badges |
| Sample templates | 4 (Playbook, Detection, Trigger, Intelligence) | 6 (+Environment Governance, +MTIP Package Metadata) |
| Schema dropdown | 2 buttons | 4 buttons rendered from `SCHEMA_LABELS` map |
| Result labels | Hardcoded "CLAW Playbooks" | Dynamic via `SCHEMA_LABELS` / `SCHEMA_FILENAMES` helpers |

**New Functions Added:**

- `validatePolicy()` — L1 schema validation for Policy artifacts (mode, data_handling, auth_required, actions, logging enums)
- `validateMetadata()` — L1 schema validation for PackageMetadata artifacts (package identity, threat mapping, artifact manifest)
- `runLevel2()` — Web-side L2 cross-reference validation (MITRE regex, package_id regex, target enum, severity escalation, implementation content, action conflicts, artifact references)

### 4. Docs Explorer & Downloads Catalog

**Docs Explorer** (`app/docs/_components/docs-explorer.tsx`):
- Added `tools/soac-harness` folder to the file tree with README.md, `src/` subfolder containing `types.ts`, `level1.ts`, `level2.ts`, `index.ts`, and `package.json`

**Downloads Catalog** (`app/downloads/_components/downloads-content.tsx`):
- Added `soac-harness` asset entry — CLI harness folder download
- Added `soac-ci-yml` asset entry — GitHub Actions workflow download
- Both placed in the "Start Here" pillar for discoverability

---

## Proof Logs

### PASS Run — Valid Playbook (L1 ✓, L2 ✓)

```
════════════════════════════════════════════════════════════
  SOaC Harness — Validation Report
  Level: 2 | Files: 1 | 2026-03-16T16:15:50.904Z
════════════════════════════════════════════════════════════

✅ test-fixtures/valid-playbook.yaml  [✓ L1] [✓ L2]  kind=Playbook
   No issues found.

════════════════════════════════════════════════════════════
  PASSED: 1  FAILED: 0  SKIPPED: 0
  Exit code: 0
════════════════════════════════════════════════════════════
```

### FAIL Run — Invalid Playbook (L1 ✗, L2 skipped)

```
════════════════════════════════════════════════════════════
  SOaC Harness — Validation Report
  Level: 2 | Files: 1 | 2026-03-16T16:15:56.670Z
════════════════════════════════════════════════════════════

❌ test-fixtures/invalid-playbook.yaml  [✗ L1] [- L2]  kind=unknown
   ❌ L1 ERROR  kind (line 2): Unknown kind "SomethingElse". Expected: Playbook, DetectionRule, Policy, PackageMetadata

════════════════════════════════════════════════════════════
  PASSED: 0  FAILED: 1  SKIPPED: 0
  Exit code: 1
════════════════════════════════════════════════════════════
```

### PASS Run — Valid Metadata (L1 ✓, L2 ✓ with warning)

```
════════════════════════════════════════════════════════════
  SOaC Harness — Validation Report
  Level: 2 | Files: 1 | 2026-03-16T16:16:02.104Z
════════════════════════════════════════════════════════════

✅ test-fixtures/valid-metadata.yaml  [✓ L1] [✓ L2]  kind=PackageMetadata
   ⚠️  L2 WARN   artifacts (line 17): Package metadata has no artifact references

════════════════════════════════════════════════════════════
  PASSED: 1  FAILED: 0  SKIPPED: 0
  Exit code: 0
════════════════════════════════════════════════════════════
```

### Full Directory Scan — JSON Output

```json
{
  "files": [
    {
      "file": "test-fixtures/invalid-playbook.yaml",
      "kind": null,
      "level1": "FAIL",
      "level2": "SKIP",
      "findings": [
        {
          "file": "test-fixtures/invalid-playbook.yaml",
          "line": 2,
          "field": "kind",
          "message": "Unknown kind \"SomethingElse\". Expected: Playbook, DetectionRule, Policy, PackageMetadata",
          "severity": "error",
          "level": 1
        }
      ]
    },
    {
      "file": "test-fixtures/valid-metadata.yaml",
      "kind": "PackageMetadata",
      "level1": "PASS",
      "level2": "PASS",
      "findings": [
        {
          "file": "test-fixtures/valid-metadata.yaml",
          "line": 17,
          "field": "artifacts",
          "message": "Package metadata has no artifact references",
          "severity": "warning",
          "level": 2
        }
      ]
    },
    {
      "file": "test-fixtures/valid-playbook.yaml",
      "kind": "Playbook",
      "level1": "PASS",
      "level2": "PASS",
      "findings": []
    }
  ],
  "totalFiles": 3,
  "passed": 2,
  "failed": 1,
  "skipped": 0,
  "maxLevel": 2,
  "timestamp": "2026-03-16T16:16:07.325Z",
  "exitCode": 1
}
```

---

## Gap Register Updates

| Gap ID | Description | Status Before M2 | Status After M2 |
|---|---|---|---|
| GAP-009 | No validation harness for SOaC artifacts | OPEN | **CLOSED** — `tools/soac-harness/` delivers L1+L2 CLI |
| GAP-010 | No CI pipeline | OPEN | **CLOSED** — `.github/workflows/soac-ci.yml` runs L1+L2 on push/PR |

---

## Files Changed (Summary)

| Action | Path | Description |
|---|---|---|
| ADD | `tools/soac-harness/package.json` | CLI package manifest |
| ADD | `tools/soac-harness/tsconfig.json` | TypeScript config |
| ADD | `tools/soac-harness/README.md` | Usage documentation |
| ADD | `tools/soac-harness/src/types.ts` | Shared types + enums |
| ADD | `tools/soac-harness/src/level1.ts` | Level 1 Schema Validation |
| ADD | `tools/soac-harness/src/level2.ts` | Level 2 Cross-Reference Validation |
| ADD | `tools/soac-harness/src/index.ts` | CLI entry point |
| ADD | `tools/soac-harness/test-fixtures/valid-playbook.yaml` | Test fixture — valid Playbook |
| ADD | `tools/soac-harness/test-fixtures/invalid-playbook.yaml` | Test fixture — invalid Playbook |
| ADD | `tools/soac-harness/test-fixtures/valid-metadata.yaml` | Test fixture — valid PackageMetadata |
| ADD | `.github/workflows/soac-ci.yml` | GitHub Actions CI pipeline |
| MOD | `app/validate/_components/schema-validator.tsx` | +Policy/Metadata schemas, +L2 validation, +harness badges |
| MOD | `app/docs/_components/docs-explorer.tsx` | +tools/soac-harness in file tree |
| MOD | `app/downloads/_components/downloads-content.tsx` | +harness + CI workflow in downloads catalog |

---

## Verification Checklist

- [x] `soac-harness validate --path <file> --level 2` exits 0 on valid artifacts
- [x] `soac-harness validate --path <file> --level 2` exits 1 on invalid artifacts
- [x] L1 failure gates L2 (L2 shows `SKIP` when L1 fails)
- [x] JSON output (`--format json`) produces machine-readable report
- [x] Web UI validates all 4 schema types (Playbook, Detection, Policy, Metadata)
- [x] Web UI displays L1/L2 harness-level badges in results panel
- [x] Harness appears in docs explorer file tree
- [x] Harness + CI workflow appear in downloads catalog
- [x] CI workflow targets `tools/soac-harness/` and scans `packages/` directory
- [x] No banned terms ("OpenCLAW", "Nervous System") in any changed file
- [x] Site builds and deploys to soacframe.io

---

## What's Next — Milestone 3 Preview

**M3: Package Manager + Lab Integration**
- `packages.json` registry with full artifact manifests
- Lab terminal integration with harness validation
- Package dependency resolution
- Lab scenario expansion for all 11 MTIP packages
