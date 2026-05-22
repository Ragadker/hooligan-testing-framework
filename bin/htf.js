#!/usr/bin/env node

import { Command } from 'commander';
import {
  listProjects,
  runProjectTests,
  getHistory,
  getRun
} from '../lib/index.js';

const program = new Command();

program
  .name('htf')
  .description('Hooligan Testing Framework CLI')
  .version('1.0.0')
  .option('--json', 'Output structured JSON');

function outputJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

function outputText(message) {
  console.error(message);
}

program
  .command('list')
  .description('List all registered projects')
  .action(() => {
    try {
      const projects = listProjects();
      const jsonMode = program.opts().json;

      if (jsonMode) {
        outputJson({
          projects: projects.map((project) => ({
            name: project.name,
            baseUrl: project.baseUrl,
            testDir: project.testDir
          }))
        });
        return;
      }

      if (projects.length === 0) {
        outputText('No registered projects found.');
        return;
      }

      outputText('Registered projects:');

      for (const project of projects) {
        outputText(`- ${project.name} (${project.baseUrl})`);
      }
    } catch (error) {
      outputText(`Error: ${error.message}`);
      process.exitCode = 1;
    }
  });

program
  .command('run')
  .description('Run tests for a registered project')
  .argument('<project>', 'Project name')
  .option('--test <name>', 'Run a specific test by name')
  .action(async (projectName, options) => {
    const jsonMode = program.opts().json;

    try {
      if (!jsonMode) {
        outputText(`Running tests for project: ${projectName}`);
      }

      const run = await runProjectTests(projectName, {
        testName: options.test ?? null
      });

      if (jsonMode) {
        outputJson(run);
      } else {
        outputText('');
        outputText(`Run ID: ${run.id}`);
        outputText(`Project: ${run.projectName}`);
        outputText(`Status: ${run.status}`);
        outputText(`Duration: ${run.durationMs}ms`);
        outputText('');

        outputText('Results:');

        for (const result of run.results) {
          outputText(
            `- ${result.status.toUpperCase()} | ${result.name} | ${result.durationMs}ms`
          );

          if (result.error) {
            outputText(`  Error: ${result.error}`);
          }
        }
      }

      if (run.status !== 'passed') {
        process.exitCode = 1;
      }
    } catch (error) {
      if (jsonMode) {
        outputJson({
          status: 'errored',
          error: error.message
        });
      } else {
        outputText(`Error: ${error.message}`);
      }

      process.exitCode = 1;
    }
  });
program
  .command('history')
  .description('Show recent test runs')
  .argument('[project]', 'Optional project name')
  .action((projectName) => {
    const jsonMode = program.opts().json;

    try {
      const runs = getHistory(projectName ?? null);

      if (jsonMode) {
        outputJson({ runs });
        return;
      }

      if (runs.length === 0) {
        outputText('No runs found.');
        return;
      }

      outputText('Recent runs:');

      for (const run of runs) {
        outputText(
          `- ${run.id} | ${run.project_name} | ${run.status} | ${run.started_at}`
        );
      }
    } catch (error) {
      if (jsonMode) {
        outputJson({ status: 'errored', error: error.message });
      } else {
        outputText(`Error: ${error.message}`);
      }

      process.exitCode = 1;
    }
  });

program
  .command('show')
  .description('Show full results for a specific run')
  .argument('<run-id>', 'Run ID')
  .action((runId) => {
    const jsonMode = program.opts().json;

    try {
      const run = getRun(runId);

      if (!run) {
        if (jsonMode) {
          outputJson({ status: 'not_found', error: 'Run not found.' });
        } else {
          outputText('Run not found.');
        }

        process.exitCode = 1;
        return;
      }

      if (jsonMode) {
        outputJson(run);
        return;
      }

      outputText(`Run ID: ${run.id}`);
      outputText(`Project: ${run.project_name}`);
      outputText(`Status: ${run.status}`);
      outputText(`Started: ${run.started_at}`);
      outputText(`Ended: ${run.ended_at}`);
      outputText(`Duration: ${run.duration_ms}ms`);

      outputText('');
      outputText('Results:');

      for (const result of run.results) {
        outputText(
          `- ${result.status.toUpperCase()} | ${result.test_name} | ${result.duration_ms}ms`
        );

        if (result.error_message) {
          outputText(`  Error: ${result.error_message}`);
        }
      }
    } catch (error) {
      if (jsonMode) {
        outputJson({ status: 'errored', error: error.message });
      } else {
        outputText(`Error: ${error.message}`);
      }

      process.exitCode = 1;
    }
  });

program.parse(process.argv);
