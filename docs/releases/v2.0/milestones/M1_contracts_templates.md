# Milestone 1 — Contracts & Global Templates

**Version:** v2.0  
**Status:** COMPLETE  
**Date:** 2026-03-16  
**Scope:** Schema contracts, naming standardization, lint enforcement, template surfacing  

---

## Objective

Establish a single source of truth for all SOaC artifact schemas. Every CLAW Playbook, Detection Rule, Policy-as-Code definition, and Package Metadata manifest must conform to versioned, machine-readable templates. Simultaneously, resolve naming inconsistencies and introduce automated guardrails against banned terminology.

---

## Deliverables

### 1. `core/templates/` — Global Schema Contracts

**Location:** `public/core/templates/`

| File | Purpose | Version |
|---|---|---|
| `claw_playbook_v1.0.yaml` | Canonical CLAW playbook structure — metadata, trigger, steps, rollback, governance | v1.0 |
| `detection_rule_v1.0.yaml` | Multi-platform detection rule schema — Splunk, Sentinel, CrowdStrike, Sigma | v1.0 |
| `policy_v1.0.yaml` | Policy-as-Code schema — environment constraints, action controls, compliance mapping | v1.0 |
| `metadata_v1.0.yaml` | Package metadata manifest — identity, MITRE coverage, artifact manifest, dependencies, validation | v1.0 |
| `README.md` | Template overview, usage guide, naming conventions, Four Pillars reference | — |

**Design Decisions:**

- All REQUIRED fields explicitly marked with inline comments.
- `target_type` enum standardized to `BODY | BRAIN | EDGE | INTERNAL` across all schemas.
- MITRE ATT&CK references embedded at schema level (tactics + techniques arrays).
- `package_id` uses `MTIP-NNN` format as cross-referencing key.
- Version follows `MAJOR.MINOR` — breaking changes increment MAJOR.
- Templates placed in `public/` for static-file accessibility (direct download, raw linking).

### 2. GAP-016 — Naming Standardization

**Change:** All references to "The Nervous System" replaced with "The Edge" across the entire codebase.

**Files Modified (12):**

| File | Change |
|---|---|
| `app/components/architecture-overview.tsx` | Pillar label |
| `app/components/landing-hero.tsx` | Hero grid pillar title |
| `app/lab/_components/lab-terminal.tsx` | Phase info label |
| `app/lab/_components/lab-graph.tsx` | Graph node label |
| `app/about/_components/about-content.tsx` | Principles description |
| `app/docs/page.tsx` | Architecture reference description |
| `data/scenarios.json` | 2× dispatch messages |
| `public/04_The_Nervous_System_Edge/edge_api_spec_v1.md` | Document header |
| `public/docs/technical/edge_api_spec_v1.md` | Document header |
| `public/docs/specs/claw_playbook_schema_v1.0.md` | Lifecycle step reference |
| `public/02_The_Purpose_CLAW_Engine/claw_schema_v1.md` | Lifecycle step reference |
| `scripts/generate-claw-pdf.ts` | 2× internal references |

**Note:** The directory `public/04_The_Nervous_System_Edge/` was intentionally NOT renamed to preserve existing external links. Content inside is updated.

**Verification:** Codebase grep confirms zero live references to "The Nervous System" outside historical documentation (`M0_snapshot.md`).

### 3. GAP-017 — Banned Term Lint

**Implementation:** `lib/banned-terms.ts`

**Banned Patterns (case-insensitive):**

| Pattern | Regex | Rationale |
|---|---|---|
| OpenCLAW | `/openclaw/gi` | Project rebranded — term must never appear |
| Open-CLAW | `/open[\-\s]?claw/gi` | Hyphenated/spaced variants |
| open_claw | `/open_claw/gi` | Underscore variant |

**Integration Point:** `app/validate/_components/schema-validator.tsx`

- Banned-term scan runs after schema-specific validation.
- Violations reported as errors with line numbers and context snippets.
- Any banned term detection forces `valid = false` on the entire validation result.
- Exported functions: `scanForBannedTerms()`, `containsBannedTerms()`, `getBannedTermLabels()`.

### 4. GAP-005 Prep — Metadata Schema

The `metadata_v1.0.yaml` template defines the canonical structure for `package.yaml` / `metadata.yml` files that every MTIP must include. Key sections:

- **Package Identity:** `package_id`, `title`, `version`, `classification`, `pillar`, `status`
- **Threat Coverage:** `mitre_attack` mapping (tactics → techniques)
- **Artifact Manifest:** Detection rules, CLAW playbooks, policies, simulations — each with `file`, `format`, `platform`, `status`
- **Stakeholders:** Owner, contributors, reviewers with roles and contact
- **Signals:** Coverage score, confidence, data sources, environments
- **Dependencies:** Required packages, external feeds, platform requirements
- **Validation:** Schema version, last validated timestamp, harness level, evidence bundle reference

**Note:** Full enforcement of `metadata.yml` per-package is deferred to M3 (Package Standardization).

### 5. Templates Surfaced on soacframe.io

**Docs Explorer** (`/docs`):
- New `core/templates` folder node added to the file tree with 5 children.
- Each template entry includes condensed content preview and GitHub `repoPath` for source linking.

**Downloads Catalog** (`/downloads`):
- 4 new template entries under the "Start Here" pillar:
  - CLAW Playbook Template v1.0
  - Detection Rule Template v1.0
  - Policy-as-Code Template v1.0
  - Package Metadata Template v1.0
- All entries link to `${GH_BLOB}/core/templates/...` for download.

---

## Gap Register Update

| Gap ID | Title | M1 Status |
|---|---|---|
| GAP-005 | Missing metadata.yml per package | PREP COMPLETE — schema defined, enforcement deferred to M3 |
| GAP-008 | No global templates or schema contracts | **CLOSED** |
| GAP-016 | "The Nervous System" naming inconsistency | **CLOSED** |
| GAP-017 | No banned term enforcement | **CLOSED** |

---

## Files Added

```
public/core/templates/README.md
public/core/templates/claw_playbook_v1.0.yaml
public/core/templates/detection_rule_v1.0.yaml
public/core/templates/policy_v1.0.yaml
public/core/templates/metadata_v1.0.yaml
lib/banned-terms.ts
docs/releases/v2.0/milestones/M1_contracts_templates.md   ← this file
```

## Files Modified

```
app/components/architecture-overview.tsx
app/components/landing-hero.tsx
app/lab/_components/lab-terminal.tsx
app/lab/_components/lab-graph.tsx
app/about/_components/about-content.tsx
app/docs/page.tsx
app/docs/_components/docs-explorer.tsx
app/downloads/_components/downloads-content.tsx
app/validate/_components/schema-validator.tsx
data/scenarios.json
public/04_The_Nervous_System_Edge/edge_api_spec_v1.md
public/docs/technical/edge_api_spec_v1.md
public/docs/specs/claw_playbook_schema_v1.0.md
public/02_The_Purpose_CLAW_Engine/claw_schema_v1.md
scripts/generate-claw-pdf.ts
```

---

## Verification Checklist

- [x] All 5 templates parse as valid YAML
- [x] Zero live references to "The Nervous System" (verified via codebase grep)
- [x] Banned-term lint triggers on `OpenCLAW` / `Open-CLAW` / `open_claw` in validator
- [x] Templates visible in Docs Explorer file tree
- [x] Templates listed in Downloads Catalog under "Start Here"
- [x] Site builds without errors
- [x] Deployed to soacframe.io

---

## Next Milestone

**M2 — SOaC-Harness CLI** — Level 1 & 2 validation engine, CI/CD integration, harness status tracking.

Awaiting explicit approval to proceed.
