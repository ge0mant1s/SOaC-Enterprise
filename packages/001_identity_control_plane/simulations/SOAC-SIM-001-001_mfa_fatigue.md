# SOAC-SIM-001-001: MFA Fatigue Simulation

## Goal
Validate detection + response chain for MFA push bombing.

## Steps
1. Use a test user with push MFA enabled.
2. Generate 10+ MFA prompts within 2–5 minutes.
3. Confirm alert fires.
4. Validate playbook revokes sessions.
