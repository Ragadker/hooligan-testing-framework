# Database Schema

The Hooligan Testing Framework stores project and test run data in SQLite.

The database file defaults to:

```txt
./db/htf.sqlite
```

The location can be changed using the HTF_DB_PATH environment variable.

## Tables

## projects

Stores registered projects.
| Column | Type | Description |
| ------------- | ------- | ---------------------------- |
| id | INTEGER | Primary key |
| name | TEXT | Unique project name |
| base_url | TEXT | Project base URL |
| manifest_path | TEXT | Path to the project manifest |
| created_at | TEXT | ISO 8601 timestamp |

### runs

Stores each test run.
| Column | Type | Description |
| ------------ | ------- | ----------------------------------- |
| id | TEXT | Unique run ID |
| project_name | TEXT | Name of the tested project |
| status | TEXT | running, passed, failed, or errored |
| started_at | TEXT | ISO 8601 start timestamp |
| ended_at | TEXT | ISO 8601 end timestamp |
| duration_ms | INTEGER | Total run duration in milliseconds |
| error | TEXT | Run-level error message, if any |

### results

Stores individual test results for each run.
| Column | Type | Description |
| ------------- | ------- | -------------------------------- |
| id | INTEGER | Primary key |
| run_id | TEXT | Related run ID |
| test_name | TEXT | Test name |
| status | TEXT | passed or failed |
| duration_ms | INTEGER | Test duration in milliseconds |
| error_message | TEXT | Error message if the test failed |
| stdout | TEXT | Test stdout |
| stderr | TEXT | Test stderr |

## Timestamp Format

Timestamps are stored as ISO 8601 strings.

## Reliability

Run completion and result insertion use a transaction so the database does not store incomplete result data if something fails.
