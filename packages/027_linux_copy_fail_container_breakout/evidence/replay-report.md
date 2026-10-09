# Linux Copy Fail Privilege Escalation and Container Breakout — L3 Replay Report

## Package: pkg-027
## Generated: 2026-10-09T12:00:00Z
## Verdict: PASS ✅

---

### Attack Narrative

This replay validates a 6-stage attack chain:

**Stage 1 — Unprivileged local execution in container**
An unprivileged local or containerized process begins the exploit attempt.

**Stage 2 — AF_ALG / algif_aead + splice() interaction**
Process creates AF_ALG sockets and uses unusual cryptographic-socket and splice() sequences.

**Stage 3 — Page-cache corruption to root**
Controlled page-cache corruption yields root (UID 0) execution.

**Stage 4 — Escape to host namespace**
Because the page cache is shared, the attacker escapes the container boundary to the host.

**Stage 5 — Detect container-to-host privilege transition**
Blue team correlates container AF_ALG socket activity with subsequent root execution or host-namespace access by the same workload.

**Stage 6 — Drain, patch and rebuild nodes**
SOC drains/isolates unpatched nodes, applies kernel updates, refreshes node images and rebuilds on suspected escape.


### Attack Chain

| Step | Title | MITRE | Phase | Provider |
|------|-------|-------|-------|----------|
| 1 | Unprivileged local execution in container | T1059 | Execution | — |
| 2 | AF_ALG / algif_aead + splice() interaction | T1068 | Privilege Escalation | — |
| 3 | Page-cache corruption to root | T1068 | Privilege Escalation | — |
| 4 | Escape to host namespace | T1611 | Privilege Escalation | — |
| 5 | Detect container-to-host privilege transition | T1068, T1611 | Detection | — |
| 6 | Drain, patch and rebuild nodes | behavioral | Response | — |

### MITRE Coverage
- [x] T1068 — exercised
- [x] T1611 — exercised
- [x] T1059 — exercised

### Detection Rule Validation
- `rule-027-001`: AF_ALG socket creation by non-root container workload (T1068). **Validated: true positive.**
- `rule-027-002`: Container AF_ALG activity followed by UID-0 or host-namespace access (T1068, T1611). **Validated: true positive.**
- `rule-027-003`: Microsoft Defender CVE-2026-31431 alert correlation (T1068). **Validated: true positive.**

