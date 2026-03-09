import os
import json
import requests

# Configuration for the AI Engine (e.g., Azure OpenAI, Bedrock, or Local LLM)
AI_ENDPOINT = os.getenv("SOAC_AI_ENDPOINT", "https://your-ai-resource.openai.azure.com/v1/chat/completions")
API_KEY = os.getenv("SOAC_AI_KEY", "YOUR_API_KEY")

def load_brain_prompt(package_id):
    """Loads the reasoning prompt for a specific SOaC package."""
    prompt_path = f"packages/{package_id}/brain/reasoning_prompt.txt"
    try:
        with open(prompt_path, 'r') as f:
            return f.read()
    except FileNotFoundError:
        return "Default: Analyze this security alert for malicious intent."

def analyze_alert(package_id, alert_data):
    """
    Sends alert telemetry to the 'Brain' (LLM) and returns a structured decision.
    """
    system_prompt = load_brain_prompt(package_id)

    payload = {
        "model": "gpt-4-turbo", # Or your specific model
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Analyze this alert telemetry: {json.dumps(alert_data)}"}
        ],
        "temperature": 0.1, # Low temperature for consistent security reasoning
        "response_format": { "type": "json_object" }
    }

    headers = {
        "Content-Type": "application/json",
        "api-key": API_KEY
    }

    print(f"[*] Sending alert to Brain ({package_id})...")
    response = requests.post(AI_ENDPOINT, headers=headers, json=payload)

    if response.status_code == 200:
        decision = response.json()['choices'][0]['message']['content']
        return json.loads(decision)
    else:
        print(f"[!] Error from Brain: {response.status_code} - {response.text}")
        return {"decision": "ERROR", "reason": "AI Engine Unreachable"}

# --- EXAMPLE USAGE ---
if __name__ == "__main__":
    # Mock alert from a SIEM (e.g., Microsoft Sentinel)
    mock_alert = {
        "user": "j.doe@enterprise.com",
        "action": "PIM_Role_Activation",
        "role": "Global Administrator",
        "location": "Unknown_VPN_IP",
        "time": "03:15 AM UTC"
    }

    # Analyze using Package 001 (Identity Control Plane)
    result = analyze_alert("001_identity_control_plane", mock_alert)

    print("\n[+] BRAIN DECISION:")
    print(json.dumps(result, indent=4))

    if result.get("decision") == "Block":
        print("\n[!] TRIGGERING PURPOSE: Executing containment workflow...")
        # Logic to trigger YAML Playbook would go here
