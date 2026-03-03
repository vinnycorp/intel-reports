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
│   └── pmg/                        # 4chan /biz/ Precious Metals General
│       ├── collect.js              # Main scraper/collector script
│       ├── package.json
│       ├── TEMPLATE.md             # Report template
│       ├── SIGNAL_DB_PROPOSAL.md   # Signal DB design for future trading bot integration
│       └── reports/                # Generated reports (.md)
├── cron/
│   ├── x402.md                     # x402 cron invocation notes
│   └── pmg.md                      # PMG cron invocation notes
└── README.md
```

## Data Sources

Available data sources across all reports. Each report taps into the sources relevant to its domain.

| Source | Method | Cost | x402 | PMG |
|--------|--------|------|:----:|:---:|
| GitHub | Search API | Free | ✅ | |
| Farcaster | Neynar x402 (USDC/Base) | ~$0.03/mo | ✅ | |
| X/Twitter | Grok mini via OpenRouter | ~$0.05/mo | ✅ | |
| Google Alerts | Email digest | Free | ✅ | |
| 4chan /biz/ | [4chan API](https://github.com/4chan/4chan-API) | Free | | ✅ |

## Architecture

All reports follow the same pipeline: collect raw data from sources, compile via LLM, deliver to Telegram.

```
Data Sources ──▶ collect.js ──▶ Sonnet 4.6 (compile) ──▶ Telegram delivery
```

Each report runs on its own cron schedule (see `cron/` for details).

### Requirements

- **Node.js 18+**
- **OPENROUTER_API_KEY** — LLM compilation (Sonnet 4.6) and X/Twitter via Grok mini
- **X402_WALLET_PRIVATE_KEY** — for Neynar x402 micropayments (USDC on Base)
- **X402_WALLET_ADDRESS** — hot wallet address on Base

> Some reports (e.g. PMG) don't require API keys — their data sources are public. See individual report docs for specifics.

### Running Reports

```bash
# x402
cd reports/x402 && npm install
node reports/x402/collect.js

# PMG
cd reports/pmg && npm install
node reports/pmg/collect.js
```

---

## Reports

### x402 — Protocol Intelligence

Automated daily intelligence tracking the **x402 protocol** (HTTP 402 Payment Required) ecosystem — developments, community discussions, and adoption signals.

This report dogfoods x402 itself — Farcaster data is fetched via x402 micropayments on Base (USDC).

**Topics Tracked:**

| Category | What it catches |
|---|---|
| 🔧 Protocol Development | Core protocol changes, spec updates, RFCs |
| 🏗️ Implementations | New SDKs, libraries, integrations |
| 💼 Adoption | Companies/projects implementing x402 |
| 🌐 Ecosystem | Coinbase, Base, and related ecosystem moves |
| 💬 Community | Discussions, opinions, debates |
| 📊 Market Signal | Payment volume, usage metrics, trends |

**Key Accounts & Projects:** Automatically tracks mentions from Coinbase/Base team, x402 protocol contributors, payment infrastructure builders, and DeFi protocols adopting x402.

---

### PMG — Precious Metals General Intelligence

Automated daily intelligence extraction from 4chan's /biz/ **Precious Metals General (/pmg/)** threads.

**How it works:**
- Scrapes the /biz/ catalog to find active /pmg/ threads
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

---

## License

Private — all rights reserved.
