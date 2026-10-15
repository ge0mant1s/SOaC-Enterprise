#!/bin/bash -eu
# ClusterFuzzLite build script — compiles the harness and installs the fuzz runtime.
#
# Keeps the required `validate` check pristine: Jazzer.js is installed here with
# --no-save (it is NOT a project dependency), so package.json / package-lock.json
# are never modified by fuzzing.

cd "$SRC/soac/tools/soac-harness"

# Install project deps (prod + dev) then compile scripts/ -> dist/ (validateFile).
npm ci || npm install
npx tsc -p .

# Fuzz runtime, installed only for the fuzzing build.
npm install --no-save @jazzer.js/core@^2

# Stage each fuzz target as an OSS-Fuzz/ClusterFuzzLite fuzzer.
for target in fuzz/*.fuzz.js; do
  name="$(basename "$target" .fuzz.js)"
  compile_javascript_fuzzer soac/tools/soac-harness "$target" --sync
done
