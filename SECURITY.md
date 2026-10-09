# Security Policy

## Supported Versions

SOaC-Enterprise is released as a rolling framework. Security fixes are applied to
the `main` branch, which is the only actively supported line.

| Version | Supported |
| ------- | --------- |
| `main` (latest) | ✅ |
| older tags / snapshots | ❌ |

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

## Scope

This policy covers the code, workflows, schemas, and detection/response content in
this repository. The security simulation and "abuse defense" packages (for
example `packages/011_genai_llm_abuse_defense`) intentionally contain **synthetic,
non-functional** sample artifacts for training and detection testing; these are
not live secrets or exploits.
