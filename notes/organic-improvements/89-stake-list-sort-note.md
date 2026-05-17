# Stake List Sort Note

## Summary
Stake list QA should confirm sort order remains predictable as users add locked, unlocked, and withdrawn stakes.

## Checks
- Compare sort order after creating multiple stakes with different lock periods.
- Confirm withdrawn stakes do not obscure active positions.
- Include the selected sort field when reporting list-order bugs.
