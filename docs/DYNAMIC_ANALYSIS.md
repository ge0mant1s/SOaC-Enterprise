# Dynamic Analysis

SOaC-Enterprise applies **dynamic analysis** to its software (the validation
harness) in addition to the static analysis done by CodeQL. This document
describes what we run, how run-time assertions are used, and how to reproduce a
finding.

## What we run

The dynamic-analysis pass is a **property-based fuzz suite**:
[`tools/soac-harness/__tests__/fuzz.test.ts`](../tools/soac-harness/__tests__/fuzz.test.ts).

Instead of a handful of fixed example inputs, it drives the real validators with
thousands of **randomized** inputs each run:

- `runLevel1(parsed, raw, file)` — fed randomly-generated artifact-shaped objects
  (valid, almost-valid, and malformed) plus random raw text.
- `validateFile(path, schema, ajv, isYaml)` — fed random file contents, mixing
  free text and structured JSON, in both YAML and JSON modes, so that both the
  parse-error path and the schema-validation path are exercised.

Each input executes the actual production code paths, which is what makes this
dynamic (run-time) analysis rather than static inspection.

## Run-time assertions

The software contains **run-time assertions** that encode the validators'
contracts, and the fuzz suite checks them while the code runs:

- `assertFindingInvariants()` in
  [`src/level1.ts`](../tools/soac-harness/src/level1.ts) asserts every `Finding`
  returned by `runLevel1` has a valid shape, severity, and level. It is called at
  every return point of `runLevel1`.
- `assertResultInvariants()` in
  [`scripts/validate-packages.ts`](../tools/soac-harness/scripts/validate-packages.ts)
  asserts every `validateFile` result is a well-formed `{ valid, errors }` object
  and that `valid ⇔ errors.length === 0`.

These assertions are cheap (O(n) over findings) and are **kept enabled in
production**, so any invariant violation surfaces immediately — in CI, in the
fuzz run, and at runtime. A fuzzed input that trips an assertion fails the suite.

## Reproducibility

The random stream is **seeded** (mulberry32), so every run is deterministic. Two
environment variables control it:

| Variable | Default | Purpose |
|---|---|---|
| `FUZZ_SEED` | `1337` | Seed for the PRNG. Change it to explore new inputs. |
| `FUZZ_ITERATIONS` | `3000` | Number of random inputs per property. |

```bash
cd tools/soac-harness
npm ci
npm test                                  # runs unit + integration + fuzz
FUZZ_SEED=99991 FUZZ_ITERATIONS=50000 npm test   # deep run
```

When a fuzz case fails, the error message prints the seed, the iteration index,
and the offending input so it can be replayed exactly.

## In CI

The suite runs locally via `npm test`. A ready-to-activate workflow is staged at
[`patches/workflows/dynamic-analysis.yml`](../patches/workflows/dynamic-analysis.yml);
a maintainer copies it to `.github/workflows/` to run the fuzz suite on every
push and pull request to `main`, plus a weekly deep run with a higher iteration
count. (The automation token cannot write to `.github/workflows/`, which is why
the file is staged here, consistent with `dependency-review.yml` and `sbom.yml`.)
