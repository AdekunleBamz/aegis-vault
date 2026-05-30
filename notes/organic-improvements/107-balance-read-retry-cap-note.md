# Balance read retry cap

Balance read retry logic should cap attempts and surface a recoverable error
instead of spinning indefinitely.
