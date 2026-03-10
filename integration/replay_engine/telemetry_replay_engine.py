import os
import json
import asyncio
from datetime import datetime
from typing import List, Dict, Any
from normalization.normalizer import SOaCNormalizer
from integration.brain_connector_v2_prod import ProductionBrainConnector

class TelemetryReplayEngine:
    def __init__(self, log_directory: str):
        self.log_directory = log_directory
        self.normalizer = SOaCNormalizer()
        self.brain = ProductionBrainConnector()

    def load_telemetry_logs(self, package_id: str) -> List[Dict[str, Any]]:
        """Load stored telemetry logs for a specific package."""
        log_path = os.path.join(self.log_directory, f"{package_id}_logs.jsonl")
        logs = []
        if os.path.exists(log_path):
            with open(log_path, 'r') as f:
                for line in f:
                    logs.append(json.loads(line.strip()))
        return logs

    async def replay_and_analyze(self, package_id: str):
        """Replay stored telemetry and analyze with the Brain."""
        logs = self.load_telemetry_logs(package_id)
        print(f"[*] Replaying {len(logs)} logs for {package_id}...")

        results = []
        for log in logs:
            # Normalize the log
            normalized = self.normalizer.from_sentinel(log) # Assume all logs are from Sentinel for demo
            # Send to Brain
            decision = await self.brain.process_alert_async(package_id, normalized)
            results.append({
                "original_log": log,
                "normalized": normalized,
                "brain_decision": decision.__dict__ if decision else None,
                "timestamp": str(datetime.now())
            })
        return results

    def generate_report(self, results: List[Dict], package_id: str):
        """Generate a replay report."""
        report_name = f"replay_report_{package_id}_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
        with open(report_name, 'w') as f:
            json.dump(results, f, indent=4)
        print(f"[+] Replay Report Generated: {report_name}")
        return report_name

# --- EXAMPLE USAGE ---
async def main():
    engine = TelemetryReplayEngine("test_logs/")
    results = await engine.replay_and_analyze("001_identity_control_plane")
    engine.generate_report(results, "001_identity_control_plane")

if __name__ == "__main__":
    # To run: asyncio.run(main())
    print("Telemetry Replay Engine Ready.")
