# CLI Documentation

The Hooligan Testing Framework provides a command line interface (CLI) called `htf`.  
This CLI allows users to list registered projects and run their tests.

---

## Install locally for development

```bash
npm link
```

This makes the htf command available globally on your system.

## Help

```bash
htf --help
```

Displays all available commands and options.

## List registered projects

```bash
htf list
```

Lists all projects defined in the manifests/ directory.
Example output:
Registered projects:

- example-project (https://example.com)

## List registered projects (JSON output)

htf --json list
Outputs the list of projects in structured JSON format.
Example

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

htf run example-project
Runs all Playwright tests for the specified project.
Example output
Running tests for project: example-project

Run ID: 1234
Project: example-project
Status: passed
Duration: 5000ms

Results:

- PASSED | example.com loads | 500ms
- PASSED | page has correct heading | 400ms
- PASSED | link is visible | 350ms

## htf run example-project --test "example.com loads"

Runs only tests that match the given test name.

## htf --json run example-project

Outputs a structured run object in JSON format.
Example

{
"id": "run-id",
"projectName": "example-project",
"status": "passed",
"startedAt": "2026-01-01T00:00:00Z",
"endedAt": "2026-01-01T00:00:05Z",
"durationMs": 5000,
"results": [
{
"name": "example.com loads",
"status": "passed",
"durationMs": 500,
"error": null,
"stdout": "",
"stderr": ""
}
],
"error": null
}

Exit Codes
The CLI returns exit codes based on test results:
| Exit Code | Meaning |
|----------|--------|
| 0 | All tests passed |
| 1 | One or more tests failed |

## Notes

The --json option outputs machine-readable JSON for automation or scripting.
By default, the CLI outputs human-readable text.

## Start the admin API server

```bash
htf serve
```

Starts the Express backend API.

### Custom port

htf serve --port 4000
