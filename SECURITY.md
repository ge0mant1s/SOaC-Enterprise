# Security Policy

## Supported Versions

SOaC-Enterprise is released as a rolling framework. Security fixes are applied to
the `main` branch, which is the only actively supported line.

| Version | Supported |
| ------- | --------- |
| `main` (latest) | ✅ |
| older tags / snapshots | ❌ |

## EU Cyber Resilience Act (CRA) Readiness

We do not anticipate this project being used in commercial products. See [LF-Supported Projects and CRA Readiness](https://openssf.org/wp-content/uploads/2026/09/LF-Supported-Projects-and-CRA-Readiness-2026-09-10.pdf) for more information.

## Reporting a Vulnerability

**Please do not open a public issue for security vulnerabilities.**

Report vulnerabilities privately through GitHub's
[Private Vulnerability Reporting](https://github.com/ge0mant1s/SOaC-Enterprise/security/advisories/new)
for this repository. This keeps the report confidential until a fix is available.

> Maintainers: enable **Settings → Code security → Private vulnerability reporting**
> for the link above to accept reports. See `docs/` and the Security Slam owner
> actions for the one-time setup.

When reporting, please include:

- A description of the issue and its impact.
- Steps to reproduce (proof-of-concept, affected package/path, or workflow).
- Any known mitigations or workarounds.

## Response Targets

These are good-faith targets for a volunteer-maintained open-source project, not a
contractual SLA:

- **Acknowledgement:** within 5 business days.
- **Initial assessment / triage:** within 10 business days.
- **Fix or mitigation plan:** communicated once the report is validated.

## Disclosure

We follow coordinated disclosure. We ask reporters to give us a reasonable window
to release a fix before any public disclosure. We will credit reporters who wish
to be acknowledged.

## Security advisories & notifications

When a vulnerability affecting this project is confirmed and fixed, we publish a
**GitHub Security Advisory (GHSA)** on the repository's
[Security Advisories](https://github.com/ge0mant1s/SOaC-Enterprise/security/advisories)
page. Advisories include the affected versions/paths, severity, and the fix.

You can follow advisories through any of these channels:

- **Watch the repository** → *Custom* → enable **Security alerts** to be notified
  of new advisories.
- **RSS/Atom:** subscribe to
  `https://github.com/ge0mant1s/SOaC-Enterprise/security/advisories.atom`.
- **Dependency consumers:** advisories published to the GitHub Advisory Database
  (GHSA) flow automatically into Dependabot / `npm audit` for anyone depending on
  an affected component.
- **Website:** a summary is posted on the security page at
  [soacframe.io](https://soacframe.io).

We also maintain machine-readable supply-chain transparency so downstream users
can assess impact themselves:

- A **CycloneDX SBOM** for the validation harness in [`sbom/`](sbom/), kept in
  sync by CI and signed with an attestation on release.
- A **GitHub-native SPDX SBOM** for the whole repository (Insights → Dependency
  graph → *Export SBOM*).
- Supply-chain controls are documented in [`docs/SUPPLY_CHAIN.md`](docs/SUPPLY_CHAIN.md).

## Scope

This policy covers the code, workflows, schemas, and detection/response content in
this repository. The security simulation and "abuse defense" packages (for
example `packages/011_genai_llm_abuse_defense`) intentionally contain **synthetic,
non-functional** sample artifacts for training and detection testing; these are
not live secrets or exploits.
