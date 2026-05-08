import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { ProjectRegistry } from '../lib/ProjectRegistry.js';

const tempDir = './tests/temp-manifests';

test.beforeEach(() => {
  fs.mkdirSync(tempDir, { recursive: true });
});

test.afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('loads a valid manifest', () => {
  const manifestPath = path.join(tempDir, 'valid-project.json');

  fs.writeFileSync(
    manifestPath,
    JSON.stringify({
      name: 'valid-project',
      baseUrl: 'https://example.com',
      testDir: './playground'
    })
  );

  const registry = new ProjectRegistry(tempDir);
  const project = registry.getProject('valid-project');

  expect(project.name).toBe('valid-project');
  expect(project.baseUrl).toBe('https://example.com');
  expect(project.testDir).toBe('./playground');
});

test('throws an error when manifest is missing required fields', () => {
  const manifestPath = path.join(tempDir, 'invalid-project.json');

  fs.writeFileSync(
    manifestPath,
    JSON.stringify({
      name: 'invalid-project'
    })
  );

  const registry = new ProjectRegistry(tempDir);

  expect(() => registry.listProjects()).toThrow(
    'Manifest is missing required field: baseUrl'
  );
});
