
# Simulation 008: Sandworm CaddyWiper Deployment
# Objective: Test the SOaC Enterprise response to destructive lateral movement.

1. **Initial Access:** Simulate an exploit on an internet-facing Edge device.
2. **Lateral Movement:** Use a simulated 'smbexec' to move to a target server.
3. **Wiper Staging:** Create a non-destructive 'canary' file in a sensitive directory.
4. **Verification:** 
   - Check if 'Body' (008) detects the lateral movement.
   - Check if 'Brain' (AI Reasoning) flags the behavioral anomaly.
   - Check if 'Purpose' (Logic) triggers the VLAN isolation and VM snapshot.
