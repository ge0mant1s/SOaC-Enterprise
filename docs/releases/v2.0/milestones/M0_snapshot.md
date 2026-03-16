# Milestone 0 — Current State Snapshot & Gap Register

**SOaC-Enterprise v2.0** — Consolidated Upgrade of GitHub v1.1 and soacframe.io v1.2  
**Date:** 2026-03-16  
**Author:** SOaC Core Team  
**Status:** COMPLETE

---

## 1. Executive Summary

This document captures the full inventory of SOaC-Enterprise at the start of the v2.0 upgrade cycle. It maps every package, every site section, every database model, and every on-disk artifact — then identifies every gap between the current state and the v2.0 target.

**Current versions:** GitHub repo v1.1, soacframe.io v1.2  
**Target:** SOaC-Enterprise v2.0 (7-milestone delivery)

---

## 2. Package Inventory (001–011)

### 2.1 Data Source Map

| Data Source | Location | Packages Covered | Notes |
|---|---|---|---|
| `data/packages.json` | Primary package registry | 001–005 only | Source for `/packages` page grid + Scenario Gallery |
| `data/scenarios.json` | Lab scenario definitions | general + 001–005 | Keyed by `pkg-00X`, each has title + output steps |
| `downloads-content.tsx` | Downloads page hardcoded array | 001–011 | Only place all 11 exist; includes MITRE + GitHub folder |
| `threat-landscape.tsx` | Homepage threat actor cards | 001–005 (mapped) | 6 threat actors link to package anchors |
| `public/downloads/packages/` | ZIP bundles on disk | 001–005 | `pkg-001.zip` through `pkg-005.zip` |

### 2.2 Full Package Registry

| # | ID | Name | MITRE Techniques | GitHub Folder | Status |
|---|---|---|---|---|---|
| 1 | pkg-001 | Identity-led Intrusion Defense | T1557.001, T1078.004, T1539 | `packages/001_identity_intrusion_defense` | **ARTIFACT_PARTIAL** |
| 2 | pkg-002 | Ransomware Containment & Response | T1486, T1059, T1068, T1490 | `packages/002_ransomware_containment` | **ARTIFACT_PARTIAL** |
| 3 | pkg-003 | Supply Chain & npm Compromise | T1195.002, T1059.007, T1027 | `packages/003_supply_chain_defense` | **ARTIFACT_PARTIAL** |
| 4 | pkg-004 | BYOVD & Kernel Exploit Defense | T1068, T1014, T1547.006 | `packages/004_byovd_defense` | **ARTIFACT_PARTIAL** |
| 5 | pkg-005 | SEO Poisoning & Gootloader Defense | T1189, T1059.007, T1071.001 | `packages/005_seo_poisoning_defense` | **ARTIFACT_PARTIAL** |
| 6 | pkg-006 | Credential Harvesting & Phishing Kit | T1598, T1566.002, T1056.004 | `packages/006_credential_harvesting` | **SCAFFOLDED** |
| 7 | pkg-007 | Cloud IAM Privilege Escalation | T1078.004, T1548, T1484 | `packages/007_cloud_iam_privesc` | **SCAFFOLDED** |
| 8 | pkg-008 | Lateral Movement & RDP Abuse | T1021.001, T1550.002, T1570 | `packages/008_lateral_movement` | **SCAFFOLDED** |
| 9 | pkg-009 | Data Exfiltration & Staging | T1560, T1041, T1567 | `packages/009_data_exfiltration` | **SCAFFOLDED** |
| 10 | pkg-010 | Living off the Land (LOLBins) | T1218, T1059.001, T1036 | `packages/010_lolbins_defense` | **SCAFFOLDED** |
| 11 | pkg-011 | Insider Threat & Anomalous Behavior | T1078, T1530, T1213 | `packages/011_insider_threat` | **SCAFFOLDED** |

**Status definitions:**
- **ARTIFACT_PARTIAL:** Package exists in `data/packages.json`, has lab scenario in `data/scenarios.json`, has ZIP bundle in `public/downloads/packages/`, has GitHub repo folder with partial artifacts (brain, edge, logic, simulations folders present; detections, playbooks, policies, metadata.yml may be missing or incomplete).
- **SCAFFOLDED:** Package exists only in `downloads-content.tsx` hardcoded array. Missing from `data/packages.json`, no lab scenario in `data/scenarios.json`, no ZIP bundle on disk, GitHub repo has directory scaffolding only (brain, edge, logic, simulations folders; no detections, playbooks, policies, metadata.yml).

---

## 3. Gap Register

### 3.1 Per-Package Artifact Completeness

Target state for ARTIFACT_COMPLETE = all ✅ in every column.

| Package | In packages.json | Lab Scenario | ZIP Bundle | Detections | Playbooks | Policies | metadata.yml | MITRE Mapping | Threat Actor | Stakeholders |
|---|---|---|---|---|---|---|---|---|---|---|
| pkg-001 | ✅ | ✅ | ✅ | ⚠️ partial | ⚠️ partial | ❌ | ❌ | ✅ | ✅ 0APT | ✅ |
| pkg-002 | ✅ | ✅ | ✅ | ⚠️ partial | ⚠️ partial | ❌ | ❌ | ✅ | ✅ Qilin | ✅ |
| pkg-003 | ✅ | ✅ | ✅ | ⚠️ partial | ⚠️ partial | ❌ | ❌ | ✅ | ✅ Lynx, Shai-Hulud | ✅ |
| pkg-004 | ✅ | ✅ | ✅ | ⚠️ partial | ⚠️ partial | ❌ | ❌ | ✅ | ✅ Emerging TTPs | ✅ |
| pkg-005 | ✅ | ✅ | ✅ | ⚠️ partial | ⚠️ partial | ❌ | ❌ | ✅ | ✅ Crimson Collective | ✅ |
| pkg-006 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (in downloads) | ❌ | ⚠️ (downloads only) |
| pkg-007 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (in downloads) | ❌ | ⚠️ (downloads only) |
| pkg-008 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (in downloads) | ❌ | ⚠️ (downloads only) |
| pkg-009 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (in downloads) | ❌ | ⚠️ (downloads only) |
| pkg-010 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (in downloads) | ❌ | ⚠️ (downloads only) |
| pkg-011 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (in downloads) | ❌ | ⚠️ (downloads only) |

**Legend:** ✅ = present & complete, ⚠️ = present but incomplete, ❌ = missing

### 3.2 Structural Gaps

| Gap ID | Category | Description | Blocking Milestone |
|---|---|---|---|
| GAP-001 | Data Registry | `data/packages.json` contains only 5 of 11 packages. Packages 006–011 are hardcoded only in `downloads-content.tsx`. | M3 |
| GAP-002 | Lab Scenarios | `data/scenarios.json` contains scenarios for general + 001–005 only. No scenarios for 006–011. | M3 |
| GAP-003 | ZIP Bundles | `public/downloads/packages/` has ZIP files for 001–005 only. No ZIP bundles for 006–011. | M3 |
| GAP-004 | Threat Actors | `threat-landscape.tsx` maps 6 actors to packages 001–005 only. No actors map to 006–011. | M3/M5 |
| GAP-005 | Package Artifacts | All packages (001–011) lack `metadata.yml` and `policies/` directory with formal policy-as-code. | M1/M3 |
| GAP-006 | Package Artifacts | Detections in 001–005 are partial (sample SPL/KQL only). 006–011 have none. | M3 |
| GAP-007 | Package Artifacts | Playbooks in 001–005 are partial (2 CLAW playbooks in `02_The_Purpose_CLAW_Engine/`). 006–011 have none. | M3 |
| GAP-008 | Global Templates | No `core/templates/` directory exists. No standardized detection, playbook, or policy templates. | M1 |
| GAP-009 | Validation Tooling | No SOaC-Harness CLI. `/validate` page exists but uses client-side YAML parsing only. No Level 1/2/3 validation. | M2 |
| GAP-010 | Evidence Bundles | No evidence bundle generation. No live evidence strip on soacframe.io. | M4/M5 |
| GAP-011 | Database - Multi-tenant | DB schema is flat: User, Account, Session, Download, InterestSignup, AdminAuditLog. No Organization, Team, Role, Invite, or artifact ownership models. | M6 |
| GAP-012 | Package Evidence Pages | No per-package public evidence pages on soacframe.io. | M5 |
| GAP-013 | Package Registry API | No API endpoint for package metadata. All rendering is client-side from JSON/hardcoded arrays. | M5 |
| GAP-014 | Agentic Workbench | No `soac-agent` tooling. No registered-user gating for agent features. | M7 |
| GAP-015 | CI/CD Integration | No GitHub Actions for harness validation, no pre-commit hooks for banned terms or template compliance. | M1/M2 |
| GAP-016 | Pillar Naming | `architecture-overview.tsx` uses "The Nervous System" for The Edge pillar — needs alignment to canonical four-pillar naming. | M1 |
| GAP-017 | Banned Term Lint | No automated lint rule to prevent usage of banned terminology. | M1 |

---

## 4. soacframe.io v1.2 → v2.0 Section Map

### 4.1 Existing Pages (v1.2)

| Route | Purpose | v2.0 Status |
|---|---|---|
| `/` (Home) | Landing: Hero, Architecture Overview, Threat Landscape, Stakeholder Tiles, Interest Form, Open by Design | **MODIFY** — add Live Evidence Strip (M5), update threat actors for 006–011 (M3) |
| `/about` | SOaC philosophy, four pillars, team | **KEEP** — minor pillar naming alignment (M1) |
| `/packages` | Package grid (reads `data/packages.json`) | **MODIFY** — expand to 11 packages (M3), add evidence badges (M5) |
| `/lab` | Interactive terminal + Scenario Gallery | **MODIFY** — add scenarios for 006–011 (M3), integrate Harness validation (M2) |
| `/docs` | Documentation hub | **MODIFY** — add Harness CLI docs (M2), template reference (M1) |
| `/docs/downloads` | Downloads catalog | **KEEP** — already has all 11 packages listed |
| `/downloads` | Direct download page with package ZIPs | **MODIFY** — add ZIPs for 006–011 (M3), add evidence bundles (M4) |
| `/stakeholders` | CISO, Detection Eng, SOC/IR, Platform cards | **KEEP** — recently updated with CISO guide CTA |
| `/deploy` | Deployment guide | **KEEP** |
| `/community` | Community links (GitHub Discussions, Contributing) | **MODIFY** — add workspace/team features (M6) |
| `/login` | Email/password login | **MODIFY** — add org context (M6) |
| `/signup` | Registration | **MODIFY** — add org invite flow (M6) |
| `/admin` | Admin dashboard (users, downloads, signups, audit) | **MODIFY** — add org admin, team management (M6) |
| `/validate` | Client-side YAML validator | **REPLACE** — integrate SOaC-Harness (M2) |
| `/privacy` | Privacy policy | **KEEP** |
| `/terms` | Terms of service | **KEEP** |

### 4.2 New Pages Required (v2.0)

| Route | Purpose | Milestone |
|---|---|---|
| `/packages/[id]` | Per-package evidence page (detections, playbooks, policies, MITRE map, validation status) | M5 |
| `/packages/registry` | Machine-readable package registry / API docs | M5 |
| `/workspace` | Organization dashboard (teams, members, artifacts, dependency graph) | M6 |
| `/workspace/teams` | Team management within org | M6 |
| `/workspace/invite` | Invite acceptance flow | M6 |
| `/workspace/artifacts` | Org-scoped artifact browser | M6 |
| `/workspace/graph` | Dependency graph visualization | M6 |
| `/agent` | Agentic Workbench (soac-agent tools, registered-user gated) | M7 |

---

## 5. Database Schema Snapshot (v1.2)

### 5.1 Current Models

| Model | Fields | Purpose |
|---|---|---|
| `User` | id, name, email, emailVerified, passwordHash, image, role, status, lastLogin, deletedAt, createdAt, updatedAt | Auth + user management |
| `Account` | id, userId, type, provider, providerAccountId, tokens... | OAuth provider accounts (NextAuth) |
| `Session` | id, sessionToken, userId, expires | Active sessions (NextAuth) |
| `VerificationToken` | identifier, token, expires | Email verification (NextAuth) |
| `Download` | id, userId, fileName, downloadedAt | Download tracking |
| `InterestSignup` | id, email, name, message, createdAt | Interest/waitlist form |
| `AdminAuditLog` | id, adminId, adminEmail, action, targetId, targetEmail, details, createdAt | Admin action audit trail |

### 5.2 Models Required for v2.0

| Model | Purpose | Milestone |
|---|---|---|
| `Organization` | Top-level tenant container | M6 |
| `Team` | Sub-group within org | M6 |
| `OrgMembership` | User ↔ Org with role (owner/admin/member) | M6 |
| `TeamMembership` | User ↔ Team with role | M6 |
| `Invite` | Email + shareable-link invites to orgs/teams | M6 |
| `Artifact` | Org/team/public-scoped artifact metadata | M6 |
| `ArtifactDependency` | Dependency edges for graph visualization | M6 |
| `ValidationResult` | Harness validation results per artifact | M4 |
| `EvidenceBundle` | Generated evidence bundle metadata | M4 |

---

## 6. On-Disk Artifact Inventory

### 6.1 Public Artifacts (`public/`)

| Path | Type | Description |
|---|---|---|
| `01_The_Body_Artifacts/splunk_sample_detection.spl` | Detection | Sample SPL detection rule |
| `02_The_Purpose_CLAW_Engine/claw_schema_v1.md` | Schema | CLAW playbook schema spec |
| `02_The_Purpose_CLAW_Engine/claw_schema_v1.pdf` | Schema (PDF) | CLAW schema rendered |
| `02_The_Purpose_CLAW_Engine/playbooks/isolate_host.yaml` | Playbook | Host isolation CLAW playbook |
| `02_The_Purpose_CLAW_Engine/playbooks/revoke_sessions.yaml` | Playbook | Session revocation CLAW playbook |
| `03_The_Brain_Claude_Security/ai_governance_baseline.yaml` | Policy | AI governance baseline |
| `04_The_Nervous_System_Edge/edge_api_spec_v1.md` | Spec | Edge API specification |
| `04_The_Nervous_System_Edge/edge_api_spec_v1.pdf` | Spec (PDF) | Edge API rendered |
| `05_Policy_as_Code/lab_safety_policy.yaml` | Policy | Lab safety policy |
| `docs/specs/claw_playbook_schema_v1.0.md` | Spec | CLAW schema (docs copy) |
| `docs/technical/edge_api_spec_v1.md` | Spec | Edge API (docs copy) |
| `policy/lab_safety_policy.yaml` | Policy | Lab safety (duplicate) |

### 6.2 Downloads (`public/downloads/`)

| Path | Type | Description |
|---|---|---|
| `SOaC_Detection_Library_v1.zip` | Bundle | Detection library v1 |
| `SOaC_Starter_Pack_v1.zip` | Bundle | Starter pack v1 |
| `SOaC_Whitepaper_v1.pdf` | Document | Original white paper |
| `soac_enterprise_white_paper_2026_v1.1.pdf` | Document | White paper v1.1 (182KB, 21 pages) |
| `soac_enterprise_white_paper_2026_v2.pdf` | Document | White paper v2 (backward compat copy) |
| `claw_playbook_schema_v1.0_spec.pdf` | Spec | CLAW schema PDF |
| `docs/executive/ciso_transformation_guide.pdf` | Guide | CISO Transformation Guide |
| `docs/operations/soc_ir_deployment_runbook.pdf` | Runbook | SOC/IR Deployment Runbook |
| `docs/technical/soac_architecture_diagram.pdf` | Diagram | Architecture Diagram PDF |
| `packages/pkg-001.zip` | Package | Identity-led Intrusion Defense |
| `packages/pkg-002.zip` | Package | Ransomware Containment |
| `packages/pkg-003.zip` | Package | Supply Chain Defense |
| `packages/pkg-004.zip` | Package | BYOVD Defense |
| `packages/pkg-005.zip` | Package | SEO Poisoning Defense |

### 6.3 Data Files

| Path | Contents |
|---|---|
| `data/packages.json` | 5 packages (001–005) with full metadata (id, name, summary, stakeholders, mitre, repo_url, repo_path, lab_scenario_id, signals_required, includes) |
| `data/scenarios.json` | 6 scenarios (general + 001–005) with title + output step sequences |

---

## 7. Component Inventory

### 7.1 Shared Components (`app/components/`)

| Component | Used On | Notes |
|---|---|---|
| `landing-hero.tsx` | Home | Hero section with tagline |
| `architecture-overview.tsx` | Home | Four-pillar architecture visual — uses "The Nervous System" for Edge (GAP-016) |
| `threat-landscape.tsx` | Home | 6 threat actor cards → 001–005 only |
| `stakeholder-tiles.tsx` | Home | 4 stakeholder persona tiles |
| `interest-form.tsx` | Home | Interest/waitlist signup form |
| `open-by-design.tsx` | Home | Open-source philosophy section |
| `nav-bar.tsx` | Global | Navigation bar |
| `footer.tsx` | Global | Footer |
| `google-analytics.tsx` | Global (layout) | GA4 tracking |

### 7.2 API Routes (`app/api/`)

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/[...nextauth]` | * | NextAuth handler |
| `/api/auth/login` | POST | Custom login endpoint |
| `/api/signup` | POST | User registration |
| `/api/interest` | POST | Interest form submission |
| `/api/downloads/file` | GET | Authenticated file download |
| `/api/admin/users` | GET | List users (admin) |
| `/api/admin/users/[id]` | PATCH | Update user (admin) |
| `/api/admin/users/[id]/toggle` | POST | Toggle user status (admin) |
| `/api/admin/users/[id]/remove` | DELETE | Soft-delete user (admin) |
| `/api/admin/users/export` | GET | Export users CSV (admin) |
| `/api/admin/signups` | GET | List interest signups (admin) |
| `/api/admin/signups/export` | GET | Export signups CSV (admin) |
| `/api/admin/downloads` | GET | List downloads (admin) |
| `/api/admin/audit` | GET | Audit log (admin) |

---

## 8. Key Configuration

| Item | Value | Notes |
|---|---|---|
| GitHub Repo | `https://github.com/ge0mant1s/SOaC-Enterprise/tree/main` | Source of truth for all artifacts |
| Deployed Domain | `soacframe.io` | Custom domain, currently v1.2 |
| Auth | NextAuth v4 with email/password + admin-email auto-promotion | `ADMIN_EMAILS` env var |
| Database | PostgreSQL via Prisma ORM | Shared dev/prod |
| Analytics | Google Analytics (GA4) | Via `google-analytics.tsx` |
| Grand Launch | March 13, 2026 | Completed |
| Webinar | March 27, 2026 14:00 CET | Upcoming |

---

## 9. Milestone Dependency Map

```
M0 (Snapshot) ──→ M1 (Templates + Lint) ──→ M2 (Harness CLI) ──→ M3 (Pkg Standardization)
                                                                         │
                                                                         ▼
                                                                    M4 (Replay + Evidence)
                                                                         │
                                                                         ▼
                                                                    M5 (Public Surfaces)
                                                                         │
                                                                         ▼
                                                                    M6 (Workspace + Multi-tenant)
                                                                         │
                                                                         ▼
                                                                    M7 (Agentic Workbench)
```

---

## 10. Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Schema migration for M6 multi-tenant on shared dev/prod DB | Data loss if incompatible changes | Additive-only migrations; never drop columns; use feature flags |
| 006–011 GitHub folders may have inconsistent structure vs 001–005 | M3 remediation scope unclear | Audit actual GitHub folder contents before M3 begins |
| `architecture-overview.tsx` pillar naming inconsistency ("Nervous System" vs "Edge") | Branding confusion | Fix in M1 as part of template/naming standardization |
| Lab scenarios for 006–011 don't exist | Lab page incomplete for 6 packages | Build in M3 alongside package artifacts |
| No CI/CD pipeline for harness validation | Merges can break package compliance | Build in M2 |

---

*End of Milestone 0 — Current State Snapshot & Gap Register*
