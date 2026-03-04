
# Simulation 007: Volt Typhoon IT-to-OT Pivot
# Objective: Test the SOaC Enterprise detection and automated containment loop.

1. **Initial Access:** Simulate compromised VPN credentials (M365/Entra ID).
2. **Discovery:** Run 'netsh interface portproxy show all' to identify pivot points.
3. **Lateral Movement:** Attempt to establish a portproxy tunnel to a simulated HMI IP (10.0.1.50).
4. **Verification:** 
   - Check if 'Body' (Sentinel/CrowdStrike) triggers the KQL alert.
   - Check if 'Brain' (AI Reasoning) validates the threat.
   - Check if 'Purpose' (Logic) executes the isolation workflow.
