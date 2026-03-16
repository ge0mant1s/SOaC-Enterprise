/**
 * SOaC Banned Term Registry
 * 
 * This module defines terms that MUST NOT appear in any SOaC artifact,
 * documentation, UI, or codebase. The lint function scans content and
 * reports violations with line numbers and context.
 */

export interface BannedTermViolation {
  term: string;
  line: number;
  column: number;
  context: string; // surrounding text snippet
}

/**
 * Banned terms list.
 * Each entry is a case-insensitive regex pattern.
 * Add new banned terms here as needed.
 */
const BANNED_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\bOpenCLAW\b/gi, label: 'OpenCLAW' },
  { pattern: /\bOpen-CLAW\b/gi, label: 'Open-CLAW' },
  { pattern: /\bopen_claw\b/gi, label: 'open_claw' },
];

/**
 * Scans content for banned terms and returns all violations.
 */
export function scanForBannedTerms(content: string): BannedTermViolation[] {
  const violations: BannedTermViolation[] = [];
  const lines = content.split('\n');

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    for (const { pattern, label } of BANNED_PATTERNS) {
      // Reset regex state
      const re = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;
      while ((match = re.exec(line)) !== null) {
        const col = match.index;
        const start = Math.max(0, col - 30);
        const end = Math.min(line.length, col + match[0].length + 30);
        violations.push({
          term: label,
          line: lineIdx + 1,
          column: col + 1,
          context: (start > 0 ? '...' : '') + line.slice(start, end).trim() + (end < line.length ? '...' : ''),
        });
      }
    }
  }

  return violations;
}

/**
 * Quick boolean check — does the content contain any banned terms?
 */
export function containsBannedTerms(content: string): boolean {
  for (const { pattern } of BANNED_PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags);
    if (re.test(content)) return true;
  }
  return false;
}

/**
 * Returns the list of banned term labels (for display purposes).
 */
export function getBannedTermLabels(): string[] {
  return BANNED_PATTERNS.map(p => p.label);
}
