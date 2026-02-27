# SOAC-SIM-001-002: OAuth Consent Abuse Simulation

## Goal
Validate detection of suspicious consent / service principal changes.

## Steps
1. In a test tenant, grant consent to a test application (admin consent if possible).
2. Ensure AuditLogs are ingested.
3. Confirm Sentinel rule `SOAC-DET-001-003` or Sigma-mapped alert triggers.
4. Execute playbook `SOAC-PB-001-002` actions.

## Expected evidence
- Audit log entries for consent/service principal updates
- User(s) associated with the consent
