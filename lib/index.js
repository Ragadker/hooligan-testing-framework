import { ProjectRegistry } from './ProjectRegistry.js';
import { TestRunner } from './TestRunner.js';
import { ResultStore } from './ResultStore.js';

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

/**
 * Gets recent test run history.
 * @param {string|null} projectName - Optional project name filter.
 * @returns {Array<object>} Recent runs.
 */
export function getHistory(projectName = null) {
  const store = new ResultStore();
  return store.getHistory(projectName);
}

/**
 * Gets full details for one run.
 * @param {string} runId - Run ID.
 * @returns {object|null} Run details.
 */
export function getRun(runId) {
  const store = new ResultStore();
  return store.getRun(runId);
}
