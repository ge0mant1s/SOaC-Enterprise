# ATT&CK / Technique Mapping  Package 001 (v1.1)

## Core techniques
- T1078.004  Cloud Accounts
- T1528  Steal Application Access Token
- T1550  Use Alternate Authentication Material
- T1098  Account Manipulation
- T1621  MFA Request Generation
- T1136  Create Account (cloud)

## Correlation philosophy
Identity signals are weak alone. SOaC treats them as a **distributed evidence graph**:
- Weak signals (MFA spam) + (risky sign-in diversity) + (OAuth consent change)  **high confidence**
- (privileged role assignment) within 24h  **critical**

## Coverage
| Stage | Pattern | Primary detections |
|---|---|---|
| Initial Access | MFA fatigue / stolen creds | MFA spam + risky sign-in correlation |
| Persistence | OAuth consent abuse | consent/service principal change + new sign-in anomalies |
| Priv Esc | privileged roles | role assignment anomalies + PIM context |
| Lateral | EntraAWS | SSO/AssumeRole anomalies + unusual UA |
| SaaS | mass access | burst downloads + rare resource access |
