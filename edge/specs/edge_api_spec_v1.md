<!--
  SOaC-Enterprise: Edge API Specification v1.0
  Publisher:  SOaC Core Team | Version: 1.0.0 | Date: March 2026
  License:    Apache 2.0
  Repository: github.com/ge0mant1s/SOaC-Enterprise
-->

# Edge API Specification v1.0
**The Nervous System — Distributed Policy Enforcement at the Network Edge**

> **Publisher:** SOaC Core Team | **Version:** 1.0.0 | **Date:** March 2026
> **License:** Apache 2.0 | **Repository:** [github.com/ge0mant1s/SOaC-Enterprise](https://github.com/ge0mant1s/SOaC-Enterprise)

---

## Table of Contents

| # | Section |
|---|---|
| 1 | [Introduction](#1-introduction) |
| 2 | [Architecture Overview](#2-architecture-overview) |
| 3 | [Authentication & Request Signing (HMAC)](#3-authentication--request-signing-hmac) |
| 4 | [Endpoints](#4-endpoints) |
| 5 | [Idempotency](#5-idempotency) |
| 6 | [Error Codes](#6-error-codes) |
| 7 | [Audit Fields](#7-audit-fields) |
| 8 | [Example Requests & Responses](#8-example-requests--responses) |
| 9 | [Versioning & Changelog](#9-versioning--changelog) |

---

## 1. Introduction

The **Edge API** is the enforcement control plane of the SOaC Distributed Intelligence Architecture. It is the interface through which **CLAW playbooks** instruct **The Nervous System** to apply real-time enforcement actions across identity, network, and endpoint surfaces.

Every enforcement action is:
- **HMAC-signed** to prevent tampering and replay attacks
- **Idempotent** to ensure safe retry without double-enforcement
- **Immutably audited** with a SHA-256 enforcement receipt

> **Security Principle:** The Edge API never trusts the caller. Every request must carry a valid HMAC signature and a unique idempotency key. Unsigned or replayed requests are rejected with `401 Unauthorized`.

### Audience

| Role | How to use this spec |
|:---|:---|
| SOC Analyst / IR | Understand what enforcement actions are available and their scope |
| Detection Engineer | Map detection outputs to the correct enforcement endpoint |
| Platform Engineer | Implement Edge API clients, integrate with CLAW execution engine |
| CISO / Compliance | Review enforcement scope, audit guarantees, and blast radius controls |

---

## 2. Architecture Overview

```
CLAW Playbook Step
      │
      │  (enforcement action + HMAC signature)
      ▼
┌─────────────────────────────┐
│     Edge API Gateway        │  ← validates HMAC, checks idempotency key
│     (Nervous System)        │
└────────────┬────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
Identity Edge     Network Edge      Endpoint Edge
(Entra/Okta)   (Firewall/SG)    (CrowdStrike/MDE)
```

**Base URL:** `https://edge.soac.io/v1`

All requests must use **HTTPS**. HTTP requests are rejected.

---

## 3. Authentication & Request Signing (HMAC)

### 3.1 Overview

The Edge API uses **HMAC-SHA256** request signing. Each CLAW execution engine holds a shared secret (`EDGE_SIGNING_KEY`) provisioned at deployment time.

### 3.2 Signing Algorithm

```
StringToSign = METHOD + "\n"
             + PATH + "\n"
             + TIMESTAMP + "\n"
             + SHA256(RequestBody)

Signature = HMAC-SHA256(EDGE_SIGNING_KEY, StringToSign)
```

### 3.3 Required Headers

| Header | Description | Example |
|:---|:---|:---|
| `X-SOaC-Timestamp` | Unix timestamp (seconds). Requests older than 300s are rejected. | `1741824000` |
| `X-SOaC-Signature` | Hex-encoded HMAC-SHA256 signature | `a3f9c2...` |
| `X-SOaC-Idempotency-Key` | UUID v4. Prevents duplicate enforcement. | `550e8400-e29b-41d4-a716-446655440000` |
| `X-SOaC-Playbook-ID` | The CLAW playbook name that triggered this action | `revoke-compromised-sessions` |
| `Content-Type` | Must be `application/json` | `application/json` |

### 3.4 Replay Protection

- Requests with `X-SOaC-Timestamp` older than **300 seconds** are rejected with `401`.
- Idempotency keys are stored for **24 hours**. Duplicate keys within this window return the original response (no re-execution).

---

## 4. Endpoints

### 4.1 Identity Enforcement

#### `POST /v1/identity/block-session`
Revokes all active sessions for a user across registered identity providers.

**Request Body:**
```json
{
  "actor_email": "user@example.com",
  "scope": "single_user",
  "duration": "24h",
  "providers": ["okta", "entra_id"],
  "playbook_id": "revoke-compromised-sessions",
  "audit_context": {
    "detection_id": "BODY-AITM-OKTA-abc123",
    "confidence": 0.97
  }
}
```

**Response `202 Accepted`:**
```json
{
  "enforcement_id": "ENF-20260301-001",
  "status": "enforcing",
  "actions": [
    { "provider": "okta", "status": "revoked", "sessions_revoked": 3 },
    { "provider": "entra_id", "status": "revoked", "tokens_revoked": 1 }
  ],
  "audit_hash": "sha256:a3f9c2d1...",
  "expires_at": "2026-03-02T00:00:00Z"
}
```

---

#### `POST /v1/identity/disable-account`
Disables a user account across identity providers. Requires `brain_oversight: true` and human approval for `org`+ blast radius.

**Request Body:**
```json
{
  "actor_email": "user@example.com",
  "scope": "single_user",
  "reason": "Confirmed account compromise",
  "playbook_id": "disable-compromised-account",
  "audit_context": {
    "detection_id": "BODY-CRED-ENTRA-xyz789",
    "confidence": 0.99
  }
}
```

**Response `202 Accepted`:**
```json
{
  "enforcement_id": "ENF-20260301-002",
  "status": "enforced",
  "account_disabled": true,
  "audit_hash": "sha256:b7e1a4f2..."
}
```

---

### 4.2 Network Enforcement

#### `POST /v1/network/block-host`
Applies network isolation to a host via firewall rule injection or security group update.

**Request Body:**
```json
{
  "host_id": "cs-device-abc123",
  "hostname": "workstation-42.corp.example.com",
  "scope": "network",
  "duration": "48h",
  "method": "security_group",
  "playbook_id": "isolate-compromised-host",
  "audit_context": {
    "detection_id": "BODY-RANSOM-CS-def456",
    "confidence": 0.95
  }
}
```

**Response `202 Accepted`:**
```json
{
  "enforcement_id": "ENF-20260301-003",
  "status": "enforced",
  "rule_id": "sg-rule-99887",
  "audit_hash": "sha256:c9d2b5e3...",
  "expires_at": "2026-03-03T00:00:00Z"
}
```

---

#### `POST /v1/network/unblock-host`
Lifts network isolation (rollback action).

**Request Body:**
```json
{
  "host_id": "cs-device-abc123",
  "enforcement_id": "ENF-20260301-003",
  "playbook_id": "isolate-compromised-host"
}
```

**Response `200 OK`:**
```json
{
  "status": "lifted",
  "rule_removed": true,
  "audit_hash": "sha256:d1e3f6a7..."
}
```

---

### 4.3 Endpoint Enforcement

#### `POST /v1/endpoint/contain`
Triggers host containment via EDR (CrowdStrike or MDE).

**Request Body:**
```json
{
  "host_id": "cs-device-abc123",
  "provider": "crowdstrike",
  "action": "contain",
  "playbook_id": "isolate-compromised-host",
  "audit_context": {
    "detection_id": "BODY-RANSOM-CS-def456",
    "confidence": 0.95
  }
}
```

**Response `202 Accepted`:**
```json
{
  "enforcement_id": "ENF-20260301-004",
  "status": "contained",
  "provider_response": { "crowdstrike_action_id": "cs-action-77123" },
  "audit_hash": "sha256:e4f7a2b1..."
}
```

---

#### `POST /v1/endpoint/lift-containment`
Lifts EDR containment (rollback action).

**Request Body:**
```json
{
  "host_id": "cs-device-abc123",
  "provider": "crowdstrike",
  "enforcement_id": "ENF-20260301-004",
  "playbook_id": "isolate-compromised-host"
}
```

**Response `200 OK`:**
```json
{
  "status": "containment_lifted",
  "audit_hash": "sha256:f5a8b3c2..."
}
```

---

### 4.4 Status & Audit

#### `GET /v1/enforcement/{enforcement_id}`
Retrieve the status and audit record of a specific enforcement action.

**Response `200 OK`:**
```json
{
  "enforcement_id": "ENF-20260301-001",
  "playbook_id": "revoke-compromised-sessions",
  "status": "enforced",
  "created_at": "2026-03-01T12:00:00Z",
  "expires_at": "2026-03-02T12:00:00Z",
  "audit_hash": "sha256:a3f9c2d1...",
  "actions": []
}
```

---

## 5. Idempotency

All `POST` endpoints are idempotent when the same `X-SOaC-Idempotency-Key` is used within 24 hours.

| Scenario | Behavior |
|:---|:---|
| First request with key `K` | Execute enforcement, return `202` |
| Repeat request with same key `K` (within 24h) | Return original response, no re-execution |
| Repeat request with same key `K` (after 24h) | Treat as new request, execute again |
| Request without idempotency key | Reject with `400 Bad Request` |

---

## 6. Error Codes

| HTTP Status | Code | Description |
|:---|:---|:---|
| `400` | `MISSING_IDEMPOTENCY_KEY` | `X-SOaC-Idempotency-Key` header is absent |
| `400` | `INVALID_REQUEST_BODY` | Request body fails schema validation |
| `401` | `INVALID_SIGNATURE` | HMAC signature does not match |
| `401` | `EXPIRED_TIMESTAMP` | `X-SOaC-Timestamp` is older than 300 seconds |
| `403` | `BLAST_RADIUS_EXCEEDED` | Requested scope exceeds policy-allowed blast radius |
| `403` | `ENVIRONMENT_POLICY_VIOLATION` | Action blocked by Lab Safety Policy |
| `404` | `ENFORCEMENT_NOT_FOUND` | `enforcement_id` does not exist |
| `409` | `ALREADY_ENFORCED` | Idempotent repeat; original response returned |
| `422` | `PROVIDER_UNAVAILABLE` | Target provider (Okta, CrowdStrike, etc.) is unreachable |
| `500` | `INTERNAL_ERROR` | Edge API internal error; escalate to SOC |

---

## 7. Audit Fields

Every enforcement action generates an immutable audit record containing:

| Field | Type | Description |
|:---|:---|:---|
| `enforcement_id` | string | Unique enforcement identifier |
| `playbook_id` | string | CLAW playbook that triggered the action |
| `detection_id` | string | Source detection event ID |
| `actor_email` | string | Affected user (if applicable) |
| `host_id` | string | Affected host (if applicable) |
| `action_type` | string | Enforcement action performed |
| `scope` | enum | `single_user`, `team`, `org`, `global` |
| `timestamp` | datetime | ISO 8601 enforcement timestamp |
| `audit_hash` | string | SHA-256 hash of the full enforcement context |
| `executed_by` | string | CLAW engine instance identifier |

---

## 8. Example Requests & Responses

### Full signed request (Python)

```python
import hmac, hashlib, time, uuid, json, requests

EDGE_BASE_URL = "https://edge.soac.io/v1"
EDGE_SIGNING_KEY = "your-signing-key"  # From environment variable

def sign_request(method, path, body_bytes):
    timestamp = str(int(time.time()))
    body_hash = hashlib.sha256(body_bytes).hexdigest()
    string_to_sign = f"{method}\n{path}\n{timestamp}\n{body_hash}"
    signature = hmac.new(
        EDGE_SIGNING_KEY.encode(),
        string_to_sign.encode(),
        hashlib.sha256
    ).hexdigest()
    return timestamp, signature

def block_session(actor_email, detection_id):
    path = "/v1/identity/block-session"
    payload = {
        "actor_email": actor_email,
        "scope": "single_user",
        "duration": "24h",
        "providers": ["okta", "entra_id"],
        "playbook_id": "revoke-compromised-sessions",
        "audit_context": { "detection_id": detection_id, "confidence": 0.97 }
    }
    body_bytes = json.dumps(payload).encode()
    timestamp, signature = sign_request("POST", path, body_bytes)

    response = requests.post(
        EDGE_BASE_URL + path,
        headers={
            "Content-Type": "application/json",
            "X-SOaC-Timestamp": timestamp,
            "X-SOaC-Signature": signature,
            "X-SOaC-Idempotency-Key": str(uuid.uuid4()),
            "X-SOaC-Playbook-ID": "revoke-compromised-sessions"
        },
        data=body_bytes
    )
    return response.json()
```

---

## 9. Versioning & Changelog

### 9.1 API Versioning Policy

The Edge API uses **URL versioning** (`/v1/`, `/v2/`). Breaking changes increment the major version. Minor additions are backward-compatible within the same version.

### 9.2 Changelog

| Version | Date | Changes |
|:---|:---|:---|
| 1.0.0 | March 2026 | Initial release. Identity, Network, and Endpoint enforcement endpoints. HMAC signing, idempotency, audit trail. |

---

*SOaC-Enterprise — Security Operations as Code. Stop Triage. Start Programming.*
*[github.com/ge0mant1s/SOaC-Enterprise](https://github.com/ge0mant1s/SOaC-Enterprise)*
