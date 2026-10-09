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

## Changes to Governance

Changes to this document follow the same pull-request-and-review process and must
be approved by the maintainers.
