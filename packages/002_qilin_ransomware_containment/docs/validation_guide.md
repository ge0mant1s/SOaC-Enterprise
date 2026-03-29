# Validation Guide: pkg-002 — Qilin Ransomware Containment

## Validation Approach

This package uses replay-driven validation. The evidence bundle contains
simulated telemetry for a complete Qilin ransomware attack chain.

## Test Scenarios

### 1. Encryption Detection
- **Input**: Simulated file rename events with `.qilin` extension (500+ files in 5 minutes)
- **Expected**: `ransomware_encryption_activity` Sigma rule fires at CRITICAL
- **Expected**: `ransomware_encryption_chain` Sentinel rule triggers with FileCount >= 500

### 2. VSS Deletion Detection
- **Input**: Simulated `vssadmin delete shadows /all /quiet` execution
- **Expected**: `vss_deletion_anti_recovery` Sigma rule fires at CRITICAL
- **Expected**: Wazuh rule 100102 triggers

### 3. Lateral Movement Detection
- **Input**: Simulated SMB connections to 15+ unique hosts in 10 minutes
- **Expected**: `lateral_movement_smb_ransomware` Sigma rule fires at HIGH
- **Expected**: `ransomware_lateral_spread` Sentinel rule triggers

### 4. Service Termination Detection
- **Input**: Simulated net stop commands for MSSQLSERVER, vss, Veeam, WinDefend
- **Expected**: `service_stop_pre_encryption` Sentinel rule triggers at CRITICAL
- **Expected**: Wazuh rule 100103 triggers

### 5. End-to-End Containment
- **Input**: Full attack chain replay
- **Expected**: CLAW playbook triggers automatically, isolates host, blocks SMB
- **Verify**: Containment achieved within 15-minute SLA

## Evidence Bundle Reference
See `validation/evidence_bundle.json` for complete simulated telemetry.
