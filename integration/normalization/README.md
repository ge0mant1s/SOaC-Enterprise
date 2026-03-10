# SOaC Normalization Layer (ECS Mapping)
## The Universal Language of Autonomous Defense

To differentiate from vendors locked into a single ecosystem, SOaC-Enterprise uses a **Normalization Layer**. This ensures that the **Brain** (AI Reasoning) receives data in a consistent format, regardless of whether it came from Microsoft, CrowdStrike, or an open-source tool like Wazuh.

### 📂 Repository Path
`integration/normalization/`

### Why ECS?
We have adopted the **Elastic Common Schema (ECS)** as our internal standard. This allows:
1. **Vendor Agnostic Reasoning:** The AI doesn't need to know 50 different field names for "User Name."
2. **Cross-Platform Playbooks:** A "Block User" playbook can trigger based on a normalized `user.name` field.
3. **Scalability:** Adding a new vendor (e.g., Splunk, Palo Alto) only requires adding a new mapping function to the `SOaCNormalizer`.

### Supported Mappings
- **Microsoft Sentinel:** Maps KQL entities to ECS.
- **CrowdStrike Falcon:** Maps Falcon telemetry to ECS.
- **Wazuh:** Maps OSSEC-style alerts to ECS.

### Usage
```python
from normalization.normalizer import SOaCNormalizer

# Raw data from your SIEM webhook
raw_data = fetch_from_webhook() 

# Normalize
normalized_alert = SOaCNormalizer.from_sentinel(raw_data)

# Send to Brain
decision = await brain.analyze(normalized_alert)
```
