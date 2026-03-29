# Threat Context: LiteLLM Supply Chain Attack

> **Package:** pkg-012 | **Severity:** CRITICAL | **MITRE ATT&CK:** T1195.002, T1552.001, T1528, T1078.004

## Executive Summary

LiteLLM is a widely-adopted open-source Python library that provides a unified interface to 100+ LLM providers (OpenAI, Anthropic, Azure, AWS Bedrock, Google Vertex, etc.). Its position as middleware between applications and AI APIs makes it a high-value supply chain target — a single compromised LiteLLM instance can expose credentials for every connected AI service.

This package simulates a sophisticated supply chain attack against LiteLLM infrastructure, based on real-world attack patterns observed in the Python/AI ecosystem.

## Real-World Attack Patterns & References

### 1. Python Package Supply Chain Compromises

| Incident | Date | Technique | Impact |
|----------|------|-----------|--------|
| **PyPI Typosquatting Campaign** | 2024 | T1195.002 | 45+ malicious packages targeting ML libraries |
| **Ultralytics YOLO Compromise** | Dec 2024 | T1195.002 | Trojanized YOLO packages on PyPI, cryptocurrency miner deployed |
| **LiteLLM CVE-2024-6587** | Sep 2024 | SSRF | Server-Side Request Forgery via `/v1/completions` endpoint |
| **LiteLLM CVE-2025-0306** | Jan 2025 | RCE | Remote code execution via crafted model parameters |
| **Codecov Supply Chain Attack** | Apr 2021 | T1195.002 | Bash uploader modified to exfiltrate CI/CD secrets |
| **event-stream Incident** | Nov 2018 | T1195.002 | npm package compromised to steal cryptocurrency wallet credentials |

### 2. CVE References for LiteLLM

- **CVE-2024-6587**: SSRF vulnerability in LiteLLM proxy allowing access to internal services and cloud metadata endpoints (CVSS 7.5)
- **CVE-2025-0306**: Remote code execution through unsafe deserialization in model configuration handling (CVSS 9.8)
- **CVE-2024-4888**: Improper access control allowing unauthorized API key enumeration
- **CVE-2024-5751**: Server-side template injection in LiteLLM proxy UI

### 3. AI/ML Infrastructure Attack Surface

The AI/ML supply chain presents unique risks:

- **Credential Aggregation**: LiteLLM stores API keys for multiple providers (OpenAI, Anthropic, Azure) — compromising one proxy exposes all
- **Trust Boundaries**: ML pipelines often run with elevated privileges for data access
- **Dependency Chains**: LiteLLM depends on 50+ packages, each a potential attack vector
- **Runtime Persistence**: Python `.pth` files execute automatically on interpreter startup — ideal for persistent implants

## Attack Scenario Modeled

This package models the following attack chain:

```
1. INITIAL ACCESS (T1195.002)
   └─ Trojanized litellm package published to PyPI (typosquat or maintainer compromise)
   
2. EXECUTION (T1059.006)
   └─ .pth file drops into site-packages → auto-executes on Python startup
   
3. PERSISTENCE (T1546.016)
   └─ .pth file survives pip upgrades and virtual environment recreation
   
4. CREDENTIAL ACCESS (T1552.001)
   └─ Implant harvests environment variables: AWS keys, Azure secrets, API tokens
   
5. COLLECTION (T1528)
   └─ OAuth tokens stolen from running LiteLLM proxy sessions
   
6. EXFILTRATION (T1567)
   └─ Credentials exfiltrated to C2 via HTTPS to attacker-controlled domain
   
7. IMPACT (T1078.004)
   └─ Attacker uses stolen credentials for unauthorized cloud access
```

## Indicators of Compromise (IOCs)

### Simulated IOCs (for lab use)

| Type | Value | Context |
|------|-------|---------|
| Domain | `*.litellm-telemetry.io` | C2 exfiltration endpoint |
| Domain | `*.ai-proxy-cdn.com` | Payload delivery |
| Domain | `*.ml-analytics-pipe.net` | Data staging |
| File Path | `*/site-packages/litellm_telemetry.pth` | Persistence mechanism |
| File Path | `*/site-packages/_litellm_hooks.py` | Implant code |
| File Hash | `sha256:a1b2c3d4...` (simulated) | Trojanized package hash |
| User-Agent | `litellm-health/1.0` | C2 beacon user-agent |

### Detection Indicators

- Unexpected `.pth` files in `site-packages/` (exclude `easy-install.pth`, `setuptools.pth`)
- Python processes reading multiple `*_API_KEY` environment variables in rapid succession
- Outbound HTTPS to domains not in approved AI provider list
- pip install commands with `--force-reinstall` or `--no-deps` flags in production
- New service principal authentications from unexpected IP ranges

## Defensive Recommendations

1. **Pin all Python dependencies** with version + hash in `requirements.txt`
2. **Use private PyPI mirrors** with package vetting before promotion
3. **Monitor `.pth` file creation** with FIM (File Integrity Monitoring)
4. **Never store credentials in environment variables** — use secret managers
5. **Network-segment AI/ML workloads** with strict egress rules
6. **Implement SCA** (Software Composition Analysis) in CI/CD pipelines
7. **Rotate all AI API keys** on a 90-day schedule minimum

## References

1. [MITRE ATT&CK T1195.002 — Supply Chain Compromise: Software Supply Chain](https://attack.mitre.org/techniques/T1195/002/)
2. [CrowdStrike 2025 Global Threat Report — AI Infrastructure Threats](https://www.crowdstrike.com/resources/reports/global-threat-report/)
3. [CVE-2024-6587 — LiteLLM SSRF](https://nvd.nist.gov/vuln/detail/CVE-2024-6587)
4. [Python .pth File Abuse for Persistence — SANS ISC](https://isc.sans.edu/)
5. [Ultralytics YOLO Supply Chain Compromise](https://blog.phylum.io/ultralytics-pypi-attack/)
6. [NIST SP 800-218 — Secure Software Development Framework](https://csrc.nist.gov/publications/detail/sp/800-218/final)
7. [SLSA Framework — Supply-chain Levels for Software Artifacts](https://slsa.dev/)

---
*SOaC Package pkg-012 | Version 1.0.0 | Apache-2.0*
