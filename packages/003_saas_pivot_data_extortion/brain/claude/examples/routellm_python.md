# Example: Python call (pseudo-code)

```python
import requests

BASE_URL = "https://routellm.abacus.ai/v1"
API_KEY = "<your key>"

payload = {
  "model": "claude-sonnet-4-6",
  "messages": [
    {"role": "system", "content": open("prompts/01_triage_system.md").read()},
    {"role": "user", "content": open("evidence_graph.json").read()},
  ],
  "temperature": 0.2,
}

r = requests.post(
  f"{BASE_URL}/chat/completions",
  headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
  json=payload,
  timeout=60,
)
print(r.json())
```
