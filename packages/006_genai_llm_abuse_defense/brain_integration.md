# Brain Layer Integration (Pkg 006)

Claude evaluates:
- Whether the detected pattern is benign experimentation vs active abuse
- Data classification context (PII/secrets)
- Tool call intent (exfiltration vs normal workflow)
- Blast radius (which connectors and principals are involved)

Confidence gating determines:
- Block response vs allow with redaction
- Kill-switch session suspend vs analyst review
