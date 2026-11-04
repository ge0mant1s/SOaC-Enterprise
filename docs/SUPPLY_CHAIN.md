# Supply-Chain Security

This document summarizes how SOaC-Enterprise manages software supply-chain risk
and transparency. It is the single reference behind the claims in `SECURITY.md`,
`security-insights.yml`, and the project's Security Slam / CRA readiness evidence.

All tooling described here is **free and open source** or built into GitHub.

## What ships, and what has dependencies

- The detection/response **content packages** (`packages/NNN_*`) are data — YAML/JSON
  rules, playbooks, policies, and Markdown docs. They have no third-party runtime
  dependency tree.
- The only managed dependency tree in the repository is the **Node.js validation
  harness** (`tools/soac-harness`), used in CI to validate packages.

## Controls in place

| Control | Implementation | Status |
| --- | --- | --- |
| Pinned CI actions | All GitHub Actions pinned to full commit SHA | Active on `main` |
| Least-privilege CI | `permissions: read-all` default, per-job elevation | Active on `main` |
| Dependency updates | Dependabot version updates (Actions + npm) | Active |
| Security updates | Dependabot security updates + vulnerability alerts | Active |
| Static analysis | CodeQL (JS/TS + Python) | Active |
| Posture scoring | OpenSSF Scorecard, published to public API | Active |
| Secret hygiene | Secret scanning + push protection | Active |
| Private disclosure | GitHub Private Vulnerability Reporting | Active |
| SBOM (CycloneDX) | `npm sbom` committed under `sbom/`, CI freshness gate | Committed; automation staged |
| SBOM (SPDX) | GitHub dependency-graph native export | Available |
| SBOM attestation | `actions/attest-sbom` (OIDC, SLSA/in-toto) on release | Staged |
| Pre-merge dep review | `actions/dependency-review-action`, fail on HIGH+ | Staged |

> "Staged" items are provided as `patches/workflows/*.yml` and activate when
> copied to `.github/workflows/` (adding workflow files requires Workflows write
> access). Once applied they run in CI like the others.

## SBOM

See [`sbom/README.md`](../sbom/README.md). Summary:

- **CycloneDX 1.5** SBOM for the harness is committed and kept current by a CI
  freshness check that fails if a dependency change is not reflected.
- **SPDX** SBOM for the whole repo is available on demand from the GitHub
  dependency graph (`Insights → Dependency graph → Export SBOM`, or
  `GET /repos/ge0mant1s/SOaC-Enterprise/dependency-graph/sbom`).
- On release, the harness is packed and the SBOM is **attested** so the
  artifact ↔ SBOM binding is independently verifiable:
  `gh attestation verify <artifact> --repo ge0mant1s/SOaC-Enterprise`.

## Vulnerability handling

1. Dependabot / `npm audit` / Dependency Review surface advisories.
2. If a fixed version exists, we upgrade. If **no upstream fix exists**, we
   remove the vulnerable component by changing the dependency path (e.g. an npm
   `override`, or upgrading the parent that pulled it in).
3. Fixes land through a reviewed pull request with CI green.
4. If the vulnerability affects downstream users, we publish a GitHub Security
   Advisory (see `SECURITY.md` → *Security advisories & notifications*).

Current harness status: `npm audit` reports **0 known vulnerabilities** on the
remediated tree.

### Accepted risks (no upstream fix available)

When a dependency has an open advisory with **no patched release anywhere in its
supported range**, and the parent cannot be moved off it, we record a dated,
reviewed risk acceptance here instead of leaving the alert silently open. Each
entry is revisited whenever Dependabot re-flags it.

| Advisory | Package | Path | Why unfixable | Why tolerable here | Accepted |
|---|---|---|---|---|---|
| [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) | `deepmerge 4.3.1` (low) | dev-only, transitive: `jest 30.5.2` → `jest-config` → `deepmerge` (`tools/soac-harness`) | `4.3.1` is the latest release and the advisory lists **no first-patched-version** (vulnerable `>= 4.2.0, <= 4.3.1`); `jest` 30.5.2 is the latest release and still depends on it. | Prototype poisoning in `mergeObject()` needs attacker-controlled source objects. Here it only merges this repository's own jest configuration during local or CI test runs; it is not shipped, and no untrusted input reaches it. Listed in `tools/soac-harness/osv-scanner.toml` and `sbom/osv-scanner.toml` with `ignoreUntil = 2027-02-01`, so OSV-Scanner and the Scorecard Vulnerabilities check force a re-review. Dependabot alert #9 dismissed as *tolerable risk*. | 2026-11-04 |

**Action on the GitHub alert:** dismiss the corresponding Dependabot alert with
reason *"Risk is tolerable"*, linking this row. Re-open and upgrade as soon as a
patched release is published.

### Resolved risk acceptances

| Advisory | Package | Resolution | Resolved |
|---|---|---|---|
| [GHSA-w8v5-vhqr-4h9v](https://github.com/advisories/GHSA-w8v5-vhqr-4h9v) / CVE-2025-69872 / PYSEC-2026-2447 | `diskcache 5.6.3` (moderate; unsafe `pickle` deserialization of cache contents, no patched `diskcache` release) | Accepted as a risk on 2026-10-15 while it came in through `sigma-cli 3.1.0` → `pysigma 1.5.1` → `diskcache`. Removed by moving to `sigma-cli 4.0.0` → `pysigma 2.0.2`, which replaced `diskcache` with the maintained fork `diskcache-community 5.8.3`. That fork carries the fix path for CVE-2025-69872: `pysigma` now opens its MITRE ATT&CK / D3FEND cache with `disk=SafeDisk` (unpickling restricted to built-in types) and the fork creates cache directories with mode `0700`. `diskcache` is no longer in `requirements.txt`, so no OSV ignore was needed. | 2026-11-04 |

## Standards alignment

- **OpenSSF Security Baseline** — supply-chain, vulnerability management, and
  CI hardening controls.
- **EU Cyber Resilience Act (CRA)** — SBOM availability and coordinated
  vulnerability handling.
- **SLSA / in-toto** — signed SBOM/provenance attestation on release.
