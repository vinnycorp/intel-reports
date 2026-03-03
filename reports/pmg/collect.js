#!/usr/bin/env node
/**
 * /pmg/ Precious Metals General - Daily Intelligence Report
 * Scrapes 4chan /biz/ for /pmg/ threads and extracts actionable alpha
 */

const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'pmg-report/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error(`JSON parse failed for ${url}: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<wbr\s*\/?>/gi, '')
    .replace(/<span class="quote">&gt;/gi, '>')
    .replace(/<[^>]+>/g, '')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

async function findPmgThreads() {
  const catalog = await fetch('https://a.4cdn.org/biz/catalog.json');
  const threads = [];
  for (const page of catalog) {
    for (const thread of page.threads) {
      const sub = (thread.sub || '').toLowerCase();
      const com = (thread.com || '').toLowerCase();
      if (sub.includes('/pmg/') || sub.includes('precious metals general') ||
          (com.includes('/pmg/') && com.includes('precious metals'))) {
        threads.push({ no: thread.no, replies: thread.replies, sub: thread.sub || '', time: thread.time });
      }
    }
  }
  // Sort by most recent
  threads.sort((a, b) => b.time - a.time);
  return threads;
}

async function getThreadPosts(threadNo) {
  try {
    const data = await fetch(`https://a.4cdn.org/biz/thread/${threadNo}.json`);
    return data.posts.map(p => ({
      no: p.no,
      threadNo: threadNo,
      time: p.time,
      date: new Date(p.time * 1000).toISOString(),
      text: stripHtml(p.com),
      hasImage: !!p.filename
    }));
  } catch(e) {
    console.error(`Failed to fetch thread ${threadNo}: ${e.message}`);
    return [];
  }
}

// Topic detection patterns
const TOPICS = {
  comex_inventory: {
    label: '📊 COMEX/Inventory',
    patterns: [/comex/i, /warehouse/i, /registered/i, /eligible/i, /vault/i, /drain/i, /deliveries/i, /standing for delivery/i, /oas/i]
  },
  sge_shanghai: {
    label: '🇨🇳 Shanghai/SGE/China',
    patterns: [/shanghai/i, /\bsge\b/i, /china/i, /chinese/i, /shfe/i, /premium.*china/i, /china.*premium/i]
  },
  price_action: {
    label: '💰 Price Action/Spot',
    patterns: [/spot price/i, /\$\d{2,3}/i, /tamp/i, /dump/i, /moon/i, /pump/i, /silver.*price/i, /gold.*price/i, /cheapies/i, /dip/i]
  },
  miners: {
    label: '⛏️ Mining Companies',
    patterns: [/\baya\b/i, /ayasf/i, /first majestic/i, /\bag\b(?!\s*coin)/i, /pan american/i, /\bpaas\b/i, /hecla/i, /\bhl\b/i, /coeur/i, /endeavour/i, /mag silver/i, /mining stock/i, /miner/i, /junior miner/i, /explorer/i, /discovery/i, /drill result/i]
  },
  supply_shortage: {
    label: '🚨 Supply Shortage',
    patterns: [/shortage/i, /out of stock/i, /sold out/i, /no supply/i, /can't get/i, /backorder/i, /wait.*month/i, /delivery.*delay/i, /mint.*nothing/i, /no metal/i, /OOS/i]
  },
  geopolitics: {
    label: '🌍 Geopolitics/War',
    patterns: [/iran/i, /war/i, /strait.*hormuz/i, /military/i, /sanctions/i, /brics/i, /de-?dollariz/i, /central bank.*buy/i, /reserve/i, /tariff/i, /invasion/i]
  },
  silver_squeeze: {
    label: '🔥 Silver Squeeze/Manipulation',
    patterns: [/squeeze/i, /manipulation/i, /spoofing/i, /jp\s?morgan/i, /jpm/i, /naked short/i, /paper.*silver/i, /paper.*gold/i, /suppression/i, /tamp/i]
  },
  industrial_demand: {
    label: '🏭 Industrial Demand',
    patterns: [/solar/i, /ev\b/i, /electric vehicle/i, /industrial/i, /5g/i, /electronics/i, /semiconductor/i, /missile/i, /military.*demand/i, /defense.*silver/i]
  },
  gsr: {
    label: '📐 Gold-Silver Ratio',
    patterns: [/gold.silver ratio/i, /\bgsr\b/i, /ratio/i, /1:1.*silver.*gold/i]
  },
  dealer_premiums: {
    label: '🏷️ Dealer Premiums/Buying',
    patterns: [/premium/i, /dealer/i, /lcs/i, /local coin shop/i, /sd bullion/i, /apmex/i, /jm bullion/i, /buying.*silver/i, /stack/i]
  },
  futures: {
    label: '📈 Futures/Forward Contracts',
    patterns: [/futures/i, /forward/i, /contract/i, /expir/i, /rollover/i, /april.*contract/i, /march.*contract/i, /options/i, /puts/i, /calls/i]
  }
};

function classifyPost(text) {
  const matched = [];
  for (const [key, topic] of Object.entries(TOPICS)) {
    if (topic.patterns.some(p => p.test(text))) {
      matched.push(key);
    }
  }
  return matched;
}

function generateReport(allPosts, threadInfos) {
  // Group posts by topic
  const topicPosts = {};
  for (const key of Object.keys(TOPICS)) {
    topicPosts[key] = [];
  }

  for (const post of allPosts) {
    if (post.text.length < 15) continue; // skip very short posts
    const topics = classifyPost(post.text);
    for (const t of topics) {
      topicPosts[t].push(post);
    }
  }

  // Sort topics by post count
  const sortedTopics = Object.entries(topicPosts)
    .filter(([, posts]) => posts.length > 0)
    .sort((a, b) => b[1].length - a[1].length);

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  let report = `# 🪙 /pmg/ Daily Intelligence Report\n`;
  report += `**Date:** ${dateStr}\n`;
  report += `**Threads analyzed:** ${threadInfos.length} (${allPosts.length} total posts)\n`;
  report += `**Thread IDs:** ${threadInfos.map(t => `[${t.no}](https://boards.4chan.org/biz/thread/${t.no})`).join(', ')}\n\n`;
  report += `---\n\n`;

  // Executive summary
  report += `## 🎯 Executive Summary\n\n`;
  const topTopics = sortedTopics.slice(0, 5);
  report += `**Top themes today:**\n`;
  for (const [key, posts] of topTopics) {
    report += `- ${TOPICS[key].label} (${posts.length} mentions)\n`;
  }
  report += `\n`;

  // Detailed sections
  for (const [key, posts] of sortedTopics) {
    report += `## ${TOPICS[key].label}\n`;
    report += `*${posts.length} related posts*\n\n`;

    // Pick top posts (longest / most substantive)
    const substantive = posts
      .filter(p => p.text.length > 50)
      .sort((a, b) => b.text.length - a.text.length)
      .slice(0, 5);

    for (const p of substantive) {
      const snippet = p.text.length > 300 ? p.text.substring(0, 300) + '...' : p.text;
      const link = `https://boards.4chan.org/biz/thread/${p.threadNo}#p${p.no}`;
      report += `> ${snippet.replace(/\n/g, '\n> ')}\n> — [source](${link})\n\n`;
    }
    report += `---\n\n`;
  }

  // Actionable signals section
  report += `## 🔔 Actionable Signals for Silver Futures Trading\n\n`;

  // Check for specific signals
  const signals = [];

  if (topicPosts.comex_inventory.length > 3) {
    signals.push('⚠️ **High COMEX chatter** — monitor inventory reports closely');
  }
  if (topicPosts.sge_shanghai.length > 0) {
    signals.push('🇨🇳 **Shanghai/SGE discussion active** — check SGE premium vs COMEX spread');
  }
  if (topicPosts.supply_shortage.length > 2) {
    signals.push('🚨 **Physical shortage reports** — dealers reporting OOS/delays, bullish for physical premium');
  }
  if (topicPosts.geopolitics.length > 3) {
    signals.push('🌍 **Geopolitical risk elevated** — safe haven bid likely');
  }
  if (topicPosts.futures.length > 0) {
    signals.push('📈 **Futures/contracts discussion** — check forward pricing anomalies');
  }
  if (topicPosts.industrial_demand.length > 0) {
    signals.push('🏭 **Industrial demand signals** — long-term bullish thesis reinforced');
  }
  if (topicPosts.miners.length > 0) {
    signals.push('⛏️ **Mining company mentions** — screen for undervalued juniors');
  }

  if (signals.length === 0) {
    report += `No strong directional signals detected today.\n\n`;
  } else {
    for (const s of signals) {
      report += `${s}\n`;
    }
    report += `\n`;
  }

  // Mining company mentions
  report += `## ⛏️ Mining Company Ticker Watch\n\n`;
  const tickerPatterns = [
    { ticker: 'AYA/AYASF', name: 'Aya Gold & Silver', pattern: /\baya\b|\bayasf\b/i },
    { ticker: 'AG', name: 'First Majestic', pattern: /first majestic|\bag\b(?!\s*(coin|round|bar|eagle|maple))/i },
    { ticker: 'PAAS', name: 'Pan American Silver', pattern: /pan american|\bpaas\b/i },
    { ticker: 'HL', name: 'Hecla Mining', pattern: /hecla|\bhl\b/i },
    { ticker: 'CDE', name: 'Coeur Mining', pattern: /coeur|\bcde\b/i },
    { ticker: 'MAG', name: 'MAG Silver', pattern: /mag silver|\bmag\b/i },
    { ticker: 'EXK', name: 'Endeavour Silver', pattern: /endeavour silver|\bexk\b/i },
  ];

  let tickerMentions = false;
  for (const { ticker, name, pattern } of tickerPatterns) {
    const mentions = allPosts.filter(p => pattern.test(p.text));
    if (mentions.length > 0) {
      tickerMentions = true;
      const links = mentions.slice(0, 3).map(p => `[#${p.no}](https://boards.4chan.org/biz/thread/${p.threadNo}#p${p.no})`).join(', ');
      report += `**${ticker}** (${name}): ${mentions.length} mention(s) — ${links}\n`;
    }
  }
  if (!tickerMentions) {
    report += `No specific mining tickers mentioned today.\n`;
  }
  report += `\n`;

  // Silver Bullion SG content ideas
  report += `## 📰 Content Ideas for Silver Bullion SG\n\n`;
  report += `Based on today's /pmg/ themes, potential content angles:\n\n`;
  
  if (topicPosts.supply_shortage.length > 0) {
    report += `- **Physical silver shortage deepens** — dealers worldwide reporting delays and OOS\n`;
  }
  if (topicPosts.comex_inventory.length > 0) {
    report += `- **COMEX drain watch** — inventory movements and delivery standing\n`;
  }
  if (topicPosts.sge_shanghai.length > 0) {
    report += `- **East vs West premium divergence** — SGE/COMEX spread analysis\n`;
  }
  if (topicPosts.geopolitics.length > 0) {
    report += `- **Geopolitical safe haven bid** — precious metals in times of conflict\n`;
  }
  if (topicPosts.industrial_demand.length > 0) {
    report += `- **Silver's industrial supercycle** — solar, defense, and tech demand\n`;
  }
  if (topicPosts.silver_squeeze.length > 0) {
    report += `- **Paper vs physical disconnect** — the case for holding real metal\n`;
  }
  if (topicPosts.gsr.length > 0) {
    report += `- **Gold-silver ratio analysis** — historical levels and what they signal\n`;
  }

  report += `\n---\n*Report generated automatically from /biz/ /pmg/ threads. Raw 4chan content filtered for signal.*\n`;

  return report;
}

async function main() {
  console.log('🔍 Scanning /biz/ catalog for /pmg/ threads...');
  const threads = await findPmgThreads();
  console.log(`Found ${threads.length} /pmg/ thread(s): ${threads.map(t => t.no).join(', ')}`);

  if (threads.length === 0) {
    console.log('No /pmg/ threads found!');
    process.exit(1);
  }

  // Fetch last 2-3 threads for coverage
  const threadsToFetch = threads.slice(0, 3);
  let allPosts = [];

  for (const t of threadsToFetch) {
    console.log(`📥 Fetching thread ${t.no} (${t.replies} replies)...`);
    const posts = await getThreadPosts(t.no);
    allPosts = allPosts.concat(posts);
    // Rate limit
    await new Promise(r => setTimeout(r, 1100));
  }

  console.log(`📊 Analyzing ${allPosts.length} posts...`);
  const report = generateReport(allPosts, threadsToFetch);

  // Output
  const fs = require('fs');
  const dateStr = new Date().toISOString().split('T')[0];
  const outPath = `/data/workspace/pmg-report/reports/${dateStr}.md`;
  fs.mkdirSync('/data/workspace/pmg-report/reports', { recursive: true });
  fs.writeFileSync(outPath, report);
  console.log(`✅ Report saved to ${outPath}`);

  // Also output to stdout for piping
  console.log('\n' + report);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
