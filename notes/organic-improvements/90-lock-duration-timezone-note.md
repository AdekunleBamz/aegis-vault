# Lock Duration Timezone Note

## Summary
Lock duration copy should avoid implying calendar-day precision when unlock timing is based on block height.

## Checks
- Compare countdown copy with the stake unlock block.
- Verify timezone labels are only used for estimated wall-clock times.
- Include both local time and block height when users report timing confusion.
