# Release font fetch note

Production builds may retry external font requests; record retry warnings separately from app compile errors.

If retries pass, keep the build artifact and note the warning in release handoff.
