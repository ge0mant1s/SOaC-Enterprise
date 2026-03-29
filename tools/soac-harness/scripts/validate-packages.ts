
import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import yaml from 'js-yaml';

const ajv = new Ajv({ allErrors: true });

// Load JSON schemas
const playbookSchema = JSON.parse(fs.readFileSync(path.join(__dirname, '../schemas/playbook.schema.json'), 'utf-8'));
const policySchema = JSON.parse(fs.readFileSync(path.join(__dirname, '../schemas/policy.schema.json'), 'utf-8'));

const validatePlaybook = ajv.compile(playbookSchema);
const validatePolicy = ajv.compile(policySchema);

// Regex for semantic versioning
const semverRegex = /^\d+\.\d+\.\d+(-[\w\.]+)?$/;

// Regex for trigger pattern validation
const triggerRegex = /^([\w\s]+)(\s*\|\|\s*[\w\s]+)*$/;

function validatePackageVersion(version: string): boolean {
  return semverRegex.test(version);
}

function validateTriggerPattern(pattern: string): boolean {
  return triggerRegex.test(pattern);
}

// Define interfaces for expected YAML structure
interface Playbook {
  name: string;
  triggers: { pattern: string }[];
  steps: { action: string }[];
}

interface Policy {
  name: string;
  version: string;
  rules: { id: string; description: string }[];
}

function validatePlaybookFile(filePath: string): string[] {
  const errors: string[] = [];
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = yaml.load(content) as Partial<Playbook> | undefined;

    if (!data) {
      errors.push(`Empty or invalid YAML in ${filePath}`);
      return errors;
    }

    if (!validatePlaybook(data)) {
      errors.push(`Schema validation errors in ${filePath}: ${ajv.errorsText(validatePlaybook.errors)}`);
    }

    // Validate triggers regex
    if (data.triggers) {
      for (const trigger of data.triggers) {
        if (typeof trigger.pattern !== 'string' || !validateTriggerPattern(trigger.pattern)) {
          errors.push(`Invalid trigger pattern '${trigger && (trigger as any).pattern}' in ${filePath}`);
        }
      }
    } else {
      errors.push(`Missing 'triggers' property in ${filePath}`);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      errors.push(`Failed to read or parse ${filePath}: ${e.message}`);
    } else {
      errors.push(`Failed to read or parse ${filePath}: unknown error`);
    }
  }
  return errors;
}

function validatePolicyFile(filePath: string): string[] {
  const errors: string[] = [];
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = yaml.load(content) as Partial<Policy> | undefined;

    if (!data) {
      errors.push(`Empty or invalid YAML in ${filePath}`);
      return errors;
    }

    if (!validatePolicy(data)) {
      errors.push(`Schema validation errors in ${filePath}: ${ajv.errorsText(validatePolicy.errors)}`);
    }

    // Validate version
    if (data.version && !validatePackageVersion(data.version)) {
      errors.push(`Invalid version '${data.version}' in ${filePath}`);
    } else if (!data.version) {
      errors.push(`Missing 'version' property in ${filePath}`);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      errors.push(`Failed to read or parse ${filePath}: ${e.message}`);
    } else {
      errors.push(`Failed to read or parse ${filePath}: unknown error`);
    }
  }
  return errors;
}

function findFiles(dir: string, fileName: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(filePath, fileName));
    } else if (file === fileName) {
      results.push(filePath);
    }
  });
  return results;
}

function validateAllPackages(rootDir: string): string[] {
  const errors: string[] = [];

  // Find all playbook.yaml and policy.yaml files
  const playbookFiles = findFiles(rootDir, 'playbook.yaml');
  const policyFiles = findFiles(rootDir, 'policy.yaml');

  for (const file of playbookFiles) {
    errors.push(...validatePlaybookFile(file));
  }

  for (const file of policyFiles) {
    errors.push(...validatePolicyFile(file));
  }

  return errors;
}

if (require.main === module) {
  const rootDir = process.argv[2] || '.';
  const errors = validateAllPackages(rootDir);
  if (errors.length > 0) {
    console.error('Validation errors found:');
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
  } else {
    console.log('All SOaC packages validated successfully.');
  }
}
