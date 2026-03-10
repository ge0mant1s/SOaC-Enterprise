# SOaC Telemetry Replay Engine
## Validate Your Defense Stack Without Risk

The Telemetry Replay Engine allows security teams to replay stored SIEM/EDR logs against the SOaC-Enterprise framework to validate detection accuracy, Brain decisions, and playbook effectiveness—all without impacting production systems.

### 📂 Repository Path
`integration/replay_engine/`

### Why Replay Matters
- **Safe Validation:** Test new detection rules or AI prompts on historical data.
- **Performance Tuning:** Identify false positives/negatives and tune accordingly.
- **Audit Readiness:** Demonstrate to auditors that your controls would have caught a past incident.

### How to Use
1. Place your stored telemetry logs in `test_logs/` (one `.jsonl` file per package).
2. Run the replay engine:
   ```bash
   python integration/replay_engine/telemetry_replay_engine.py
   ```
3. Review the generated `replay_report_<package>_<timestamp>.json` for detailed analysis.

### Integration with Normalization
The engine automatically normalizes raw logs (currently assumes Sentinel format) before sending them to the Brain, ensuring consistent reasoning.

### Differentiator vs. Big Vendors
Most autonomous SOCs offer "simulated attacks" but not "real telemetry replay." SOaC-Enterprise lets you validate your stack against **your own data**, giving you unmatched confidence in your security posture.
