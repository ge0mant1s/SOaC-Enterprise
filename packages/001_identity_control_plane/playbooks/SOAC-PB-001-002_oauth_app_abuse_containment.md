# SOAC-PB-001-002: OAuth App Abuse / Consent Phishing Containment

## Trigger
- OAuth consent/service principal change alert
- New connected app + anomalous sign-in activity

## Tier 1 (automatic)
1. Disable or quarantine the suspect app/service principal
2. Revoke user sessions for impacted users
3. Force re-consent for known-good apps if needed

## Tier 2 (human-in-loop)
4. Review permissions (scopes/roles) granted
5. Remove app role assignments / delegated permissions
6. Execute user comms and credential hygiene

## Evidence
- Audit log correlation IDs
- App/service principal identifiers
- List of impacted users
