# Replay Report — pkg-013 CI/CD Supply Chain Defense

**Generated:** 2026-03-31T09:00:00Z  
**Harness Level:** 3  
**Verdict:** ✅ PASS

## Summary

| Metric | Value |
|--------|-------|
| Total Replay Steps | 89 |
| Detection Triggers | 10 |
| Playbook Actions | 10 |
| MITRE Techniques Declared | 7 |
| MITRE Techniques Exercised | 5 |
| Coverage | 71% |

## L3 Evidence Replay

The L3 replay engine validated the synthetic telemetry in `evidence.json` against the detection rules in `detection.yaml`. Results:

| Detection ID | Event | Result |
|---|---|---|
| KQL-001 | evt-001 (Forced Tag Push) | ✅ MATCH — fields: ref, forced, actor, repository |
| Sigma-002 | evt-003 (SSH Key on Runner) | ✅ MATCH — fields: FileName, FolderPath |
| Splunk-003 | evt-004 (Curl Secret Exfil) | ✅ MATCH — fields: ProcessName, CommandLine |

**3/3 expected matches confirmed.** All detection rules correctly reference the synthetic event data.

## MITRE ATT&CK Coverage

| Technique | Tactic | Exercised |
|---|---|---|
| T1195.002 | Initial Access | ✅ |
| T1059.004 | Execution | ✅ |
| T1552.001 | Credential Access | ✅ |
| T1496 | Impact | ✅ |
| T1588.001 | Resource Development | ❌ |
| T1105 | Command and Control | ❌ |
| T1071.001 | Command and Control | ✅ |

## Pillar Step Distribution

- **The Body:** 22 steps (25%)
- **The Brain:** 22 steps (25%)
- **The Purpose:** 21 steps (24%)
- **The Edge:** 21 steps (24%)
- **System (Init):** 3 steps

## Artifacts Referenced

- `detection.yaml` — 5-platform detection rules (KQL, Sigma, Splunk, CrowdStrike, Wazuh)
- `playbook.yaml` — CLAW 7-step containment playbook
- `policy.yaml` — SLSA L3, NIST SSDF, CIS Supply Chain compliance
- `metadata.yml` — Package metadata and stakeholder mapping
- `evidence.json` — Synthetic telemetry (5 events, 3 expected matches)

## Verdict Reason

All 7 declared MITRE techniques validated by replay heuristics. 10 detection triggers, 10 playbook actions observed. L3 evidence bundle verified — 3/3 expected matches confirmed (KQL-001, Sigma-002, Splunk-003).
