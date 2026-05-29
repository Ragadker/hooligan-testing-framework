import express from 'express';
import { apiRouter } from './routes/api.js';

const DEFAULT_PORT = 3000;

/**
 * Creates the Express server for the admin backend API.
 * @returns {object} Express app.
 */
export function createServer() {
  const app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    console.error(`${req.method} ${req.url}`);
    next();
  });

  app.get('/', (req, res) => {
    res.json({
      message: 'Hooligan Testing Framework API is running'
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
    console.error(`HTF admin API running at http://localhost:${port}`);
  });
}
