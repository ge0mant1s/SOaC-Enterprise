
# Simulation 011: Qilin Healthcare Supply Chain & PHI Exfil
# Objective: Test non-destructive response to a clinical data breach.

1. **Initial Access:** Simulate a 'Quick Assist' session on a Windows endpoint.
2. **Credential Theft:** Simulate a canary 'AWS_Access_Key' being read from memory.
3. **PHI Access:** Attempt to list a 'Simulated_PHI_Bucket' in AWS.
4. **Verification:** 
   - Check if 'Body' (011) detects the RMM tool + Cloud API correlation.
   - Check if 'Brain' (AI) flags the access as non-clinical.
   - Check if 'Purpose' (Logic) revokes the AWS role and isolates the endpoint.
