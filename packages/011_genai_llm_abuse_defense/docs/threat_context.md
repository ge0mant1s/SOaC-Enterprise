# Threat Context: GenAI & LLM Abuse Defense (GTR-2025)

## Executive Summary

CrowdStrike's 2025 Global Threat Report identifies GenAI and LLM abuse as an
emerging threat vector, with adversaries weaponizing AI platforms for social
engineering, data exfiltration, and infrastructure abuse. This package provides
detection and response capabilities for the four primary GenAI attack surfaces:
prompt injection, data leakage, model supply chain compromise, and resource abuse.

## Threat Landscape

### Prompt Injection Attacks (OWASP LLM01)
- **CVE-2024-5184** (BentoML): Remote code execution via prompt injection in
  BentoML serving framework, allowing arbitrary Python execution through crafted
  prompts. CVSS 9.8.
- **CVE-2024-3402** (LangChain): Prompt injection in LangChain agents enabling
  SSRF and data exfiltration through tool-calling mechanisms.
- **Technique**: Attackers craft inputs that override system prompts, extract
  training data, or hijack model behavior. Common patterns include DAN
  (Do Anything Now) jailbreaks, instruction overrides, and multi-turn
  manipulation chains.
- **Real-world**: In December 2024, researchers demonstrated persistent prompt
  injection via ChatGPT memory features, allowing attackers to implant
  instructions that persist across sessions.

### Data Exfiltration via LLM Responses (OWASP LLM06)
- **Wiz Research (2024)**: Discovered that major GenAI platforms inadvertently
  exposed customer data through shared training infrastructure, affecting
  multiple cloud AI services.
- **Training data extraction**: Research from ETH Zurich demonstrated extraction
  of verbatim training data from production LLMs including PII, credentials,
  and proprietary code.
- **RAG poisoning**: Adversaries inject malicious documents into RAG pipelines
  to influence LLM responses and exfiltrate data through crafted queries.

### AI Model Supply Chain Compromise (OWASP LLM05)
- **JFrog Research (2024)**: Identified over 100 malicious ML models on Hugging
  Face containing reverse shells, credential stealers, and ransomware payloads
  embedded in pickle serialization.
- **HiddenLayer (2024)**: Demonstrated weaponization of ONNX and SafeTensors
  model formats with code execution capabilities that bypass standard AV scans.
- **Technique**: Threat actors publish backdoored models on public registries
  (Hugging Face, Civitai, ModelScope) that execute malicious code when loaded
  via `torch.load()`, `pickle.load()`, or `joblib.load()` with unsafe settings.

### Resource Abuse & Model DoS (OWASP LLM04)
- **CrowdStrike GTR-2025**: Reports adversaries hijacking cloud GPU instances
  for unauthorized AI training/inference, costing victims $50K-$500K in compute.
- **LLMjacking**: Sysdig researchers identified attacks stealing cloud AI API
  credentials to run unauthorized inference, with one campaign consuming $46K
  in OpenAI API credits in 48 hours.

## Key Threat Actors
- **SCATTERED SPIDER**: Uses GenAI for vishing script generation and social
  engineering at scale
- **FAMOUS CHOLLIMA (DPRK)**: Leverages LLMs to generate convincing English-
  language communications for IT worker infiltration schemes
- **Multiple eCrime Groups**: Weaponize LLMs for phishing email generation,
  malware code assistance, and credential stuffing automation

## MITRE ATT&CK / ATLAS Mapping
| Technique | ID | Description |
|-----------|-----|------------|
| Exploit Public-Facing Application | T1190 | Prompt injection via web endpoints |
| Exfiltration Over C2 Channel | T1041 | Data leak through LLM responses |
| Supply Chain Compromise | T1195.002 | Malicious ML model distribution |
| Resource Hijacking | T1496 | Unauthorized AI compute usage |
| LLM Prompt Injection | AML.T0051 | Direct/indirect prompt injection |
| Exfiltrate via ML API | AML.T0048 | Data extraction through AI APIs |
| Publish Poisoned Data | AML.T0019 | Backdoored model distribution |
| Cost Harvesting | AML.T0034 | Unauthorized API consumption |

## Indicators of Compromise
### Injection Payload Patterns
- `ignore previous instructions` / `ignore all prior`
- `you are now DAN` / `jailbreak` / `developer mode`
- `disregard your system prompt` / `reveal your instructions`
- `<<<OVERRIDE>>>` / `ADMIN_OVERRIDE`
- `[INST]` / `<<SYS>>` (Llama-format injection)

### Suspicious Model File Hashes (JFrog Campaign)
- `sha256:a3f4b5c6...` (malicious-bert-base, Hugging Face)
- `sha256:d7e8f9a0...` (trojan-gpt2-sentiment, Hugging Face)
- File extensions: `.bin`, `.pt`, `.pkl`, `.gguf`, `.safetensors`, `.onnx`

### Malicious AI Infrastructure
- Unauthorized model registry connections from corporate networks
- API keys appearing in public GitHub repositories
- Unusual GPU utilization patterns in cloud environments

## References
1. CrowdStrike Global Threat Report 2025
2. OWASP Top 10 for LLM Applications v2.0 (2025)
3. MITRE ATLAS - Adversarial Threat Landscape for AI Systems
4. Wiz Research: GenAI Data Leakage in Cloud AI Platforms (2024)
5. JFrog: Malicious ML Models on Hugging Face (2024)
6. Sysdig: LLMjacking - Stolen Cloud Credentials for AI Abuse (2024)
7. HiddenLayer: Weaponizing Machine Learning Models (2024)
8. NIST AI Risk Management Framework (AI RMF 1.0)
