# Threat Context: Cloud Control Plane Hijack

## Threat Landscape

Cloud control plane attacks have become one of the most impactful vectors
in the modern threat landscape. The CrowdStrike 2025 Global Threat Report
documented a **35% increase** in cloud intrusions year-over-year, with
identity-based attacks leading the majority of cloud compromises.

### Threat Actor: Lynx

**Lynx** is a cloud-focused threat group specializing in IAM privilege
escalation and cross-account pivoting in AWS and Azure environments.
Their operations demonstrate sophisticated understanding of cloud
permission models and trust relationships.

### Notable Cloud Control Plane Incidents

- **July 2023 — Microsoft Storm-0558**: Chinese threat actor exploited
  a Microsoft signing key to forge Azure AD tokens, gaining access to
  email accounts of multiple US government agencies. The attack exposed
  fundamental weaknesses in cloud trust hierarchies and token validation.

- **January 2024 — Midnight Blizzard (APT29) vs Microsoft**: Russian
  intelligence service compromised Microsoft corporate email by exploiting
  a legacy test OAuth application without MFA, then pivoted through the
  corporate environment. This demonstrated the risk of legacy applications
  with elevated permissions.

- **2024 — SCATTERED SPIDER Cloud Operations**: CrowdStrike tracked
  SCATTERED SPIDER pivoting from social-engineered helpdesk access into
  cloud control planes, creating IAM backdoors and disabling logging
  before exfiltrating data from cloud storage.

- **2024-2025 — Cross-Account Pivot Campaigns**: Multiple threat actors
  exploited overly permissive role trust policies to pivot between AWS
  accounts within organizations, effectively turning a single account
  compromise into an organization-wide breach.

### Technical Indicators

| Indicator | Type | Context |
|-----------|------|---------|
| AdministratorAccess policy attachment | CloudTrail event | Privilege escalation |
| StopLogging / DeleteTrail events | CloudTrail event | Log evasion |
| 0.0.0.0/0 security group rules | Network config | Backdoor access |
| Rapid cross-account AssumeRole | CloudTrail event | Lateral movement |
| PermissionsBoundary deletion | CloudTrail event | Guardrail removal |

### MITRE ATT&CK Mapping

| Technique | Name | Usage |
|-----------|------|-------|
| T1098.001 | Additional Cloud Credentials | Creating new access keys/roles |
| T1078.004 | Cloud Accounts | Using valid cloud credentials |
| T1562.008 | Disable Cloud Logs | Disabling CloudTrail/GuardDuty |
| T1550.001 | Application Access Token | Cross-account role assumption |
| T1578 | Modify Cloud Compute Infrastructure | Network/compute changes |

## References

1. CrowdStrike. "2025 Global Threat Report." February 2025.
2. Microsoft. "Analysis of Storm-0558 techniques for unauthorized email access." July 2023.
3. CISA. "Enhanced Monitoring to Detect APT Activity Targeting Outlook Online." July 2023.
4. Microsoft. "Midnight Blizzard: Guidance for responders on nation-state attack." January 2024.
5. Mandiant. "Cloud Compromise and Identity-Based Threats." M-Trends 2024.
