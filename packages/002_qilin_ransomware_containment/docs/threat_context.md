# Threat Context: Qilin Ransomware

## Threat Actor Profile

**Qilin** (also tracked as **Agenda**) is a ransomware-as-a-service (RaaS) operation
first observed in July 2022. The group operates a double-extortion model, encrypting
victim data while also exfiltrating sensitive files for leverage.

### Notable Incidents

- **August 2024 — Chrome Credential Harvesting**: Sophos X-Ops documented Qilin
  affiliates deploying a novel technique to harvest Google Chrome stored credentials
  via Group Policy-deployed PowerShell scripts before encryption. This represented an
  evolution beyond typical ransomware operations into credential theft at scale.

- **2024-2025 — Critical Infrastructure Targeting**: Qilin has shown persistent focus on
  critical infrastructure and essential-service sectors, leveraging the urgency of service
  restoration to pressure ransom payments.

### Technical Indicators

| Indicator | Type | Context |
|-----------|------|---------|
| `.qilin` file extension | File artifact | Encrypted file marker |
| `README_TO_RESTORE.txt` | File artifact | Ransom note |
| VMProtect/UPX packing | Binary artifact | Payload obfuscation |
| Go/Rust cross-compilation | Tooling | Cross-platform capability |
| `agenda_<victim_id>.exe` | Binary naming | Customized per-victim payloads |

### MITRE ATT&CK Mapping

| Technique | Name | Qilin Usage |
|-----------|------|-------------|
| T1486 | Data Encrypted for Impact | Primary ransomware encryption |
| T1490 | Inhibit System Recovery | VSS deletion, bcdedit modification |
| T1489 | Service Stop | Pre-encryption service termination |
| T1021.002 | SMB/Windows Admin Shares | Lateral movement for propagation |
| T1570 | Lateral Tool Transfer | Deploying encryptor across network |
| T1078 | Valid Accounts | Credential-based initial access |
| T1059.001 | PowerShell | Credential harvesting scripts |

## References

1. Sophos X-Ops. "Qilin ransomware caught stealing credentials stored in Google Chrome." August 2024.
2. CISA. "StopRansomware: Qilin Ransomware." Advisory AA24-290A, October 2024.
3. CrowdStrike. "2025 Global Threat Report — Ransomware Ecosystem Evolution." February 2025.
