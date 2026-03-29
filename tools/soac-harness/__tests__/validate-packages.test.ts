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
const triggerRegex = /^([\w\s]+)(\s*\|\|\s*[\w\s]+)$/;

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
        if (!validateTriggerPattern(trigger.pattern)) {
          errors.push(`Invalid trigger pattern '${trigger.pattern}' in ${filePath}`);
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
    const content = fs.readFileSync(filePath, 'utf-
