# SOAC-SIM-002-003: AWS Snapshot External Share Simulation

## Goal
Validate detection of snapshot shared externally.

## Steps
1. Create a test EBS snapshot.
2. Modify attribute to share with an external test account:
   aws ec2 modify-snapshot-attribute --snapshot-id snap-XXXX --attribute createVolumePermission --operation-type add --user-ids <external-test-account-id>
3. Confirm SOAC-DET-002-005 fires.
4. Validate Tier 1 revokes the share.

## Expected evidence
- CloudTrail: ModifySnapshotAttribute event
- Sentinel High alert
