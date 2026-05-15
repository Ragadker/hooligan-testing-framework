#!/usr/bin/env node

import { Command } from 'commander';
import { listProjects, runProjectTests } from '../lib/index.js';

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

program.parse(process.argv);
