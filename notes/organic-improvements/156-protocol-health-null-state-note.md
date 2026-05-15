# Protocol Health Null State

## Summary
Protocol health cards should have a clear null state when read-only calls fail.

## Checks
- Avoid showing zero when data is unknown.
- Include retry guidance for transient API failures.
- Keep unavailable-state styling distinct from degraded health.
