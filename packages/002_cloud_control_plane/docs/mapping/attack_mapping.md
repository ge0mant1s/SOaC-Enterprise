# ATT&CK / Technique Mapping -- Package 002

## Core techniques
- T1078.004  Cloud Accounts (persistence via new IAM users/roles/service principals)
- T1098.001  Additional Cloud Credentials
- T1136.003  Create Cloud Account
- T1562.008  Disable Cloud Logs
- T1537     Transfer Data to Cloud Account
- T1580     Cloud Infrastructure Discovery
- T1619     Cloud Storage Object Discovery
- T1552.005 Cloud Instance Metadata API

## Correlation philosophy
Cloud control plane signals are high-fidelity but often isolated.
SOaC treats them as a distributed evidence graph:

- (New IAM user/role) + (CloudTrail disabled) = Critical
- (Snapshot created) + (new external share) = High
- (Risky Entra sign-in) + (AssumeRole burst) + (IAM change) = Critical

## Coverage map
| Stage          | Pattern                          | Primary detections                        |
|----------------|----------------------------------|-------------------------------------------|
| Persistence    | IAM backdoor creation            | New IAM user/role/SP + key creation       |
| Defense Evasion| Logging/monitoring tampering     | CloudTrail stop/delete, Diag log disable  |
| Exfiltration   | Snapshot/storage access          | Snapshot share + S3/Blob access bursts    |
| Lateral        | Cross-cloud pivot                | AssumeRole + Entra correlation            |
| Discovery      | Infra/storage enumeration        | Describe/List API bursts                  |
