# SOC Operational Manual: SOaC Enterprise Framework
## Operationalizing Distributed Intelligence

**Target Audience:** SOC Manager, Tier 1/2/3 Analysts, Threat Hunters

### 1. Introduction to SOaC Operations
Traditional SOCs react to "Body" alerts (static signatures). The SOaC SOC operates on **Distributed Intelligence**, correlating telemetry with **Brain** (AI) reasoning.

### 2. Alert Triage Workflow
1.  **L1 - The Body Alert:** A detection rule triggers (e.g., Suspicious PowerShell).
2.  **L2 - The Brain Validation:** The system automatically passes the alert context to the "Brain" (LLM Prompt).
    *   *Scenario A:* Brain confirms "Malicious" -> Immediate "Purpose" (Playbook) execution.
    *   *Scenario B:* Brain flags "Suspicious/Unknown" -> Escalation to Tier 2 Analyst.
    *   *Scenario C:* Brain confirms "False Positive" -> Auto-close with reasoning log.

### 3. Incident Response & Playbooks (The Purpose)
*   **Containment:** How to manually trigger "Purpose" workflows if automation is in 'Monitor' mode.
*   **Evidence Collection:** Accessing the "Brain's" reasoning logs for forensic reporting.

### 4. Threat Hunting with SOaC
*   Using the provided KQL/SPL queries in each package for proactive hunting.
*   Focusing on "Edge" telemetry (Firewall/Proxy) to identify C2 heartbeats.

### 5. Continuous Improvement
*   Feedback loop: How analysts can tune "Brain" prompts based on real-world findings.
