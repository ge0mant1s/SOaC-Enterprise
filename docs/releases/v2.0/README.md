# What's New in SOaC Enterprise v2.0-PLATINUM

**Release: March 2026**

---

## Overview

SOaC Enterprise v2.0-PLATINUM represents the most significant evolution of the Security-as-Code framework since its inception. This release introduces the **Play → Verify → Integrate** lifecycle, a fully evidence-based validation engine, and first-class support for all four security operations roles.

---

## Key Highlights

### 🎭 Four-Role Model

Every scenario, package, and workflow now supports four distinct stakeholder roles:

| Role | Mission | Portal Entry Point |
|------|---------|--------------------|
| **Red Team** | Adversary simulation — execute attack chains mapped to MITRE ATT&CK techniques | Lab → Scenario Replay |
| **Blue Team** | Detection engineering — validate that telemetry and detections fire correctly | Lab → Scenario Replay |
| **SOC Manager** | Operational oversight — monitor playbook execution, triage, and response metrics | Validate → Evidence Dashboard |
| **CISO** | Strategic governance — track compliance posture, risk reduction, and audit readiness | Stakeholders → CISO Track |

### 🔄 Play → Verify → Integrate Lifecycle

The v2.0 workflow replaces ad-hoc validation with a structured three-phase lifecycle:

1. **Play** — Run team game simulations in the Lab environment. Red Team executes attack steps; Blue Team monitors detections and triggers CLAW playbooks.
2. **Verify** — The SOaC Harness (Level 3 Replay) produces Evidence Bundles for every package — machine-readable manifests and human-readable Markdown reports with MITRE ATT&CK coverage metrics.
3. **Integrate** — Validated packages are deployed via GitHub-native CI/CD (`soac-ci.yml`). Each package carries its evidence bundle, making audit and compliance a byproduct of the workflow.

### ✅ Validation & Evidence Engine

- **Level 3 Replay** — Scenario-driven evidence generation maps lab steps to detection triggers, playbook actions, and policy enforcement.
- **Evidence Bundles** — Each of the 11 MTIP packages now carries `evidence-manifest.json` (machine-readable) and `replay-report.md` (human-readable).
- **Verdict System** — Automated PASS / PARTIAL / FAIL verdicts based on MITRE technique coverage, detection trigger confirmation, and playbook action verification.
- **Evidence Dashboard** — The `/validate` page surfaces all 11 packages with their evidence status, verdict, and drill-down to individual evidence artifacts.

### 🎮 Team Game Operations

- **Role-Filtered Scenarios** — Each scenario card in the Lab displays role badges (Red, Blue, SOC, CISO) showing which roles participate.
- **Role Selection Modal** — Before entering a scenario, operators choose their role, filtering the step-by-step walkthrough to show only their perspective.
- **After Action Review (AAR)** — Post-game summaries with timeline, per-role actions, and evidence links.

### 📦 11 MTIP Packages — All Verified

All 11 Modular Threat Intelligence Packages ship with v2.0-PLATINUM evidence:

| ID | Package | Verdict |
|----|---------|--------|
| pkg-001 | AitM Phishing & Session Hijack | PASS |
| pkg-002 | Cloud IAM Privilege Escalation | PASS |
| pkg-003 | Ransomware (Endpoint + Network) | PASS |
| pkg-004 | Supply Chain Compromise (CI/CD) | PASS |
| pkg-005 | Insider Threat (Data Exfiltration) | PASS |
| pkg-006 | API Abuse & Bot Mitigation | PASS |
| pkg-007 | DNS Tunneling & C2 Communication | PASS |
| pkg-008 | Container Escape & K8s Lateral Move | PASS |
| pkg-009 | Zero-Day Exploit Chain | PASS |
| pkg-010 | Business Email Compromise (BEC) | PASS |
| pkg-011 | Cloud Storage Misconfiguration | PASS |

### 🏗️ Architecture Updates

- **Distributed Intelligence Architecture** — Four-pillar model (Body, Brain, Purpose, Edge) now includes explicit role-to-pillar mapping.
- **CLAW Engine v2** — Playbook schema supports `governance.brain_oversight` and `max_blast_radius` constraints.
- **Edge Enforcement API v1** — HMAC-SHA256 authenticated REST endpoints for real-time enforcement actions.
- **Policy-as-Code** — Lab safety policies, environment-scoped enforcement modes (simulate → dry_run → enforce).

### 📄 Documentation Center

- **Rebranded** to "SOaC Enterprise v2.0 Documentation Center"
- **Three-section layout** — Executive Resources, Architecture, Technical Documentation
- **Repository Explorer** — Interactive file tree reflecting the full GitHub structure including `docs/executive` and `docs/architecture` folders
- **All documents updated** for v2.0-PLATINUM with March 2026 timestamps

---

## Upgrade Path

Existing SOaC v1.x deployments can upgrade by:

1. Pulling the latest `main` branch from the SOaC-Enterprise repository
2. Running `soac-harness validate --path packages/ --level 2` to verify schema compatibility
3. Running `soac-harness replay` to regenerate evidence bundles with Level 3 verification
4. Deploying updated packages via the `soac-ci.yml` GitHub Actions workflow

---

*SOaC Enterprise v2.0-PLATINUM — Security operations, codified and verified.*
