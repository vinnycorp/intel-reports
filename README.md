# intel-reports

Monorepo for automated intelligence reports. Each report is a standalone Node.js script with its own `package.json` and `reports/` output directory.

## Structure

```
intel-reports/
├── shared/                         # Future shared pipeline utilities
├── reports/
│   ├── x402/                       # x402 protocol daily intelligence
│   │   ├── collect.js              # Main collector script
│   │   ├── package.json
│   │   ├── TEMPLATE.md             # Report template
│   │   └── reports/                # Generated reports (.json + .md)
│   └── pmg/                        # 4chan /biz/ Precious Metals General scraper
│       ├── scraper.js              # Main scraper script
│       ├── package.json
│       ├── TEMPLATE.md             # Report template
│       ├── README.md               # PMG-specific notes
│       ├── SIGNAL_DB_PROPOSAL.md   # Signal DB design proposal
│       └── reports/                # Generated reports (.md)
├── cron/
│   ├── x402.md                     # x402 cron invocation notes
│   └── pmg.md                      # PMG cron invocation notes
└── README.md                       # This file
```

## Running Reports

### x402
```bash
cd reports/x402 && npm install
node reports/x402/collect.js        # from repo root
```
See [`cron/x402.md`](cron/x402.md) for scheduling details.

### PMG
```bash
cd reports/pmg && npm install
node reports/pmg/scraper.js         # from repo root
```
See [`cron/pmg.md`](cron/pmg.md) for scheduling details.

## History

Consolidated from two separate repos:
- [`vinnycorp/x402-report`](https://github.com/vinnycorp/x402-report) → `reports/x402/`
- [`vinnycorp/pmg-report`](https://github.com/vinnycorp/pmg-report) → `reports/pmg/`

Both source repos are archived.
