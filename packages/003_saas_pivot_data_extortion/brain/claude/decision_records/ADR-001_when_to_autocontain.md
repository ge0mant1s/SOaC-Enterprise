# ADR-001: When to Auto-Contain

Decision: Auto-containment is allowed only when:
- constraints.allow_auto_containment is true, AND
- Claude confidence >= 0.75, AND
- At least two independent signals indicate malicious activity (e.g., identity risk + SaaS export, IAM backdoor + logging tamper).

Otherwise:
- Default to safe Tier 1 constraints (session revoke, step-up auth) and route to analyst approval.
