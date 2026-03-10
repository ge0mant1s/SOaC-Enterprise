# SOaC-Enterprise: Integration Engine
## Connecting the Body, Brain, and Purpose

This directory contains the "Glue Code" and orchestration logic that transforms static security artifacts into a functional, autonomous defense system.

### 📂 Directory Structure

```text
integration/
├── brain_connector_v2_prod.py   # Production-grade AI Reasoning Engine
├── prompt_registry/             # Versioned Prompt Management System
│   ├── prompt_registry_manager.py
│   ├── README.md                # Registry Documentation
│   └── prompts/                 # Versioned .txt prompts per package
└── README.md                    # This file
```

---

### 🧠 1. The Production Brain Connector
The `brain_connector_v2_prod.py` is the core middleware. It listens for alerts from your SIEM/EDR (The Body) and consults the AI (The Brain) for a behavioral verdict.

**Key Features:**
- **Async Execution:** Handles high-velocity alert streams without blocking.
- **Resilience:** Built-in exponential backoff retries and circuit breakers.
- **Auditability:** Generates a `soac_brain_audit.log` containing the full "Chain of Thought" for every decision.
- **Deterministic:** Forced `temperature: 0.0` to ensure consistent security outcomes.

---

### 🗄️ 2. The Prompt Registry
Located in `/prompt_registry`, this system manages the "Intelligence" of the framework. Instead of hardcoded logic, we use versioned prompts.

**Why Versioning Matters:**
- **Rollbacks:** If a new AI model update causes false positives, instantly roll back to `v1.txt`.
- **A/B Testing:** Run different reasoning logic against the same threat data to optimize accuracy.
- **Canary Deploys:** Update the "Brain" for Identity threats without affecting Ransomware defense.

---

### 🛠️ Integration Example

Here is how the **Connector** and **Registry** work together in a production loop:

```python
from prompt_registry.prompt_registry_manager import PromptRegistryManager
from brain_connector_v2_prod import ProductionBrainConnector

# 1. Initialize the Registry and Connector
registry = PromptRegistryManager()
connector = ProductionBrainConnector()

# 2. Fetch the LATEST reasoning logic for a specific threat
package_id = "001_identity_control_plane"
reasoning_logic = registry.get_prompt(package_id)

# 3. Process the alert with the versioned intelligence
alert_data = {"user": "admin", "action": "MFA_Bypass_Attempt", "source_ip": "10.0.0.5"}
decision = await connector.process_alert_async(package_id, alert_data)

print(f"Verdict: {decision.decision} | Confidence: {decision.confidence}")
```

---

### 🚀 Deployment Instructions

1. **Environment Variables:**
   ```bash
   export SOAC_AI_ENDPOINT="https://your-resource.openai.azure.com/"
   export SOAC_AI_KEY="your-secure-api-key"
   export SOAC_MODEL="gpt-4-turbo"
   ```
2. **Install Dependencies:**
   ```bash
   pip install requests asyncio
   ```
3. **Run Validation:**
   Use the `master_simulation_orchestrator.py` in the `/simulations` folder to test the full end-to-end flow.

---

### 🛡️ Security & Privacy
- **Data Masking:** Ensure PII is redacted before sending telemetry to the `brain_connector`.
- **Audit Logs:** Monitor `soac_brain_audit.log` for any signs of prompt injection or model drift.
