# SOAC-PB-003-001: SaaS Data Extortion Containment

## Trigger
- SOAC-DET-003-001
- SOAC-DET-003-002
- SOAC-CORR-003-001

## Tier 1 (Automatic)
1. Revoke SaaS session tokens
2. Disable OAuth / API tokens
3. Force password reset + MFA re-registration
4. Restrict IP temporarily via Conditional Access

## Tier 2 (Human-in-loop)
5. Identify data accessed/exported
6. Engage legal/DPO if required
7. Review audit logs for privilege escalation
