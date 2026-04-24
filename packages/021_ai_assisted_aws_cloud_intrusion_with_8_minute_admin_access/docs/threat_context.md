# AI-Assisted AWS Cloud Intrusion with 8-Minute Admin Access — Threat Context

## Overview
AI-assisted cloud intrusion campaign leveraging Large Language Models (LLMs) to achieve AWS administrative access in under 10 minutes. Threat actors steal valid credentials from misconfigured public S3 buckets, then use LLM-generated code to inject malicious Lambda functions, escalate privileges, and establish persistent backdoor access. The campaign demonstrates novel tactics including LLM-assisted reconnaissance, automated code generation for privilege escalation, and unauthorized usage of cloud-hosted AI models (LLMjacking). Targets include DevOps and cloud engineering teams with access to AWS environments containing sensitive data, ML models, and production infrastructure. This package provides detection coverage for rapid cloud privilege escalation, LLM-assisted automation patterns, Lambda function code injection, and unauthorized Bedrock model invocations.

## Threat Actor
UNC-Classified / AI-Assisted Cloud Intrusion Cluster

## Attack Chain
1. **Credential Discovery in Public S3 Buckets** — Credential Discovery in Public S3 Buckets
   - MITRE: T1552.001
   - Phase: Credential Access
   - Pillar: Detect
2. **AWS Service Reconnaissance** — [BREAKPOINT] AWS Service Reconnaissance
   - MITRE: T1526, T1580
   - Phase: Execution
   - Pillar: Offense
3. **Failed Role Assumption Attempts** — [BREAKPOINT] Failed Role Assumption Attempts
   - MITRE: T1134.001
   - Phase: Execution
   - Pillar: Offense
4. **Lambda Function Code Injection** — [BREAKPOINT] Lambda Function Code Injection
   - MITRE: T1059.006, T1484.002
   - Phase: Execution
   - Pillar: Offense
5. **Administrative Access Key Creation** — [BREAKPOINT] Administrative Access Key Creation
   - MITRE: T1078.004
   - Phase: Initial Access
   - Pillar: Offense
6. **Cross-Account Lateral Movement** — [BREAKPOINT] Cross-Account Lateral Movement
   - MITRE: T1021.007, T1134.001
   - Phase: Lateral Movement
   - Pillar: Respond
7. **Backdoor User Creation** — [BREAKPOINT] Backdoor User Creation
   - MITRE: T1078.004
   - Phase: Initial Access
   - Pillar: Offense
8. **Data Collection and Exfiltration** — Data Collection and Exfiltration
   - MITRE: T1530, T1552.001
   - Phase: Collection
   - Pillar: Detect

## Target Stack
AWS, Sentinel, Sigma

## Category
Cloud
