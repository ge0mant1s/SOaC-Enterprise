# Google Workspace detection patterns (Sentinel)

Google Workspace telemetry schema differs by ingestion method.

Use this as a pattern guide:
- Detect **new OAuth token grants** / app authorizations
- Detect **admin privilege changes**
- Detect **large download / Drive export** bursts
- Detect **mailbox access** anomalies

Implement by mapping your ingested tables to:
- actor/user
- IP + geo
- userAgent
- event type
- target resource count

If you share your table names, the community can contribute exact KQL.
