# SOAC-BRAIN-CLAUDE Integration Runbook

This runbook describes how to call Claude via RouteLLM APIs and embed results into SOaC playbooks.

## Data contract
- Build an Evidence Graph JSON that validates against `evidence_graph.schema.json`.
- Sanitize all secrets.

## RouteLLM API
- Base URL: https://routellm.abacus.ai/v1
- Endpoint: POST /chat/completions
- Model: use a Claude model name (example: `claude-sonnet-4-6`) or `route-llm` for auto-routing.

## Minimal curl example

- Use your API key as a Bearer token.
- Provide the system prompt from `prompts/` and the evidence graph in the user message.

## Operational pattern
1. Tier 0: alert fires -> assemble evidence graph
2. Tier 1: call Claude triage prompt -> propose safe actions
3. Tier 2: analyst approves -> execute containment
4. Post-incident: call executive summary prompt

## Guardrails
- Require confidence + cited signal_ids
- If confidence < 0.6, do not auto-contain; route to human
