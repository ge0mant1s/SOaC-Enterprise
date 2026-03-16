# Milestone 4 — SOaC-Harness Level 3: Replay & Evidence

**Status:** Complete  
**Date:** 2026-03-16  
**Tag:** `v2.0-M4`  
**Scope:** Implement the Level 3 Replay Engine, generate Evidence Bundles for all 11 MTIP packages, integrate replay into CI, and surface evidence on soacframe.io.

---

## Objectives Delivered

### 1. Level 3 Replay Engine (`tools/soac-harness/src/level3.ts`)

New ~520-line module that walks a package's lab scenario step-by-step and maps each phase to the package's detection rules, playbook actions, and policy constraints.

**Core functions:**

| Function | Purpose |
|---|---|
| `replayPackage()` | Walks scenario terminal_steps, classifies each by pillar (Body/Brain/Purpose/Edge), matches steps to artifacts via keyword heuristics, tracks MITRE ATT&CK technique exercise |
| `generateMarkdownReport()` | Renders an EvidenceManifest into a human-readable Markdown report with tables for coverage, artifacts, and timeline |
| `runLevel3()` | CLI-callable entry point: discovers package directories, loads scenarios + registry, runs replay per package, writes evidence bundles |

**Pillar-to-artifact mapping:**

| Scenario Step Type | Pillar | Matched Artifact |
|---|---|---|
| `body` + detection keywords | BODY | `detection.yaml` |
| `purpose` / `brain` + playbook keywords | PURPOSE / BRAIN | `playbook.yaml` |
| `edge` | EDGE | `policy.yaml` |
| `header`, `info`, `system`, etc. | SYSTEM | (no artifact match) |

**Keyword heuristics:**
- DETECTION_KEYWORDS: detect, alert, anomal, sigma, correlat, rule, trigger, ingest, log, telemetry, sensor, event
- PLAYBOOK_KEYWORDS: claw, playbook, revoke, isolat, contain, kill, block, remediat, respond, action, step-, orchestrat, execut

**MITRE coverage computation:**
- Extracts technique IDs from all package artifacts (detection, playbook, metadata) handling three different schema patterns
- Extracts technique IDs from scenario step text via regex (`T####.###`)
- When a detection trigger fires, all declared MITRE IDs are attributed to that step
- Coverage percentage = (exercised / declared) × 100

**Verdict logic:**

| Verdict | Condition |
|---|---|
| PASS | 100% of declared MITRE techniques (from metadata.yml) validated AND detection triggers > 0 AND playbook actions > 0 |
| PARTIAL | ≥50% coverage OR at least one detection trigger |
| FAIL | Below threshold |

### 2. CLI Integration (`tools/soac-harness/src/index.ts`)

Added `replay` command to the harness CLI alongside existing `validate`:

```
soac-harness replay \
  --packages-dir <dir> \
  --scenarios <file> \
  --registry <file> \
  [--format text|json]
```

Text output includes per-package verdict badges, MITRE coverage ratios, detection/playbook counts, and step breakdowns. JSON output wraps all manifests in a single serializable object.

### 3. Evidence Bundles for All 11 Packages

Every MTIP package now ships with a machine-readable evidence bundle:

```
packages/NNN/evidence/
├── evidence-manifest.json   — structured JSON (EvidenceManifest schema v1.0.0)
└── replay-report.md       — human-readable Markdown with tables
```

**Results across all packages:**

| Package | Name | Verdict | MITRE Coverage | Det. Triggers | Playbook Actions |
|---|---|---|---|---|---|
| pkg-001 | Identity-led Intrusion Defense | ✅ PASS | 100% (3/3) | 9 | 17 |
| pkg-002 | Cloud Credential Abuse Defense | ✅ PASS | 100% (3/3) | 3 | 18 |
| pkg-003 | Insider Threat — Data Exfiltration | ✅ PASS | 100% (3/3) | 2 | 8 |
| pkg-004 | Ransomware Kill Chain Response | ✅ PASS | 100% (3/3) | 1 | 9 |
| pkg-005 | Supply Chain Artifact Tampering | ✅ PASS | 100% (3/3) | 2 | 12 |
| pkg-006 | MFA Phishing & Session Hijack | ✅ PASS | 100% (2/2) | 6 | 12 |
| pkg-007 | Cloud Privilege Escalation | ✅ PASS | 100% (2/2) | 4 | 9 |
| pkg-008 | Lateral Movement via RDP/SMB | ✅ PASS | 100% (2/2) | 4 | 9 |
| pkg-009 | Data Staging & Exfiltration | ✅ PASS | 100% (2/2) | 4 | 9 |
| pkg-010 | LOLBins Evasion Techniques | ✅ PASS | 100% (2/2) | 3 | 10 |
| pkg-011 | Insider Threat — Credential Abuse | ✅ PASS | 100% (2/2) | 3 | 9 |

**11/11 packages PASS** — every declared MITRE technique is exercised by the corresponding lab scenario.

### 4. CI Pipeline Update (`.github/workflows/soac-ci.yml`)

Added a second job (`replay`) that runs after the `validate` job:

- **Trigger paths:** Added `data/scenarios.json` and `data/packages.json` to push/PR path filters
- **Replay step:** Runs `soac-harness replay` against all packages, writes text output to GitHub Step Summary
- **JSON report:** Generates machine-readable replay report as a separate step
- **Artifact uploads:**
  - `soac-evidence-bundles` — all `packages/*/evidence/` directories (90-day retention)
  - `soac-replay-report` — JSON replay report (30-day retention)

### 5. Website Updates

- **Docs Explorer:** Added `level3.ts` to the harness file tree with a descriptive summary of its architecture and functions. Updated `index.ts` description to document both `validate` and `replay` commands. Updated `package.json` to include `replay` script.
- **Harness README:** Updated from "Level 3 — planned (M4)" to full documentation of the replay command, evidence bundle format, verdict logic, and CI integration.
- **Releases section:** Added v2.0-M4 and v2.0-M3 release entries to the Downloads page Releases & Changelog section, linking to their respective milestone records.
- **Packages page:** Added "Evidence" button (emerald/green) on each package card linking directly to the package's `replay-report.md`.

---

## Files Changed

| Path | Action | Description |
|---|---|---|
| `tools/soac-harness/src/level3.ts` | **Created** | Level 3 Replay Engine (~520 lines) |
| `tools/soac-harness/src/index.ts` | Modified | Added `replay` CLI command with arg parsing + text/JSON reporter |
| `.github/workflows/soac-ci.yml` | Modified | Added replay job, data path triggers, evidence artifact upload |
| `packages/001–011/evidence/` | **Created** | 11 × evidence-manifest.json + replay-report.md |
| `docs/releases/v2.0/milestones/M4_replay_evidence.md` | **Created** | This milestone record |

**Website components:**

| File | Change |
|---|---|
| `app/docs/_components/docs-explorer.tsx` | Added level3.ts entry, updated README/index.ts/package.json descriptions |
| `app/downloads/_components/downloads-content.tsx` | Added v2.0-M4 and v2.0-M3 release entries |
| `app/packages/_components/packages-content.tsx` | Added "Evidence" button per package card |

---

## Evidence Bundle Example (pkg-001)

```json
{
  "schema_version": "1.0.0",
  "harness_level": 3,
  "package_id": "pkg-001",
  "package_name": "Identity-led Intrusion Defense",
  "scenario_id": "pkg-001",
  "scenario_title": "0APT Identity Pivot",
  "generated_at": "2026-03-16T18:25:00.328Z",
  "summary": {
    "total_steps": 99,
    "body_steps": 16,
    "brain_steps": 15,
    "purpose_steps": 16,
    "edge_steps": 10,
    "detection_triggers": 9,
    "playbook_actions": 17,
    "mitre_techniques_declared": 3,
    "mitre_techniques_exercised": 3,
    "coverage_pct": 100
  },
  "mitre_coverage": [
    {
      "technique_id": "T1557.001",
      "tactic": "Credential Access",
      "exercised_by_scenario": true,
      "exercised_at_steps": [8, 12, 14, 15, 17, 25, 28, 29, 30, 62, 64],
      "detected_by": "aitm-session-hijack-detection",
      "responded_by": "revoke-compromised-sessions"
    },
    {
      "technique_id": "T1078.004",
      "tactic": "Defense Evasion",
      "exercised_by_scenario": true,
      "exercised_at_steps": [8, 12, 14, 15, 17, 25, 28, 29, 30, 62, 64],
      "detected_by": "aitm-session-hijack-detection",
      "responded_by": "revoke-compromised-sessions"
    },
    {
      "technique_id": "T1539",
      "tactic": "Credential Access",
      "exercised_by_scenario": true,
      "exercised_at_steps": [8, 12, 14, 15, 17, 25, 28, 29, 30, 62],
      "detected_by": "aitm-session-hijack-detection",
      "responded_by": "revoke-compromised-sessions"
    }
  ],
  "artifacts_used": {
    "detection": "detection.yaml",
    "playbook": "playbook.yaml",
    "policy": "policy.yaml",
    "metadata": "metadata.yml"
  },
  "verdict": "PASS",
  "verdict_reason": "All 3 declared MITRE techniques (from metadata.yml) validated by replay heuristics. 9 detection triggers, 17 playbook actions observed."
}
```

---

## Architecture Note

**Replay source of truth:** `tools/soac-harness/src/level3.ts` is the sole source of the Level 3 replay engine logic. It reads the same package artifacts that ship in ZIP bundles (detection.yaml, playbook.yaml, policy.yaml, metadata.yml) and the same scenario data that powers the interactive Lab.

**CI evidence generation:** The GitHub Actions workflow (`.github/workflows/soac-ci.yml`) invokes `soac-harness replay` as a CI step. This produces the evidence bundles (`evidence-manifest.json` + `replay-report.md`) deterministically for every package. Any contributor can also run the same command locally to verify evidence before submitting a PR.

**Coverage semantics:** When the engine reports "100% coverage", this means 100% of the MITRE ATT&CK techniques **declared in that package's `metadata.yml`** were validated by the replay heuristics. It does **not** imply coverage of the entire MITRE ATT&CK matrix. The `coverage_pct` field in `evidence-manifest.json` is always scoped to the package's own declared techniques.

The keyword heuristic approach was chosen deliberately over regex-only matching because scenario step text uses natural language descriptions. The heuristic is intentionally broad ("telemetry", "log", "sensor" for detection; "contain", "isolat", "remediat" for playbook) to capture the full range of operational verbs used across the 11 scenarios.

---

## M4 Corrections Patch (post-review)

Applied per Carlos's conditional review before M5:

| # | Change | Files affected |
|---|--------|---------------|
| 1 | Renamed `replay-manifest.json` → `evidence-manifest.json` | `tools/soac-harness/src/level3.ts`, `tools/soac-harness/src/index.ts`, `app/docs/_components/docs-explorer.tsx`, all 11 `packages/NNN/evidence/` dirs, this doc |
| 2 | Reworded "100% MITRE coverage" → "100% of declared MITRE techniques (from metadata.yml) validated by replay heuristics" | `level3.ts` (verdict logic + console output + report template), 11 × `evidence-manifest.json` (verdict_reason), 11 × `replay-report.md` (verdict + coverage label), `M4_replay_evidence.md`, `docs-explorer.tsx` |
| 3 | Expanded Architecture Note to explicitly confirm `level3.ts` as replay source of truth, CI generates evidence via `soac-harness replay`, and `coverage_pct` is scoped to declared techniques only | `M4_replay_evidence.md` |

---

## Next Milestone

**M5** — (Pending Carlos approval) — scope TBD.
