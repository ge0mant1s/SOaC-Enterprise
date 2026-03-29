# Validation Guide: pkg-009

## Test Scenarios
1. **Bulk Data Staging**: Simulate 100+ file downloads → expect Wazuh 101001
2. **Anonymous Sharing**: Create anonymous links on sensitive docs → expect Wazuh 101002
3. **OAuth Escalation**: Simulate permission grant escalation → expect Wazuh 101003
4. **Full Extortion Chain**: Complete replay → expect CLAW auto-trigger
