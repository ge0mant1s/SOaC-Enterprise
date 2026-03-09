# Simulation 002: Cloud Control Plane Breach
# Objective: Test detection and response to suspicious cloud API calls.

1. **Initial Access:** Simulate a login to AWS console from an unusual IP.
2. **Destructive Action:** Simulate deletion of an S3 bucket.
3. **Verification:**
   - Check if 'Body' (002) detects the unusual login and destructive action.
   - Check if 'Brain' (AI) flags the action as non-standard.
   - Check if 'Purpose' (Logic) revokes tokens and notifies the cloud security team.
