# Governance action idempotency

Governance admin actions should keep buttons disabled after submission until the
transaction id is known, preventing duplicate owner or pause requests.
