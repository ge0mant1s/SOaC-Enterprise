# SOAC-PB-002-003: Cloud Snapshot / Storage Exfiltration Response

## Trigger
- SOAC-DET-002-005 (AWS snapshot shared externally)

## Tier 1 (Automatic)
1. Revoke external snapshot sharing (remove public/external attribute)
2. Block source IP at network layer (Security Group / NACL)
3. Revoke actor sessions

## Tier 2 (Human-in-loop)
4. Identify what data was in the snapshot
5. Notify DPO / legal if PII/sensitive data is involved
6. Initiate breach notification process if required

## Evidence
- CloudTrail ModifySnapshotAttribute event
- Snapshot ID + shared account IDs
