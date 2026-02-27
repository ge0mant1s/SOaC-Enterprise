# Salesforce detection patterns (Sentinel)

Pattern-based detections to implement once logs are ingested:
- Rare IP / geo for admin users
- Burst of report exports / API pulls
- Permission set changes + immediate data extraction
- New connected app + API access spike

Map to your Salesforce event objects (LoginEvent, ReportEvent, APIEvent, ConnectedApp).
