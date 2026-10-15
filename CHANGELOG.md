# Changelog

All notable changes to SOaC-Enterprise are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and releases use
[Semantic Versioning](https://semver.org/) with git tags named `vMAJOR.MINOR.PATCH`.

Each release lists fixed security vulnerabilities under **Security**, including the
CVE/GHSA identifier when one has been assigned.

## [Unreleased]

## [2.1.0] - 2026-10-13

### Added
- 10 new threat intelligence packages (`pkg-023` – `pkg-032`), bringing the catalog to 32 packages.
- OpenSSF Scorecard workflow, CodeQL analysis (Python, JavaScript/TypeScript), and Dependabot version + security updates.
- `SECURITY.md` (private vulnerability reporting, response targets), `GOVERNANCE.md`, `security-insights.yml`, and `docs/SUPPLY_CHAIN.md`.
- CycloneDX SBOM for the validation harness in `sbom/`.
- Testing policy and contribution requirements in `CONTRIBUTING.md`; pull request template.

### Changed
- Branch protection on `main`: required status checks, one approving review, no force pushes.
- GitHub Actions pinned to full commit SHAs with least-privilege permissions.
- Python dependency floors raised to current releases (pandas, openai, anthropic, sigma-cli, uvicorn, elasticsearch-dsl).

### Security
- No vulnerabilities in SOaC-Enterprise itself were reported or fixed in this release (no CVE/GHSA assigned).
- Dependency updates delivered via Dependabot as listed under *Changed*.

## [2.0.0] - 2026-03

### Added
- v2.0-PLATINUM: Play → Verify → Integrate lifecycle, evidence-based validation engine, four-role model. See `docs/releases/v2.0/`.

## [1.0.0] - 2026-03

### Added
- Initial stable release. See `RELEASE_1.0_ROADMAP.md`.

[Unreleased]: https://github.com/ge0mant1s/SOaC-Enterprise/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/ge0mant1s/SOaC-Enterprise/releases/tag/v2.1.0
