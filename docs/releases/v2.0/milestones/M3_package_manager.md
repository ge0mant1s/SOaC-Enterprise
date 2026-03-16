# Milestone 3 — Package Manager + Lab Integration

**Status:** Complete  
**Date:** 2026-03-16  
**Tag:** `v2.0-M3`  
**Scope:** Unify the package registry, bring all 11 MTIPs to contract compliance, expand lab scenarios and CI coverage.

---

## Objectives Delivered

### 1. Unified Package Registry (`data/packages.json`)

- Expanded from 5 → 11 entries covering all SOaC Modular Threat Intelligence Packages.
- Single-source registry consumed by: Downloads page, Packages page, Lab scenario gallery, Lab container.
- Removed hardcoded duplication from `downloads-content.tsx` — now derives all 11 package cards from the registry via a mapping layer (`stakeholders` → audience labels, `summary` → description, `repo_path` → GitHub folder).

### 2. Contract-Compliant Artifacts (`public/packages/{001–011}/`)

Every package directory now contains four validated artifacts:

| Artifact | Kind | apiVersion | Validation |
|---|---|---|---|
| `metadata.yml` | PackageMetadata | soac.io/v1 | L1 + L2 |
| `detection.yaml` | DetectionRule | soac.io/v1 | L1 + L2 |
| `playbook.yaml` | Playbook | claw.soac.io/v1 | L1 + L2 |
| `policy.yaml` | Policy | soac.io/v1 | L1 + L2 |

All artifacts pass SOaC Harness Level 1 (schema) and Level 2 (cross-reference) validation:
- MITRE IDs match `T####(.###)?` format
- Package IDs match `pkg-NNN` format
- CRITICAL-severity playbooks include rollback steps and `governance.requires_brain_oversight: true`
- Detection implementations contain >10-character Sigma rule content
- No banned terms (the framework formerly known by a banned name)

### 3. Lab Scenarios for pkg-006 through pkg-011 (`data/scenarios.json`)

Six new interactive terminal scenarios added (12 total: general + pkg-001 through pkg-011):

| Package | Scenario | Steps | Threat Actor |
|---|---|---|---|
| pkg-006 | EvilProxy Credential Harvest | 76 | EvilProxy threat group |
| pkg-007 | SolarStorm Cloud Privilege Escalation | 64 | SolarStorm APT |
| pkg-008 | BlueRelay Lateral Movement Campaign | 63 | BlueRelay operators |
| pkg-009 | DarkVault Data Exfiltration | 62 | DarkVault syndicate |
| pkg-010 | GhostBin LOLBins Evasion Chain | 63 | GhostBin collective |
| pkg-011 | Midnight Raven Insider Threat | 65 | Insider actor (Midnight Raven) |

Each scenario follows the 4-phase structure: Body → Brain → Purpose → Edge.

### 4. ZIP Bundles for pkg-006 through pkg-011 (`public/downloads/packages/`)

- Created `pkg-006.zip` through `pkg-011.zip` containing all four contract-compliant artifacts each.
- All 11 ZIP bundles now available for download via the Downloads page.

### 5. CI Expansion (`.github/workflows/soac-ci.yml`)

- Added `packages/**` to path triggers (push + PR).
- New CI step: "Validate package artifacts" — runs harness Level 1 + Level 2 against all YAML/YML files under `packages/`.
- Updated header comments from "M2 strategy" to "M3 strategy".

---

## Files Changed

### New Files (50 total)

| Path | Description |
|---|---|
| `public/packages/001/metadata.yml` | Package 001 metadata |
| `public/packages/001/detection.yaml` | Package 001 detection rule |
| `public/packages/001/playbook.yaml` | Package 001 CLAW playbook |
| `public/packages/001/policy.yaml` | Package 001 policy |
| `public/packages/002/metadata.yml` | Package 002 metadata |
| `public/packages/002/detection.yaml` | Package 002 detection rule |
| `public/packages/002/playbook.yaml` | Package 002 CLAW playbook |
| `public/packages/002/policy.yaml` | Package 002 policy |
| `public/packages/003/metadata.yml` | Package 003 metadata |
| `public/packages/003/detection.yaml` | Package 003 detection rule |
| `public/packages/003/playbook.yaml` | Package 003 CLAW playbook |
| `public/packages/003/policy.yaml` | Package 003 policy |
| `public/packages/004/metadata.yml` | Package 004 metadata |
| `public/packages/004/detection.yaml` | Package 004 detection rule |
| `public/packages/004/playbook.yaml` | Package 004 CLAW playbook |
| `public/packages/004/policy.yaml` | Package 004 policy |
| `public/packages/005/metadata.yml` | Package 005 metadata |
| `public/packages/005/detection.yaml` | Package 005 detection rule |
| `public/packages/005/playbook.yaml` | Package 005 CLAW playbook |
| `public/packages/005/policy.yaml` | Package 005 policy |
| `public/packages/006/metadata.yml` | Package 006 metadata |
| `public/packages/006/detection.yaml` | Package 006 detection rule |
| `public/packages/006/playbook.yaml` | Package 006 CLAW playbook |
| `public/packages/006/policy.yaml` | Package 006 policy |
| `public/packages/007/metadata.yml` | Package 007 metadata |
| `public/packages/007/detection.yaml` | Package 007 detection rule |
| `public/packages/007/playbook.yaml` | Package 007 CLAW playbook |
| `public/packages/007/policy.yaml` | Package 007 policy |
| `public/packages/008/metadata.yml` | Package 008 metadata |
| `public/packages/008/detection.yaml` | Package 008 detection rule |
| `public/packages/008/playbook.yaml` | Package 008 CLAW playbook |
| `public/packages/008/policy.yaml` | Package 008 policy |
| `public/packages/009/metadata.yml` | Package 009 metadata |
| `public/packages/009/detection.yaml` | Package 009 detection rule |
| `public/packages/009/playbook.yaml` | Package 009 CLAW playbook |
| `public/packages/009/policy.yaml` | Package 009 policy |
| `public/packages/010/metadata.yml` | Package 010 metadata |
| `public/packages/010/detection.yaml` | Package 010 detection rule |
| `public/packages/010/playbook.yaml` | Package 010 CLAW playbook |
| `public/packages/010/policy.yaml` | Package 010 policy |
| `public/packages/011/metadata.yml` | Package 011 metadata |
| `public/packages/011/detection.yaml` | Package 011 detection rule |
| `public/packages/011/playbook.yaml` | Package 011 CLAW playbook |
| `public/packages/011/policy.yaml` | Package 011 policy |
| `public/downloads/packages/pkg-006.zip` | ZIP bundle for pkg-006 |
| `public/downloads/packages/pkg-007.zip` | ZIP bundle for pkg-007 |
| `public/downloads/packages/pkg-008.zip` | ZIP bundle for pkg-008 |
| `public/downloads/packages/pkg-009.zip` | ZIP bundle for pkg-009 |
| `public/downloads/packages/pkg-010.zip` | ZIP bundle for pkg-010 |
| `public/downloads/packages/pkg-011.zip` | ZIP bundle for pkg-011 |

### Modified Files (4 total)

| Path | Change |
|---|---|
| `data/packages.json` | Expanded from 5 → 11 packages |
| `data/scenarios.json` | Expanded from 6 → 12 scenarios (added pkg-006 through pkg-011) |
| `app/downloads/_components/downloads-content.tsx` | Replaced hardcoded packages array with import from registry |
| `public/.github/workflows/soac-ci.yml` | Added `packages/**` triggers + package artifact validation step |

---

## Gap Register Updates

| Gap ID | Description | Status |
|---|---|---|
| GAP-011 | Packages 006–011 missing from registry | **CLOSED** — all 11 in `data/packages.json` |
| GAP-012 | No contract-compliant artifacts for any package | **CLOSED** — all 44 artifacts pass L1 + L2 |
| GAP-013 | Lab scenarios missing for pkg-006 through pkg-011 | **CLOSED** — 6 new scenarios added |
| GAP-014 | ZIP bundles missing for pkg-006 through pkg-011 | **CLOSED** — 6 ZIPs created |
| GAP-015 | Downloads page has hardcoded package duplication | **CLOSED** — now imports from registry |
| GAP-018 | CI does not validate package artifacts | **CLOSED** — `packages/**` trigger + validation step added |

---

## Verification Checklist

- [x] `data/packages.json` contains exactly 11 entries (pkg-001 through pkg-011)
- [x] `data/scenarios.json` contains 12 scenarios (general + pkg-001 through pkg-011)
- [x] All 44 package artifacts exist under `public/packages/{001–011}/`
- [x] All artifacts conform to M1 template schemas (correct apiVersion, kind, required fields)
- [x] CRITICAL playbooks have rollback + brain oversight
- [x] Detection rules have Sigma implementations >10 chars
- [x] No banned terms in any artifact
- [x] 11 ZIP bundles exist under `public/downloads/packages/`
- [x] `downloads-content.tsx` imports from `data/packages.json` (no hardcoded packages array)
- [x] CI workflow triggers on `packages/**` changes
- [x] CI workflow includes package artifact validation step
- [x] Web platform builds without errors
- [x] Deployed to soacframe.io

---

## What M3 Does NOT Include (Deferred to M4+)

- Deep detection engineering (real vendor-specific rules beyond Sigma stubs)
- Replay logic or simulation engine
- Package versioning or dependency resolution
- Cross-package correlation rules
