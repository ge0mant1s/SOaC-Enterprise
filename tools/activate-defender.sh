#!/usr/bin/env bash
# Turn on grc.store publishing (Security Slam Defender evidence) in one step.
#
# Run ONLY after:
#   1. grc.store granted you a namespace (invite-only: https://grc.store/request-access)
#   2. ge0mant1s/SOaC-Enterprise is bound as a trusted publisher on that namespace,
#      ref refs/heads/main, workflow .github/workflows/publish-results.yml
#
# Usage (repo root, on an up-to-date main):
#   bash tools/activate-defender.sh <namespace> [maturity-level]
#   e.g. bash tools/activate-defender.sh soac 1
#
# What it does (all local; nothing is pushed):
#   - writes the namespace (and level) into patches/workflows/publish-results.yml
#   - adds publish-results.yml to FILES in tools/sync-workflows.sh
#   - runs tools/sync-workflows.sh so the workflow lands in .github/workflows/
#   - adds an "OSPS Baseline results" link to the README
# You review, commit, push, then trigger the first publish (printed at the end).
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

NS="${1:-}"
LEVEL="${2:-1}"
WF="patches/workflows/publish-results.yml"
SYNC="tools/sync-workflows.sh"
TARGET_SLUG="soac-enterprise"

if [[ ! "$NS" =~ ^[a-z0-9][a-z0-9-]{0,62}$ ]]; then
  echo "usage: bash tools/activate-defender.sh <namespace> [1|2|3]" >&2
  echo "namespace must be lowercase letters, digits and dashes (got: '${NS}')" >&2
  exit 2
fi
if [[ ! "$LEVEL" =~ ^[123]$ ]]; then
  echo "maturity level must be 1, 2 or 3 (got: '${LEVEL}')" >&2
  exit 2
fi

if grep -q "target: NAMESPACE/" "$WF"; then
  sed -i "s#target: NAMESPACE/#target: ${NS}/#" "$WF"
  echo "set namespace '${NS}' in ${WF}"
elif grep -q "target: ${NS}/" "$WF"; then
  echo "namespace '${NS}' already set in ${WF}"
else
  echo "FAIL: ${WF} already targets a different namespace:" >&2
  grep -n "target:" "$WF" >&2
  exit 1
fi
sed -i -E "s#- maturity-[123] \# The project's Baseline level#- maturity-${LEVEL} \# The project's Baseline level#" "$WF"
grep -q "maturity-${LEVEL} # The project's Baseline level" "$WF" || { echo "FAIL: could not set maturity level" >&2; exit 1; }
echo "set Baseline level maturity-${LEVEL}"

if grep -qE '^  publish-results\.yml$' "$SYNC"; then
  echo "publish-results.yml already listed in ${SYNC}"
else
  sed -i -E 's#^  osps-baseline\.yml$#  osps-baseline.yml\n  publish-results.yml#' "$SYNC"
  grep -qE '^  publish-results\.yml$' "$SYNC" || { echo "FAIL: could not add to FILES in ${SYNC}" >&2; exit 1; }
  echo "added publish-results.yml to FILES in ${SYNC}"
fi

bash "$SYNC"

URL="https://grc.store/targets/${NS}/${TARGET_SLUG}"
if ! grep -qF "$URL" README.md; then
  # Insert a plain link right after the badge block (grc.store has no badge image yet).
  awk -v line="[OSPS Baseline results (grc.store)](${URL})" '
    !done && /^\[!\[/ {inblk=1}
    !done && inblk && !/^\[!\[/ {print ""; print line; done=1}
    {print}
    END {if (!done) print line}' README.md > README.md.tmp && mv README.md.tmp README.md
  echo "added grc.store results link to README.md"
fi

cat <<EOF

=== Defender publishing staged locally ===
Review:   git diff
Commit:   git add .github/workflows/publish-results.yml ${WF} ${SYNC} README.md
          git commit -m "feat(defender): publish OSPS Baseline results to grc.store (${NS})"
          git push
First run (dry run, then real):
          gh workflow run publish-results.yml -f dry-run=true
          gh workflow run publish-results.yml
Target page (submit this URL on securityslam.com/library/defender once it shows Passed):
          ${URL}
Hub API:  curl -sf https://hub.grc.store/v1/targets/${NS}/${TARGET_SLUG} | jq '.versions[0].latest | {result, counts, run_at}'
EOF
