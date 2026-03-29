# Deployment Guide: GenAI & LLM Abuse Defense (pkg-011)

## Prerequisites
- SIEM platform: Microsoft Sentinel, Splunk, or Wazuh (v4.7+)
- Web proxy/WAF with request body inspection capability
- API gateway with rate limiting for AI endpoints
- CrowdStrike Falcon with IOA rule deployment permissions
- DLP solution capable of inspecting API response payloads

## Phase 1: Detection Deployment (Week 1)

### Sigma Rules
Deploy three Sigma rules to your SIEM via sigma-cli or native import:

```bash
# Convert for your backend
sigma convert -t splunk -p sysmon detections/sigma/genai_prompt_injection_attempt.yml
sigma convert -t microsoft365defender detections/sigma/genai_data_exfiltration_via_llm.yml
sigma convert -t splunk detections/sigma/genai_model_poisoning_supply_chain.yml
```

**Tuning Notes:**
- `genai_prompt_injection_attempt.yml`: Adjust `c-uri` patterns to match your
  organization's AI endpoint paths. Add internal LLM gateway URLs.
- `genai_data_exfiltration_via_llm.yml`: Extend `sc-body` patterns with
  organization-specific sensitive data regex (internal project names, etc.)
- `genai_model_poisoning_supply_chain.yml`: Add your approved model registry
  domains to `filter_trusted` section.

### KQL Analytics Rules (Sentinel)
1. Navigate to Microsoft Sentinel > Analytics > Create > Scheduled query rule
2. Import each `.kql` file as a new analytics rule
3. Set run frequency: 1 hour (prompt injection), 30 minutes (data leak)
4. Configure entity mapping: IP → SourceIP, URL → RequestURL

### SPL Correlation Searches (Splunk)
1. Import `.spl` files as saved searches in Splunk Enterprise Security
2. Create correlation search for `genai_prompt_injection.spl`:
   - Scheduling: Every 15 minutes
   - Notable event: Severity High
   - Throttle: Per src_ip, 1 hour
3. Create macro `genai_prompt_injection_filter` for site-specific exclusions

### Wazuh Rules
1. Copy `genai_abuse_rules.xml` to `/var/ossec/etc/rules/local_rules.xml`
2. Restart Wazuh manager: `systemctl restart wazuh-manager`
3. Verify rules loaded: `$HOME/ossec/bin/ossec-logtest`
4. Rule IDs 101201-101204 should appear in loaded rules list

### CrowdStrike Falcon IOA
1. Navigate to Falcon Console > Custom IOA Rule Groups
2. Create rule group: "SOaC-011-GenAI-Defense"
3. Import rules from `genai_abuse_ioa.json`:
   - "Prompt Injection Payload in Process Args" → Severity: High
   - "Unauthorized AI Model File Download" → Severity: Medium
   - "Suspicious AI Framework Execution Chain" → Severity: High
4. Assign to host groups: All AI/ML workstations and servers

## Phase 2: Policy Deployment (Week 2)

### Conditional Access Policy
1. Deploy `ca_genai_security_policy.json` via Entra ID / Azure AD
2. Start in Report-Only mode for 7 days
3. Review access logs for false positives
4. Switch to Enforcement mode after validation

### Governance Controls
1. Distribute `governance_genai_usage.yaml` to AI platform administrators
2. Implement controls per priority: input_security > output_security > model_integrity
3. Schedule quarterly compliance reviews

## Phase 3: Playbook Activation (Week 3)

### CLAW Playbooks
1. Import `claw_genai_prompt_injection_response.yaml` into SOAR platform
2. Import `claw_genai_data_exfil_response.yaml` into SOAR platform
3. Configure integration connections (SIEM API, WAF, API Gateway, Secrets Manager)
4. Run tabletop exercise with SOC team

### SOAR Workflow
1. Import `soar_genai_incident.json` into XSOAR/Swimlane/Cortex
2. Map integration credentials for all connected tools
3. Validate automation sequences with test alerts

## Validation Checklist
- [ ] Sigma rules converting and alerting correctly
- [ ] KQL queries returning results in Sentinel
- [ ] Wazuh rules 101201-101204 loaded and tested
- [ ] CrowdStrike IOA rules active on target host groups
- [ ] Conditional access enforcing MFA on AI endpoints
- [ ] Playbooks executing containment steps within SLA
- [ ] Evidence bundle scenarios producing expected alerts
