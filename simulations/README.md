# SOaC Master Simulation Orchestrator
## Validating the Shield

This Python orchestrator allows security teams to run automated "Purple Team" exercises across the entire SOaC-Enterprise framework.

### How it Works
1. **Discovery:** The script identifies the `.sh` or `.ps1` simulation scripts within each package.
2. **Execution:** It triggers the breach simulation (e.g., a mock session hijack or unauthorized API call).
3. **Validation:** It monitors the SIEM/EDR for the 'Body' detection and the 'Brain' reasoning response.
4. **Reporting:** It generates a consolidated JSON report showing which defenses held and which need tuning.

### Usage
1. Ensure you have execution permissions for the simulation scripts:
   `chmod +x packages/*/simulations/*.sh`
2. Run the orchestrator:
   `python master_simulation_orchestrator.py`

### Why this is 'Enterprise-Grade'
- **Continuous Validation:** Can be integrated into a CI/CD pipeline to ensure new cloud changes don't break security detections.
- **Audit Ready:** Provides a timestamped JSON report of all security control validations for compliance (ISO/NIST).
