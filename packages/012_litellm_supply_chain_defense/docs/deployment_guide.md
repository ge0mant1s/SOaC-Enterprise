# Deployment Guide: LiteLLM Supply Chain Attack Defense (pkg-012)

## Prerequisites

- Access to at least one SIEM platform (Sentinel, Splunk, or Wazuh)
- Endpoint detection agent (CrowdStrike Falcon, SentinelOne, or equivalent)
- Python environments to protect (production LiteLLM deployments)
- SOC team with alert triage capability

## Step-by-Step Deployment

### 1. Deploy Sigma Rules

```bash
# Copy Sigma rules to your SIEM pipeline
cp detections/sigma/*.yml /path/to/sigma-rules/supply_chain/

# Convert to your backend (example: Sentinel)
sigma convert -t microsoft365defender detections/sigma/litellm_pth_persistence.yml
sigma convert -t splunk detections/sigma/litellm_credential_env_access.yml

# Test with sigmac
sigmac -t <backend> --config <config> detections/sigma/*.yml
```

### 2. Deploy Sentinel KQL Detections

For each `.kql` file in `detections/sentinel/`:

1. Open Microsoft Sentinel → **Analytics** → **Create** → **Scheduled query rule**
2. Paste the KQL query from the detection file
3. Configure:
   - **Run query every:** 5 minutes
   - **Lookup data from:** 24 hours
   - **Alert threshold:** Greater than 0
   - **Entity mapping:** Map `DeviceName` to Host, `AccountName` to Account
4. Set severity to match the `AlertSeverity` field in the query

### 3. Deploy Splunk SPL Detections

```bash
# Import as saved searches or correlation searches
# For Splunk Enterprise Security:
cp detections/splunk/*.spl /opt/splunk/etc/apps/soac_supply_chain/local/savedsearches.conf

# Or import via Splunk Web:
# Settings → Searches, Reports, Alerts → New Alert
# Paste SPL query, set schedule, configure alert actions
```

### 4. Deploy Wazuh Rules

```bash
# Copy rules to Wazuh manager
sudo cp detections/wazuh/litellm_supply_chain_rules.xml /var/ossec/etc/rules/

# Restart Wazuh manager to load new rules
sudo systemctl restart wazuh-manager

# Verify rules loaded
sudo /var/ossec/bin/wazuh-logtest
# Paste a test log entry matching the rule conditions
```

### 5. Deploy CrowdStrike IOAs

1. Open Falcon Console → **Configuration** → **Custom IOA Rule Groups**
2. Create new group: `SOaC Supply Chain Defense`
3. For each IOA in `detections/crowdstrike/litellm_ioa_definitions.json`:
   - Create new rule matching the conditions
   - Set disposition (Detect / Prevent)
   - Assign to appropriate host groups

### 6. Import CLAW Playbooks

```bash
# If running SOaC Platform:
# Upload via Admin → Packages → Import
# Or use the API:
curl -X POST https://your-soac-instance/api/admin/packages/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "package=@pkg-012.zip"
```

### 7. Apply Conditional Access Policy

1. Open Entra ID → **Security** → **Conditional Access**
2. Create new policy from `policies/conditional_access/ai_service_access_policy.json`
3. Start in **Report-only** mode
4. Monitor for 7 days, then switch to **Enabled**

### 8. Deploy Governance Policy

```bash
# Apply governance controls per policies/governance/supply_chain_security_policy.yaml
# Key actions:
# 1. Configure approved PyPI mirror
# 2. Enable file integrity monitoring on site-packages paths
# 3. Set up secret manager integration (replace env vars)
# 4. Configure network egress rules for AI workloads
```

## Validation

After deployment, run the validation steps from `validation_guide.md` to confirm all detections fire correctly against the simulated evidence.

## Rollback

To remove all package detections:
1. Disable Sentinel analytics rules prefixed with "LiteLLM Supply Chain"
2. Remove Splunk saved searches
3. Delete Wazuh rules file and restart
4. Disable CrowdStrike IOA rule group
5. Set Conditional Access policy to disabled

---
*SOaC Package pkg-012 | Version 1.0.0 | Apache-2.0*
