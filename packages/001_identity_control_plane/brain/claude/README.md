# Claude Intelligence Bridge (SOaC Brain Module)

This folder provides a **Claude-powered reasoning layer** you can plug into SOaC playbooks.
It is designed to work with:
- Microsoft Sentinel (KQL outputs)
- CrowdStrike Falcon LogScale outputs
- Any SaaS / cloud audit logs you ingest

## Purpose
Claude is used to:
- Reduce false positives by evaluating **context** (change windows, admin allowlists, automation roles)
- Generate an executive-ready summary with **evidence-backed claims**
- Recommend **surgical containment** (minimum necessary actions) with confidence scoring

## Safety and governance
- Do not send secrets (tokens, passwords, private keys) to the model.
- Provide only the **evidence graph** (sanitized fields) and environment constraints.
- Require Claude outputs to include: "What we know", "What we do not know", "Confidence", "Recommended actions".

## Integration options
1. SOAR calls Claude during triage to propose a containment plan.
2. Human-in-loop: analyst reviews Claude recommendation, then approves Tier 1 actions.
3. Post-incident: Claude generates a board summary and decision record.

See:
- evidence_graph.schema.json
- prompts/
- runbooks/SOAC-BRAIN-CLAUDE_integration.md
