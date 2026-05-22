import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_DB_PATH = './db/htf.sqlite';

/**
 * Stores and queries projects, runs, and test results using SQLite.
 */
export class ResultStore {
  /**
   * Creates a ResultStore.
   * @param {string} dbPath - SQLite database file path.
   */
  constructor(dbPath = process.env.HTF_DB_PATH || DEFAULT_DB_PATH) {
    this.dbPath = dbPath;
    this.ensureDatabaseFolder();
    this.db = new Database(this.dbPath);
    this.runMigrations();
  }

  /**
   * Ensures the database folder exists.
   */
  ensureDatabaseFolder() {
    const folder = path.dirname(this.dbPath);
    fs.mkdirSync(folder, { recursive: true });
  }

  /**
   * Runs SQL migration files.
   */
  runMigrations() {
    const migrationPath = './db/migrations/001_init.sql';
    const sql = fs.readFileSync(migrationPath, 'utf8');
    this.db.exec(sql);
  }

  /**
   * Inserts or updates a project record.
   * @param {object} project - Project manifest.
   */
  saveProject(project) {
    const statement = this.db.prepare(`
      INSERT INTO projects (name, base_url, manifest_path, created_at)
      VALUES (@name, @baseUrl, @manifestPath, @createdAt)
      ON CONFLICT(name) DO UPDATE SET
        base_url = excluded.base_url,
        manifest_path = excluded.manifest_path
    `);

    statement.run({
      name: project.name,
      baseUrl: project.baseUrl,
      manifestPath: project.manifestPath,
      createdAt: new Date().toISOString()
    });
  }

  /**
   * Creates a run with running status.
   * @param {object} run - Run object.
   */
  createRun(run) {
    const statement = this.db.prepare(`
      INSERT INTO runs (id, project_name, status, started_at, ended_at, duration_ms, error)
      VALUES (@id, @projectName, @status, @startedAt, @endedAt, @durationMs, @error)
    `);

    statement.run(run);
  }

  /**
   * Completes a run and stores its results using a transaction.
   * @param {object} run - Completed run object.
   */
  completeRun(run) {
    const updateRun = this.db.prepare(`
      UPDATE runs
      SET status = @status,
          ended_at = @endedAt,
          duration_ms = @durationMs,
          error = @error
      WHERE id = @id
    `);

    const insertResult = this.db.prepare(`
      INSERT INTO results
      (run_id, test_name, status, duration_ms, error_message, stdout, stderr)
      VALUES
      (@runId, @testName, @status, @durationMs, @errorMessage, @stdout, @stderr)
    `);

    const transaction = this.db.transaction(() => {
      updateRun.run({
        id: run.id,
        status: run.status,
        endedAt: run.endedAt,
        durationMs: run.durationMs,
        error: run.error
      });

      for (const result of run.results) {
        insertResult.run({
          runId: run.id,
          testName: result.name,
          status: result.status,
          durationMs: result.durationMs,
          errorMessage: result.error,
          stdout: result.stdout,
          stderr: result.stderr
        });
      }
    });

    transaction();
  }

  /**
   * Gets recent runs, optionally filtered by project name.
   * @param {string|null} projectName - Optional project name.
   * @returns {Array<object>} Recent runs.
   */
  getHistory(projectName = null) {
    if (projectName) {
      return this.db
        .prepare(
          `
          SELECT *
          FROM runs
          WHERE project_name = ?
          ORDER BY started_at DESC
          LIMIT 20
        `
        )
        .all(projectName);
    }

    return this.db
      .prepare(
        `
        SELECT *
        FROM runs
        ORDER BY started_at DESC
        LIMIT 20
      `
      )
      .all();
  }

  /**
   * Gets one run with all test results.
   * @param {string} runId - Run ID.
   * @returns {object|null} Run with results.
   */
  getRun(runId) {
    const run = this.db.prepare('SELECT * FROM runs WHERE id = ?').get(runId);

    if (!run) {
      return null;
    }

    const results = this.db
      .prepare('SELECT * FROM results WHERE run_id = ? ORDER BY id ASC')
      .all(runId);

    return {
      ...run,
      results
    };
  }
}
