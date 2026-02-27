# SOAC-PB-001-004: SAP Identity Containment (Security Audit Log Trigger)

## Trigger
- `SOAC-DET-001-051` (Privileged Access Anomaly)
- `SOAC-CORR-001-052` (Entra -> SAP Pivot)

## Tier 1 (Automatic/Fast)
1. **Lock SAP User**: Execute SAP function module `BAPI_USER_LOCK` or equivalent via SOAR connector.
2. **Revoke Entra Sessions**: Immediately kill the source identity session in Entra ID.
3. **Terminate SAP Sessions**: Kill active GUI/RFC sessions for the user.

## Tier 2 (Human-in-loop)
4. **Audit Role Changes**: Review any profiles or roles added during the incident window.
5. **RFC Destination Review**: Check for new or modified RFC destinations (potential persistence).
6. **Data Leakage Assessment**: Review SAL for mass data export or sensitive table access (SE16/SE16N).

## Evidence
- SAP Security Audit Log (SAL) extracts.
- Correlation ID between Entra Sign-in and SAP Terminal ID.
