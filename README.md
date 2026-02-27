# SOaC: Distributed Intelligence Architecture
> *The Unified Standard for Security Operations as Code*

Official Repository: [ge0mant1s/SOaC-Enterprise](https://github.com/ge0mant1s/SOaC-Enterprise)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![SOaC Version](https://img.shields.io/badge/SOaC-v2.0-blue.svg)](docs/architecture/ARCHITECTURE_OVERVIEW.md)

---

## What is SOaC?

**SOaC (Security Operations as Code)** is a vendor-agnostic, cross-industry security operating model that treats the entire enterprise — from Identity and Cloud to Endpoint and OT — as a single, version-controlled, and intelligent organism.

---

## The Four Pillars of SOaC

| Pillar | Folder | Purpose |
|---|---|---|
| 🏗️ **The Body** | `/packages/` | Artifacts: Detections, Policies, Playbooks |
| 🎯 **The Purpose** | `/logic/` | Cross-domain automated workflows |
| 🧠 **The Brain** | `/brain/` | AI governance, prompts, and reasoning |
| ⚡ **The Nervous System** | `/edge/` | Distributed enforcement and OT/IoT logic |

---

## Repository Structure

```
SOaC-Enterprise/
├── packages/                  # Security-as-Code artifact packages
│   └── 001_identity_control_plane/
├── logic/                     # SOaC Logic: cross-domain workflows
├── brain/                     # SOaC Brain: AI governance layer
├── edge/                      # SOaC Edge: Distributed enforcement
├── simulations/               # Breach simulation scenarios
├── docs/                      # Documentation & Strategy
│   ├── architecture/          # Technical architecture
│   ├── executive/             # CISO & Board-level strategy
│   └── operations/            # SOC/SecEng operational guides
├── .github/                   # GitHub templates and CI workflows
└── CONTRIBUTING.md
```

---

## Quick Start

1. **Clone**: `git clone https://github.com/ge0mant1s/SOaC-Enterprise.git`
2. **Strategize**: Read the [CISO Transformation Guide](docs/executive/CISO_TRANSFORMATION_GUIDE.md)
3. **Deploy**: Start with [Package 001 — Identity Control Plane](packages/001_identity_control_plane/README.md)
