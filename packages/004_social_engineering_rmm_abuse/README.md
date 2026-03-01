# Package 004 — Social Engineering & RMM Abuse Defense

SOaC Package 004 protects the human and endpoint entry layer and integrates natively with:
- Package 001 (Identity Control Plane)
- Package 002 (Cloud Control Plane)
- Package 003 (SaaS & Data Extortion)
- SOAC_BRAIN_MODULE_V1 (Claude Intelligence)

Version: 1.0.0
Last Updated: 2026-03-01

## Core Threat Pattern
1. Phishing / Vishing / MFA Fatigue
2. User installs or launches RMM tool (AnyDesk, ScreenConnect, TeamViewer, etc.)
3. Attacker steals tokens / credentials
4. Pivot into Identity (Pkg 001) → Cloud (Pkg 002) → SaaS (Pkg 003)

## Architecture Role
Package 004 acts as the EARLY DISRUPTION LAYER.
It detects social engineering before the pivot chain escalates.

## Integrated Interaction Model
- RMM detection → triggers Identity session validation (Pkg 001)
- OAuth abuse → triggers token revoke workflow (Pkg 001 + Pkg 003)
- Endpoint isolation → prevents Cloud/API abuse (Pkg 002)
- Evidence Graph forwarded to SOAC Brain for confidence gating
