# OpenSSF Scorecard — roadmap to ≥ 8.0

Aggregate at last scan (2026-10-13): **7.4**. That scan predates the v2.1.0
release. Target: **≥ 8.0**.

Scorecard aggregates per-check scores by risk weight (Critical 10, High 7.5,
Medium 5, Low 5). Levers below are ordered by return on effort for a **solo
maintainer** (no second human reviewer available).

| # | Lever | Check (weight) | Now → target | Owner action | Est. aggregate |
|---|-------|----------------|--------------|--------------|----------------|
| 0 | **Neutralize release drag** | Signed-Releases (High) | −1 → 9 | Activate `release-signing.yml`, re-publish v2.1.0 | prevents a drop to ~6.7 |
| 1 | Best Practices badge rescan | CII-Best-Practices (Low) | 0 → 5 | none (automatic on next scan) | ~7.6 |
| 2 | Hash-pin dependencies | Pinned-Dependencies (Med) | 7 → 10 | merge PR #88 | ~7.8 |
| 3 | Sign releases | Signed-Releases (High) | → 9 | lever 0 | ~7.9 |
| 4 | **Continuous fuzzing** | Fuzzing (Med) | 0 → 10 | activate ClusterFuzzLite workflows | **~8.3** |
| 5 | Harden branch protection | Branch-Protection (High) | 4 → ~6 | admin PAT recipe (report 17) | ~8.5 |

Crossing 8.0 requires lever 4 (fuzzing) on top of 1–3; levers 0 and 5 add margin.

## What is in this repo now (staged, needs owner to activate)
- `.clusterfuzzlite/` + `tools/soac-harness/fuzz/` — working Jazzer.js fuzzing
  (verified locally: 200k runs, 0 crashes). Scorecard's Fuzzing check detects
  ClusterFuzzLite once the workflows are live.
- `patches/workflows/clusterfuzzlite-pr.yml`, `clusterfuzzlite-batch.yml` — copy
  into `.github/workflows/` to run fuzzing in CI.
- `patches/workflows/release-signing.yml` — copy into `.github/workflows/`, then
  re-publish v2.1.0 (or cut v2.1.1) so release artifacts are cosign-signed with
  SLSA provenance.

## The solo-maintainer ceiling (be realistic)
- **Code-Review (High, score 0)** and the **top Branch-Protection tiers** require
  a *different human* to approve PRs. They cannot be raised without a second
  trusted collaborator (fabricating one is off the table). Branch protection can
  still reach ~6 via admin enforcement + required status checks while staying
  mergeable by you.
- **Packaging (−1)** only scores if you publish to a package registry (e.g. npm);
  optional.

All tooling referenced here is free and open source.
