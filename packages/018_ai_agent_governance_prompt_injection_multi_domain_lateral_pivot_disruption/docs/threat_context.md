# AI Agent Governance: Prompt Injection & Multi-Domain Lateral Pivot Disruption — Threat Context

## Overview
AI coding agent governance package for AI Coding Agent (Claude Code / Cursor): interactive mode, critical risk

## Threat Actor
AI Coding Agent (Claude Code / Cursor) (Autonomous)

## Attack Chain
1. **Agent Task Prompt** — AI agent receives a task
   - MITRE: 
   - Phase: Execution
   - Pillar: Offense
2. **Code Execution** — Agent runs commands or modifies code
   - MITRE: T1059, T1059.004
   - Phase: Execution
   - Pillar: Offense
3. **Repository Access** — Agent reads/modifies files
   - MITRE: T1083, T1565, T1528
   - Phase: Credential Access
   - Pillar: Detect
4. **External Resource Access** — Agent contacts APIs or downloads packages
   - MITRE: T1071, T1567
   - Phase: Command and Control
   - Pillar: Respond
5. **Governance Review** — Actions reviewed and audit logged
   - MITRE: 
   - Phase: Execution
   - Pillar: Offense

## Target Stack
Sigma, Sentinel

## Category
Identity
