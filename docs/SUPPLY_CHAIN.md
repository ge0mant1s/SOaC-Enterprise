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

## Standards alignment

- **OpenSSF Security Baseline** — supply-chain, vulnerability management, and
  CI hardening controls.
- **EU Cyber Resilience Act (CRA)** — SBOM availability and coordinated
  vulnerability handling.
- **SLSA / in-toto** — signed SBOM/provenance attestation on release.
