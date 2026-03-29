# Validation Guide: pkg-004 — Rapid Vulnerability Exploit & Emergency Patch Defense

## Test Scenarios

### 1. Web Server Exploit Chain
- **Input**: Simulate w3wp.exe spawning cmd.exe with encoded PowerShell
- **Expected**: Sigma `zero_day_exploit_indicators` fires CRITICAL; Wazuh 100301 and 100302

### 2. Web Shell Deployment
- **Input**: Simulate .aspx file creation in wwwroot by w3wp.exe
- **Expected**: Sigma `post_exploit_persistence` fires CRITICAL; Wazuh 100303

### 3. KEV Exploit Attempt
- **Input**: Simulate HTTP requests matching CVE-2024-3400 patterns
- **Expected**: `cisa_kev_exploit_correlation` Sentinel rule triggers

### 4. Post-Exploit Reconnaissance
- **Input**: Simulate whoami, systeminfo, net from w3wp.exe parent
- **Expected**: Wazuh 100304 triggers after 3 events in 5 minutes

### 5. Emergency Patch Workflow
- **Input**: Full exploit chain triggering automated response
- **Expected**: CLAW playbook triggers, virtual patches deployed, hosts contained
