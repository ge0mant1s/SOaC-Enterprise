#!/bin/bash -eu
# ClusterFuzzLite build script — compiles the harness and installs the fuzz runtime.
#
# All dependencies, including the Jazzer.js fuzz runtime (an exact-pinned
# devDependency), come from package-lock.json via `npm ci` - no floating installs
# (OpenSSF Scorecard Pinned-Dependencies).

cd "$SRC/soac/tools/soac-harness"

# Install locked deps (prod + dev, incl. @jazzer.js/core) then compile scripts/ -> dist/.
npm ci
npx tsc -p .

# Stage each fuzz target as an OSS-Fuzz/ClusterFuzzLite fuzzer.
for target in fuzz/*.fuzz.js; do
  name="$(basename "$target" .fuzz.js)"
  compile_javascript_fuzzer soac/tools/soac-harness "$target" --sync
done
