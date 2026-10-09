# Linux Copy Fail Privilege Escalation and Container Breakout

**Package ID:** pkg-027
**Package Type:** instance
**Schema Version:** 3.0
**Difficulty:** Elite

CVE-2026-31431 ("Copy Fail") is a Linux kernel privilege-escalation flaw in the algif_aead component of the AF_ALG userspace cryptographic API. Microsoft reported that an unprivileged local user could corrupt the kernel page cache and obtain root access. Because the page cache is shared across containers on a host, the flaw can support container breakout and host compromise. This package provides container-to-host privilege-escalation detection, hunting and response content for Linux hosts, Kubernetes nodes and CI/CD runners.

## MITRE ATT&CK Coverage
- T1068
- T1611
- T1059

> MITRE techniques are **SOaC engineering mappings** derived from documented behavior unless a source explicitly reports the technique. See `docs/threat_context.md` for source-supported behavior vs. engineering mappings.

## Attack Chain (6 Stages)
1. **Unprivileged local execution in container** — T1059
2. **AF_ALG / algif_aead + splice() interaction** — T1068
3. **Page-cache corruption to root** — T1068
4. **Escape to host namespace** — T1611
5. **Detect container-to-host privilege transition** — T1068, T1611
6. **Drain, patch and rebuild nodes** — behavioral

## Threat Intelligence Sources
- <https://www.microsoft.com/en-us/security/blog/2026/05/01/cve-2026-31431-copy-fail-vulnerability-enables-linux-root-privilege-escalation/>
- <https://learn.microsoft.com/en-us/azure/azure-linux/manage-cves>

## Public IOCs and Artifacts

No public file hashes, IP addresses or domains have been established for Copy Fail (CVE-2026-31431) exploitation. The following are **public technical artifacts**, not indicators of compromise:

| Artifact | Type | Note |
|----------|------|------|
| `AF_ALG` / `algif_aead` | Kernel interface | Legitimate Linux cryptographic socket interface abused during exploitation |
| `splice()` | Syscall | Legitimate syscall used in the page-cache corruption primitive |
| CVE-2026-31431 | Identifier | Vulnerability identifier ("Copy Fail") |

Detection must therefore rely on behavioral correlation rather than static IOC matching.

**Sources:** Microsoft Security Response Center (1 May 2026); CISA KEV review (pending primary-source validation).

## Target Platforms
Sigma, Sentinel, Splunk, CrowdStrike, Wazuh, MDE, Endpoint, Cloud, CI/CD

## Contents
- `manifest.json` — Package manifest (Harness v3.0)
- `metadata.yml` — Package metadata mirror
- `detection.yaml` — Detection rules (KQL/Sigma)
- `playbook.yaml` — CLAW response playbook
- `policy.yaml` — Governance policy
- `hunt.yaml` — Proactive threat hunt
- `intelligence.json` — Intelligence analysis metadata
- `scenario.json` — Lab simulation data
- `evidence.json` — L3 replay evidence
- `evidence/` — Evidence manifest and replay report
- `detections/` — Per-platform detection rule files (Sentinel/Sigma/Splunk/Wazuh/CrowdStrike)
- `hunts/` — Hunt queries and analysis procedure
- `playbooks/` — CLAW/containment and SOAR/investigation playbooks
- `policies/` — Environment-specific policies
- `mappings/` — MITRE ATT&CK mapping
- `docs/` — Deployment guide, threat context, validation guide
