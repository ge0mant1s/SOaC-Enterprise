# SOaC-Enterprise v2.0 — Milestone Sync Protocol (PROCESS)

**Status:** Mandatory process for milestones M0–M7

This document defines the *non-negotiable* milestone execution and synchronization process for the SOaC-Enterprise v2.0 program. The goal is to ensure the **GitHub repository** and **soacframe.io** remain consistent, versioned, auditable, and communication-ready at every step.

## 1) Definitions

### 1.1 Source of truth
- **GitHub repository** is the source of truth for all artifacts, tools, schemas, and package content.
- **soacframe.io** is the evidence, learning, and collaboration surface that renders content derived from GitHub artifacts and CI outputs.

### 1.2 What “Milestone Complete” means
A milestone is only considered **COMPLETE** when **all** of the following are true:
1. **soacframe.io deployed** (only if that milestone includes website changes).
2. **GitHub repo updated** (all code/docs/templates/tools committed).
3. **Milestone record saved in repo** at:
   - `docs/releases/v2.0/milestones/M{N}_{slug}.md`

Additionally, create a **Git tag** per milestone:
- `v2.0-M0`, `v2.0-M1`, `v2.0-M2`, …

## 2) Mandatory Milestone Output Bundle (what DeepAgent must produce)
At the end of **every** milestone, DeepAgent must output a "Milestone Output Bundle" containing:

### A) Repo Patch List
A precise list of:
- Files created/modified
- Exact intended repository paths
- Whether each file is **required** for release

### B) Copy/Paste Payloads (no ambiguity)
For every file that needs to be pushed to GitHub, DeepAgent must provide:
- The **full content** of the file
- The **intended path**
- Any migration notes (renames, deprecated files, compatibility shims)

### C) Verification Checklist
Commands or steps to confirm, at minimum:
- Site builds and runs (if applicable)
- Tests pass (unit/integration where present)
- Validation/harness checks pass

### D) Release Comms Kit
- Website release notes snippet (for the site changelog / “What’s New”)
- LinkedIn post draft
- Screenshot/visual capture plan

## 3) Governance Gate (hard stop)
DeepAgent must not proceed to the next milestone until the project owner explicitly confirms:
1. The GitHub repo has been updated with the milestone patch.
2. CI is green (when CI exists for that milestone).
3. The milestone record has been saved in `docs/releases/v2.0/milestones/`.

## 4) Per-milestone record template (required fields)
Each milestone record (`M{N}_{slug}.md`) must include:
- Executive summary
- Scope
- Files changed (paths)
- Design decisions and rationale
- Acceptance criteria checklist
- Validation results (logs, screenshots, CI links)
- Known issues / risk register updates
- Next milestone prerequisites
- Release notes snippet
- LinkedIn draft
- Visual plan

## 5) Special requirements for Milestone 2 (SOaC-Harness Level 1 & 2)
Milestone 2 introduces tooling that must live in GitHub and run in CI.

### 5.1 Required GitHub pushes for M2
M2 is not complete unless the following are committed:
1. `tools/soac-harness/` (new CLI + schema loader + validators)
2. `.github/workflows/soac-ci.yml` (PR checks)
3. Documentation:
   - `docs/harness/` (how to run locally)
4. Milestone record:
   - `docs/releases/v2.0/milestones/M2_harness_level1_level2.md`

### 5.2 Required “proof of completion” for M2
M2 must include demonstrable evidence of correctness:
- One PR/branch where CI runs the harness and **fails** on intentionally non-compliant content
- One PR/branch where CI runs the harness and **passes** on compliant content
- Harness outputs are deterministic and include machine-readable output (JSON) and human-readable summary (Markdown)

### 5.3 Required website update for M2 (minimal)
Even if the harness is repo-first, the website must reflect it:
- `/validate` must clearly indicate validation is powered by **soac-harness** (Level 1/2)
- `/docs` must include Harness CLI documentation and usage examples
- A release notes snippet must be published

## 6) Contribution readiness (community PR safety)
Once CI is active, the process must support outside contributions:
- PR checks must block merges when contracts fail
- Templates must be referenced in contributor docs
- Naming and banned-term lint must run in CI

## 7) Change control
Default policy is **additive-only** changes.
- Any rename/move must include backward compatibility or explicit migration notes.
- No destructive DB migrations in v2.0 (no dropping columns/tables on shared environments).

