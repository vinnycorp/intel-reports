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
│       ├── collect.js              # Main scraper script
│       ├── package.json
│       ├── TEMPLATE.md             # Report template
│       ├── SIGNAL_DB_PROPOSAL.md   # Signal DB design for future trading bot integration
│       └── reports/                # Generated reports (.md)
├── cron/
│   ├── x402.md                     # x402 cron invocation notes
│   └── pmg.md                      # PMG cron invocation notes
└── README.md
```

## Running Reports

### x402
```bash
cd reports/x402 && npm install
node reports/x402/collect.js        # from repo root
```

### PMG
```bash
cd reports/pmg && npm install
node reports/pmg/collect.js         # from repo root
```

---

## Report Descriptions

### x402 — Protocol Intelligence Report

Automated daily intelligence report tracking the **x402 protocol** (HTTP 402 Payment Required) ecosystem — developments, community discussions, and adoption signals across multiple data sources.

**Data Sources:**

| Source | Method | Cost |
|--------|--------|------|
| GitHub | Search API | Free |
| Farcaster | Neynar x402 (USDC/Base) | ~$0.03/mo |
| X/Twitter | Grok mini via OpenRouter | ~$0.05/mo |
| Google Alerts | Email digest | Free |

**Topics Tracked:**

| Category | What it catches |
|---|---|
| 🔧 Protocol Development | Core protocol changes, spec updates, RFCs |
| 🏗️ Implementations | New SDKs, libraries, integrations |
| 💼 Adoption | Companies/projects implementing x402 |
| 🌐 Ecosystem | Coinbase, Base, and related ecosystem moves |
| 💬 Community | Discussions, opinions, debates |
| 📊 Market Signal | Payment volume, usage metrics, trends |

**Architecture:**
```
GitHub API ──┐
Neynar x402 ─┤──▶ Sonnet 4.6 (compile) ──▶ Telegram delivery
Grok mini ───┘                                (8AM Bangkok daily)
```

**x402 Payment Details:** This project dogfoods x402 itself — Farcaster data is fetched via x402 micropayments on Base (USDC).

**Requirements:** Node.js 18+, `OPENROUTER_API_KEY`, `X402_WALLET_PRIVATE_KEY`, `X402_WALLET_ADDRESS`

---

### PMG — Precious Metals General Intelligence

Automated daily intelligence extraction from 4chan's /biz/ **Precious Metals General (/pmg/)** threads.

**How it works:**
- Scrapes the /biz/ catalog via the [4chan API](https://github.com/4chan/4chan-API) to find active /pmg/ threads
- Pulls all posts and classifies them across 11 topic categories
- Extracts actionable signals for silver futures trading and mining stock research
- Generates a structured daily report with source-linked highlights

**Topics Tracked:**

| Category | What it catches |
|---|---|
| 📊 COMEX/Inventory | Vault drains, registered vs eligible, delivery standings |
| 🇨🇳 Shanghai/SGE | SGE premium, China demand, East-West divergence |
| 💰 Price Action | Spot moves, tamping, dips, pumps |
| ⛏️ Mining Companies | Ticker mentions, drill results, junior miners |
| 🚨 Supply Shortage | Dealer OOS, mint delays, physical scarcity |
| 🌍 Geopolitics | War, sanctions, BRICS, de-dollarization |
| 🔥 Squeeze/Manipulation | JPM, spoofing, paper vs physical |
| 🏭 Industrial Demand | Solar, EVs, defense, semiconductors |
| 📐 Gold-Silver Ratio | GSR analysis and trades |
| 🏷️ Dealer Premiums | LCS reports, online dealer pricing |
| 📈 Futures/Contracts | Forward pricing, open interest, options |

**Ticker Watch:** Automatically detects mentions of silver mining companies including AYA/AYASF, AG (First Majestic), PAAS (Pan American), HL (Hecla), CDE (Coeur), MAG Silver, EXK (Endeavour).

**Use Cases:**
1. Silver futures trading — actionable signals and sentiment
2. Mining stock research — early detection of undervalued juniors
3. Content automation — feed for autonomous precious metals news publishing

**Requirements:** Node.js 18+, no API keys needed (4chan API is public)

---

## License

Private — all rights reserved.
