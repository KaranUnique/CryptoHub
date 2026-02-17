/**
 * CoinGecko Free API Service
 * No API key required — uses public endpoints
 * Rate limit: ~10-30 calls/min (plenty for a chatbot)
 */

const BASE_URL = "https://api.coingecko.com/api/v3";

// Simple in-memory cache to avoid redundant API calls
const cache = {};
const CACHE_TTL = 60_000; // 1 minute

async function cachedFetch(url, cacheKey) {
  const now = Date.now();
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 429) throw new Error("RATE_LIMITED");
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    cache[cacheKey] = { data, timestamp: now };
    return data;
  } catch (err) {
    // Return stale cache if available
    if (cache[cacheKey]) return cache[cacheKey].data;
    throw err;
  }
}

// ─── Market Overview (global stats) ───────────────────────────────
export async function getGlobalData() {
  const data = await cachedFetch(`${BASE_URL}/global`, "global");
  const g = data.data;
  return {
    totalMarketCap: g.total_market_cap?.usd,
    totalVolume: g.total_volume?.usd,
    marketCapChangePercent24h: g.market_cap_change_percentage_24h_usd,
    btcDominance: g.market_cap_percentage?.btc,
    ethDominance: g.market_cap_percentage?.eth,
    activeCryptos: g.active_cryptocurrencies,
  };
}

// ─── Top Coins by Market Cap ──────────────────────────────────────
export async function getTopCoins(
  currency = "inr",
  perPage = 50,
  page = 1
) {
  const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d`;
  return cachedFetch(url, `top_coins_${currency}_${perPage}_${page}`);
}

// ─── Single Coin Price ────────────────────────────────────────────
export async function getCoinPrice(coinId, currency = "inr") {
  const url = `${BASE_URL}/simple/price?ids=${coinId}&vs_currencies=${currency}&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
  return cachedFetch(url, `price_${coinId}_${currency}`);
}

// ─── Coin Details ─────────────────────────────────────────────────
export async function getCoinDetails(coinId) {
  const url = `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`;
  return cachedFetch(url, `details_${coinId}`);
}

// ─── Trending Coins ───────────────────────────────────────────────
export async function getTrending() {
  const data = await cachedFetch(`${BASE_URL}/search/trending`, "trending");
  return data.coins?.map((c) => ({
    id: c.item.id,
    name: c.item.name,
    symbol: c.item.symbol,
    marketCapRank: c.item.market_cap_rank,
    priceBtc: c.item.price_btc,
    thumb: c.item.thumb,
  }));
}

// ─── Search Coin by Name/Symbol ───────────────────────────────────
export async function searchCoin(query) {
  const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}`;
  const data = await cachedFetch(url, `search_${query.toLowerCase()}`);
  return data.coins?.slice(0, 5) || [];
}

// ─── Derived: Top Gainers & Losers ────────────────────────────────
export async function getGainersLosers(currency = "inr", count = 5) {
  const coins = await getTopCoins(currency, 100);
  const sorted = [...coins].sort(
    (a, b) =>
      (b.price_change_percentage_24h || 0) -
      (a.price_change_percentage_24h || 0)
  );
  return {
    gainers: sorted.slice(0, count),
    losers: sorted.slice(-count).reverse(),
  };
}

// ─── Derived: Compare Two Coins ───────────────────────────────────
export async function compareCoins(coinId1, coinId2, currency = "inr") {
  const coins = await getTopCoins(currency, 250);
  const coin1 = coins.find((c) => c.id === coinId1);
  const coin2 = coins.find((c) => c.id === coinId2);
  return { coin1, coin2 };
}

// ─── Coin ID Resolution ──────────────────────────────────────────
// Maps common names/symbols to CoinGecko IDs
const COIN_ALIASES = {
  btc: "bitcoin", bitcoin: "bitcoin",
  eth: "ethereum", ether: "ethereum", ethereum: "ethereum",
  sol: "solana", solana: "solana",
  bnb: "binancecoin", binance: "binancecoin",
  xrp: "ripple", ripple: "ripple",
  ada: "cardano", cardano: "cardano",
  doge: "dogecoin", dogecoin: "dogecoin",
  dot: "polkadot", polkadot: "polkadot",
  matic: "matic-network", polygon: "matic-network",
  avax: "avalanche-2", avalanche: "avalanche-2",
  link: "chainlink", chainlink: "chainlink",
  shib: "shiba-inu", "shiba inu": "shiba-inu", shiba: "shiba-inu",
  uni: "uniswap", uniswap: "uniswap",
  ltc: "litecoin", litecoin: "litecoin",
  atom: "cosmos", cosmos: "cosmos",
  near: "near", "near protocol": "near",
  xlm: "stellar", stellar: "stellar",
  algo: "algorand", algorand: "algorand",
  apt: "aptos", aptos: "aptos",
  arb: "arbitrum", arbitrum: "arbitrum",
  op: "optimism", optimism: "optimism",
  sui: "sui", ton: "the-open-network", toncoin: "the-open-network",
  usdt: "tether", tether: "tether",
  usdc: "usd-coin",
  pepe: "pepe", wif: "dogwifhat",
  trx: "tron", tron: "tron",
};

export function resolveCoinId(input) {
  if (!input) return null;
  const key = input.toLowerCase().trim();
  return COIN_ALIASES[key] || key;
}

// ─── Utility: Format Currency ─────────────────────────────────────
export function formatINR(num) {
  if (num === null || num === undefined) return "N/A";
  if (num >= 1e12) return `₹${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `₹${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e7) return `₹${(num / 1e7).toFixed(2)}Cr`;
  if (num >= 1e5) return `₹${(num / 1e5).toFixed(2)}L`;
  if (num >= 1) return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  return `₹${num.toFixed(6)}`;
}

export function formatUSD(num) {
  if (num === null || num === undefined) return "N/A";
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1) return `$${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  return `$${num.toFixed(6)}`;
}

export function formatPercent(num) {
  if (num === null || num === undefined) return "N/A";
  const sign = num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
}