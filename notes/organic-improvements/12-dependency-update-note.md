# Dependency Update Note

- Upgrade one dependency group per pull request.
- Re-run frontend lint and root tests after updates.
- Document any required runtime version adjustments.
- Keep lockfile and package changes in same commit.
- Reinstall with `npm ci` after lockfile updates before smoke testing.
