# Fuzz targets (Jazzer.js / ClusterFuzzLite)

Coverage-guided fuzzers for the SOaC validation harness. They exercise the real
parse → schema-validate pipeline used by `npm run validate` (the required CI
check) and assert its contract holds under arbitrary input.

## Targets
- `validate.fuzz.js` — fuzzes `validateFile()` in both YAML and JSON modes
  against the project's real AJV schemas. Asserts it always returns a well-formed
  `{ valid: boolean, errors: string[] }` and never throws, hangs, or leaks a
  parser/validator exception.

## Run locally
```bash
cd tools/soac-harness
npm install && npx tsc -p .            # compile scripts/ -> dist/
npm install --no-save @jazzer.js/core  # fuzz runtime (not a project dep)
npx jazzer fuzz/validate.fuzz.js ./corpus --sync -- -max_total_time=60
```

## In CI
Runs via ClusterFuzzLite (`.clusterfuzzlite/`): short budget on every PR
(`clusterfuzzlite-pr.yml`) and a daily batch run (`clusterfuzzlite-batch.yml`).
Local baseline: 200k executions, 0 crashes, corpus/coverage growth.

> Jazzer.js is installed with `--no-save` so the required `validate` check and
> `package.json` / `package-lock.json` are never affected by fuzzing.
