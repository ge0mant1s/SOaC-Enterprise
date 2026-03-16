/* ============================================================================
 * SOaC Harness — Type Definitions
 * ============================================================================ */

export type Severity = 'error' | 'warning' | 'info';

export interface Finding {
  file: string;
  line: number | null;
  field: string;
  message: string;
  severity: Severity;
  level: 1 | 2;          // which harness level caught this
}

export interface FileResult {
  file: string;
  kind: string | null;   // Playbook | DetectionRule | Policy | PackageMetadata
  level1: 'PASS' | 'FAIL' | 'SKIP';
  level2: 'PASS' | 'FAIL' | 'SKIP';
  findings: Finding[];
}

export interface HarnessResult {
  files: FileResult[];
  totalFiles: number;
  passed: number;
  failed: number;
  skipped: number;
  maxLevel: 1 | 2;
  timestamp: string;
  exitCode: number;
}

export type Kind = 'Playbook' | 'DetectionRule' | 'Policy' | 'PackageMetadata';

export const VALID_KINDS: Kind[] = ['Playbook', 'DetectionRule', 'Policy', 'PackageMetadata'];

export const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
export const TARGETS = ['BODY', 'BRAIN', 'EDGE', 'INTERNAL'] as const;
export const TRIGGER_SOURCES = ['BODY', 'BRAIN', 'MANUAL', 'SCHEDULED'] as const;
export const OPERATORS = ['eq', 'neq', 'gt', 'lt', 'contains', 'regex'] as const;
export const FAILURE_MODES = ['halt', 'skip', 'rollback'] as const;
export const BACKOFF_MODES = ['linear', 'exponential', 'fixed'] as const;
export const BLAST_RADIUS = ['single_user', 'team', 'org', 'global'] as const;
export const AUDIT_LEVELS = ['minimal', 'standard', 'verbose'] as const;
export const DATA_SOURCE_TYPES = ['log', 'api', 'endpoint', 'network', 'cloud'] as const;
export const LOGIC_TYPES = ['correlation', 'threshold', 'anomaly', 'signature'] as const;
export const ESCALATION_MODES = ['auto', 'manual', 'conditional'] as const;
export const CONFIDENCE_LEVELS = ['HIGH', 'MEDIUM', 'LOW'] as const;
export const POLICY_SCOPES = ['global', 'package', 'environment'] as const;
export const ENV_MODES = ['enforce', 'simulate', 'audit'] as const;
export const DATA_HANDLING = ['synthetic', 'anonymized', 'live'] as const;
export const NETWORK_ACCESS = ['isolated', 'restricted', 'full'] as const;
export const PERSISTENCE = ['ephemeral', 'persistent'] as const;
export const PERMISSIONS = ['read', 'write', 'execute', 'admin'] as const;
export const AUTH_METHODS = ['sso', 'mfa', 'api_key', 'certificate'] as const;
export const REVIEW_FREQUENCY = ['quarterly', 'monthly', 'on_change'] as const;
export const STATUS_VALUES = ['draft', 'review', 'released', 'deprecated'] as const;

/* Banned terms — must never appear in any artifact */
export const BANNED_PATTERNS = [
  { pattern: /\bOpenCLAW\b/gi, label: 'OpenCLAW' },
  { pattern: /\bOpen-CLAW\b/gi, label: 'Open-CLAW' },
  { pattern: /\bopen_claw\b/gi, label: 'open_claw' },
];
