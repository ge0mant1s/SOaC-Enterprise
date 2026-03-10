# SOaC-Enterprise: CrowdStrike Falcon (LQL) Detection Pack

## Package 001: Identity Control Plane (Token Theft / PIM Abuse)
```lql
// Detects suspicious PIM activation from unmanaged IP
event_simple_name=PimRoleAssignmentActivated
| ip_address != "CORPORATE_VPN_RANGE"
| table timestamp, UserPrincipalName, RoleName, ip_address
```

## Package 002: Cloud Control Plane (AWS Root Login / IAM Change)
```lql
// Detects AWS Root user login without MFA
event_simple_name=AwsConsoleSignIn
| userIdentity_type="Root"
| additionalEventData_MFAUsed="false"
| table timestamp, userIdentity_arn, sourceIPAddress
```

## Package 006: GenAI & LLM Abuse (Data Exfiltration to OpenAI)
```lql
// Detects high-volume data transfer to known LLM endpoints
event_simple_name=NetworkConnectIP
| RemoteIP IN ("104.18.7.192/28", "104.18.6.192/28") // OpenAI CIDRs
| OutboundBytes > 10485760 // 10MB+
| table timestamp, ComputerName, UserName, RemoteIP, OutboundBytes
```
