# Onboarding a Project

This guide explains how to register a new project with the Hooligan Testing Framework.

## 1. Create or choose a web project

The project must be a web application that can be reached through a base URL.

Example:

```txt
http://localhost:5050

```

## 2. Create Playwright tests

Place Playwright tests inside the project or in a dedicated tests folder.

Example:
examples/sample-app/tests/sample-app.spec.js

## 3. Create a manifest

Create a manifest file inside the manifests/ folder.

Example:
manifests/sample-app.json

## 4. Add required fields

A manifest must include:

```json
{
  "name": "sample-app",
  "baseUrl": "http://localhost:5050",
  "testDir": "./examples/sample-app/tests"
}
```

## 5. Verify the project is registered

Run:
htf list
The project should appear in the list.

## 6. Run tests from the CLI

Run:
htf run sample-app

## 7. View run history

Run:
htf history sample-app

## 8. View run details

Run:
htf show <run-id>

## 9. Run from the web UI

Start the admin UI:
htf serve
Open:

```txt
http://localhost:3000

```

Then select the project and click Run tests now.

### Notes

The example project in examples/sample-app shows the full registration-to-results flow.
