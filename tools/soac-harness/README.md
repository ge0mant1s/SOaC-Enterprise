# SOaC Validation Harness

This harness validates Security-as-Code (SOaC) packages for structure, schema, and content correctness.

## Features

- Validates `playbook.yaml` and `policy.yaml` files against JSON Schemas.
- Checks semantic versioning of package versions.
- Validates regex patterns in playbook triggers.
- Provides CLI for local validation.
- Integrates with GitHub Actions for CI validation.

## Installation

```bash
npm install
```

## Usage

To validate all SOaC packages locally:

```bash
npm run validate
```

## CI Integration

The GitHub Actions workflow `.github/workflows/soac-validation.yml` runs this validation on every push and pull request to `main`.

---

# Details

- Schemas are located in `schemas/`.
- Validation logic is in `scripts/validate-packages.ts`.
- Tests are in `__tests__/validate-packages.test.ts`.
