# Edge Enforcement API Specification v1.0
## The Nervous System - Distributed Enforcement Points

### Overview
The Edge API provides HMAC-signed REST endpoints for distributed enforcement across the SOaC architecture. All communications are authenticated, encrypted, and audited.

### Base URL
```
https://edge.soac.io/api/v1
```

### Authentication
All requests must include HMAC-SHA256 signed headers:

```
X-SOaC-Timestamp: <unix_timestamp>
X-SOaC-Signature: HMAC-SHA256(<timestamp>.<method>.<path>.<body_hash>)
X-SOaC-Node-ID: <edge_node_identifier>
Content-Type: application/json
```

### Signature Computation
```python
import hmac, hashlib, time, json

def sign_request(method, path, body, secret_key, node_id):
    timestamp = str(int(time.time()))
    body_hash = hashlib.sha256(json.dumps(body).encode()).hexdigest()
    message = f"{timestamp}.{method}.{path}.{body_hash}"
    signature = hmac.new(
        secret_key.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()
    return {
        "X-SOaC-Timestamp": timestamp,
        "X-SOaC-Signature": signature,
        "X-SOaC-Node-ID": node_id
    }
```

---

### Endpoints

#### POST /enforce
Push an enforcement action to edge nodes.

**Request:**
```json
{
  "action": "block_session | block_host | block_ip | rate_limit | quarantine",
  "scope": "user | host | network | global",
  "identifier": "target_identifier",
  "parameters": {
    "duration": "24h",
    "reason": "CLAW playbook execution",
    "playbook_id": "revoke-compromised-sessions",
    "severity": "CRITICAL"
  },
  "metadata": {
    "detection_id": "BODY-AITM-OKTA-abc123",
    "brain_approval": true,
    "confidence": 0.97
  }
}
```

**Response (201):**
```json
{
  "enforcement_id": "EDGE-ENF-2026-001",
  "status": "active",
  "propagated_to": ["edge-us-east-1", "edge-eu-west-1"],
  "effective_at": "2026-01-15T14:30:00Z",
  "expires_at": "2026-01-16T14:30:00Z",
  "audit_hash": "sha256:abc123..."
}
```

#### GET /enforce/{enforcement_id}
Query status of an active enforcement.

#### DELETE /enforce/{enforcement_id}
Revoke an active enforcement (requires dual-approval for CRITICAL).

#### GET /health
Edge node health check.

**Response (200):**
```json
{
  "node_id": "edge-us-east-1",
  "status": "healthy",
  "active_enforcements": 47,
  "uptime": "99.99%",
  "last_sync": "2026-01-15T14:29:55Z",
  "version": "1.0.0"
}
```

#### POST /sync
Force synchronization between edge nodes.

---

### Error Codes
| Code | Description |
|------|-------------|
| 401  | Invalid HMAC signature |
| 403  | Insufficient permissions |
| 409  | Conflicting enforcement exists |
| 429  | Rate limit exceeded |
| 503  | Edge node unavailable |

### Rate Limits
- Standard: 100 requests/minute per node
- Burst: 250 requests/minute (CRITICAL severity)
- Sync: 10 requests/minute
