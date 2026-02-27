# ATT&CK / Technique Mapping — Package 001

## Core techniques
- T1078.004 — Cloud Accounts
- T1528 — Steal Application Access Token
- T1550 — Use Alternate Authentication Material
- T1098 — Account Manipulation
- T1621 — MFA Request Generation

## Coverage
| Stage | Pattern | Examples |
|---|---|---|
| Initial Access | MFA fatigue / stolen creds | MFA spam + risky sign-in correlation |
| Persistence | OAuth app abuse | new consent, new service principal |
| Priv Esc | role assignment | privileged group/role add |
| Lateral | Entra→AWS pivot | SSO + AssumeRole anomalies |
