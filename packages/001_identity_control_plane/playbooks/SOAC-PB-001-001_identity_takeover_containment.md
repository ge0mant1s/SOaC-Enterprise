# SOAC-PB-001-001: Identity Takeover Containment

## Trigger
Any of:
- MFA fatigue alert + risky sign-in
- OAuth consent change + anomalous sign-ins
- Privileged role assignment anomaly

## Tier 1 (automatic)
1. Revoke user sessions (Entra)
2. Force re-auth / step-up auth
3. Disable newly-consented OAuth app (if suspected)

## Tier 2 (human-in-loop)
4. Disable user account (if confirmed)
5. Revert role/group changes
6. Rotate secrets / revoke refresh tokens

## Evidence
- SIEM alert IDs + correlations
- Audit log correlation IDs
- Endpoint telemetry links
