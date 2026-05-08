import { ProjectRegistry } from './ProjectRegistry.js';
import { TestRunner } from './TestRunner.js';

/**
 * Runs tests for a registered project by project name.
 * @param {string} projectName - Name of the registered project.
 * @param {object} options - Optional runner options.
 * @returns {Promise<object>} Structured run object.
 */
export async function runProjectTests(projectName, options = {}) {
  const registry = new ProjectRegistry();
  const project = registry.getProject(projectName);

  const runner = new TestRunner();
  return runner.run(project, options);
}

/**
 * Lists all registered projects.
 * @returns {Array<object>} Registered project manifests.
 */
export function listProjects() {
  const registry = new ProjectRegistry();
  return registry.listProjects();
}
