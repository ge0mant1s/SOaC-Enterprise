# SOaC-Enterprise: Splunk (SPL) Detection Pack

## Package 001: Identity Control Plane (Token Theft / PIM Abuse)
```spl
index=azure_logs sourcetype="azure:monitor:aad" operationName="Add member to role completed (PIM)"
| where NOT cidrmatch("10.0.0.0/8", src_ip)
| table _time, user, role_name, src_ip
```

## Package 002: Cloud Control Plane (AWS Root Login / IAM Change)
```spl
index=aws_cloudtrail eventName=ConsoleLogin "userIdentity.type"=Root "additionalEventData.MFAUsed"=No
| table _time, userIdentity.arn, sourceIPAddress, user_agent
```

## Package 006: GenAI & LLM Abuse (Data Exfiltration to OpenAI)
```spl
index=network_traffic dest_category="AI_Services" bytes_out > 10000000
| stats sum(bytes_out) as total_exfil by src_ip, user, dest_host
| where total_exfil > 50000000
```
