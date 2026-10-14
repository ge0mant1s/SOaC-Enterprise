/* ============================================================================
 * SOaC Harness — Dynamic Analysis (Fuzz) Suite
 * ============================================================================
 * This is the project's dynamic-analysis pass: instead of fixed example inputs,
 * it drives the real validators with thousands of RANDOMIZED inputs and checks
 * that their run-time invariants (the assertions in src/level1.ts and
 * scripts/validate-packages.ts) are never violated and that no validator ever
 * throws an unexpected error.
 *
 * Properties checked (per OpenSSF Best Practices dynamic_analysis /
 * dynamic_analysis_enable_assertions):
 *   - runLevel1 never throws on arbitrary parsed input + raw text.
 *   - Every Finding it returns satisfies the Finding invariants (shape, enum,
 *     level) — enforced in-code by assertFindingInvariants and re-checked here.
 *   - validateFile never throws on arbitrary file contents and always returns a
 *     well-formed { valid, errors } result.
 *
 * The random stream is SEEDED, so every run is deterministic and reproducible;
 * a failing case prints the seed and iteration so it can be replayed.
 * ============================================================================ */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import Ajv from 'ajv';
import { runLevel1, assertFindingInvariants } from '../src/level1';
import { loadSchema, validateFile } from '../scripts/validate-packages';
import {
  VALID_KINDS, SEVERITIES, CONFIDENCE_LEVELS, POLICY_SCOPES, STATUS_VALUES,
} from '../src/types';

/* ── Seeded PRNG (mulberry32) — deterministic & reproducible ───────────────── */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED = Number(process.env.FUZZ_SEED) || 1337;
const ITERATIONS = Number(process.env.FUZZ_ITERATIONS) || 3000;

/* ── Random value generators ──────────────────────────────────────────────── */
function pick<T>(rnd: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rnd() * arr.length)];
}

function randString(rnd: () => number): string {
  const alphabet =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-_:/{}[]"\n\t';
  const len = Math.floor(rnd() * 40);
  let s = '';
  for (let i = 0; i < len; i++) s += alphabet[Math.floor(rnd() * alphabet.length)];
  return s;
}

function randScalar(rnd: () => number): unknown {
  const r = rnd();
  if (r < 0.2) return randString(rnd);
  if (r < 0.35) return Math.floor(rnd() * 2000) - 500;
  if (r < 0.45) return rnd() < 0.5;
  if (r < 0.5) return null;
  if (r < 0.55) return undefined;
  // sometimes an enum-ish token (valid or invalid)
  const pools = [SEVERITIES, CONFIDENCE_LEVELS, POLICY_SCOPES, STATUS_VALUES, VALID_KINDS];
  return pick(rnd, pick(rnd, pools) as readonly string[]);
}

function randValue(rnd: () => number, depth: number): unknown {
  if (depth <= 0) return randScalar(rnd);
  const r = rnd();
  if (r < 0.45) return randScalar(rnd);
  if (r < 0.7) {
    const n = Math.floor(rnd() * 4);
    return Array.from({ length: n }, () => randValue(rnd, depth - 1));
  }
  const obj: Record<string, unknown> = {};
  const n = Math.floor(rnd() * 5);
  const keys = ['metadata', 'spec', 'name', 'version', 'author', 'severity',
    'package_id', 'trigger', 'steps', 'source', 'conditions', 'operator',
    'data_sources', 'logic', 'implementations', 'kind', 'apiVersion',
    'package', 'threat', 'stakeholders', 'signals_required', randString(rnd)];
  for (let i = 0; i < n; i++) obj[pick(rnd, keys)] = randValue(rnd, depth - 1);
  return obj;
}

/** Build an artifact-shaped object that often looks almost valid. */
function randArtifact(rnd: () => number): Record<string, unknown> {
  const o = (randValue(rnd, 3) as Record<string, unknown>) || {};
  if (typeof o !== 'object' || o === null || Array.isArray(o)) return {};
  if (rnd() < 0.7) o.apiVersion = rnd() < 0.5 ? pick(rnd, ['soac.io/v1', 'claw.soac.io/v1']) : randString(rnd);
  if (rnd() < 0.8) o.kind = rnd() < 0.6 ? pick(rnd, VALID_KINDS) : randString(rnd);
  return o;
}

describe('Dynamic analysis — fuzzing the harness validators', () => {
  test(`runLevel1 upholds its invariants on ${ITERATIONS} random inputs`, () => {
    const rnd = mulberry32(SEED);
    for (let i = 0; i < ITERATIONS; i++) {
      const parsed = randArtifact(rnd);
      const raw = randString(rnd);
      try {
        const { kind, findings } = runLevel1(parsed, raw, `fuzz-${i}.yaml`);
        // Re-check invariants at the call site (defence in depth).
        assertFindingInvariants(findings);
        expect(kind === null || (VALID_KINDS as readonly string[]).includes(kind)).toBe(true);
      } catch (e) {
        throw new Error(
          `runLevel1 threw on iteration ${i} (seed ${SEED}): ${(e as Error).message}\n` +
          `input=${JSON.stringify(parsed)}`
        );
      }
    }
  });

  test(`validateFile returns a well-formed result on ${ITERATIONS} random files`, () => {
    const rnd = mulberry32(SEED ^ 0x9e3779b9);
    const ajv = new Ajv({ allErrors: true, strict: false });
    const schema = loadSchema('policy.schema.json');
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'soac-fuzz-'));
    try {
      for (let i = 0; i < ITERATIONS; i++) {
        const isYaml = rnd() < 0.5;
        const p = path.join(tmp, `f-${i}.${isYaml ? 'yaml' : 'json'}`);
        // Mix of random text and (sometimes) structured JSON to hit both the
        // parse-error path and the schema-validation path.
        const content =
          rnd() < 0.5 ? randString(rnd) : JSON.stringify(randValue(rnd, 3)) ?? 'null';
        fs.writeFileSync(p, String(content));
        const result = validateFile(p, schema, ajv, isYaml);
        expect(typeof result.valid).toBe('boolean');
        expect(Array.isArray(result.errors)).toBe(true);
        // Contract: invalid ⇒ at least one error string; valid ⇒ none.
        expect(result.valid ? result.errors.length === 0 : result.errors.length > 0).toBe(true);
      }
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
