#!/usr/bin/env bash
# Copy the corrected workflow files from patches/workflows/ into .github/workflows/.
#
# Why: the connector that opens PRs cannot write .github/workflows/*, so fixes are
# staged in patches/workflows/. This script applies them to the live location.
# It reads from the repo (not an editor buffer), so it can't pick up stale content.
#
# Run from the repo root:  bash tools/sync-workflows.sh
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

MODE="${1:-apply}"
if [[ "$MODE" != "apply" && "$MODE" != "--check" ]]; then
  echo "usage: bash tools/sync-workflows.sh [apply|--check]" >&2
  exit 2
fi

FILES=(
  release-signing.yml
  dependency-review.yml
  clusterfuzzlite-pr.yml
  clusterfuzzlite-batch.yml
  dynamic-analysis.yml
  sbom.yml
  soac-drift-detection.yml
  osps-baseline.yml
  soac-validation.yml
  # publish-results.yml is intentionally NOT listed: it must not go live until a
  # grc.store namespace exists and this repo is bound as a trusted publisher.
  # Add it here only after that setup (see the Defender handoff).
)

for f in "${FILES[@]}"; do
  if [[ "$MODE" == "--check" ]]; then
    if ! cmp -s "patches/workflows/$f" ".github/workflows/$f"; then
      echo "MISMATCH: patches/workflows/$f != .github/workflows/$f" >&2
      exit 1
    fi
    echo "match: $f"
  else
    cp "patches/workflows/$f" ".github/workflows/$f"
    echo "copied patches/workflows/$f -> .github/workflows/$f"
  fi
done

echo
echo "=== sanity checks ==="
if grep -rn "uses:.*@v[0-9]" .github/workflows/ | grep -v "pvtr-publish-results" ; then
  echo "FAIL: unpinned action(s) above still present"; exit 1
else
  echo "OK: every action in .github/workflows/ is pinned by SHA"
fi

if awk '/^permissions:/{f=1;next} /^[a-z]/{f=0} f&&/write/{print FILENAME": "$0}' .github/workflows/release-signing.yml | grep -q write ; then
  echo "FAIL: release-signing.yml still has top-level write permissions"; exit 1
else
  echo "OK: release-signing.yml top-level token is read-only"
fi

echo
echo "All good. Now commit and push (or run with --check in CI):"
echo "  git add .github/workflows/"
echo '  git commit -m "fix(scorecard): apply pinned/least-privilege workflow fixes to live workflows"'
echo "  git push"
