/**
 * Jazzer.js fuzz target for the SOaC validation harness.
 *
 * Fuzzes the real parse -> schema-validate pipeline used by `npm run validate`
 * (the required CI check). It feeds randomized bytes through validateFile() in
 * both YAML and JSON modes against the project's real AJV schemas and asserts
 * the function upholds its contract: it must ALWAYS return a well-formed
 * { valid: boolean, errors: string[] } result and must never throw, hang, or
 * leak a parser/validator exception to the caller.
 *
 * Run locally:   npx jazzer fuzz/validate.fuzz.js
 * Run in CI:     via ClusterFuzzLite (see .clusterfuzzlite/).
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const Ajv = require('ajv');

// Compiled from scripts/validate-packages.ts (tsc -p .) -> dist/
const { validateFile } = require('../dist/scripts/validate-packages.js');
const SCHEMAS_DIR = path.resolve(__dirname, '../schemas');
const loadSchema = (n) => JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, n), 'utf-8'));

const ajv = new Ajv({ allErrors: true, strict: false });
const SCHEMAS = ['manifest.schema.json', 'detection.schema.json', 'playbook.schema.json', 'policy.schema.json']
  .map((n) => loadSchema(n));

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'soac-fuzz-'));
let counter = 0;

module.exports.fuzz = function (data) {
  const content = data.toString('utf-8');
  const schema = SCHEMAS[data.length % SCHEMAS.length];
  const file = path.join(tmpDir, `f${counter++ % 64}.tmp`);
  fs.writeFileSync(file, content);

  for (const isYaml of [true, false]) {
    const res = validateFile(file, schema, ajv, isYaml);
    // Contract invariants — a crash here is a real finding.
    assert(res && typeof res === 'object', 'result must be an object');
    assert(typeof res.valid === 'boolean', 'result.valid must be boolean');
    assert(Array.isArray(res.errors), 'result.errors must be an array');
    assert(res.errors.every((e) => typeof e === 'string'), 'every error must be a string');
    if (res.valid) assert(res.errors.length === 0, 'valid result must have no errors');
  }
};
