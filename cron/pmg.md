# PMG Report — Cron / Invocation

Run with:

```
node reports/pmg/collect.js
```

from the repo root (`intel-reports/`).

## Suggested cron schedule

```cron
0 8 * * * cd /path/to/intel-reports && node reports/pmg/collect.js
```

Runs daily at 08:00 UTC. Adjust path and time as needed.
