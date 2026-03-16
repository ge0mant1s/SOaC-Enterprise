#!/usr/bin/env node
/* ============================================================================
 * SOaC Harness CLI — Entry Point
 * ============================================================================
 * Usage:
 *   soac-harness validate --path <dir|file> [--level 1|2] [--format text|json]
 *
 * Exit codes:
 *   0 — all files passed
 *   1 — one or more files failed
 *   2 — no YAML files found or invalid arguments
 * ============================================================================ */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { runLevel1 } from './level1';
import { runLevel2 } from './level2';
import { FileResult, HarnessResult, Finding } from './types';

/* ── Argument parsing ────────────────────────────────────── */
function parseArgs(): { targetPath: string; level: 1 | 2; format: 'text' | 'json' } {
  const args = process.argv.slice(2);
  let targetPath = '.';
  let level: 1 | 2 = 2;
  let format: 'text' | 'json' = 'text';

  const cmd = args[0];
  if (cmd !== 'validate') {
    console.error('Usage: soac-harness validate --path <dir|file> [--level 1|2] [--format text|json]');
    process.exit(2);
  }

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--path' && args[i + 1]) { targetPath = args[++i]; }
    else if (args[i] === '--level' && args[i + 1]) { level = parseInt(args[++i], 10) as 1 | 2; }
    else if (args[i] === '--format' && args[i + 1]) { format = args[++i] as 'text' | 'json'; }
  }

  return { targetPath, level, format };
}

/* ── File discovery ──────────────────────────────────────── */
function findYamlFiles(targetPath: string): string[] {
  const resolved = path.resolve(targetPath);
  if (!fs.existsSync(resolved)) {
    console.error(`Path not found: ${resolved}`);
    process.exit(2);
  }

  const stat = fs.statSync(resolved);
  if (stat.isFile()) return [resolved];

  const files: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        walk(full);
      } else if (/\.ya?ml$/i.test(entry.name)) {
        files.push(full);
      }
    }
  }
  walk(resolved);
  return files.sort();
}

/* ── Validate single file ───────────────────────────────── */
function validateFile(filePath: string, level: 1 | 2): FileResult {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const rel = path.relative(process.cwd(), filePath);

  // Parse YAML
  let parsed: Record<string, unknown>;
  try {
    const doc = yaml.load(raw);
    if (typeof doc !== 'object' || doc === null) {
      return {
        file: rel, kind: null, level1: 'SKIP', level2: 'SKIP',
        findings: [{ file: rel, line: null, field: 'root', message: 'Not a YAML object (might be a list or scalar)', severity: 'info', level: 1 }],
      };
    }
    parsed = doc as Record<string, unknown>;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'YAML parse error';
    return {
      file: rel, kind: null, level1: 'FAIL', level2: 'SKIP',
      findings: [{ file: rel, line: null, field: 'root', message: `YAML parse error: ${msg}`, severity: 'error', level: 1 }],
    };
  }

  // Skip files without kind (not SOaC artifacts)
  if (!parsed.kind && !parsed.apiVersion) {
    return {
      file: rel, kind: null, level1: 'SKIP', level2: 'SKIP',
      findings: [{ file: rel, line: null, field: 'root', message: 'No apiVersion/kind — not a SOaC artifact, skipping', severity: 'info', level: 1 }],
    };
  }

  // Level 1
  const { kind, findings: l1findings } = runLevel1(parsed, raw, rel);
  const l1errors = l1findings.filter(f => f.severity === 'error');
  const l1pass = l1errors.length === 0;

  const result: FileResult = {
    file: rel,
    kind,
    level1: l1pass ? 'PASS' : 'FAIL',
    level2: 'SKIP',
    findings: [...l1findings],
  };

  // Level 2 (only if L1 passed and level >= 2)
  if (l1pass && level >= 2 && kind) {
    const l2findings = runLevel2(parsed, raw, rel, kind);
    result.findings.push(...l2findings);
    const l2errors = l2findings.filter(f => f.severity === 'error');
    result.level2 = l2errors.length === 0 ? 'PASS' : 'FAIL';
  }

  return result;
}

/* ── Reporter ───────────────────────────────────────────── */
function printText(result: HarnessResult) {
  const bar = '═'.repeat(60);
  console.log(`\n${bar}`);
  console.log(`  SOaC Harness — Validation Report`);
  console.log(`  Level: ${result.maxLevel} | Files: ${result.totalFiles} | ${result.timestamp}`);
  console.log(`${bar}\n`);

  for (const fr of result.files) {
    if (fr.level1 === 'SKIP' && fr.level2 === 'SKIP') continue; // don't print skipped

    const l1badge = fr.level1 === 'PASS' ? '✓ L1' : fr.level1 === 'FAIL' ? '✗ L1' : '- L1';
    const l2badge = fr.level2 === 'PASS' ? '✓ L2' : fr.level2 === 'FAIL' ? '✗ L2' : '- L2';
    const status = (fr.level1 === 'FAIL' || fr.level2 === 'FAIL') ? 'FAIL' : 'PASS';
    const icon = status === 'PASS' ? '✅' : '❌';

    console.log(`${icon} ${fr.file}  [${l1badge}] [${l2badge}]  kind=${fr.kind || 'unknown'}`);

    const errs = fr.findings.filter(f => f.severity === 'error');
    const warns = fr.findings.filter(f => f.severity === 'warning');

    for (const f of errs) {
      console.log(`   ❌ L${f.level} ERROR  ${f.field}${f.line ? ` (line ${f.line})` : ''}: ${f.message}`);
    }
    for (const f of warns) {
      console.log(`   ⚠️  L${f.level} WARN   ${f.field}${f.line ? ` (line ${f.line})` : ''}: ${f.message}`);
    }
    if (errs.length === 0 && warns.length === 0) {
      console.log('   No issues found.');
    }
    console.log('');
  }

  console.log(`${bar}`);
  console.log(`  PASSED: ${result.passed}  FAILED: ${result.failed}  SKIPPED: ${result.skipped}`);
  console.log(`  Exit code: ${result.exitCode}`);
  console.log(`${bar}\n`);
}

/* ── Main ───────────────────────────────────────────────── */
function main() {
  const { targetPath, level, format } = parseArgs();
  const files = findYamlFiles(targetPath);

  if (files.length === 0) {
    console.error('No YAML files found at', targetPath);
    process.exit(2);
  }

  const results: FileResult[] = files.map(f => validateFile(f, level));

  const nonSkipped = results.filter(r => r.level1 !== 'SKIP');
  const passed = nonSkipped.filter(r => r.level1 === 'PASS' && (r.level2 === 'PASS' || r.level2 === 'SKIP')).length;
  const failed = nonSkipped.filter(r => r.level1 === 'FAIL' || r.level2 === 'FAIL').length;
  const skipped = results.filter(r => r.level1 === 'SKIP').length;

  const harnessResult: HarnessResult = {
    files: results,
    totalFiles: files.length,
    passed,
    failed,
    skipped,
    maxLevel: level,
    timestamp: new Date().toISOString(),
    exitCode: failed > 0 ? 1 : 0,
  };

  if (format === 'json') {
    console.log(JSON.stringify(harnessResult, null, 2));
  } else {
    printText(harnessResult);
  }

  process.exit(harnessResult.exitCode);
}

main();
