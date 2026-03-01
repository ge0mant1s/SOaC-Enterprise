# SOAC-PB-006-001: LLM Abuse Containment (Tool + Data)

## Triggers
- SOAC-DET-006-001 Prompt Injection Indicators
- SOAC-DET-006-002 Excessive Tool Calls
- SOAC-DET-006-003 Sensitive Data Leakage

## Tier 1 (Auto, reversible)
1. Suspend the LLM agent session (gateway kill-switch)
2. Revoke agent/API tokens used for tool execution
3. Disable high-risk connectors temporarily (Drive, Salesforce export APIs)
4. Notify security and application owner with Evidence Graph

## Tier 2 (Approval required)
5. Rotate impacted credentials, invalidate secrets
6. Force re-auth for affected principals (Pkg 001)
7. Freeze suspicious SaaS exports (Pkg 003)

## Cross-Package Interaction
- If Identity anomalies detected → invoke Pkg 001 session revocation
- If SaaS export burst detected → invoke Pkg 003 containment
- If cloud admin actions detected → invoke Pkg 002 guardrails
