# Governance

This document describes how the SOaC-Enterprise project is governed. It is
intentionally lightweight and reflects the current, small-maintainer reality of
the project. It is expected to evolve as the community grows.

## Roles

### Maintainers

Maintainers are responsible for the overall direction, review, and release of the
project. They have write access and merge rights.

Current maintainers:

- **[@ge0mant1s](https://github.com/ge0mant1s)** — project lead

> To add maintainers, open a pull request editing this list; existing maintainers
> approve by review.

### Contributors

Anyone who submits a pull request, issue, detection rule, playbook, or package is
a contributor. Contributors do not need write access.

## Decision Making

- Routine changes (fixes, docs, new detection content) are decided by **maintainer
  review and approval** on a pull request.
- Significant changes (architecture, licensing, security policy, breaking schema
  changes) require agreement from the maintainers and should be raised as an issue
  or discussion before implementation.
- When maintainers disagree, the project lead makes the final decision.

## Contribution Process

1. Open an issue (or pick up an existing one) to describe the change.
2. Submit a pull request referencing the issue.
3. At least one maintainer reviews. CI (validation harness, manifest validation,
   and security workflows) must pass.
4. A maintainer merges once approved and green.

See `CONTRIBUTING` guidance in the README and `SECURITY.md` for reporting
vulnerabilities.

### Single-maintainer review policy (current)

While the project has a single maintainer, no independent human reviewer
exists. Until a second maintainer joins, the following compensating controls
apply instead of a second-person approval:

- `main` is protected by a repository ruleset: pull requests only, squash merge
  only, resolved review threads, and **strict required status checks**
  (`validate`, CodeQL `Analyze` for javascript-typescript / python / actions,
  and `Review dependency changes`).
- The maintainer may merge their own pull request through the ruleset's admin
  bypass **only after all required checks are green**. Direct pushes to `main`
  are not used.
- Workflow changes are additionally guarded by the byte-identical mirror check
  (`tools/sync-workflows.sh --check`) and zizmor/CodeQL `actions` analysis.
- `CODEOWNERS` routes all changes (and especially `.github/`, workflow mirrors,
  `security-insights.yml` and `SECURITY.md`) to the maintainer.

**Accepted OpenSSF Scorecard findings.** Because of this, the Scorecard
`Code-Review` and `Branch-Protection` checks cannot reach their maximum
score (they require approvals from a second person and no admin bypass).
The corresponding code-scanning alerts are dismissed as *won't fix* with a
reference to this section. They will be revisited, and the bypass removed
and approvals raised to non-bypassable reviews, as soon as a second
maintainer is added to the list above.

## Changes to Governance

Changes to this document follow the same pull-request-and-review process and must
be approved by the maintainers.
