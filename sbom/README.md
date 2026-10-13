# Software Bill of Materials (SBOM)

This directory holds machine-readable SBOMs for the components of SOaC-Enterprise
that have a managed dependency tree. SBOMs give downstream users and auditors a
transparent, verifiable inventory of every third-party component we rely on.

They support:

- **OpenSSF Security Baseline** — supply-chain / SBOM controls.
- **EU Cyber Resilience Act (CRA)** — SBOM expectations for digital products.
- **SLSA / in-toto** — signed provenance for released artifacts.
- The project's **Security Slam Fall 2026** readiness evidence (Mechanizer + Defender).

## Files

| File | Scope | Format |
| ---- | ----- | ------ |
| `soac-harness.cdx.json` | `tools/soac-harness` (Node.js validation harness) | CycloneDX 1.5 (JSON) |

> The detection/response **content packages** (`packages/NNN_*`) are data (YAML/JSON
> rules, playbooks, docs), not compiled software, and have no third-party runtime
> dependency tree of their own. The only managed dependency tree in the repository
> is the Node.js validation harness, so that is what the SBOM covers.

## Two complementary SBOMs

1. **CycloneDX (this directory, committed).** Generated with the npm-native
   generator and committed so it is reviewable in git history and downloadable
   without running anything.
2. **SPDX (GitHub-native, on demand).** GitHub's dependency graph exposes an
   always-current SPDX SBOM for the whole repository with zero setup:
   - UI: **Insights → Dependency graph → Export SBOM**.
   - API: `GET /repos/ge0mant1s/SOaC-Enterprise/dependency-graph/sbom`.

## How the committed CycloneDX SBOM is produced

Free, open-source tooling only (the npm-native CycloneDX generator):

```bash
cd tools/soac-harness
npm ci                                                   # clean install from the lockfile
npm sbom --sbom-format cyclonedx > ../../sbom/soac-harness.cdx.json
```

- Tooling: npm 10+ / Node.js 24 (`npm sbom`, built-in). No paid services.
- The SBOM reflects the dependency tree of `tools/soac-harness` at generation
  time, rooted at `soac-harness@1.0.1`.

## Automation & freshness

`.github/workflows/sbom.yml` keeps this SBOM honest:

- **Regenerates** the SBOM on any change to the harness `package.json` /
  `package-lock.json`, weekly on a schedule (to catch transitive drift), on
  release, and on manual dispatch.
- **Fails CI** if the committed `soac-harness.cdx.json` is out of sync with the
  resolved dependency tree, with the exact command to refresh it — so a stale
  SBOM can no longer be merged.
- **Uploads** the SBOM as a build artifact on every run.
- **On release**, packs the harness and produces a **signed SBOM attestation**
  via `actions/attest-sbom` (GitHub OIDC-backed, SLSA/in-toto). Anyone can then
  verify the artifact ↔ SBOM binding with:
  ```bash
  gh attestation verify <artifact> --repo ge0mant1s/SOaC-Enterprise
  ```

> The workflow is staged in `patches/workflows/sbom.yml` and activated by
> copying it to `.github/workflows/` (adding workflow files requires Workflows
> write access).

## Vulnerability status (VEX-style note)

The committed SBOM corresponds to the **remediated** harness dependency tree:
`npm audit` reports **0 known vulnerabilities**. The earlier `js-yaml` DoS
advisories were resolved by the lockfile repair + bump (merged), and the
dev-only `sprintf-js` and `braces` advisories — which have **no upstream patched
release** — were removed from the tree entirely by dropping the transitive
paths that pulled them in (jest 30 upgrade + an npm `override` on
`@istanbuljs/load-nyc-config`). See `SECURITY.md` and the project reports for
the full disclosure.

## Regeneration

Re-run the command above after any dependency change and commit the updated
file — or just let `sbom.yml` catch it. The in-sync check in CI is the backstop.
