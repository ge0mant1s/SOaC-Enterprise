# Software Bill of Materials (SBOM)

This directory holds machine-readable SBOMs for the components of SOaC-Enterprise
that have a managed dependency tree. SBOMs support supply-chain transparency
(OSPS Baseline QA-02.02 / supply-chain controls) and are part of the project's
Security Slam / CRA readiness evidence.

## Files

| File | Scope | Format |
| ---- | ----- | ------ |
| `soac-harness.cdx.json` | `tools/soac-harness` (Node.js validation harness) | CycloneDX 1.5 (JSON) |

## How it was produced

Generated with free, open-source tooling — the npm-native CycloneDX generator:

```bash
cd tools/soac-harness
npm install            # resolve the dependency tree from package.json + package-lock.json
npm sbom --sbom-format cyclonedx > ../../sbom/soac-harness.cdx.json
```

- Tooling: npm 10.9.2 / Node.js 22 (`npm sbom`, built-in). No paid services.
- The SBOM reflects the dependency tree of `tools/soac-harness` at generation time
  (307 components), rooted at `soac-harness@1.0.1`.

## Known caveat (as of generation)

At generation time, `tools/soac-harness/package-lock.json` on `main` was **out of
sync** with `package.json` (a clean `npm ci` / `npm ls` fails — e.g. missing
`ajv`, `jest`, `ts-jest` entries and a stale `p-try` pin). This SBOM was therefore
produced from a fresh `npm install` resolution. The committed lockfile still pins
`js-yaml@4.1.1`, which carries open DoS advisories; the lockfile repair and the
`js-yaml` bump are tracked in a separate PR (harness security/test fix). Once that
PR merges, regenerate this SBOM with the command above so it reflects the
remediated tree.

## Regeneration

Re-run the command above after any dependency change and commit the updated file.
