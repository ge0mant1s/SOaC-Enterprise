# SOaC MITRE ATT&CK Benchmark Runner
## Radical Transparency in Autonomous Defense

To differentiate from "Black Box" AI security vendors, SOaC-Enterprise provides a built-in benchmark runner that maps every package to the **MITRE ATT&CK Framework**.

### 📂 Repository Path
`integration/benchmarks/`

### Why Benchmarking Matters
- **Trust:** Users can see exactly which techniques are covered and validated.
- **Gap Analysis:** Identify which MITRE techniques are missing from your current SOaC deployment.
- **Compliance:** Provides the evidence needed for SOC2, ISO 27001, and regulatory audits.

### How to Use
1. Define the MITRE techniques you want to test in the `MITREBenchmarkRunner`.
2. Run the benchmark:
   ```bash
   python integration/benchmarks/mitre_benchmark_runner.py
   ```
3. The script will generate `MITRE_ATTACK_EVALUATION_RESULTS.md` in the root of your repo.

### Differentiator vs. Big Vendors
Most vendors claim "AI-powered protection" but refuse to show the raw evaluation data. SOaC-Enterprise is **Open-Validation**. We provide the scripts, the logs, and the results for the community to verify.
