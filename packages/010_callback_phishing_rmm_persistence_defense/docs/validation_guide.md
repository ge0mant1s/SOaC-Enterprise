# Validation Guide: pkg-010

## Test Scenarios
1. **RMM Tool Execution**: Run unapproved AnyDesk.exe → expect Wazuh 101101
2. **Browser-Downloaded RMM**: Launch RMM from chrome.exe parent → expect Wazuh 101102
3. **RMM Persistence**: Create service for ScreenConnect → expect Wazuh 101103
4. **Full Callback Chain**: Email + RMM install + persistence → expect CLAW auto-trigger
