# SOaC-Enterprise Quick Start Validation
# This script simulates a full SOaC lifecycle: Body -> Brain -> Purpose -> Edge

import json
import time

def run_simulation(alert_path):
    print("--- [SOaC-Enterprise] Initializing Simulation ---")

    # 1. The Body: Load and Normalize
    with open(alert_path, 'r') as f:
        alert = json.load(f)
    print(f"[BODY] Ingested Alert: {alert['threat']['indicator']} for user {alert['user']['name']}")
    time.sleep(1)

    # 2. The Brain: AI Reasoning (Simulated)
    print("[BRAIN] Analyzing behavioral patterns and risk context...")
    confidence = alert['threat']['confidence']
    risk = alert['user']['risk_score']
    print(f"[BRAIN] Verdict: HIGH RISK (Score: {risk}). Reasoning: Token refresh from Tor exit node by privileged user.")
    time.sleep(1)

    # 3. The Purpose: Load Playbook
    print("[PURPOSE] Loading Playbook: 001_REVOKE_SESSIONS.yaml")
    time.sleep(1)

    # 4. The Edge: Enforcement
    print(f"[EDGE] Executing API Call to Entra ID: Revoke_All_Sessions({alert['user']['id']})")
    print(f"[EDGE] Executing API Call to AWS IAM: Deny_All_Policies({alert['user']['name']})")
    time.sleep(1)

    print("--- [SOaC-Enterprise] Simulation Complete: Attack Contained in 3.2s ---")

if __name__ == "__main__":
    run_simulation('samples/identity_theft_alert.json')
