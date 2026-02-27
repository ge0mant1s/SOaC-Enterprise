# SOAC-SIM-002-002: CloudTrail Stop Logging Simulation

## Goal
Validate detection and auto-remediation of logging tampering.

## Steps
1. In a test AWS account, run: aws cloudtrail stop-logging --name <test-trail>
2. Confirm SOAC-DET-002-002 fires within 1 alert cycle.
3. Validate Tier 1 playbook re-enables logging automatically.

## Expected evidence
- CloudTrail: StopLogging event
- Sentinel Critical alert
- Logging re-enabled within 5 minutes
