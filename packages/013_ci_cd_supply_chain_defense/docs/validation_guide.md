# Validation Guide: pkg-013 L3 Replay

## Overview

This package includes a Level 3 evidence bundle (`evidence.json`) containing 5 synthetic telemetry events. The L3 replay engine validates that detection rules in `detection.yaml` correctly match against these events.

## Running L3 Replay

1. Load `evidence.json` events
2. Parse `detection.yaml` inline rules
3. For each expected match, verify the detection rule references the correct fields/values from the event data
4. A package passes L3 validation when all `expected_matches` are satisfied

## Expected Results

| Detection ID | Event | Field Match |
|---|---|---|
| KQL-001 | evt-001 (forced tag push) | ref, forced, actor, repository |
| Sigma-002 | evt-003 (SSH key created) | FileName, FolderPath |
| Splunk-003 | evt-004 (curl exfil) | ProcessName, CommandLine |
