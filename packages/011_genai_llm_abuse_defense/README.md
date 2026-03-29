# GenAI & LLM Abuse Defense

> **Package ID:** pkg-011 | **Tier:** Advanced | **Difficulty:** 3/4

## Overview

Detect GenAI and LLM abuse including prompt injection, data exfiltration, and model manipulation.

## MITRE ATT&CK Coverage

- `T1059`
- `T1530`
- `T1213`

## Structure

```
pkg-011/
├── manifest.json          # Package metadata
├── scenario.json          # Simulation steps
├── README.md              # This file
├── detections/
│   ├── sigma/             # Sigma detection rules
│   ├── sentinel/          # Microsoft Sentinel KQL
│   ├── splunk/            # Splunk SPL queries
│   ├── wazuh/             # Wazuh XML rules
│   └── crowdstrike/       # CrowdStrike IOA definitions
├── playbooks/
│   ├── claw/              # SOaC CLAW playbooks (YAML)
│   └── soar/              # Generic SOAR playbooks (JSON)
├── policies/
│   ├── conditional_access/ # Entra ID / Cloud IAM policies
│   └── governance/        # Security governance policies
├── docs/
│   ├── deployment_guide.md
│   ├── validation_guide.md
│   └── threat_context.md
├── replays/
│   └── replay_scenario.json
├── validation/
│   └── evidence_bundle.json
└── mappings/
    ├── mitre_attack.json
    └── stack_matrix.json
```

## Quick Start

1. Deploy detections to your SIEM (choose your stack folder)
2. Import playbooks into your SOAR platform
3. Apply policies to your identity provider
4. Run the simulation in SOaC Lab or use `replays/replay_scenario.json`
5. Validate results against `validation/evidence_bundle.json`

## Roles

- **Red Team**
- **Blue Team**
- **SOC**
- **CISO**

## Tags

`gtr-2025` · `genai` · `llm` · `ai-abuse` · `defense`

## License

Apache-2.0 — Free and open for all defenders.
