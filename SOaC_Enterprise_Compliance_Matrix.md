# SOaC Enterprise — Compliance Matrix

> **Version:** 2.0-PLATINUM · **Harness:** v3.0 · **MITRE ATT&CK:** v16.1 · **Updated:** 2026-03-30

This matrix maps each SOaC Enterprise package to MITRE ATT&CK techniques, compliance frameworks, and platform coverage.

---

## PKG-001 — 0APT Identity Pivot

| Field | Value |
|-------|-------|
| **Tier** | Advanced (3) |
| **MITRE Techniques** | T1557.001 (LLMNR/NBT-NS Poisoning), T1078.004 (Cloud Accounts), T1539 (Steal Web Session Cookie) |
| **Platforms** | Azure AD, Okta, Entra ID |
| **Detections** | 10 rules across Sigma, Sentinel, Splunk, CrowdStrike, Wazuh |
| **Playbooks** | 2 CLAW playbooks |
| **Policies** | 2 governance policies |
| **Compliance** | NIST 800-53 (IA-2, IA-5, AC-7), ISO 27001 (A.9.2, A.9.4), CIS Controls v8 (6.3, 6.5) |

## PKG-002 — Qilin Ransomware Containment

| Field | Value |
|-------|-------|
| **Tier** | Advanced (3) |
| **MITRE Techniques** | T1486 (Data Encrypted for Impact), T1490 (Inhibit System Recovery), T1489 (Service Stop), T1021.002 (SMB/Admin Shares), T1570 (Lateral Tool Transfer) |
| **Platforms** | Multi-platform |
| **Detections** | 10 rules |
| **Playbooks** | 2 CLAW playbooks |
| **Policies** | 2 governance policies |
| **Compliance** | NIST 800-53 (CP-9, CP-10, IR-4), ISO 27001 (A.12.3, A.16.1), CIS Controls v8 (11.1, 11.3, 11.4) |

## PKG-003 — Cloud Control Plane Hijack

| Field | Value |
|-------|-------|
| **Tier** | Advanced (3) |
| **MITRE Techniques** | T1098.001 (Additional Cloud Credentials), T1078.004 (Cloud Accounts), T1562.008 (Disable Cloud Logs), T1550.001 (Application Access Token), T1578 (Modify Cloud Compute) |
| **Platforms** | AWS, Azure, GCP |
| **Detections** | 10 rules |
| **Playbooks** | 2 CLAW playbooks |
| **Policies** | 2 governance policies |
| **Compliance** | NIST 800-53 (AC-2, AC-6, AU-12), CIS Controls v8 (6.1, 6.2, 8.2), CSA CCM v4 (IAM-01, IAM-04) |

## PKG-004 — Rapid Vulnerability Exploit & Emergency Patch Defense

| Field | Value |
|-------|-------|
| **Tier** | Elite (4) |
| **MITRE Techniques** | T1190 (Exploit Public-Facing Application), T1059 (Command and Scripting Interpreter), T1505.003 (Web Shell), T1203 (Exploitation for Client Execution), T1210 (Exploitation of Remote Services) |
| **Platforms** | Windows, Linux, Network |
| **Detections** | 10 rules |
| **Playbooks** | 2 CLAW playbooks |
| **Policies** | 2 governance policies |
| **Compliance** | NIST 800-53 (SI-2, SI-5, RA-5), ISO 27001 (A.12.6, A.14.2), CIS Controls v8 (7.1, 7.4, 7.7) |

## PKG-005 — SaaS OAuth & Integration Risk Defense

| Field | Value |
|-------|-------|
| **Tier** | Advanced (3) |
| **MITRE Techniques** | T1098.003 (Additional Cloud Roles), T1566.002 (Spearphishing Link), T1567 (Exfiltration Over Web Service), T1528 (Steal Application Access Token), T1530 (Data from Cloud Storage) |
| **Platforms** | Microsoft 365, Google Workspace, SaaS |
| **Detections** | 10 rules |
| **Playbooks** | 2 CLAW playbooks |
| **Policies** | 2 governance policies |
| **Compliance** | NIST 800-53 (AC-6, CA-9, SA-9), CIS Controls v8 (16.9, 16.10), CSA CCM v4 (STA-03, DSP-04) |

## PKG-006 — EvilProxy Credential Harvest

| Field | Value |
|-------|-------|
| **Tier** | Advanced (3) |
| **MITRE Techniques** | T1557.001 (LLMNR/NBT-NS Poisoning), T1539 (Steal Web Session Cookie), T1621 (Multi-Factor Authentication Request Generation), T1566.002 (Spearphishing Link), T1114.003 (Email Forwarding Rule) |
| **Platforms** | Multi-platform |
| **Detections** | 10 rules |
| **Playbooks** | 2 CLAW playbooks |
| **Policies** | 2 governance policies |
| **Compliance** | NIST 800-53 (IA-2, IA-5, SI-3), ISO 27001 (A.9.4, A.13.1), CIS Controls v8 (6.5, 9.2) |

## PKG-007 — Identity-Led Intrusion Defense (GTR-2025)

| Field | Value |
|-------|-------|
| **Tier** | Advanced (3) |
| **MITRE Techniques** | T1190, T1505.003, T1068, T1021, T1078, T1557, T1539, T1550 |
| **Platforms** | Multi-platform |
| **Detections** | 10 rules |
| **Playbooks** | 2 CLAW playbooks |
| **Policies** | 2 governance policies |
| **Compliance** | NIST 800-53 (IA-2, AC-2, IR-4), CIS Controls v8 (4.1, 6.1, 6.3, 13.1) |

## PKG-008 — Cloud Control Plane Defense

| Field | Value |
|-------|-------|
| **Tier** | Elite (4) |
| **MITRE Techniques** | T1484.002 (Domain Trust Modification), T1525 (Implant Internal Image), T1496 (Resource Hijacking), T1098.001 (Additional Cloud Credentials), T1530 (Data from Cloud Storage), T1648 (Serverless Execution) |
| **Platforms** | Multi-platform |
| **Detections** | 10 rules |
| **Playbooks** | 2 CLAW playbooks |
| **Policies** | 2 governance policies |
| **Compliance** | NIST 800-53 (AC-2, AC-6, AU-12, SC-7), CSA CCM v4 (IAM-01, IVS-01), CIS Controls v8 (6.1, 6.8, 8.2) |

## PKG-009 — SaaS OAuth Abuse & Extortion Defense

| Field | Value |
|-------|-------|
| **Tier** | Advanced (3) |
| **MITRE Techniques** | T1567.002 (Exfiltration to Cloud Storage), T1213 (Data from Information Repositories), T1657 (Financial Theft), T1098.003 (Additional Cloud Roles), T1530 (Data from Cloud Storage) |
| **Platforms** | Multi-platform |
| **Detections** | 10 rules |
| **Playbooks** | 2 CLAW playbooks |
| **Policies** | 2 governance policies |
| **Compliance** | NIST 800-53 (AC-6, AU-12, SC-28), CIS Controls v8 (3.3, 16.9, 16.12) |

## PKG-010 — Callback Phishing & RMM Persistence Defense

| Field | Value |
|-------|-------|
| **Tier** | Advanced (3) |
| **MITRE Techniques** | T1566.003 (Spearphishing via Service), T1219 (Remote Access Software), T1543.003 (Windows Service), T1053.005 (Scheduled Task), T1204.001 (Malicious Link) |
| **Platforms** | Multi-platform |
| **Detections** | 10 rules |
| **Playbooks** | 2 CLAW playbooks |
| **Policies** | 2 governance policies |
| **Compliance** | NIST 800-53 (SI-3, SI-4, CM-7), CIS Controls v8 (2.5, 9.2, 10.1) |

## PKG-011 — GenAI & LLM Abuse Defense (GTR-2025)

| Field | Value |
|-------|-------|
| **Tier** | Advanced (3) |
| **MITRE Techniques** | T1190 (Exploit Public-Facing Application), T1041 (Exfiltration Over C2 Channel), T1195.002 (Compromise Software Supply Chain), T1496 (Resource Hijacking) |
| **Platforms** | Multi-platform |
| **Detections** | 13 rules |
| **Playbooks** | 3 CLAW playbooks |
| **Policies** | 2 governance policies |
| **Compliance** | NIST AI RMF 1.0 (MAP-1, MEASURE-2, GOVERN-1), OWASP LLM Top 10 (LLM01, LLM02, LLM06), CIS Controls v8 (16.1, 18.3) |

## PKG-012 — LiteLLM Supply Chain Attack Defense

| Field | Value |
|-------|-------|
| **Tier** | Elite (4) |
| **MITRE Techniques** | T1195.002 (Compromise Software Supply Chain), T1552.001 (Credentials in Files), T1528 (Steal Application Access Token), T1078.004 (Cloud Accounts), T1546.016 (Installer Packages), T1071.001 (Web Protocols), T1567 (Exfiltration Over Web Service) |
| **Platforms** | Multi-platform |
| **Detections** | 10 rules |
| **Playbooks** | 3 CLAW playbooks |
| **Policies** | 2 governance policies |
| **Compliance** | NIST 800-53 (SA-12, SI-7, SR-3), SSDF (PO.1, PS.1, PW.4), SLSA Level 3+, CIS Controls v8 (16.1, 16.4, 16.14) |

---

## Summary

| Metric | Count |
|--------|-------|
| **Packages** | 12 |
| **Detection Rules** | 123 |
| **Playbooks** | 24 |
| **Policies** | 24 |
| **MITRE Techniques** | 60+ unique |
| **Tier Distribution** | 8 Advanced, 4 Elite |
| **Platform Coverage** | AWS, Azure, GCP, M365, Google Workspace, Okta, Multi-platform |
