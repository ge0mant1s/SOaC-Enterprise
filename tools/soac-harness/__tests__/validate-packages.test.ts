import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import Ajv from 'ajv';
import { loadSchema, validateFile } from '../scripts/validate-packages';

describe('SOaC Validation Harness', () => {
  const harnessPath = path.join(__dirname, '../scripts/validate-packages.ts');
  let tmpDir: string;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'soac-harness-'));
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  // --- Unit tests: exported pure validators ---

  test('loadSchema returns a parsed JSON schema object', () => {
    const schema = loadSchema('policy.schema.json') as Record<string, unknown>;
    expect(typeof schema).toBe('object');
    expect(schema).not.toBeNull();
  });

  test('loadSchema throws for a missing schema file', () => {
    expect(() => loadSchema('does-not-exist.schema.json')).toThrow();
  });

  test('validateFile reports a YAML parse error for malformed YAML', () => {
    const ajv = new Ajv({ allErrors: true, strict: false });
    const schema = loadSchema('policy.schema.json');
    const badPath = path.join(tmpDir, 'bad.yaml');
    // Unterminated flow mapping -> js-yaml throws, harness captures it.
    fs.writeFileSync(badPath, 'name: test\nrules: [unclosed\n');
    const result = validateFile(badPath, schema, ajv, true);
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/Parse error/i);
  });

  test('validateFile reports schema errors for valid YAML that violates the schema', () => {
    const ajv = new Ajv({ allErrors: true, strict: false });
    const schema = loadSchema('policy.schema.json');
    const wrongPath = path.join(tmpDir, 'wrong.yaml');
    // Well-formed YAML but a bare string, which cannot satisfy an object schema.
    fs.writeFileSync(wrongPath, 'just-a-string\n');
    const result = validateFile(wrongPath, schema, ajv, true);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  // --- Integration test: real harness against the repository packages ---

  test('harness validates the repository packages and exits successfully', () => {
    const result = execSync(`ts-node ${harnessPath}`, { encoding: 'utf-8' });
    expect(result).toContain('All validations passed');
    expect(result).toMatch(/Summary: \d+ packages clean, 0 packages with errors/);
  });
});
