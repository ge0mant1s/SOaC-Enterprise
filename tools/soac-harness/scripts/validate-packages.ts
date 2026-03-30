import Ajv from 'ajv';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const PACKAGES_DIR = path.resolve(__dirname, '../../../packages');
const SCHEMAS_DIR = path.resolve(__dirname, '../schemas');

interface PackageResult {
  package: string;
  manifest: 'pass' | 'fail' | 'skip';
  detection: 'pass' | 'fail' | 'warn';
  playbook: 'pass' | 'fail' | 'warn';
  policy: 'pass' | 'fail' | 'warn';
  errors: string[];
  warnings: string[];
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
  const results: PackageResult[] = [];
  let hardFailures = 0;

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

  console.log(`\nValidating ${packages.length} directories...\n`);

  for (const pkg of packages) {
    const pkgDir = path.join(PACKAGES_DIR, pkg);
    const result: PackageResult = {
      package: pkg,
      manifest: 'skip',
      detection: 'warn',
      playbook: 'warn',
      policy: 'warn',
      errors: [],
      warnings: [],
    };

    // 1. manifest.json — required; if missing, skip entire package with warning
    const manifestPath = path.join(pkgDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      result.manifest = 'skip';
      result.warnings.push('No manifest.json — skipping package');
      results.push(result);
      continue;
    }

    const mResult = validateFile(manifestPath, manifestSchema, ajv, false);
    if (mResult.valid) {
      result.manifest = 'pass';
    } else {
      result.manifest = 'fail';
      result.errors.push(...mResult.errors.map((e) => `manifest.json: ${e}`));
      hardFailures++;
    }

    // 2. detection.yaml — root level; warn if missing, fail if invalid
    const detPath = path.join(pkgDir, 'detection.yaml');
    if (fs.existsSync(detPath)) {
      const dResult = validateFile(detPath, detectionSchema, ajv, true);
      if (dResult.valid) {
        result.detection = 'pass';
      } else {
        result.detection = 'fail';
        result.errors.push(...dResult.errors.map((e) => `detection.yaml: ${e}`));
        hardFailures++;
      }
    } else {
      result.detection = 'warn';
      result.warnings.push('detection.yaml not found');
    }

    // 3. playbook.yaml — root level; warn if missing, fail if invalid
    const pbPath = path.join(pkgDir, 'playbook.yaml');
    if (fs.existsSync(pbPath)) {
      const pResult = validateFile(pbPath, playbookSchema, ajv, true);
      if (pResult.valid) {
        result.playbook = 'pass';
      } else {
        result.playbook = 'fail';
        result.errors.push(...pResult.errors.map((e) => `playbook.yaml: ${e}`));
        hardFailures++;
      }
    } else {
      result.playbook = 'warn';
      result.warnings.push('playbook.yaml not found');
    }

    // 4. policy.yaml — root level; warn if missing, fail if invalid
    const polPath = path.join(pkgDir, 'policy.yaml');
    if (fs.existsSync(polPath)) {
      const polResult = validateFile(polPath, policySchema, ajv, true);
      if (polResult.valid) {
        result.policy = 'pass';
      } else {
        result.policy = 'fail';
        result.errors.push(...polResult.errors.map((e) => `policy.yaml: ${e}`));
        hardFailures++;
      }
    } else {
      result.policy = 'warn';
      result.warnings.push('policy.yaml not found');
    }

    results.push(result);
  }

  // Print summary table
  console.log('='.repeat(90));
  console.log(
    'Package'.padEnd(50) +
    'Manifest'.padEnd(10) +
    'Detection'.padEnd(11) +
    'Playbook'.padEnd(10) +
    'Policy'.padEnd(8)
  );
  console.log('-'.repeat(90));

  for (const r of results) {
    const icon = (s: string) =>
      s === 'pass' ? '✓' : s === 'fail' ? '✗' : s === 'warn' ? '⚠' : '⊘';
    console.log(
      r.package.padEnd(50) +
      icon(r.manifest).padEnd(10) +
      icon(r.detection).padEnd(11) +
      icon(r.playbook).padEnd(10) +
      icon(r.policy).padEnd(8)
    );
  }

  console.log('='.repeat(90));

  // Print errors
  const withErrors = results.filter((r) => r.errors.length > 0);
  if (withErrors.length > 0) {
    console.log('\nErrors (cause CI failure):\n');
    for (const r of withErrors) {
      for (const e of r.errors) {
        console.log(`  ✗ ${r.package}: ${e}`);
      }
    }
  }

  // Print warnings
  const withWarnings = results.filter((r) => r.warnings.length > 0);
  if (withWarnings.length > 0) {
    console.log('\nWarnings (informational only):\n');
    for (const r of withWarnings) {
      for (const w of r.warnings) {
        console.log(`  ⚠ ${r.package}: ${w}`);
      }
    }
  }

  const passed = results.filter((r) => r.errors.length === 0).length;
  const failed = results.filter((r) => r.errors.length > 0).length;
  console.log(`\nSummary: ${passed} packages clean, ${failed} packages with errors, ${hardFailures} total validation failures`);

  if (hardFailures > 0) {
    console.log('\n✗ Validation FAILED\n');
    process.exit(1);
  } else {
    console.log('\n✓ All validations passed\n');
    process.exit(0);
  }
}

main();
