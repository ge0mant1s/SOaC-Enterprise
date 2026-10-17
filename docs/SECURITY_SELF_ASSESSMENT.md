# SOaC-Enterprise Security Self-Assessment

**Last reviewed:** 2026-10-17
**Assessed version / scope:** `main` (v2.1.x line)
**Author:** @ge0mant1s (maintainer)
**Framework:** This assessment follows the [OpenSSF security-assessments](https://github.com/ossf/security-assessments)
outline and supports OSPS Baseline controls OSPS-SA-03.01 (self-assessment) and,
for the threat-modeling content in section 3, OSPS-SA-03.02.

> This is a maintainer self-assessment, not an independent third-party audit. It
> describes the security posture of the repository and the artifacts it produces.
> It intentionally omits exploit-level detail; suspected vulnerabilities are
> handled privately through the process in [SECURITY.md](../SECURITY.md).

---

## 1. Project Overview and Scope

**What the project does.** SOaC-Enterprise ("Security-Operations-as-Code") is a
vendor-agnostic framework that expresses security-operations logic as versioned
software: telemetry normalization to the Elastic Common Schema, a reasoning layer,
YAML detection/response playbooks, and API-based enforcement. The repository ships
the framework code, a library of threat-intelligence packages under `packages/`,
a TypeScript validation harness under `tools/soac-harness/`, and supporting
documentation.

**Actors.**

- **Operators / adopters** — security engineers who clone the framework, author or
  consume packages, and run the validation harness. They supply their own
  environment credentials; the project stores none.
- **Contributors** — anyone opening an issue or pull request with detection
  content, playbooks, or code.
- **Maintainer** — @ge0mant1s, who reviews, approves, and releases (see
  [GOVERNANCE.md](../GOVERNANCE.md)).
- **External systems** — the SIEM/EDR/identity/network platforms that adopters
  integrate with at runtime. These are out of this repository's trust boundary.

**Main flows.**

1. A contributor proposes a package or code change via pull request.
2. CI (validation harness, manifest schema validation, CodeQL, Scorecard,
   Dependency Review) gates the merge.
3. A maintainer reviews and merges to `main`.
4. Tagged releases are built, signed, and published with an SBOM and provenance
   attestation.

**In scope for this assessment:** the repository's source, schemas, validation
harness, CI/CD workflows, release pipeline, and the synthetic content in
`packages/`.

**Out of scope:** the adopter's production SOC deployment, the third-party
platforms SOaC integrates with, and the confidentiality of adopter-supplied
credentials (handled entirely in the adopter's environment).

**Security goals.** Integrity and authenticity of released artifacts; no real
secrets or live exploit code in the repository; reproducible builds; a working
private vulnerability-reporting channel.

**Non-goals.** The project is not a hosted service, stores no user data, and does
not process untrusted input at runtime on project-controlled infrastructure.

---

## 2. Development Practices and Governance

- **Merge and release rights.** Only the maintainer holds write/merge rights
  ([GOVERNANCE.md](../GOVERNANCE.md)). Maintainers are added by pull request and
  existing-maintainer review.
- **Branch protection.** `main` is protected by a repository ruleset: direct
  pushes are blocked, deletion and non-fast-forward are disallowed, pull requests
  are required, and required status checks must pass. All changes land through pull
  requests.
- **Code review.** Every change is reviewed by a maintainer before merge
  (GOVERNANCE.md, "Contribution Process"). `TODO(maintainer): the project is
  currently single-maintainer, so required-reviewer enforcement for the owner's own
  PRs relies on admin discipline; revisit when a second maintainer joins.`
- **CI checks that gate merges.** The required checks are `validate` (the SOaC
  validation harness) and CodeQL (`Analyze (python)`, `Analyze
  (javascript-typescript)`), per [CONTRIBUTING.md](../CONTRIBUTING.md). Dependency
  Review blocks PRs that introduce known HIGH/CRITICAL advisories.
- **Contributor identity.** Contributions are made through GitHub pull requests.
  `TODO(maintainer): confirm whether a DCO sign-off or CLA is required; none is
  enforced in CI today.`

---

## 3. Security Controls and Threat Considerations

**Authentication, authorization, secrets handling.** The project itself holds no
runtime secrets. CI uses the GitHub-provided `GITHUB_TOKEN` with least-privilege,
explicitly scoped `permissions:` blocks; release signing uses OIDC (no long-lived
signing keys stored). Actions are pinned to full commit SHAs. Secret scanning and
push protection are recommended repository settings (see section "Known gaps").

**Trust boundaries.** The principal boundary is the pull-request intake: untrusted
contributor content crosses into the repository only after maintainer review and
CI. The validation harness parses package YAML/JSON against JSON Schemas, which
constrains what merged content can look like.

**Top threats and mitigations.**

| # | Threat | Attack | Impact | Mitigation |
| - | ------ | ------ | ------ | ---------- |
| T1 | Malicious pull request | A contributor submits a package or code change containing a backdoor or live exploit | Compromise of adopters who pull `main` | Mandatory maintainer review; CodeQL SAST; CONTRIBUTING rule forbidding real secrets/exploit code; synthetic-only simulation artifacts |
| T2 | Compromised dependency | A transitive npm/pip/Action dependency is malicious or vulnerable | Supply-chain compromise of the harness or CI | Pinned lockfiles; Dependabot version + security updates; Dependency Review on PRs; SHA-pinned Actions |
| T3 | Release tampering | An attacker alters a released artifact | Adopters run a tampered build | Signed releases with provenance attestation and CycloneDX SBOM; verification documented in `docs/SUPPLY_CHAIN.md` |
| T4 | CI token abuse | A workflow with excessive permissions is abused via a crafted PR | Write access to the repo or secrets | Least-privilege `permissions:` blocks; no `pull_request_target`; fuzzing/scan tokens kept off untrusted code |
| T5 | Branch-protection bypass | Direct push or force-push to `main` | Unreviewed code reaches adopters | Ruleset blocking direct pushes, deletion, and non-fast-forward on the default branch |
| T6 | Misread "abuse defense" samples | Synthetic attack samples in `packages/011_genai_llm_abuse_defense` mistaken for live exploits | Accidental misuse | Samples are explicitly synthetic and labelled; scope note in SECURITY.md |

**Known gaps / planned work.**

- Secret scanning and push protection should be confirmed enabled in repository
  settings (OSPS-BR-07.01). `TODO(maintainer): enable in Settings → Code security.`
- Required-reviewer enforcement is limited by the single-maintainer model (see T5
  and section 2).
- Binary artifacts tracked in the repository (PDFs, packaged zips) increase the
  scanned surface; `TODO(maintainer): review whether large binaries belong in git
  or should move to release assets.`

---

## 4. Incident Response and Vulnerability Management

- **Reporting.** Vulnerabilities are reported privately through GitHub Private
  Vulnerability Reporting; see [SECURITY.md](../SECURITY.md). Public issues for
  security problems are explicitly discouraged.
- **Triage and timelines.** Good-faith targets (not an SLA): acknowledge within 5
  business days, initial assessment within 10 business days, fix/mitigation plan
  communicated once validated (SECURITY.md, "Response Targets").
- **Disclosure.** Coordinated disclosure; reporters are asked for a reasonable
  window before public disclosure and are credited if they wish.
- **Advisories.** Confirmed, fixed issues are published as GitHub Security
  Advisories (GHSA) and flow to the GitHub Advisory Database for downstream
  Dependabot/`npm audit` consumers.
- **Past advisories.** None to date. `TODO(maintainer): update when the first
  advisory is published.`

---

## 5. Dependencies and Supply Chain

- **Selection and tracking.** Python dependencies are pinned in
  `requirements.txt`; harness npm dependencies are locked in
  `tools/soac-harness/package-lock.json`. New dependencies are introduced through
  pull requests and must carry an Apache-2.0-compatible OSI license
  ([CONTRIBUTING.md](../CONTRIBUTING.md), "Dependency Management").
- **Updates.** Dependabot provides version updates (GitHub Actions + npm) and
  security-update pull requests.
- **SCA and SAST.** OpenSSF Scorecard (posture), CodeQL (SAST for Python and
  JavaScript/TypeScript), Dependency Review (PR-time SCA), and ClusterFuzzLite
  (fuzzing) run in CI.
- **Build, release, signing, SBOM, provenance.** Releases are the signed source
  tree plus a CycloneDX SBOM (`sbom/soac-harness.cdx.json`) and an OIDC-backed
  provenance attestation produced by the release workflow. Verification steps are
  documented in [docs/SUPPLY_CHAIN.md](SUPPLY_CHAIN.md).

---

## References

- [SECURITY.md](../SECURITY.md) — vulnerability reporting and disclosure policy
- [GOVERNANCE.md](../GOVERNANCE.md) — roles, decision-making, contribution process
- [CONTRIBUTING.md](../CONTRIBUTING.md) — build, dependency, and contribution rules
- [docs/SUPPLY_CHAIN.md](SUPPLY_CHAIN.md) — supply-chain controls and release verification
- [security-insights.yml](../security-insights.yml) — machine-readable security metadata
