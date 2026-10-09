# Linux Copy Fail Privilege Escalation and Container Breakout — Threat Context

## Overview
CVE-2026-31431 ("Copy Fail") is a Linux kernel privilege-escalation flaw in the algif_aead component of the AF_ALG userspace cryptographic API. Microsoft reported that an unprivileged local user could corrupt the kernel page cache and obtain root access. Because the page cache is shared across containers on a host, the flaw can support container breakout and host compromise. This package provides container-to-host privilege-escalation detection, hunting and response content for Linux hosts, Kubernetes nodes and CI/CD runners.

## Threat Actor
Not established in reviewed sources

## Source-Supported Behavior vs. Engineering Mappings
## Behavioral Context

Copy Fail (CVE-2026-31431) abuses the Linux `AF_ALG`/`algif_aead` cryptographic socket interface together with `splice()` to corrupt the shared page cache, escalate from an unprivileged context to root and — because the page cache is shared with the host — escape the container boundary. `AF_ALG`, `algif_aead` and `splice()` are legitimate kernel features; their presence is **not** an indicator of compromise. Detection logic in this package is behavioral and engineering-driven, focusing on unusual sequences (non-root AF_ALG usage followed by privilege transition) rather than static IOCs. Microsoft reported the issue on 1 May 2026.

## Attack Chain
1. **Unprivileged local execution in container** — An unprivileged local or containerized process begins the exploit attempt.
   - MITRE: T1059
   - Phase: Execution
   - Pillar: Offense
2. **AF_ALG / algif_aead + splice() interaction** — Process creates AF_ALG sockets and uses unusual cryptographic-socket and splice() sequences.
   - MITRE: T1068
   - Phase: Privilege Escalation
   - Pillar: Offense
3. **Page-cache corruption to root** — Controlled page-cache corruption yields root (UID 0) execution.
   - MITRE: T1068
   - Phase: Privilege Escalation
   - Pillar: Offense
4. **Escape to host namespace** — Because the page cache is shared, the attacker escapes the container boundary to the host.
   - MITRE: T1611
   - Phase: Privilege Escalation
   - Pillar: Offense
5. **Detect container-to-host privilege transition** — Blue team correlates container AF_ALG socket activity with subsequent root execution or host-namespace access by the same workload.
   - MITRE: T1068, T1611
   - Phase: Detection
   - Pillar: Detect
6. **Drain, patch and rebuild nodes** — SOC drains/isolates unpatched nodes, applies kernel updates, refreshes node images and rebuilds on suspected escape.
   - MITRE: behavioral (no source-reported technique)
   - Phase: Response
   - Pillar: Respond

## Target Stack
Sigma, Sentinel, Splunk, CrowdStrike, Wazuh, MDE, Endpoint, Cloud, CI/CD

## Category
Cloud

## Intelligence Sources
- <https://www.microsoft.com/en-us/security/blog/2026/05/01/cve-2026-31431-copy-fail-vulnerability-enables-linux-root-privilege-escalation/>
- <https://learn.microsoft.com/en-us/azure/azure-linux/manage-cves>
