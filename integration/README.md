# SOaC Brain Integration: The 'Glue Code'
## Connecting Telemetry to Distributed Intelligence

This reference implementation demonstrates how to bridge the gap between your **Body** (SIEM/EDR Alerts) and your **Brain** (AI Reasoning Prompts).

### How it Works
1.  **Trigger:** A detection rule in your SIEM triggers an alert.
2.  **Contextualization:** The `brain_connector.py` script fetches the specific **Reasoning Prompt** for that threat package.
3.  **Reasoning:** The alert telemetry is sent to an LLM (Azure OpenAI, AWS Bedrock, etc.) for behavioral analysis.
4.  **Decision:** The Brain returns a JSON object with a `decision` (Block/MFA/Allow) and a `reason`.
5.  **Action:** If the decision is 'Block', the script triggers the corresponding **Purpose** (YAML Playbook).

### Setup
1.  Set your environment variables:
    *   `SOAC_AI_ENDPOINT`: Your LLM API URL.
    *   `SOAC_AI_KEY`: Your API Key.
2.  Ensure your folder structure matches the repository (e.g., `packages/001_identity_control_plane/brain/reasoning_prompt.txt`).
3.  Run the script: `python brain_connector.py`

### Why this is 'Enterprise-Grade'
- **Low Latency:** Uses structured JSON output for fast parsing.
- **Consistency:** Low temperature settings ensure repeatable security logic.
- **Auditability:** Every decision is logged with the Brain's reasoning for forensic review.
