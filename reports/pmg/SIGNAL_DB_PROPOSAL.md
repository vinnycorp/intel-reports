# Signal Database Structure for Trading Bot

## Current State
- Only markdown reports in `/reports/YYYY-MM-DD.md`
- No structured data for machine analysis

## Proposed Structure

### 1. JSON Data Output (alongside markdown)
```json
{
  "date": "2026-02-19",
  "timestamp": 1771495200000,
  "threads": [
    {"no": 61870723, "replies": 304, "url": "https://boards.4chan.org/biz/thread/61870723"}
  ],
  "total_posts": 705,
  "signals": {
    "price_action": {
      "post_count": 101,
      "sentiment": "bullish",
      "confidence": 0.75,
      "key_levels": ["$73", "$79", "$107"],
      "keywords": ["moon", "dump", "tamp", "cheapies"],
      "signal_strength": 8.2
    },
    "geopolitics": {
      "post_count": 36,
      "sentiment": "elevated_risk",
      "confidence": 0.82,
      "events": ["Iran", "Strait of Hormuz", "military drills"],
      "signal_strength": 7.1
    },
    "supply_shortage": {
      "post_count": 12,
      "sentiment": "critical",
      "confidence": 0.91,
      "indicators": ["OOS", "3 month wait", "no delivery"],
      "signal_strength": 9.3
    }
  },
  "tickers": {
    "AG": {"mentions": 3, "sentiment": "neutral"},
    "HL": {"mentions": 2, "sentiment": "neutral"}
  },
  "composite_score": {
    "bullish_sentiment": 7.8,
    "supply_stress": 9.1,
    "geopolitical_risk": 7.1,
    "overall_signal": "strong_buy"
  }
}
```

### 2. Time-Series Database Schema

**Table: daily_signals**
```sql
date, total_posts, price_sentiment, supply_stress_score, 
geopolitical_risk, futures_chatter, comex_mentions,
sge_china_score, ticker_mentions_json, composite_bullish_score
```

**Table: signal_events** 
```sql
date, timestamp, signal_type, confidence, strength, 
raw_post_count, keywords_json, sentiment
```

### 3. Confidence Scoring Methodology

**Signal Strength (0-10):**
- Post count weight: 30%
- Keyword intensity: 25% 
- Source credibility: 20%
- Historical accuracy: 15%
- Cross-validation: 10%

**Confidence Levels:**
- 0.9+: High confidence (multiple threads, consistent messaging)
- 0.7-0.9: Medium confidence 
- 0.5-0.7: Low confidence
- <0.5: Noise/ignore

### 4. Trading Signal Categories

**Primary Signals:**
1. `supply_shortage` - Physical metal scarcity (highest weight)
2. `comex_stress` - Inventory/delivery issues 
3. `geopolitical_risk` - War/sanctions driving safe haven
4. `price_momentum` - Technical sentiment
5. `industrial_demand` - Solar/defense/tech demand

**Secondary Signals:**
1. `sge_premium` - Shanghai vs COMEX divergence
2. `futures_positioning` - Options/forward curves
3. `mining_sentiment` - Junior miner chatter
4. `manipulation_claims` - JPM/spoofing discussions

### 5. Implementation Plan

**Phase 1:** Modify scraper to output JSON alongside markdown
**Phase 2:** Build SQLite database with historical data  
**Phase 3:** Add confidence scoring algorithms
**Phase 4:** Create trading signal API endpoints
**Phase 5:** Backtest signals against historical silver prices

## Storage Options

1. **SQLite** - Simple, local, good for backtesting
2. **PostgreSQL** - If you want time-series analysis
3. **JSON files** - Easiest to start, append daily

## Questions for Vincent:
1. What timeframe trades? (intraday, daily, weekly?)
2. Futures, ETFs, or miners?
3. Risk tolerance for signal accuracy?
4. Backtesting period needed?