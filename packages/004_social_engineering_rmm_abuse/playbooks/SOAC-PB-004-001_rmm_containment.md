# SOAC-PB-004-001: Social Engineering Containment

## Trigger
- SOAC-DET-004-001
- SOAC-DET-004-002
- SOAC-CORR-004-001

## Tier 1 (Auto, reversible)
1. Isolate endpoint (MDE/CrowdStrike)
2. Revoke all active Entra sessions (Pkg 001)
3. Disable suspicious OAuth grants
4. Notify user for confirmation

## Tier 2 (Approval required)
5. Force password reset + MFA reset
6. Disable user account if persistence detected

## Cross-Package Interaction
- If Cloud control activity detected within 15 minutes → escalate to Pkg 002 workflow
- If SaaS export burst detected → escalate to Pkg 003 workflow
