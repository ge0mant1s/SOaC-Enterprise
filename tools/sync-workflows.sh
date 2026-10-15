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

FILES=(
  release-signing.yml
  clusterfuzzlite-pr.yml
  clusterfuzzlite-batch.yml
  dynamic-analysis.yml
  sbom.yml
)

for f in "${FILES[@]}"; do
  cp "patches/workflows/$f" ".github/workflows/$f"
  echo "copied patches/workflows/$f -> .github/workflows/$f"
done

echo
echo "=== sanity checks ==="
if grep -rn "uses:.*@v[0-9]" .github/workflows/ ; then
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
echo "All good. Now commit and push:"
echo "  git add .github/workflows/"
echo '  git commit -m "fix(scorecard): apply pinned/least-privilege workflow fixes to live workflows"'
echo "  git push"
