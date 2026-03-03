# Security Reasoning Core (v1.0)
## The Central Intelligence of the SOaC Distributed Architecture

This core component acts as the "Brain" of the SOaC ecosystem. It provides high-level reasoning, confidence scoring, and enforcement tiering by ingesting normalized telemetry from all domain packages (001-006).

### 📂 Structure
- `/prompts`: System and reasoning prompts for Claude/LLMs.
- `/schemas`: JSON/YAML definitions for the Evidence Graph and Integration Handshakes.
- `/api`: Sample integration scripts for CLAW and Edge connectivity.
- `/simulations`: Validation scenarios for testing reasoning logic.

### 🔗 Integration
- **Input:** Evidence Graph JSON from any SOaC package.
- **Orchestration:** Bidirectional callback with the **CLAW Engine**.
- **Enforcement:** Direct policy snippet generation for the **Nervous System (Edge)**.
