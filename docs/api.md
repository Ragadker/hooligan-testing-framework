# API Documentation

The Hooligan Testing Framework exposes an Express API for reading projects, viewing run history, viewing run details, and triggering test runs.

The default server URL is:

```txt
http://localhost:3000

```

## Start the server with:

htf serve

## Start on a custom port:

htf serve --port 4000

## GET /api/projects

Lists all registered projects.

### Example

curl http://localhost:3000/api/projects

### Response

```json
{
  "projects": [
    {
      "name": "example-project",
      "baseUrl": "https://example.com",
      "testDir": "./playground"
    }
  ]
}
```

### GET /api/projects/:name/runs

Lists recent runs for a project.

## Example

curl http://localhost:3000/api/projects/example-project/runs

```json
{
  "runs": [
    {
      "id": "run-id",
      "project_name": "example-project",
      "status": "passed",
      "started_at": "2026-01-01T00:00:00.000Z",
      "ended_at": "2026-01-01T00:00:05.000Z",
      "duration_ms": 5000,
      "error": null
    }
  ]
}
```

### GET /api/runs/:id

Shows full details for a specific run.

## Response

```json
{
  "id": "run-id",
  "project_name": "example-project",
  "status": "passed",
  "started_at": "2026-01-01T00:00:00.000Z",
  "ended_at": "2026-01-01T00:00:05.000Z",
  "duration_ms": 5000,
  "error": null,
  "results": [
    {
      "id": 1,
      "run_id": "run-id",
      "test_name": "example.com loads",
      "status": "passed",
      "duration_ms": 500,
      "error_message": null,
      "stdout": "",
      "stderr": ""
    }
  ]
}
```

### POST /api/projects/:name/runs

Triggers a new test run for a project.

## Example

curl -X POST http://localhost:3000/api/projects/example-project/runs

## Response

```json
{
  "runId": "run-id",
  "projectName": "example-project",
  "status": "started"
}
```

This endpoint returns immediately with a run ID. The test run continues asynchronously in the background. The client can poll `GET /api/runs/:id` using the returned run ID.

## GET /api/projects/:name/runs

OR

## GET /api/runs/:id

to check for results.

### Request Logging

The server logs each request method and URL to stderr
