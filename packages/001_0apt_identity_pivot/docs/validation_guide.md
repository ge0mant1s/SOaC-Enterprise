# Validation Guide: 0APT Identity Pivot (pkg-001)

## Test Matrix

| Test | Detection | MITRE | Expected |
|------|-----------|-------|----------|
| V-001 | Multi-IP session | T1557.001 | ALERT |
| V-002 | AitM proxy detection | T1557.001 | ALERT |
| V-003 | Session token reuse | T1539 | ALERT |
| V-004 | Cloud account pivot | T1078.004 | ALERT |
| V-005 | Composite multi-IP | T1557.001+T1539 | CRITICAL |

## Test Procedures

### V-001: Multi-IP Session
Authenticate the same user from 3+ different IPs within 15 minutes.
Expected: Alert fires with risk score >= 75.

### V-002: AitM Proxy Detection
Authenticate with User-Agent containing "python-requests" or "Go-http-client".
Expected: Sigma/Wazuh rule triggers.

### V-003: Session Token Reuse
Replay a session cookie from a different IP than the original auth.
Expected: Alert fires for session anomaly.

### V-004: Cloud Account Pivot
Access 3+ new cloud applications not in the user's 30-day baseline.
Expected: Sentinel/Splunk detection triggers.

### V-005: Composite
Combine V-001 conditions on same user within Wazuh timeframe.
Expected: Wazuh rule 100704 fires CRITICAL.

## Pass Criteria
- **PASS**: All 5 tests produce expected alerts
- **PARTIAL**: 3+ tests pass
- **FAIL**: Fewer than 3 tests pass

---
*SOaC Package pkg-001 | Version 1.0.0 | Apache-2.0*
