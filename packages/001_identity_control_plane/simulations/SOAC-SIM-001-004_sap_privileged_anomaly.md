# SOAC-SIM-001-004: SAP Privileged Anomaly Simulation

## Goal
Validate detection of unauthorized privileged changes in SAP SAL.

## Steps
1. Log in to SAP with a test administrative account.
2. Perform a "noisy" privileged action (e.g., create a test user, assign a sensitive profile like SAP_ALL to a test user).
3. Ensure SAP Security Audit Log (SAL) is active and being ingested.
4. Confirm Sentinel alert `SOAC-DET-001-051` fires.
5. Validate the SAP user lock action in the playbook.

## Expected Evidence
- SAL Message IDs: AUO (User created), AUP (User changed), AUR (Profile assigned).
