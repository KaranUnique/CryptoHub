/**
 * Knowledge Base — Static crypto education + report index
 * No API calls needed. Runs entirely client-side.
 */

// ─── Crypto Education Dictionary ──────────────────────────────────
export const EDUCATION = {
  "market cap": {
    term: "Market Cap (Market Capitalization)",
    answer:
      "Market cap is the total value of a cryptocurrency. It's calculated by multiplying the current price by the circulating supply. For example, if a coin costs ₹100 and there are 1 million coins in circulation, the market cap is ₹10 crore. It's the most common way to rank cryptocurrencies — Bitcoin has the largest market cap.",
  },
  "circulating supply": {
    term: "Circulating Supply",
    answer:
      "Circulating supply is the number of coins that are currently available and trading in the market. It doesn't include coins that are locked, reserved, or not yet released. Think of it like the number of shares of a company that are actually available for trading.",
  },
  "total supply": {
    term: "Total Supply",
    answer:
      "Total supply is the total number of coins that exist right now, including locked or reserved ones. It's different from max supply (the absolute maximum that can ever exist) and circulating supply (what's currently tradable).",
  },
  "max supply": {
    term: "Max Supply",
    answer:
      "Max supply is the maximum number of coins that will ever exist. Bitcoin's max supply is 21 million — once all are mined, no more will be created. Some coins like Ethereum don't have a max supply cap.",
  },
  volume: {
    term: "Trading Volume",
    answer:
      "Volume is the total amount of a coin that has been traded in a given time period (usually 24 hours). High volume means lots of buying and selling activity — it indicates strong interest and usually better liquidity (easier to buy/sell without affecting the price much).",
  },
  defi: {
    term: "DeFi (Decentralized Finance)",
    answer:
      "DeFi is a system of financial applications built on blockchain networks. Instead of banks or brokers, smart contracts handle lending, borrowing, trading, and earning interest. Popular DeFi platforms include Uniswap, Aave, and Compound. It's like a financial system that runs 24/7 without intermediaries.",
  },
  nft: {
    term: "NFT (Non-Fungible Token)",
    answer:
      "NFTs are unique digital tokens on a blockchain that represent ownership of a specific item — like digital art, music, game items, or collectibles. Unlike Bitcoin where every coin is identical, each NFT is one-of-a-kind. They're mostly on Ethereum and Solana.",
  },
  blockchain: {
    term: "Blockchain",
    answer:
      "A blockchain is a digital ledger that records transactions across many computers. Once data is recorded, it can't be easily changed. Think of it as a shared Google Sheet that everyone can read but no single person controls. Bitcoin and Ethereum are the most well-known blockchains.",
  },
  staking: {
    term: "Staking",
    answer:
      "Staking is locking up your crypto to help validate transactions on a blockchain network. In return, you earn rewards (like interest). It's used in Proof-of-Stake blockchains like Ethereum, Solana, and Cardano. It's similar to earning interest in a savings account, but with higher risk and reward.",
  },
  "gas fee": {
    term: "Gas Fee",
    answer:
      "Gas fees are transaction costs on blockchain networks, most commonly Ethereum. Every action on the network (sending tokens, swapping on DEXs, minting NFTs) requires computational work, and gas fees compensate the validators who do that work. Fees spike when the network is congested.",
  },
  wallet: {
    term: "Crypto Wallet",
    answer:
      "A crypto wallet stores your private keys — the passwords that give you access to your cryptocurrency. Hot wallets (MetaMask, Trust Wallet) are connected to the internet for easy access. Cold wallets (Ledger, Trezor) are offline hardware devices for maximum security.",
  },
  altcoin: {
    term: "Altcoin",
    answer:
      "Altcoin means 'alternative coin' — any cryptocurrency other than Bitcoin. Ethereum, Solana, Cardano, and thousands of others are all altcoins. They often move together with Bitcoin but can have their own independent price action based on their own technology and adoption.",
  },
  "btc dominance": {
    term: "Bitcoin Dominance",
    answer:
      "BTC Dominance is the percentage of the total crypto market cap that belongs to Bitcoin. When dominance is high (~60%+), it means money is concentrated in Bitcoin. When it drops, it usually means altcoins are gaining traction — often called 'alt season'.",
  },
  whale: {
    term: "Whale",
    answer:
      "A whale is someone who holds a very large amount of cryptocurrency. Their trades can significantly move the market. Tracking whale wallets and their movements (large transfers to/from exchanges) is a popular on-chain analysis technique.",
  },
  "on-chain": {
    term: "On-Chain Analysis",
    answer:
      "On-chain analysis examines data directly from the blockchain — wallet movements, exchange flows, active addresses, miner activity, etc. Unlike traditional technical analysis (which looks at price charts), on-chain data shows what holders are actually doing. Exchange outflows, for example, suggest people are holding rather than selling.",
  },
  "exchange outflows": {
    term: "Exchange Outflows",
    answer:
      "Exchange outflows happen when crypto is moved from exchanges to private wallets. This is generally seen as bullish because it means people are taking coins off exchanges (where they could easily sell) and into cold storage (long-term holding). The opposite — exchange inflows — can signal selling pressure.",
  },
  hodl: {
    term: "HODL",
    answer:
      "HODL started as a typo for 'hold' in a famous 2013 Bitcoin forum post and became crypto culture. It means holding your cryptocurrency long-term regardless of price drops. 'Diamond hands' is the modern meme version of the same idea.",
  },
  dex: {
    term: "DEX (Decentralized Exchange)",
    answer:
      "A DEX lets you trade crypto directly from your wallet without a middleman. Unlike centralized exchanges (Binance, Coinbase), there's no company holding your funds. Uniswap (Ethereum), Raydium (Solana), and PancakeSwap (BNB Chain) are popular DEXs.",
  },
  layer2: {
    term: "Layer 2",
    answer:
      "Layer 2 solutions are built on top of existing blockchains (Layer 1) to make them faster and cheaper. For Ethereum, popular L2s include Arbitrum, Optimism, and Base. They bundle many transactions together and settle them on the main chain, reducing fees dramatically.",
  },
  halving: {
    term: "Bitcoin Halving",
    answer:
      "Bitcoin halving is an event that happens roughly every 4 years where the mining reward is cut in half. It reduces the rate of new Bitcoin creation, making it more scarce. Historically, halvings have preceded major bull runs. The most recent halving was in April 2024.",
  },
};

// ─── Report Summaries (from your blog) ────────────────────────────
// Add your actual report content here over time.
export const REPORTS = [
  {
    id: "bitcoin-vector-37",
    title: "The Bitcoin Vector #37",
    category: "VECTOR",
    type: "premium",
    date: "2026-01",
    summary:
      "Bitcoin enters 2026 attempting to stabilise after its Q4 drawdown. The Vector models suggest a subtle shift in momentum as long-term holders continue accumulating while short-term volatility remains elevated. Key support levels and resistance zones are analyzed with on-chain metrics pointing to a potential accumulation phase.",
    keywords: [
      "bitcoin", "btc", "vector", "momentum", "Q4", "drawdown",
      "accumulation", "support", "resistance", "long-term holders",
    ],
  },
  {
    id: "week-on-chain-2-2026",
    title: "Week On-Chain #2 2026",
    category: "WEEK ON-CHAIN",
    type: "free",
    date: "2026-01",
    summary:
      "Bitcoin shows early signs of stabilization as exchange outflows pick up, indicating growing holder conviction. On-chain data reveals accumulation patterns across multiple cohorts, with whale addresses increasing their positions. Network activity metrics show steady usage despite the recent price correction.",
    keywords: [
      "bitcoin", "btc", "on-chain", "exchange outflows", "stabilization",
      "whale", "accumulation", "network activity", "holder",
    ],
  },
];

// ─── Report Search ────────────────────────────────────────────────
export function searchReports(query) {
  const q = query.toLowerCase();
  const words = q.split(/\s+/);

  return REPORTS.map((report) => {
    let score = 0;
    const searchText = `${report.title} ${report.category} ${report.summary} ${report.keywords.join(" ")}`.toLowerCase();

    for (const word of words) {
      if (word.length < 3) continue;
      if (searchText.includes(word)) score++;
      if (report.keywords.some((k) => k.includes(word))) score += 2;
    }

    return { ...report, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ─── Education Search ─────────────────────────────────────────────
export function searchEducation(query) {
  const q = query.toLowerCase();
  const matches = [];

  for (const [key, entry] of Object.entries(EDUCATION)) {
    if (q.includes(key) || key.split(" ").some((word) => q.includes(word) && word.length > 3)) {
      matches.push(entry);
    }
  }

  return matches;
}