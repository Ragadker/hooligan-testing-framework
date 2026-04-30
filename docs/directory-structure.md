# Directory Structure Plan

This project is divided into layers:

- bin/ → CLI commands
- lib/ → core logic (test runner, registry, database)
- web/ → admin UI (Express + EJS)
- docs/ → documentation
- playground/ → temporary tests for learning Playwright

This structure keeps the core reusable by both CLI and web UI.
