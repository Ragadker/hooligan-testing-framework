import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import crypto from 'node:crypto';
import { ResultStore } from './ResultStore.js';

const execFileAsync = promisify(execFile);

/**
 * Runs Playwright tests for a registered project.
 */
export class TestRunner {
  /**
   * Runs tests for a project manifest.
   * @param {object} project - Project manifest.
   * @param {object} options - Runner options.
   * @param {string|null} options.testName - Optional test name filter.
   * @returns {Promise<object>} Structured run object.
   */
  async run(project, options = {}) {
    const startedAt = new Date();
    const run = {
      id: crypto.randomUUID(),
      projectName: project.name,
      status: 'running',
      startedAt: startedAt.toISOString(),
      endedAt: null,
      durationMs: null,
      results: [],
      error: null
    };

    const store = new ResultStore();
    store.saveProject(project);
    store.createRun(run);

    try {
      const args = ['playwright', 'test', project.testDir, '--reporter=json'];

      if (options.testName) {
        args.push('--grep', options.testName);
      }

      const output = await this.runPlaywright(args);
      const parsedOutput = JSON.parse(output.stdout);

      run.results = this.mapPlaywrightResults(parsedOutput);
      run.status = run.results.every((result) => result.status === 'passed')
        ? 'passed'
        : 'failed';
    } catch (error) {
      run.status = 'errored';
      run.error = error.message;

      if (error.stdout) {
        try {
          const parsedOutput = JSON.parse(error.stdout);
          run.results = this.mapPlaywrightResults(parsedOutput);
          run.status = run.results.every((result) => result.status === 'passed')
            ? 'passed'
            : 'failed';
        } catch {
          run.results = [];
        }
      }
    } finally {
      const endedAt = new Date();
      run.endedAt = endedAt.toISOString();
      run.durationMs = endedAt.getTime() - startedAt.getTime();

      store.completeRun(run);
    }

    return run;
  }

  /**
   * Executes Playwright as a child process.
   * @param {Array<string>} args - Command arguments.
   * @returns {Promise<object>} Process output.
   */
  async runPlaywright(args) {
    return execFileAsync('npx', args, {
      shell: true,
      maxBuffer: 1024 * 1024 * 10
    });
  }

  /**
   * Converts Playwright JSON output into framework result objects.
   * @param {object} playwrightOutput - Playwright JSON reporter output.
   * @returns {Array<object>} Test result objects.
   */
  mapPlaywrightResults(playwrightOutput) {
    const results = [];

    for (const suite of playwrightOutput.suites || []) {
      this.collectSpecs(suite, results);
    }

    return results;
  }

  /**
   * Recursively collects Playwright test specs.
   * @param {object} suite - Playwright suite object.
   * @param {Array<object>} results - Results array to populate.
   */
  collectSpecs(suite, results) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const result = test.results?.[0];

        results.push({
          name: spec.title,
          status: result?.status === 'passed' ? 'passed' : 'failed',
          durationMs: result?.duration ?? 0,
          error: result?.error?.message ?? null,
          stdout: result?.stdout?.map((item) => item.text).join('') ?? '',
          stderr: result?.stderr?.map((item) => item.text).join('') ?? ''
        });
      }
    }

    for (const childSuite of suite.suites || []) {
      this.collectSpecs(childSuite, results);
    }
  }
}
