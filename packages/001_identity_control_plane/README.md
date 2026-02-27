# Package 001  Identity Control Plane Defense (v1.1)

**SOaC (Security Operations as Code)** package for detecting and containing identity-led intrusions across **M365 / Entra ID**, **endpoint telemetry**, **cloud control planes**, and **SaaS**.

**Golden platforms (v1.1):**
- **Microsoft Sentinel (KQL)** for analytics + correlation
- **CrowdStrike Falcon LogScale** for high-scale event hunting/detection

**Version:** 1.1.0  
**Last Updated:** 2026-02-27

## v1.1 highlights (what changed)
- Added **high-confidence correlation** logic in Sentinel (MFA fatigue  risky sign-in  OAuth changes  privileged role changes)
- Added **Cross-cloud pivot** detections: Entra  AWS
- Added **SaaS focus** detections & response patterns for:
  - Google Workspace
  - Salesforce (pattern-based)
  - SAP (pattern-based)
- Added **LogScale-focused** queries for identity pivot & endpoint precursors
- Added **simulation pack** expansions (OAuth consent abuse, EntraAWS role pivot)

## Quickstart
1. Import Sentinel analytics rules in `detections/sentinel_kql/analytics/`
2. Import hunting queries in `detections/sentinel_kql/hunting/`
3. Deploy LogScale queries from `detections/crowdstrike_logscale/`
4. Roll out CA baseline in report-only  enforce
5. Run simulations in `simulations/`

## Evidence-based outcomes
- Correlation reduces false positives and drives **Tier 1 constraints** fast
- Cross-domain containment reduces lateral movement probability
- Public simulations provide repeatable proof of detection efficacy
