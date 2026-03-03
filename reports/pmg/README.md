# /pmg/ Intelligence Report

Automated daily intelligence extraction from 4chan's /biz/ **Precious Metals General (/pmg/)** threads.

## What it does

- Scrapes the /biz/ catalog via the [4chan API](https://github.com/4chan/4chan-API) to find active /pmg/ threads
- Pulls all posts and classifies them across 11 topic categories
- Extracts actionable signals for silver futures trading and mining stock research
- Generates a structured daily report with source-linked highlights
- Designed to feed autonomous content publishing for precious metals industry news

## Topics Tracked

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

## Ticker Watch

Automatically detects mentions of silver mining companies including:
AYA/AYASF, AG (First Majestic), PAAS (Pan American), HL (Hecla), CDE (Coeur), MAG Silver, EXK (Endeavour)

## Usage

```bash
node scraper.js
```

Reports are saved to `reports/YYYY-MM-DD.md` (gitignored).

## Use Cases

1. **Silver futures trading** — actionable signals and sentiment from the most active precious metals community online
2. **Mining stock research** — early detection of undervalued junior miners and exploration plays
3. **Content automation** — feed for autonomous precious metals news publishing (Telegram, Twitter, email)

## Requirements

- Node.js 18+
- No API keys needed (4chan API is public)

## License

Private — all rights reserved.
