# SOaC Package: Identity-led Intrusion Defense (pkg-001)

Detect and contain AitM phishing, session hijacking, and identity-based attacks
across Okta, Entra ID, and Azure AD.

## Contents
- `revoke_sessions.yaml` — CLAW Playbook for revoking compromised sessions
- `splunk_sample_detection.spl` — Splunk detection rule for AitM/Okta anomalies
- `ai_governance_baseline.yaml` — AI governance policy for The Brain oversight

## MITRE ATT&CK
- T1557.001 — Adversary-in-the-Middle
- T1078.004 — Valid Accounts: Cloud
- T1539 — Steal Web Session Cookie

## License
Apache 2.0 — https://github.com/ge0mant1s/SOaC-Enterprise/blob/main/LICENSE
