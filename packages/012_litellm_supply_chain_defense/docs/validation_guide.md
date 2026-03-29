# Validation Guide: LiteLLM Supply Chain Attack Defense (pkg-012)

## Overview

This guide validates that all deployed detections correctly identify the attack patterns simulated by pkg-012. Each test maps to a specific detection rule and MITRE technique.

## Test Matrix

| Test ID | Detection | MITRE | Platform | Expected Result |
|---------|-----------|-------|----------|-----------------|
| V-001 | .pth file persistence | T1546.016 | Sigma, Sentinel, Wazuh, CrowdStrike | ALERT triggered |
| V-002 | Credential env var access | T1552.001 | Sigma, Sentinel, Splunk | ALERT triggered |
| V-003 | C2 domain communication | T1071.001 | Sigma, Wazuh, CrowdStrike | ALERT/BLOCK |
| V-004 | Pip install from non-PyPI | T1195.002 | Wazuh, Splunk | ALERT triggered |
| V-005 | OAuth token theft correlation | T1528 | Sentinel | ALERT triggered |
| V-006 | Composite: persistence + cred harvest | T1195.002+T1552.001 | Wazuh | CRITICAL alert |

## Test Procedures

### V-001: .pth File Persistence

```bash
# Simulate .pth file creation (safe — creates harmless file)
SITE_PKG=$(python3 -c "import site; print(site.getsitepackages()[0])")
echo "# SOaC test - safe to delete" > "$SITE_PKG/soac_test_litellm.pth"

# Expected: Alert fires within detection window
# Verify: Check SIEM for alert matching "pth" or "persistence"

# Cleanup
rm -f "$SITE_PKG/soac_test_litellm.pth"
```

### V-002: Credential Environment Variable Access

```bash
# Simulate credential harvesting (reads env vars — no actual exfil)
python3 -c "
import os
keys = ['AWS_SECRET_ACCESS_KEY', 'OPENAI_API_KEY', 'LITELLM_MASTER_KEY']
for k in keys:
    val = os.environ.get(k, 'NOT_SET')
    print(f'{k}: {\"SET\" if val != \"NOT_SET\" else \"NOT_SET\"}')
"

# Expected: Alert fires for Python process accessing credential env vars
```

### V-003: C2 Domain Communication

```bash
# Simulate DNS query to C2 domain (harmless — domain doesn't resolve)
nslookup test.litellm-telemetry.io 2>/dev/null || echo "DNS blocked (expected)"
curl -s --connect-timeout 5 https://beacon.ai-proxy-cdn.com/health 2>/dev/null || echo "Connection blocked (expected)"

# Expected: DNS/Network alert fires
```

### V-004: Non-PyPI Package Install

```bash
# Simulate suspicious pip install (dry run — does not actually install)
pip install --dry-run --no-deps git+https://example.com/fake-litellm.git 2>/dev/null || true

# Expected: Alert for pip install from non-standard source
```

### V-005: OAuth Token Theft Correlation

This test requires Azure AD sign-in logs. Use the replay scenario:

```bash
# Load replay data
cat replays/replay_scenario.json | jq '.events[] | select(.category == "oauth_abuse")'

# Manually inject events into Sentinel workspace for testing
# Or use the SOaC Lab simulation with this package loaded
```

### V-006: Composite Alert

Run V-001 followed by V-002 within 10 minutes on the same host. Expected: Wazuh rule 100805 fires a CRITICAL composite alert.

## Evidence Bundle Validation

Compare detection outputs against `validation/evidence_bundle.json`:

```bash
# Validate evidence bundle structure
python3 -c "
import json
with open('validation/evidence_bundle.json') as f:
    bundle = json.load(f)
print(f'Tests: {len(bundle[\"test_cases\"])}')
print(f'Expected Alerts: {sum(1 for t in bundle[\"test_cases\"] if t[\"expected_result\"] == \"ALERT\")}')
for tc in bundle['test_cases']:
    print(f'  {tc[\"test_id\"]}: {tc[\"mitre\"]} → {tc[\"expected_result\"]}')
"
```

## Pass Criteria

- **PASS**: All V-001 through V-006 tests produce expected alerts within detection windows
- **PARTIAL**: 4+ of 6 tests pass (investigate failed detections)
- **FAIL**: Fewer than 4 tests pass (review deployment guide and re-deploy)

---
*SOaC Package pkg-012 | Version 1.0.0 | Apache-2.0*
