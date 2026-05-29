import express from 'express';
import {
  listProjects,
  getHistory,
  getRun,
  runProjectTests
} from '../../lib/index.js';
import crypto from 'node:crypto';

export const apiRouter = express.Router();

apiRouter.get('/projects', (req, res) => {
  const projects = listProjects();

  res.json({
    projects: projects.map((project) => ({
      name: project.name,
      baseUrl: project.baseUrl,
      testDir: project.testDir
    }))
  });
});

apiRouter.get('/projects/:name/runs', (req, res) => {
  const runs = getHistory(req.params.name);

  res.json({
    runs
  });
});

apiRouter.get('/runs/:id', (req, res) => {
  const run = getRun(req.params.id);

  if (!run) {
    return res.status(404).json({
      error: 'Run not found'
    });
  }

  return res.json(run);
});

apiRouter.post('/projects/:name/runs', (req, res) => {
  const projectName = req.params.name;
  const runId = crypto.randomUUID();

  runProjectTests(projectName, { runId }).catch((error) => {
    console.error(`Run failed for ${projectName}: ${error.message}`);
  });

  res.status(202).json({
    runId,
    projectName,
    status: 'started'
  });
});
