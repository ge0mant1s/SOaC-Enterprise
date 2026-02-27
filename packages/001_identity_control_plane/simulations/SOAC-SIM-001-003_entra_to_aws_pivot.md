# SOAC-SIM-001-003: EntraAWS Pivot Simulation

## Goal
Validate hunting/detection for AssumeRole bursts and containment workflow.

## Steps
1. Use Entra SSO into AWS.
2. Generate a burst of AssumeRole events (CLI or console) for a test principal.
3. Confirm hunting query flags burst behavior.
4. Execute containment playbook `SOAC-PB-001-003`.

## Expected evidence
- CloudTrail AssumeRole events with IP/UA data
- Correlation to Entra sign-in user
