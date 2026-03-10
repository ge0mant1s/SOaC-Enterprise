#!/usr/bin/env python3
# SOaC-Enterprise: Master Orchestrator
# The final glue that binds the Body, Brain, and Purpose together.

import asyncio
import json
from datetime import datetime
from integration.brain_connector_v2_prod import ProductionBrainConnector
from integration.normalization.normalizer import SOaCNormalizer
from integration.replay_engine.telemetry_replay_engine import TelemetryReplayEngine

class MasterOrchestrator:
    def __init__(self):
        self.brain = ProductionBrainConnector()
        self.normalizer = SOaCNormalizer()
        self.replay_engine = TelemetryReplayEngine("test_logs/")
        print("[*] SOaC-Enterprise Master Orchestrator Initialized.")

    async def listen_for_telemetry(self):
        """Simulate listening for telemetry from SIEM/EDR webhooks."""
        print("[*] Listening for telemetry...")
        # In production, this would be a webhook endpoint
        mock_alerts = [
            {"TimeGenerated": "2026-03-10T15:00:00Z", "OperationName": "Sign-in Activity", "UserPrincipalName": "admin@enterprise.com", "IPAddress": "192.168.1.100", "Location": "US"},
            {"TimeGenerated": "2026-03-10T15:05:00Z", "OperationName": "PIM Role Activation", "UserPrincipalName": "user2@enterprise.com", "IPAddress": "1.2.3.4", "RoleName": "Global Administrator"}
        ]
        for alert in mock_alerts:
            await self.process_alert(alert)
            await asyncio.sleep(2) # Simulate delay

    async def process_alert(self, raw_alert: dict):
        """Normalize, analyze, and act on a single alert."""
        print(f"[+] Received Alert: {raw_alert.get('OperationName')}")

        # 1. Normalize
        normalized = self.normalizer.from_sentinel(raw_alert)
        print(f"    Normalized: {normalized.get('user', {}).get('name')}")

        # 2. Send to Brain
        decision = await self.brain.process_alert_async("001_identity_control_plane", normalized)
        if decision and decision.decision == "BLOCK":
            print(f"    [ACTION REQUIRED] Brain Decision: BLOCK ({decision.confidence})")
            # 3. Execute Purpose (Playbook)
            self.execute_playbook(decision.playbook, normalized)
        else:
            print(f"    [INFO] Brain Decision: MONITOR ({decision.confidence if decision else 'N/A'})")

    def execute_playbook(self, playbook_name: str, context: dict):
        """Execute a playbook based on the Brain's decision."""
        print(f"    [EXECUTING] Playbook: {playbook_name}")
        # In production, this would load and run the YAML playbook
        print(f"    [SUCCESS] Playbook '{playbook_name}' executed for {context.get('user', {}).get('name')}.")

    async def run(self):
        """Main entry point."""
        await self.listen_for_telemetry()
        print("[*] Orchestrator Run Complete.")

if __name__ == "__main__":
    orchestrator = MasterOrchestrator()
    asyncio.run(orchestrator.run())
