import json
from typing import Dict, Any

class SOaCNormalizer:
    """
    Normalizes multi-vendor security telemetry into the 
    Elastic Common Schema (ECS) format for the SOaC Brain.
    """

    @staticmethod
    def from_sentinel(data: Dict[str, Any]) -> Dict[str, Any]:
        """Maps Microsoft Sentinel (KQL) fields to ECS."""
        return {
            "timestamp": data.get("TimeGenerated"),
            "event": {
                "action": data.get("OperationName"),
                "category": ["iam"],
                "provider": "azure.sentinel"
            },
            "user": {
                "name": data.get("AccountCustomEntity") or data.get("UserPrincipalName"),
                "id": data.get("UserId")
            },
            "source": {
                "ip": data.get("IPAddress"),
                "geo": {"country_name": data.get("Location")}
            },
            "soac_metadata": {
                "original_vendor": "microsoft_sentinel",
                "alert_id": data.get("SystemAlertId")
            }
        }

    @staticmethod
    def from_crowdstrike(data: Dict[str, Any]) -> Dict[str, Any]:
        """Maps CrowdStrike (LQL/Falcon) fields to ECS."""
        return {
            "timestamp": data.get("timestamp"),
            "event": {
                "action": data.get("event_simple_name"),
                "category": ["endpoint", "process"],
                "provider": "crowdstrike.falcon"
            },
            "user": {
                "name": data.get("UserName"),
                "id": data.get("UserSid")
            },
            "process": {
                "name": data.get("ImageFileName"),
                "command_line": data.get("CommandLine"),
                "pid": data.get("ProcessId")
            },
            "host": {
                "name": data.get("ComputerName"),
                "id": data.get("aid")
            },
            "soac_metadata": {
                "original_vendor": "crowdstrike_falcon",
                "detection_id": data.get("detection_id")
            }
        }

    @staticmethod
    def from_wazuh(data: Dict[str, Any]) -> Dict[str, Any]:
        """Maps Wazuh/OSSEC fields to ECS."""
        rule = data.get("rule", {})
        return {
            "timestamp": data.get("timestamp"),
            "event": {
                "action": rule.get("description"),
                "code": rule.get("id"),
                "level": rule.get("level"),
                "provider": "wazuh"
            },
            "host": {
                "name": data.get("agent", {}).get("name"),
                "ip": data.get("agent", {}).get("ip")
            },
            "soac_metadata": {
                "original_vendor": "wazuh",
                "full_log": data.get("full_log")
            }
        }

# --- EXAMPLE USAGE ---
if __name__ == "__main__":
    normalizer = SOaCNormalizer()

    # Mock Sentinel Data
    sentinel_alert = {
        "TimeGenerated": "2026-03-10T10:00:00Z",
        "OperationName": "Sign-in Activity",
        "UserPrincipalName": "admin@enterprise.com",
        "IPAddress": "192.168.1.100",
        "Location": "US"
    }

    ecs_data = normalizer.from_sentinel(sentinel_alert)
    print("[+] Normalized Sentinel to ECS:")
    print(json.dumps(ecs_data, indent=4))
