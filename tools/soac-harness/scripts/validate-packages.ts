import Ajv from 'ajv';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const PACKAGES_DIR = path.resolve(__dirname, '../../../packages');
const SCHEMAS_DIR = path.resolve(__dirname, '../schemas');

interface ValidationResult {
  package: string;
  file: string;
  valid: boolean;
  errors?: string[];
}

function loadSchema(name: string): object {
  const schemaPath = path.join(SCHEMAS_DIR, name);
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema not found: ${schemaPath}`);
  }
  return JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
}

function validateFile(
  filePath: string,
  schema: object,
  ajv: Ajv,
  isYaml: boolean
): { valid: boolean; errors: string[] } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = isYaml ? yaml.load(content) : JSON.parse(content);
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid && validate.errors) {
      return {
        valid: false,
        errors: validate.errors.map(
          (e) => `${e.instancePath || '/'} ${e.message}`
        ),
      };
    }
    return { valid: true, errors: [] };
  } catch (err: any) {
    return { valid: false, errors: [`Parse error: ${err.message}`] };
  }
}

function main() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const results: ValidationResult[] = [];

  // Load schemas
  const manifestSchema = loadSchema('manifest.schema.json');
  const detectionSchema = loadSchema('detection.schema.json');
  const playbookSchema = loadSchema('playbook.schema.json');
  const policySchema = loadSchema('policy.schema.json');

  // Discover packages
  const packages = fs
    .readdirSync(PACKAGES_DIR)
    .filter((d) => fs.statSync(path.join(PACKAGES_DIR, d)).isDirectory())
    .sort();

  console.log(`\nValidating ${packages.length} packages...\n`);

  for (const pkg of packages) {
    const pkgDir = path.join(PACKAGES_DIR, pkg);

    // 1. Validate manifest.json
    const manifestPath = path.join(pkgDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      const r = validateFile(manifestPath, manifestSchema, ajv, false);
      results.push({ package: pkg, file: 'manifest.json', ...r });
    } else {
      results.push({
        package: pkg,
        file: 'manifest.json',
        valid: false,
        errors: ['File not found'],
      });
    }

    // 2. Validate detection*.yaml files
    const detectionsDir = path.join(pkgDir, 'detections');
    if (fs.existsSync(detectionsDir)) {
      const detFiles = fs
        .readdirSync(detectionsDir)
        .filter((f) => f.startsWith('detection') && f.endsWith('.yaml'));
      for (const df of detFiles) {
        const r = validateFile(
          path.join(detectionsDir, df),
          detectionSchema,
          ajv,
          true
        );
        results.push({ package: pkg, file: `detections/${df}`, ...r });
      }
    }

    // 3. Validate playbook*.yaml files
    const playbooksDir = path.join(pkgDir, 'playbooks');
    if (fs.existsSync(playbooksDir)) {
      const pbFiles = fs
        .readdirSync(playbooksDir)
        .filter((f) => f.startsWith('playbook') && f.endsWith('.yaml'));
      for (const pf of pbFiles) {
        const r = validateFile(
          path.join(playbooksDir, pf),
          playbookSchema,
          ajv,
          true
        );
        results.push({ package: pkg, file: `playbooks/${pf}`, ...r });
      }
    }

    // 4. Validate policy*.yaml files
    const policiesDir = path.join(pkgDir, 'policies');
    if (fs.existsSync(policiesDir)) {
      const polFiles = fs
        .readdirSync(policiesDir)
        .filter((f) => f.startsWith('policy') && f.endsWith('.yaml'));
      for (const pf of polFiles) {
        const r = validateFile(
          path.join(policiesDir, pf),
          policySchema,
          ajv,
          true
        );
        results.push({ package: pkg, file: `policies/${pf}`, ...r });
      }
    }
  }

  // Summary
  const passed = results.filter((r) => r.valid).length;
  const failed = results.filter((r) => !r.valid).length;

  console.log('='.repeat(60));
  console.log(`Results: ${passed} passed, ${failed} failed, ${results.length} total`);
  console.log('='.repeat(60));

  // Print failures
  const failures = results.filter((r) => !r.valid);
  if (failures.length > 0) {
    console.log('\nFailures:\n');
    for (const f of failures) {
      console.log(`  ✗ ${f.package}/${f.file}`);
      for (const e of f.errors || []) {
        console.log(`      ${e}`);
      }
    }
    process.exit(1);
  } else {
    console.log('\n✓ All validations passed\n');
    process.exit(0);
  }
}

main();
