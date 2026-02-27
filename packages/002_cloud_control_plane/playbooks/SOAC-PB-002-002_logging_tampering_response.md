# SOAC-PB-002-002: Cloud Logging Tampering Response

## Trigger
- SOAC-DET-002-002 (AWS CloudTrail tampering)
- SOAC-DET-002-003 (Azure Diagnostic Log disable)

## Tier 1 (Automatic)
1. Re-enable CloudTrail logging immediately (AWS: cloudtrail:StartLogging)
2. Re-enable Azure Diagnostic Settings (ARM API call)
3. Alert SOC lead and CISO immediately (P1 escalation)

## Tier 2 (Human-in-loop)
4. Investigate the actor who disabled logging
5. Assume breach posture: initiate full IR process
6. Preserve all available logs before re-enabling (snapshot current state)

## Evidence
- CloudTrail event for StopLogging/DeleteTrail
- Azure Activity Log for diagnostic setting deletion
