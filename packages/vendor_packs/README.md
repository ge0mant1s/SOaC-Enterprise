# SOaC Multi-Vendor Detection Packs
## Breaking Vendor Lock-In with Universal Security-as-Code

To differentiate from "Single-Stack" autonomous SOCs, SOaC-Enterprise provides native detection logic for the world's leading security platforms.

### 📂 Repository Path
`packages/<package_id>/vendor_packs/`

### Supported Platforms
- **Microsoft Sentinel (KQL):** Native integration (See root package files).
- **CrowdStrike Falcon (LQL):** High-fidelity queries for Falcon LogScale.
- **Splunk (SPL):** Optimized searches for Splunk Enterprise Security.
- **Sigma:** Generic format for translation to 30+ other SIEMs.

### Why Multi-Vendor?
Enterprises are rarely "Mono-Cloud." A typical Fortune 500 uses **Azure** for Identity, **AWS** for Infrastructure, and **CrowdStrike** for Endpoints. SOaC-Enterprise is the only framework that provides a unified **Brain** (AI) to reason across all of them simultaneously.

### How to Deploy
1. Navigate to the `vendor_packs/` folder within your target package.
2. Copy the query for your specific SIEM/EDR.
3. Map the output fields to the **SOaC Normalization Layer** (See `integration/normalization/`).
