# Hooligan Testing Framework

The Hooligan Testing Framework is a Node.js and Playwright-based tool for registering web projects, running end-to-end tests, storing run history, and viewing results from both the CLI and a web UI.

## Requirements

- Node.js LTS
- npm
- Playwright browsers

## Install

```bash
npm install
npx playwright install
npm link
```

### Run tests

npm test

### Start the sample app

npm run sample-app
The sample app runs at:

```txt
http://localhost:5050
```

### CLI usage

List projects:
htf list
Run tests:
htf run sample-app
Run one test:
htf run sample-app --test "home page loads"
View history:
htf history sample-app
Show run details:
htf show <run-id>
JSON output:
htf --json run sample-app

### Start the admin web UI

htf serve
Open:

```txt
http://localhost:3000
```

### Example project

The example project is located at:
examples/sample-app

It includes:
home page smoke test
navigation test
form submission test

### Documentation

docs/manifest.md
docs/cli.md
docs/schema.md
docs/api.md
docs/onboarding-a-project.md

### Database

The SQLite database defaults to:
./db/htf.sqlite
The location can be changed with:
HTF_DB_PATH=./custom/path.sqlite

### Development checks

Run these before committing:
npm test
npm run lint
npm run format
