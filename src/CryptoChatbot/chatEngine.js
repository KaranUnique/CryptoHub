/**
 * Chat Engine — Intent Parser + Response Generator
 * 
 * Entirely rule-based NLP. Zero API calls for understanding.
 * Uses regex, keyword matching, and pattern recognition.
 */

import {
  getGlobalData,
  getTopCoins,
  getCoinPrice,
  getCoinDetails,
  getTrending,
  searchCoin,
  getGainersLosers,
  compareCoins,
  resolveCoinId,
  formatINR,
  formatPercent,
} from "./coinGeckoService";
import { searchReports, searchEducation } from "./knowledgeBase";

// ─── Intent Definitions ───────────────────────────────────────────

const INTENT_PATTERNS = [
  {
    intent: "greeting",
    patterns: [
      /^(hi|hello|hey|howdy|sup|yo|hola|good\s*(morning|evening|afternoon|night)|namaste)/i,
    ],
  },
  {
    intent: "help",
    patterns: [
      /\b(help|what can you do|commands|features|menu|options)\b/i,
    ],
  },
  {
    intent: "market_overview",
    patterns: [
      /\b(market|overall)\s*(overview|summary|status|update|today|now|doing|look)/i,
      /\bhow('?s| is| are)\s*(the )?(market|crypto|things)/i,
      /\b(green|red)\s*day/i,
      /\bmarket\s*(cap|sentiment|mood)/i,
      /\bwhat'?s\s*(happening|going on|up)\s*(in|with)?\s*(the )?(market|crypto)/i,
    ],
  },
  {
    intent: "price_check",
    patterns: [
      /\b(price|cost|value|rate|worth)\s*(of|for)?\s+(\w[\w\s]*)/i,
      /\bhow\s*much\s*(is|does|for)\s+(\w[\w\s]*)/i,
      /\b(\w+)\s*(price|cost|value|rate|kya hai|kitna)/i,
      /^(btc|eth|sol|bnb|xrp|ada|doge|dot|matic|avax|link|shib|ltc|uni|atom|pepe|ton|trx|sui|near|apt|arb|op)\s*\??$/i,
    ],
  },
  {
    intent: "top_gainers",
    patterns: [
      /\b(top|best|biggest|highest)\s*(gainer|winner|performer|pump)/i,
      /\bwho\s*(gained|pumped|went up|mooned|rallied)/i,
      /\bgain(ed|ing|s)?\s*(the )?(most|highest|biggest)/i,
      /\bwhich\s*(coin|crypto)\s*(gained|pumped|up|rallied)/i,
      /\bpump(ed|ing)?\s*(the most|today|hard)/i,
    ],
  },
  {
    intent: "top_losers",
    patterns: [
      /\b(top|worst|biggest|highest)\s*(loser|dump|decline|drop|crash)/i,
      /\bwho\s*(lost|dumped|dropped|crashed|went down|tanked)/i,
      /\blos(t|ing|e|es)\s*(the )?(most|highest|biggest)/i,
      /\bwhich\s*(coin|crypto)\s*(lost|dumped|dropped|crashed|tanked)/i,
      /\bdump(ed|ing)?\s*(the most|today|hard)/i,
    ],
  },
  {
    intent: "trending",
    patterns: [
      /\b(trending|hot|popular|buzzing|viral|hype)/i,
      /\bwhat'?s\s*(trending|hot|popular)/i,
      /\btrend(s|ing)?\s*(today|now|right now|coins?)/i,
    ],
  },
  {
    intent: "compare",
    patterns: [
      /\bcompare\s+(\w+)\s*(and|vs|versus|with|or|&)\s*(\w+)/i,
      /\b(\w+)\s*(vs|versus|compared to|or)\s*(\w+)/i,
    ],
  },
  {
    intent: "coin_info",
    patterns: [
      /\b(tell|info|about|details|what is|what'?s|explain)\s*(me )?(about )?\s*(\w[\w\s]*)/i,
      /\bwhat\s*(is|are)\s+(\w[\w\s]*)/i,
    ],
  },
  {
    intent: "report",
    patterns: [
      /\b(report|analysis|vector|on-?chain|week\s*on|blog|research|article)\b/i,
      /\blatest\s*(report|analysis|research)/i,
      /\bwhat\s*(did|does|do)\s*(the )?(report|analysis|vector|blog)/i,
    ],
  },
  {
    intent: "dominance",
    patterns: [
      /\b(btc|bitcoin|eth|ethereum)?\s*dominance/i,
    ],
  },
  {
    intent: "investment",
    patterns: [
      /\b(should\s*i|is\s*it\s*(good|wise|safe|smart|right)\s*to)\s*(buy|sell|invest|hold|trade|put money)/i,
      /\b(invest|put money|put ₹|put rs|put \$)\s*(in|into|on)\s+/i,
      /\b(profit|loss|return|gain|earn|make money|lose money)\s*(if|when|from|on|by)\s*(i )?(invest|buy|sell|hold|put)/i,
      /\bhow\s*much\s*(profit|loss|return|gain|money|will i)\s*(will|can|do|if|from|on)/i,
      /\b(will|can|could)\s*(i )?(make|earn|gain|lose|get)\s*(money|profit|return|₹|\$|rs)/i,
      /\b(good|best|right|safe|wise)\s*(time|moment|opportunity)\s*to\s*(buy|sell|invest|enter|exit)/i,
      /\bworth\s*(buying|selling|investing|holding)/i,
      /\b(buy|sell|hold)\s*(or\s*(buy|sell|hold))?\s*\?/i,
    ],
  },
  {
    intent: "prediction",
    patterns: [
      /\b(will|can|could|shall)\s+(\w+)\s*(go|reach|hit|cross|touch|pump|dump|crash|moon|rise|fall|drop)/i,
      /\b(\w+)\s*(price\s*)?(prediction|forecast|target|potential|future|outlook)/i,
      /\b(where|what)\s*(will|would|could)\s+(\w+)\s*(be|go|reach|price)/i,
      /\bwhen\s*(will|would|could)\s+(\w+)\s*(reach|hit|cross|touch|go to|moon)/i,
      /\b(moon|lambo|100x|10x|1000x)\b/i,
    ],
  },
  {
    intent: "best_coin",
    patterns: [
      /\b(best|top|good|safest|most promising)\s*(coin|crypto|token|investment)\s*(to\s*(buy|invest|hold))?/i,
      /\bwhich\s*(coin|crypto|token)\s*(should|to|can|do)\s*(i )?(buy|invest|hold|pick)/i,
      /\bwhat\s*(should|to|can)\s*(i )?(buy|invest in|hold|pick)/i,
      /\brecommend\s*(a )?(coin|crypto|token|investment)/i,
      /\bsuggest\s*(a )?(coin|crypto|token)/i,
    ],
  },
  {
    intent: "education",
    patterns: [
      /\b(what\s*(is|are|does)|explain|meaning\s*of|define|eli5)\s+(.+)/i,
    ],
  },
];

// ─── Intent Extraction ────────────────────────────────────────────

function extractIntent(message) {
  const msg = message.trim().toLowerCase();

  for (const { intent, patterns } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      const match = msg.match(pattern);
      if (match) {
        return { intent, match, raw: msg };
      }
    }
  }

  return { intent: "unknown", match: null, raw: msg };
}

// ─── Coin Name Extraction from Message ────────────────────────────

function extractCoinName(message) {
  const msg = message.toLowerCase().trim();

  // Remove common filler words
  const cleaned = msg
    .replace(
      /\b(what|is|the|price|of|for|how|much|does|cost|tell|me|about|info|details|coin|crypto|token|check|get|show|current|today|now|please|can|you)\b/g,
      ""
    )
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[?.!,]/g, "")
    .trim();

  if (cleaned.length > 0 && cleaned.length < 30) {
    return cleaned;
  }
  return null;
}

// ─── Extract Coin from Complex Sentences ──────────────────────────
// Handles: "should I invest in toncoin right now?"
//          "how much profit if I invest on ethereum?"
//          "will solana go up?"

function extractCoinFromSentence(message) {
  const msg = message.toLowerCase().trim();

  // Try to find a known coin alias directly in the message
  const KNOWN_COINS = [
    "bitcoin", "btc", "ethereum", "eth", "solana", "sol", "bnb", "binance",
    "xrp", "ripple", "cardano", "ada", "dogecoin", "doge", "polkadot", "dot",
    "polygon", "matic", "avalanche", "avax", "chainlink", "link", "shiba",
    "shib", "uniswap", "uni", "litecoin", "ltc", "cosmos", "atom", "near",
    "stellar", "xlm", "algorand", "algo", "aptos", "apt", "arbitrum", "arb",
    "optimism", "op", "sui", "ton", "toncoin", "tether", "usdt", "usdc",
    "pepe", "tron", "trx", "wif", "dogwifhat",
  ];

  for (const coin of KNOWN_COINS) {
    if (msg.includes(coin)) return coin;
  }

  // Fallback: strip common filler words and see what's left
  const stripped = msg
    .replace(
      /\b(should|would|could|will|can|do|did|does|is|are|was|were|i|we|you|they|it|if|the|a|an|in|on|at|to|of|for|and|or|but|how|much|many|what|when|where|which|who|why|not|no|yes|my|this|that|right now|right|now|today|tomorrow|currently|invest|investment|investing|buy|buying|sell|selling|hold|holding|trade|trading|put|money|profit|loss|return|gain|earn|make|lose|get|good|bad|best|worst|safe|wise|smart|time|moment|go up|go down|reach|hit|cross|moon|pump|dump|crash|rise|fall|drop|price|prediction|forecast|target|worth|think|believe|suggest|recommend)\b/g,
      ""
    )
    .replace(/[?.!,₹$]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .trim();

  if (stripped.length > 0 && stripped.length < 25) {
    return stripped;
  }

  return null;
}

// ─── Extract Two Coins for Comparison ─────────────────────────────

function extractCompareCoins(message) {
  const patterns = [
    /compare\s+(\w+)\s*(?:and|vs|versus|with|or|&)\s*(\w+)/i,
    /(\w+)\s*(?:vs|versus|compared\s*to)\s*(\w+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) return [match[1], match[2]];
  }
  return null;
}

// ─── Response Generators ──────────────────────────────────────────

async function handleGreeting() {
  const greetings = [
    "Hey! 👋 I'm CryptoBot, your on-chain companion. Ask me about prices, market trends, top gainers, or anything crypto!",
    "Hello! I can help you with crypto prices, market overviews, coin comparisons, and more. What do you want to know?",
    "Namaste! 🙏 Ready to talk crypto. Try asking me 'How's the market?' or 'What's the price of ETH?'",
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

function handleHelp() {
  return `Here's what I can help you with:

🔹 **Market Overview** — "How's the market today?"
🔹 **Price Check** — "What's the price of BTC?"
🔹 **Top Gainers** — "Which coin gained the most?"
🔹 **Top Losers** — "Who lost the most today?"
🔹 **Trending** — "What's trending right now?"
🔹 **Compare** — "Compare ETH vs SOL"
🔹 **Coin Info** — "Tell me about Cardano"
🔹 **Reports** — "What does the latest report say?"
🔹 **Learn** — "What is DeFi?" / "Explain staking"

Just type naturally — I'll figure out what you mean!`;
}

async function handleMarketOverview() {
  try {
    const [global, coins] = await Promise.all([
      getGlobalData(),
      getTopCoins("inr", 10),
    ]);

    const btc = coins.find((c) => c.id === "bitcoin");
    const eth = coins.find((c) => c.id === "ethereum");

    const sentiment =
      global.marketCapChangePercent24h >= 0 ? "green 🟢" : "red 🔴";

    const topMover = [...coins].sort(
      (a, b) =>
        Math.abs(b.price_change_percentage_24h || 0) -
        Math.abs(a.price_change_percentage_24h || 0)
    )[0];

    return `The market is **${sentiment}** today.

📊 **Total Market Cap:** ${formatINR(global.totalMarketCap)} (${formatPercent(global.marketCapChangePercent24h)} 24h)
₿ **BTC Dominance:** ${global.btcDominance?.toFixed(1)}%
${btc ? `\n**Bitcoin:** ${formatINR(btc.current_price)} (${formatPercent(btc.price_change_percentage_24h)})` : ""}
${eth ? `**Ethereum:** ${formatINR(eth.current_price)} (${formatPercent(eth.price_change_percentage_24h)})` : ""}
${topMover ? `\n🔥 **Biggest mover in top 10:** ${topMover.name} (${formatPercent(topMover.price_change_percentage_24h)})` : ""}`;
  } catch (err) {
    if (err.message === "RATE_LIMITED") {
      return "⏳ I'm getting rate-limited by the data provider. Please try again in a minute!";
    }
    return "Couldn't fetch market data right now. Try again in a moment!";
  }
}

async function handlePriceCheck(message) {
  const coinName = extractCoinName(message);
  if (!coinName) return "Which coin's price would you like to check? Try something like 'price of BTC' or 'ETH price'.";

  const coinId = resolveCoinId(coinName);
  try {
    const data = await getCoinPrice(coinId, "inr");
    const coinData = data[coinId];

    if (!coinData) {
      // Try search
      const results = await searchCoin(coinName);
      if (results.length > 0) {
        const suggestion = results[0];
        const retryData = await getCoinPrice(suggestion.id, "inr");
        const retryInfo = retryData[suggestion.id];
        if (retryInfo) {
          return `**${suggestion.name} (${suggestion.symbol?.toUpperCase()})**
💰 Price: ${formatINR(retryInfo.inr)}
📈 24h Change: ${formatPercent(retryInfo.inr_24h_change)}
📊 Market Cap: ${formatINR(retryInfo.inr_market_cap)}
💹 24h Volume: ${formatINR(retryInfo.inr_24h_vol)}`;
        }
      }
      return `Couldn't find "${coinName}". Try the full name (e.g., "bitcoin") or symbol (e.g., "BTC").`;
    }

    return `**${coinName.toUpperCase()}**
💰 Price: ${formatINR(coinData.inr)}
📈 24h Change: ${formatPercent(coinData.inr_24h_change)}
📊 Market Cap: ${formatINR(coinData.inr_market_cap)}
💹 24h Volume: ${formatINR(coinData.inr_24h_vol)}`;
  } catch (err) {
    if (err.message === "RATE_LIMITED")
      return "⏳ Rate limited! Try again in about a minute.";
    return "Couldn't fetch the price right now. Please try again!";
  }
}

async function handleGainers() {
  try {
    const { gainers } = await getGainersLosers("inr", 5);
    const list = gainers
      .map(
        (c, i) =>
          `${i + 1}. **${c.name}** (${c.symbol.toUpperCase()}) — ${formatINR(c.current_price)} (${formatPercent(c.price_change_percentage_24h)})`
      )
      .join("\n");

    return `🚀 **Top 5 Gainers (24h):**\n\n${list}`;
  } catch (err) {
    return "Couldn't fetch gainers right now. Try again in a moment!";
  }
}

async function handleLosers() {
  try {
    const { losers } = await getGainersLosers("inr", 5);
    const list = losers
      .map(
        (c, i) =>
          `${i + 1}. **${c.name}** (${c.symbol.toUpperCase()}) — ${formatINR(c.current_price)} (${formatPercent(c.price_change_percentage_24h)})`
      )
      .join("\n");

    return `📉 **Top 5 Losers (24h):**\n\n${list}`;
  } catch (err) {
    return "Couldn't fetch losers right now. Try again in a moment!";
  }
}

async function handleTrending() {
  try {
    const trending = await getTrending();
    if (!trending || trending.length === 0) return "No trending data available right now.";

    const list = trending
      .slice(0, 7)
      .map(
        (c, i) =>
          `${i + 1}. **${c.name}** (${c.symbol?.toUpperCase()}) — Rank #${c.marketCapRank || "N/A"}`
      )
      .join("\n");

    return `🔥 **Trending Coins Right Now:**\n\n${list}`;
  } catch (err) {
    return "Couldn't fetch trending coins. Try again shortly!";
  }
}

async function handleCompare(message) {
  const coins = extractCompareCoins(message);
  if (!coins)
    return 'Try: "Compare BTC vs ETH" or "SOL vs AVAX"';

  const [name1, name2] = coins;
  const id1 = resolveCoinId(name1);
  const id2 = resolveCoinId(name2);

  try {
    const { coin1, coin2 } = await compareCoins(id1, id2, "inr");

    if (!coin1 && !coin2)
      return `Couldn't find data for either ${name1} or ${name2}. Make sure you're using the correct coin names.`;
    if (!coin1) return `Couldn't find ${name1}. Try the full name or symbol.`;
    if (!coin2) return `Couldn't find ${name2}. Try the full name or symbol.`;

    return `⚖️ **${coin1.name} vs ${coin2.name}**

| | ${coin1.symbol.toUpperCase()} | ${coin2.symbol.toUpperCase()} |
|---|---|---|
| **Price** | ${formatINR(coin1.current_price)} | ${formatINR(coin2.current_price)} |
| **24h Change** | ${formatPercent(coin1.price_change_percentage_24h)} | ${formatPercent(coin2.price_change_percentage_24h)} |
| **Market Cap** | ${formatINR(coin1.market_cap)} | ${formatINR(coin2.market_cap)} |
| **Volume** | ${formatINR(coin1.total_volume)} | ${formatINR(coin2.total_volume)} |
| **Rank** | #${coin1.market_cap_rank} | #${coin2.market_cap_rank} |

${
  (coin1.price_change_percentage_24h || 0) > (coin2.price_change_percentage_24h || 0)
    ? `📈 ${coin1.name} is outperforming ${coin2.name} today.`
    : `📈 ${coin2.name} is outperforming ${coin1.name} today.`
}`;
  } catch (err) {
    return "Couldn't compare those coins right now. Try again shortly!";
  }
}

async function handleCoinInfo(message) {
  const coinName = extractCoinName(message);
  if (!coinName) return "Which coin would you like to know about?";

  // First check education base
  const eduMatches = searchEducation(coinName);
  if (eduMatches.length > 0 && !resolveCoinId(coinName)) {
    return `📖 **${eduMatches[0].term}**\n\n${eduMatches[0].answer}`;
  }

  const coinId = resolveCoinId(coinName);
  try {
    const details = await getCoinDetails(coinId);
    if (!details || !details.market_data)
      return `Couldn't find detailed info for "${coinName}". Try the full name or symbol!`;

    const md = details.market_data;
    const desc = details.description?.en
      ? details.description.en.replace(/<[^>]*>/g, "").slice(0, 300) + "..."
      : "No description available.";

    return `**${details.name} (${details.symbol?.toUpperCase()})**

💰 Price: ${formatINR(md.current_price?.inr)}
📈 24h: ${formatPercent(md.price_change_percentage_24h)}
📅 7d: ${formatPercent(md.price_change_percentage_7d)}
📊 Market Cap: ${formatINR(md.market_cap?.inr)} (Rank #${details.market_cap_rank || "N/A"})
💹 24h Volume: ${formatINR(md.total_volume?.inr)}
📦 Circulating: ${md.circulating_supply?.toLocaleString() || "N/A"}
🔒 Max Supply: ${md.max_supply?.toLocaleString() || "∞"}

📝 ${desc}`;
  } catch (err) {
    return `Couldn't fetch info for "${coinName}". Try the exact coin name!`;
  }
}

function handleReport(message) {
  const results = searchReports(message);

  if (results.length === 0) {
    return `Here are the available reports:

📑 **The Bitcoin Vector #37** (Premium) — Analysis of BTC momentum and accumulation patterns entering 2026.
📑 **Week On-Chain #2 2026** (Free) — On-chain analysis showing exchange outflows and stabilization signs.

Ask me something specific like "What does the Bitcoin Vector say about momentum?" or "Summarize the on-chain report."`;
  }

  const report = results[0];
  return `📑 **${report.title}** (${report.type === "premium" ? "🔒 Premium" : "🆓 Free"})

${report.summary}

${report.type === "premium" ? "\n_This is a premium report. Upgrade to access the full analysis._" : ""}`;
}

async function handleDominance() {
  try {
    const global = await getGlobalData();
    return `📊 **Market Dominance:**
₿ Bitcoin: **${global.btcDominance?.toFixed(1)}%**
Ξ Ethereum: **${global.ethDominance?.toFixed(1)}%**
🪙 Others: **${(100 - (global.btcDominance || 0) - (global.ethDominance || 0)).toFixed(1)}%**

${
  global.btcDominance > 55
    ? "BTC dominance is high — money is concentrated in Bitcoin. Altcoins may underperform until dominance drops."
    : global.btcDominance < 45
      ? "BTC dominance is low — could signal alt season! Altcoins might be gaining traction."
      : "BTC dominance is moderate — the market is relatively balanced between BTC and alts."
}`;
  } catch (err) {
    return "Couldn't fetch dominance data right now.";
  }
}

function handleEducation(message) {
  const matches = searchEducation(message);
  if (matches.length > 0) {
    return `📖 **${matches[0].term}**\n\n${matches[0].answer}`;
  }
  return null; // Fall through to unknown
}

// ─── Investment Query Handler ─────────────────────────────────────

async function handleInvestment(message) {
  const coinName = extractCoinFromSentence(message);

  if (!coinName) {
    return `I can't predict profits or tell you what to invest in — no one can with certainty! 🎯

But I **can** help you research. Try:
• "Price of BTC" — check current price and 24h trend
• "Compare ETH vs SOL" — side-by-side comparison
• "Top gainers today" — see what's performing well
• "What's trending?" — see what the market is buzzing about

**⚠️ Disclaimer:** I'm a data bot, not a financial advisor. Always do your own research (DYOR) before investing.`;
  }

  const coinId = resolveCoinId(coinName);
  try {
    const data = await getCoinPrice(coinId, "inr");
    let coinData = data[coinId];
    let resolvedName = coinName.toUpperCase();

    if (!coinData) {
      const results = await searchCoin(coinName);
      if (results.length > 0) {
        const retryData = await getCoinPrice(results[0].id, "inr");
        coinData = retryData[results[0].id];
        resolvedName = results[0].name;
      }
    }

    if (!coinData) {
      return `Couldn't find data for "${coinName}". Try using the full coin name or symbol!\n\n**⚠️ Disclaimer:** I can show you data, but I can't predict future prices or profits.`;
    }

    const change = coinData.inr_24h_change;
    const trend = change >= 0 ? "up 📈" : "down 📉";
    const sentiment = change > 3 ? "strong bullish momentum" : change > 0 ? "slight positive movement" : change > -3 ? "slight negative movement" : "strong bearish pressure";

    return `I can't predict future profits, but here's what **${resolvedName}** looks like right now:

💰 **Current Price:** ${formatINR(coinData.inr)}
📈 **24h Change:** ${formatPercent(change)} (trending ${trend})
📊 **Market Cap:** ${formatINR(coinData.inr_market_cap)}
💹 **24h Volume:** ${formatINR(coinData.inr_24h_vol)}

📋 **Current Momentum:** ${sentiment}

**⚠️ Important:** Crypto is highly volatile. Past performance doesn't guarantee future returns. Never invest more than you can afford to lose. This is data, not financial advice — always DYOR!

Want deeper research? Try:
• "Tell me about ${coinName}" — for detailed coin info
• "Compare ${coinName} vs BTC" — benchmark against Bitcoin`;
  } catch (err) {
    return "Couldn't fetch that data right now. Try again in a moment!";
  }
}

// ─── Prediction Query Handler ─────────────────────────────────────

async function handlePrediction(message) {
  const coinName = extractCoinFromSentence(message);

  if (!coinName) {
    return `I can't predict future prices — and honestly, no one reliably can! 🔮

What I **can** do is show you current data to help you form your own view:
• "Price of BTC" — current price + 24h trend
• "Top gainers today" — what's performing right now
• "Bitcoin dominance" — market structure overview

**⚠️ Be cautious** of anyone claiming to know exactly where a coin is going.`;
  }

  const coinId = resolveCoinId(coinName);
  try {
    const details = await getCoinDetails(coinId);
    if (!details || !details.market_data) {
      return `Couldn't find data for "${coinName}".\n\n🔮 Even if I could, price predictions are unreliable — always DYOR!`;
    }

    const md = details.market_data;
    const change24h = md.price_change_percentage_24h || 0;
    const change7d = md.price_change_percentage_7d || 0;
    const change30d = md.price_change_percentage_30d || 0;

    let trendSummary;
    if (change24h > 0 && change7d > 0 && change30d > 0) {
      trendSummary = "🟢 All timeframes are positive — the trend has been consistently upward recently.";
    } else if (change24h < 0 && change7d < 0 && change30d < 0) {
      trendSummary = "🔴 All timeframes are negative — the trend has been consistently downward recently.";
    } else {
      trendSummary = "🟡 Mixed signals across timeframes — the trend is uncertain.";
    }

    return `I can't predict where **${details.name}** will go, but here's the recent trend data:

💰 **Price:** ${formatINR(md.current_price?.inr)}
📈 **24h:** ${formatPercent(change24h)}
📅 **7d:** ${formatPercent(change7d)}
📆 **30d:** ${formatPercent(change30d)}
📊 **Rank:** #${details.market_cap_rank || "N/A"}

${trendSummary}

**⚠️ Remember:** Past trends don't predict the future. Crypto is volatile and unpredictable. This is data, not a forecast!`;
  } catch (err) {
    return "Couldn't fetch trend data right now. Try again shortly!";
  }
}

// ─── Best Coin Handler ────────────────────────────────────────────

async function handleBestCoin() {
  try {
    const [trending, { gainers }] = await Promise.all([
      getTrending(),
      getGainersLosers("inr", 3),
    ]);

    const trendList = trending?.slice(0, 3)
      .map((c, i) => `${i + 1}. **${c.name}** (${c.symbol?.toUpperCase()}) — Rank #${c.marketCapRank || "N/A"}`)
      .join("\n") || "No trending data";

    const gainerList = gainers
      .map((c, i) => `${i + 1}. **${c.name}** (${c.symbol.toUpperCase()}) — ${formatPercent(c.price_change_percentage_24h)}`)
      .join("\n");

    return `I can't recommend specific investments, but here's what the data shows right now:

🔥 **Trending Coins:**
${trendList}

🚀 **Today's Top Gainers:**
${gainerList}

**⚠️ Important:** Trending or gaining doesn't mean "best to buy." High performers today could drop tomorrow. Always:
• Do your own research (DYOR)
• Never invest more than you can lose
• Consider the project's fundamentals, not just price

Want to research a specific coin? Try "Tell me about [coin name]"`;
  } catch (err) {
    return "Couldn't fetch market data right now. Try again in a moment!";
  }
}

// ─── Unknown Handler ──────────────────────────────────────────────

function handleUnknown(message) {
  const suggestions = [
    "I'm not sure I understood that. Here are some things you can try:",
    "Hmm, I didn't quite get that. Maybe try one of these:",
    "I'm best at crypto-related questions! Here are some ideas:",
  ];

  const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

  return `${suggestion}

• "How's the market today?"
• "Price of Bitcoin"
• "Top gainers today"
• "Compare ETH vs SOL"
• "What is DeFi?"
• "Latest report summary"

Or type **help** to see all my capabilities!`;
}

// ─── Main Message Handler ─────────────────────────────────────────

export async function processMessage(message) {
  if (!message || message.trim().length === 0) {
    return "Go ahead, ask me something about crypto! Type **help** to see what I can do.";
  }

  const { intent, raw } = extractIntent(message);

  switch (intent) {
    case "greeting":
      return handleGreeting();
    case "help":
      return handleHelp();
    case "market_overview":
      return handleMarketOverview();
    case "price_check":
      return handlePriceCheck(raw);
    case "top_gainers":
      return handleGainers();
    case "top_losers":
      return handleLosers();
    case "trending":
      return handleTrending();
    case "compare":
      return handleCompare(raw);
    case "coin_info":
      return handleCoinInfo(raw);
    case "report":
      return handleReport(raw);
    case "dominance":
      return handleDominance();
    case "investment":
      return handleInvestment(raw);
    case "prediction":
      return handlePrediction(raw);
    case "best_coin":
      return handleBestCoin();
    case "education": {
      const eduResult = handleEducation(raw);
      if (eduResult) return eduResult;
      // If no education match, try coin info
      return handleCoinInfo(raw);
    }
    default: {
      // Last resort: check education, then coin info
      const edu = handleEducation(raw);
      if (edu) return edu;

      // Try to treat it as a price check
      const coinName = extractCoinName(raw);
      if (coinName && resolveCoinId(coinName)) {
        return handlePriceCheck(raw);
      }

      // Check if message mentions any known coin — might be an investment question
      const coinFromSentence = extractCoinFromSentence(raw);
      if (coinFromSentence && resolveCoinId(coinFromSentence)) {
        return handleInvestment(raw);
      }

      return handleUnknown(raw);
    }
  }
}