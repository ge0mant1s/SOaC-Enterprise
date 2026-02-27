# Example: RouteLLM curl (Claude)

```bash
curl -s https://routellm.abacus.ai/v1/chat/completions   -H "Authorization: Bearer $ROUTELLM_API_KEY"   -H "Content-Type: application/json"   -d '{
  "model": "claude-sonnet-4-6",
  "messages": [
    {
      "role": "system",
      "content": "<paste prompts/01_triage_system.md here>"
    },
    {
      "role": "user",
      "content": "<paste Evidence Graph JSON here>"
    }
  ],
  "temperature": 0.2
}'
```
