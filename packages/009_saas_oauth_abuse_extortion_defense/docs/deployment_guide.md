# Deployment Guide: pkg-009 — SaaS OAuth Abuse & Extortion Defense GTR-2025

## Prerequisites
- Microsoft Sentinel with O365 and Azure AD connectors
- Microsoft DLP policies configured
- Splunk with O365 and Azure add-ons
- Wazuh with Azure/O365 integration

## Detection Deployment
Import Sigma, KQL, SPL, and Wazuh rules per standard procedure.
Key frequencies: extortion detection every 5m, OAuth weaponization every 15m.

## Validation
```bash
soac validate --package pkg-009 --evidence validation/evidence_bundle.json
```
