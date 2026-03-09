# Simulation 001: Identity Control Plane Breach
# Objective: Test detection and response to suspicious identity access.

1. **Initial Access:** Simulate a login to Azure AD PIM role from an unusual location.
2. **Privilege Escalation:** Simulate activation of a Global Administrator role.
3. **Verification:**
   - Check if 'Body' (001) detects the unusual login pattern.
   - Check if 'Brain' (AI) flags the access as non-standard.
   - Check if 'Purpose' (Logic) blocks the account and notifies CISO.
