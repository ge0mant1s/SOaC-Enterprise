# 🛡️ SOaC-Enterprise: Security-Operations-as-Code
## The Autonomous, Vendor-Agnostic Defense Framework for the Modern Enterprise

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Framework: SOaC](https://img.shields.io/badge/Framework-SOaC-blue.svg)](#architecture)
[![MITRE ATT&CK](https://img.shields.io/badge/MITRE%20ATT%26CK-Validated-green.svg)](integration/benchmarks/MITRE_ATTACK_EVALUATION_RESULTS.md)

**SOaC-Enterprise** is a modular, programmable, and highly scalable framework designed to transform static security artifacts into a dynamic, AI-powered defense system. By unifying **Detection (The Body)**, **Reasoning (The Brain)**, and **Response (The Purpose)**, we provide an open-source alternative to proprietary "Autonomous SOC" vendors.

---

### 🎯 Mission & Strategic Objectives

**Mission:** To democratize high-tier autonomous defense by providing enterprises with a code-driven framework that outpaces adversaries through precision, speed, and explainable AI.

**Strategic Objectives:**
1. **Eliminate Vendor Lock-in:** Provide a universal normalization layer (ECS) that works across Microsoft, CrowdStrike, Splunk, and AWS.
2. **Explainable AI (XAI):** Move away from "Black Box" security. Every AI decision is logged with a full "Chain of Thought" in our **Prompt Registry**.
3. **Shift-Left Security Ops:** Treat detection and response as software. Version control your defense logic just like your application code.
4. **Regulatory Alignment:** Built-in mapping for **GDPR**, **EU AI Act**, **NIST CSF**, and **ISO 27001**.

---

### 🧠 The Architecture: The Four Pillars

SOaC-Enterprise operates on a distributed intelligence model:

*   **💪 The Body (Detection-as-Code):** High-fidelity telemetry ingestion via KQL, LQL, SPL, and Sigma.
*   **🧠 The Brain (AI-Driven Reasoning):** An asynchronous LLM connector that performs behavioral analysis and risk scoring.
*   **🎯 The Purpose (Playbooks-as-Code):** YAML-based automated workflows for containment and remediation.
*   **🛡️ The Edge (Enforcement Logic):** Real-time policy enforcement across Identity (Entra ID), Endpoint (EDR), and Cloud (AWS/Azure).

---

### 📦 Threat Intelligence Packages (The Library)

We provide 11 production-ready packages. Each contains its own `README.md`, detection rules, and specific AI reasoning prompts.

| ID | Package Name | Primary Focus | Path |
|:---|:---|:---|:---|
| 001 | **Identity Control Plane** | Token Theft, PIM Abuse, MFA Bypass | [`/packages/001_identity`](packages/001_identity_control_plane) |
| 002 | **Cloud Control Plane** | AWS/Azure Root Abuse, IAM Shadowing | [`/packages/002_cloud`](packages/002_cloud_control_plane) |
| 003 | **SaaS Pivot & Extortion** | Salesforce, SAP, Google Workspace | [`/packages/003_saas`](packages/003_saas_pivot_data_extortion) |
| 004 | **RMM & Social Eng.** | AnyDesk/ScreenConnect Abuse | [`/packages/004_rmm`](packages/004_social_engineering_rmm_abuse) |
| 005 | **Perimeter Exploit** | Edge Device Chaining (VPN/Firewall) | [`/packages/005_perimeter`](packages/005_perimeter_exploit_chaining) |
| 006 | **GenAI & LLM Abuse** | Prompt Injection, Data Exfiltration | [`/packages/006_genai`](packages/006_genai_llm_abuse_defense) |
| 007 | **Critical Infra (ICS)** | OT/ICS Resilience & Modbus/S7 | [`/packages/007_ics`](packages/007_critical_infrastructure_resilience) |
| 008 | **Sandworm/Destructive** | Wiper Malware & Industrial Sabotage | [`/packages/008_sandworm`](packages/008_sandworm_destructive_defense) |
| 009 | **Financial Defense** | SWIFT/Banking Trojan Patterns | [`/packages/009_finance`](packages/009_financial_industry_defense) |
| 010 | **Lazarus Group** | State-Sponsored Crypto/Apt Defense | [`/packages/010_lazarus`](packages/010_lazarus_group_defense) |
| 011 | **Healthcare Resilience** | Ransomware vs. Medical IoT | [`/packages/011_healthcare`](packages/011_healthcare_resilience) |

---

### 🛠️ The Integration Engine (The Core)

The `integration/` directory contains the production-grade software that runs the framework:

*   **[Master Orchestrator](master_orchestrator.py):** The main entry point that binds all components.
*   **[Brain Connector](integration/brain_connector_v2_prod.py):** Async AI reasoning engine with audit logging.
*   **[Normalization Layer](integration/normalization/):** Maps multi-vendor logs to Elastic Common Schema (ECS).
*   **[Prompt Registry](integration/prompt_registry/):** Version-controlled AI prompts to prevent model drift.
*   **[Analyst Console](integration/console/):** A sleek, web-based "Glass Box" UI for human-in-the-loop approval.
*   **[Playbook Editor](integration/editor/):** Low-code YAML generator for rapid response design.
*   **[Replay Engine](integration/replay_engine/):** Test your defense against historical telemetry.

---

### 🚀 Getting Started

#### 1. Prerequisites
- Python 3.9+
- Access to an LLM API (OpenAI, Azure, or local via RouteLLM)
- A SIEM/EDR data source (Sentinel, CrowdStrike, or Wazuh)

#### 2. Installation
```bash
git clone https://github.com/your-org/SOaC-Enterprise.git
cd SOaC-Enterprise
pip install -r requirements.txt
```

#### 3. Configuration
Set your environment variables:
```bash
export SOAC_AI_KEY="your-api-key"
export SOAC_AI_ENDPOINT="https://your-endpoint"
```

#### 4. Run the Orchestrator
```bash
python master_orchestrator.py
```

---

### 📊 Validation & Trust
We believe in **Radical Transparency**. 
- **MITRE ATT&CK:** View our latest [Evaluation Results](integration/benchmarks/MITRE_ATTACK_EVALUATION_RESULTS.md).
- **Audit Logs:** Every AI decision is stored in `soac_brain_audit.log` for forensic review.

---

### 🤝 Community & Contribution
We are building the future of autonomous security together.
- **Analysts:** Contribute new Playbooks (The Purpose).
- **Engineers:** Add new Vendor Mappings (The Body).
- **Researchers:** Refine AI Prompts (The Brain).

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for our code of conduct and submission process.

---

### 📜 License & Compliance
- **License:** MIT License.
- **Compliance:** Designed to meet **GDPR Article 32** and **EU AI Act** transparency requirements.

**Last Updated:** 2026-03-10  
**Maintainer:** SOaC Community / SOaC-Enterprise Team
