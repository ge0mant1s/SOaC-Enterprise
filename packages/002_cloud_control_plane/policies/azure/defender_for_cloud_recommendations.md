# Azure Defender for Cloud -- SOaC Package 002 Recommendations

## Priority controls
- Enable Microsoft Defender for all resource types (Servers, Storage, SQL, Containers, Key Vault, ARM)
- Enable Diagnostic Settings on all subscriptions (Activity Log -> Log Analytics)
- Enforce MFA for all Azure AD users with ARM access
- Enable Just-In-Time (JIT) VM access
- Restrict public blob access on all storage accounts
- Enable Azure Policy: Audit privileged role assignments

## Conditional Access (ARM-specific)
- Require MFA for Azure Management (app: 797f4846-ba00-4fd7-ba43-dac1f8f63013)
- Require compliant device for Owner/Contributor roles
