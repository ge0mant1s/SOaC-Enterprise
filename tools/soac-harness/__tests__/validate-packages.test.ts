import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

describe('SOaC Validation Harness', () => {
  const harnessPath = path.join(__dirname, '../scripts/validate-packages.ts');
  const testDir = path.join(__dirname, 'test-packages');

  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
  });

  afterAll(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  test('valid playbook.yaml passes validation', () => {
    const playbookContent = `---
name: Test Playbook
triggers:
  - pattern: "login || logout"
steps:
  - action: notify
`;
    const playbookPath = path.join(testDir, 'playbook.yaml');
    fs.writeFileSync(playbookPath, playbookContent);

    const result = execSync(`ts-node ${harnessPath} ${testDir}`, { encoding: 'utf-8' });
    expect(result).toContain('All SOaC packages validated successfully.');
  });

  test('invalid playbook.yaml fails validation', () => {
    const playbookContent = `---
name: Test Playbook
triggers:
  - pattern: "invalid pattern $$$"
steps:
  - action: notify
`;
    const playbookPath = path.join(testDir, 'playbook.yaml');
    fs.writeFileSync(playbookPath, playbookContent);

    try {
      execSync(`ts-node ${harnessPath} ${testDir}`, { encoding: 'utf-8' });
      throw new Error('Expected validation to fail');
    } catch (e) {
      expect(e.message).toContain('Invalid trigger pattern');
    }
  });

  test('valid policy.yaml passes validation', () => {
    const policyContent = `---
name: Test Policy
version: "1.0.0"
rules:
  - id: test-rule
    description: Test rule
`;
    const policyPath = path.join(testDir, 'policy.yaml');
    fs.writeFileSync(policyPath, policyContent);

    const result = execSync(`ts-node ${harnessPath} ${testDir}`, { encoding: 'utf-8' });
    expect(result).toContain('All SOaC packages validated successfully.');
  });

  test('invalid policy.yaml fails validation', () => {
    const policyContent = `---
name: Test Policy
version: "invalid_version"
rules:
  - id: test-rule
    description: Test rule
`;
    const policyPath = path.join(testDir, 'policy.yaml');
    fs.writeFileSync(policyPath, policyContent);

    try {
      execSync(`ts-node ${harnessPath} ${testDir}`, { encoding: 'utf-8' });
      throw new Error('Expected validation to fail');
    } catch (e) {
      expect(e.message).toContain('Invalid version');
    }
  });
});
