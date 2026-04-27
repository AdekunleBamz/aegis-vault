# Validation Precision Note

## What changed

- Added stricter STX amount conversion guards in frontend validation utilities.
- `stxToMicroStx` now rejects malformed strings and values with more than 6 decimal places.
- Added focused tests for conversion behavior and trimmed helper validation.

## Why this helps

- Prevents silent precision loss when users submit values with too many decimal places.
- Keeps transaction amount handling aligned with micro-STX precision expectations.
- Improves confidence in form/input handling before contract calls.
- Reduces support churn by returning clearer validation feedback before wallet confirmation.
