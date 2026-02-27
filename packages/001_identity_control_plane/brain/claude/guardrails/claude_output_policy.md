# Claude Output Policy (SOaC)

Claude outputs must:
- Cite evidence by signal_id for each major claim
- Include explicit confidence (0.0-1.0)
- Separate facts vs hypotheses vs unknowns
- Provide reversible Tier 1 actions first

Claude outputs must NOT:
- Contain secrets or credentials
- Instruct offensive actions
- Claim attribution unless evidence explicitly supports it
