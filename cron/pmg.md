# PMG Report — Cron / Invocation

Run with:

```
node reports/pmg/scraper.js
```

from the repo root (`auto-reports/`).

## Suggested cron schedule

```cron
0 8 * * * cd /path/to/auto-reports && node reports/pmg/scraper.js
```

Runs daily at 08:00 UTC. Adjust path and time as needed.
