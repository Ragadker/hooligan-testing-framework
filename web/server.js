import express from 'express';
import path from 'node:path';
import { apiRouter } from './routes/api.js';
import { listProjects, getHistory, getRun } from '../lib/index.js';

const DEFAULT_PORT = 3000;

/**
 * Creates the Express server for the admin web UI and API.
 * @returns {object} Express app.
 */
export function createServer() {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.resolve('web/views'));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.resolve('web/public')));

  app.use((req, res, next) => {
    console.error(`${req.method} ${req.url}`);
    next();
  });

  app.get('/', (req, res) => {
    const projects = listProjects();
    const projectCards = projects.map((project) => {
      const latestRun = getHistory(project.name)[0] ?? null;

      return {
        ...project,
        latestRun
      };
    });

    res.render('dashboard', {
      title: 'Dashboard',
      projects: projectCards
    });
  });

  app.get('/projects/:name', (req, res) => {
    const projectName = req.params.name;
    const runs = getHistory(projectName);

    res.render('project', {
      title: `Project: ${projectName}`,
      projectName,
      runs
    });
  });

  app.get('/runs/:id', (req, res) => {
    const run = getRun(req.params.id);

    if (!run) {
      return res.status(404).send('Run not found');
    }

    return res.render('run', {
      title: `Run ${run.id}`,
      run
    });
  });

  app.use('/api', apiRouter);

  return app;
}

/**
 * Starts the Express server.
 * @param {number} port - Port number.
 */
export function startServer(port = process.env.PORT || DEFAULT_PORT) {
  const app = createServer();

  app.listen(port, () => {
    console.error(`HTF admin UI running at http://localhost:${port}`);
  });
}
