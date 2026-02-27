# Package 003 -- SaaS Pivot & Data Extortion Defense

SOaC (Security Operations as Code) package focused on detecting and containing
identity-driven pivots into SaaS platforms and large-scale data export patterns.

Scope (v1.0):
- Salesforce
- SAP (application layer perspective)
- Google Workspace
- Entra ID correlation layer

Version: 1.0.0
Last Updated: 2026-02-27

## Core Threat Pattern
1. Identity compromise (token theft / phishing / OAuth abuse)
2. Pivot into SaaS platform
3. Privilege escalation or API token creation
4. Mass export / reporting abuse / data staging
5. Extortion or public disclosure

This package operationalizes:
- Edge detection at SaaS API layer
- Identity correlation across Entra
- Export anomaly detection
- Automated containment (session revoke + token disable)

## Golden Platforms
- Microsoft Sentinel (KQL)
- CrowdStrike Falcon LogScale
- Sigma (portable rules)

## Success Metrics
- Detection of abnormal export within 5 minutes
- Token abuse detected within first API burst
- SaaS session revocation < 10 minutes for high confidence cases

This package includes an optional Claude reasoning layer under `brain/claude/`.
Use it to generate evidence-backed containment recommendations and executive summaries.

- Package ID: SOAC-PKG-003
- Package Version: 1.1.0
