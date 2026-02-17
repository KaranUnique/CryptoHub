import image1 from "../assets/1.png";
import image2 from "../assets/2.png";
import image3 from "../assets/3.png";
import image4 from "../assets/4.png";
import image5 from "../assets/5.png";
import image6 from "../assets/6.png";
import image7 from "../assets/7.png";
import image8 from "../assets/8.png";
import image9 from "../assets/9.png";
import image10 from "../assets/10.png";
import image11 from "../assets/11.png";
import image12 from "../assets/12.png";
import image13 from "../assets/13.png";
import image14 from "../assets/14.png";
import image15 from "../assets/15.png";
import image16 from "../assets/16.png";
import image17 from "../assets/17.png";
import image18 from "../assets/18.png";
import image19 from "../assets/19.png";
import image20 from "../assets/20.png";
import image21 from "../assets/21.png";
import image22 from "../assets/22.png";
import image23 from "../assets/23.png";
import image24 from "../assets/24.png";
import image25 from "../assets/25.png";
import image26 from "../assets/26.png";
import image27 from "../assets/27.png";
import image29 from "../assets/29.png";
import image30 from "../assets/30.png";

export const generateBlogPosts = () => {
    return [
      {
        id: 1,
        title: "The Bitcoin Vector #37",
        excerpt: "Bitcoin enters 2026 attempting to stabilise after its Q4 drawdown. The Vector models suggest a subtle shift in momentum as long-term holders resume accumulation.",
        date: "Jan 10, 2026",
        readTime: "12 min read",
        image: image1,
        category: "Vector",
        tag: "Premium",
        badgeColor: "#4559DC",
        isFeatured: true,
        gradient: "linear-gradient(135deg, #4559DC30, #22c55e20)",
        content: {
          toc: ["Market Overview", "On-chain Metrics", "Supply Dynamics", "Price Action Analysis", "Forward Outlook"],
          sections: [
            {
              heading: "Market Overview",
              text: "Bitcoin enters the new year with cautious optimism as markets attempt to stabilize following the Q4 2025 drawdown. The Vector framework indicates subtle shifts in market structure that professional traders should monitor closely."
            },
            {
              heading: "On-chain Metrics",
              text: "Long-term holder supply has resumed growth after a period of distribution, suggesting renewed conviction from Bitcoin's most steadfast investors. Exchange balances continue their multi-year decline, with only 11.5% of circulating supply remaining on exchanges."
            },
            {
              heading: "Supply Dynamics",
              text: "The percentage of supply held in profit has recovered to 85%, indicating most holders remain in profit despite recent volatility. Realized capitalization growth suggests organic capital inflow rather than speculative trading."
            }
          ]
        }
      },
      {
        id: 2,
        title: "Week On-Chain #2 2026",
        excerpt: "Bitcoin shows early signs of stabilization as exchange outflows accelerate. Network fundamentals remain strong despite price volatility.",
        date: "Jan 9, 2026",
        readTime: "8 min read",
        image: image2,
        category: "Week On-chain",
        tag: "Free",
        badgeColor: "#22c55e",
        isFeatured: true,
        gradient: "linear-gradient(135deg, #22c55e30, #9d4edd20)",
        content: {
          toc: ["Weekly Summary", "Exchange Flows", "Miner Activity", "Network Health", "Trading Volume"],
          sections: [
            {
              heading: "Weekly Summary",
              text: "The second week of 2026 shows Bitcoin attempting to establish a new equilibrium. Exchange net outflows totaled 15,000 BTC this week, the highest since November 2025."
            },
            {
              heading: "Exchange Flows",
              text: "Major exchanges recorded significant outflows, particularly from institutional custody solutions. This suggests accumulation by long-term investors despite uncertain price action."
            }
          ]
        }
      },
      {
        id: 3,
        title: "Market Pulse: January 2026",
        excerpt: "Bitcoin volatility compresses as options markets signal uncertainty. Dealer gamma positioning suggests potential for explosive moves.",
        date: "Jan 8, 2026",
        readTime: "10 min read",
        image: image3,
        category: "Market Pulse",
        tag: "Premium",
        badgeColor: "#9d4edd",
        isFeatured: true,
        gradient: "linear-gradient(135deg, #9d4edd30, #f59e0b20)",
        content: {
          toc: ["Volatility Analysis", "Options Positioning", "Liquidity Conditions", "Market Sentiment", "Risk Assessment"],
          sections: [
            {
              heading: "Volatility Analysis",
              text: "Bitcoin's 30-day realized volatility has compressed to 45%, approaching yearly lows. This compression often precedes significant directional moves."
            },
            {
              heading: "Options Positioning",
              text: "Dealer gamma exposure is turning positive near current price levels, creating potential for accelerated moves should key technical levels break."
            }
          ]
        }
      },
      {
        id: 4,
        title: "Ethereum: The Merge Anniversary Report",
        excerpt: "One year post-Merge: analyzing Ethereum's transition to proof-of-stake and its impact on supply dynamics, security, and network economics.",
        date: "Jan 7, 2026",
        readTime: "15 min read",
        image: image4,
        category: "Research",
        tag: "Premium",
        badgeColor: "#f59e0b",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #f59e0b30, #4559DC20)"
      },
      {
        id: 5,
        title: "Altcoin Vector #35: Layer 2 Ecosystem",
        excerpt: "Deep dive into Ethereum Layer 2 scaling solutions: Arbitrum, Optimism, zkSync, and StarkNet adoption metrics and value capture analysis.",
        date: "Jan 6, 2026",
        readTime: "14 min read",
        image: image5,
        category: "Vector",
        tag: "Premium",
        badgeColor: "#4559DC",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #4559DC30, #22c55e20)"
      },
      {
        id: 6,
        title: "Bitcoin Mining Report: Q4 2025",
        excerpt: "Analysis of Bitcoin mining industry post-halving: hash rate trends, miner revenue, and the transition to sustainable energy sources.",
        date: "Jan 5, 2026",
        readTime: "11 min read",
        image: image6,
        category: "Research",
        tag: "Free",
        badgeColor: "#22c55e",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #22c55e30, #9d4edd20)"
      },
      {
        id: 7,
        title: "DeFi Liquidity Dynamics 2026",
        excerpt: "Comprehensive analysis of DeFi liquidity patterns across Ethereum, Solana, and emerging L2 ecosystems. TVL concentration and yield opportunities.",
        date: "Jan 4, 2026",
        readTime: "13 min read",
        image: image7,
        category: "Research",
        tag: "Premium",
        badgeColor: "#9d4edd",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #9d4edd30, #f59e0b20)"
      },
      {
        id: 8,
        title: "Institutional Adoption Tracker",
        excerpt: "Monthly update on institutional Bitcoin and Ethereum investments: ETF flows, corporate treasuries, and regulated product growth.",
        date: "Jan 3, 2026",
        readTime: "9 min read",
        image: image8,
        category: "Market Intelligence",
        tag: "Free",
        badgeColor: "#f59e0b",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #f59e0b30, #4559DC20)"
      },
      {
        id: 9,
        title: "NFT Market Analysis: 2025 Review",
        excerpt: "Year-end review of NFT market dynamics: trading volumes, collection performance, and the rise of utility-based NFTs.",
        date: "Jan 2, 2026",
        readTime: "10 min read",
        image: image9,
        category: "Research",
        tag: "Free",
        badgeColor: "#4559DC",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #4559DC30, #22c55e20)"
      },
      {
        id: 10,
        title: "Stablecoin Supply Analysis",
        excerpt: "Tracking stablecoin supply changes as a proxy for liquidity conditions and capital rotation within crypto markets.",
        date: "Jan 1, 2026",
        readTime: "7 min read",
        image: image10,
        category: "Market Intelligence",
        tag: "Free",
        badgeColor: "#22c55e",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #22c55e30, #9d4edd20)"
      },
      {
        id: 11,
        title: "Bitcoin Macro Indicators",
        excerpt: "Combining on-chain data with traditional macro indicators to forecast Bitcoin's performance in different economic regimes.",
        date: "Dec 31, 2025",
        readTime: "16 min read",
        image: image11,
        category: "Research",
        tag: "Premium",
        badgeColor: "#9d4edd",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #9d4edd30, #f59e0b20)"
      },
      {
        id: 12,
        title: "Lightning Network Growth Report",
        excerpt: "Analysis of Bitcoin Lightning Network adoption: capacity growth, channel dynamics, and real-world payment usage.",
        date: "Dec 30, 2025",
        readTime: "12 min read",
        image: image12,
        category: "Research",
        tag: "Free",
        badgeColor: "#f59e0b",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #f59e0b30, #4559DC20)"
      },
      {
        id: 13,
        title: "Crypto Derivatives Landscape",
        excerpt: "Comprehensive overview of crypto derivatives markets: futures, options, and perpetual swaps across major exchanges.",
        date: "Dec 29, 2025",
        readTime: "14 min read",
        image: image13,
        category: "Market Intelligence",
        tag: "Premium",
        badgeColor: "#4559DC",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #4559DC30, #22c55e20)"
      },
      {
        id: 14,
        title: "Ethereum Staking Economics",
        excerpt: "Deep dive into Ethereum staking yields, validator economics, and the impact of restaking protocols on network security.",
        date: "Dec 28, 2025",
        readTime: "13 min read",
        image: image14,
        category: "Research",
        tag: "Premium",
        badgeColor: "#22c55e",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #22c55e30, #9d4edd20)"
      },
      {
        id: 15,
        title: "Cross-Chain Bridge Security",
        excerpt: "Analysis of security practices and vulnerabilities in major cross-chain bridges following recent exploit incidents.",
        date: "Dec 27, 2025",
        readTime: "11 min read",
        image: image15,
        category: "Research",
        tag: "Free",
        badgeColor: "#9d4edd",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #9d4edd30, #f59e0b20)"
      },
      {
        id: 16,
        title: "Bitcoin Halving Impact Study",
        excerpt: "Historical analysis of previous Bitcoin halvings and data-driven projections for the 2024 halving's market impact.",
        date: "Dec 26, 2025",
        readTime: "15 min read",
        image: image16,
        category: "Research",
        tag: "Premium",
        badgeColor: "#f59e0b",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #f59e0b30, #4559DC20)"
      },
      {
        id: 17,
        title: "Regulatory Developments Tracker",
        excerpt: "Monthly update on global crypto regulatory developments and their potential market implications.",
        date: "Dec 25, 2025",
        readTime: "8 min read",
        image: image17,
        category: "Market Intelligence",
        tag: "Free",
        badgeColor: "#4559DC",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #4559DC30, #22c55e20)"
      },
      {
        id: 18,
        title: "Smart Contract Audit Trends",
        excerpt: "Analysis of smart contract security audit findings and emerging best practices in Web3 development.",
        date: "Dec 24, 2025",
        readTime: "12 min read",
        image: image18,
        category: "Research",
        tag: "Premium",
        badgeColor: "#22c55e",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #22c55e30, #9d4edd20)"
      },
      {
        id: 19,
        title: "Crypto Venture Capital Report",
        excerpt: "Q4 2025 analysis of venture capital flows into crypto and blockchain startups across different verticals.",
        date: "Dec 23, 2025",
        readTime: "10 min read",
        image: image19,
        category: "Market Intelligence",
        tag: "Free",
        badgeColor: "#9d4edd",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #9d4edd30, #f59e0b20)"
      },
      {
        id: 20,
        title: "MEV (Miner Extractable Value) Research",
        excerpt: "Comprehensive study of MEV in Ethereum and other PoS networks: detection, quantification, and mitigation strategies.",
        date: "Dec 22, 2025",
        readTime: "16 min read",
        image: image20,
        category: "Research",
        tag: "Premium",
        badgeColor: "#f59e0b",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #f59e0b30, #4559DC20)"
      },
      {
        id: 21,
        title: "Bitcoin Adoption Metrics",
        excerpt: "Tracking Bitcoin adoption through on-chain metrics: active addresses, new entities, and transaction patterns.",
        date: "Dec 21, 2025",
        readTime: "9 min read",
        image: image21,
        category: "Market Intelligence",
        tag: "Free",
        badgeColor: "#4559DC",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #4559DC30, #22c55e20)"
      },
      {
        id: 22,
        title: "Zero-Knowledge Proof Applications",
        excerpt: "Exploring practical applications of ZK-proofs in blockchain scalability, privacy, and interoperability solutions.",
        date: "Dec 20, 2025",
        readTime: "14 min read",
        image: image22,
        category: "Research",
        tag: "Premium",
        badgeColor: "#22c55e",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #22c55e30, #9d4edd20)"
      },
      {
        id: 23,
        title: "Crypto Market Correlation Study",
        excerpt: "Analysis of correlation patterns between crypto assets and traditional financial markets under different regimes.",
        date: "Dec 19, 2025",
        readTime: "11 min read",
        image: image23,
        category: "Research",
        tag: "Free",
        badgeColor: "#9d4edd",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #9d4edd30, #f59e0b20)"
      },
      {
        id: 24,
        title: "DAO Governance Analysis",
        excerpt: "Study of DAO governance patterns: voter participation, proposal success rates, and treasury management practices.",
        date: "Dec 18, 2025",
        readTime: "13 min read",
        image: image24,
        category: "Research",
        tag: "Premium",
        badgeColor: "#f59e0b",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #f59e0b30, #4559DC20)"
      },
      {
        id: 25,
        title: "Crypto Tax Reporting Guide",
        excerpt: "Comprehensive guide to crypto tax reporting requirements across major jurisdictions for 2025 tax year.",
        date: "Dec 17, 2025",
        readTime: "10 min read",
        image: image25,
        category: "Partner Reports",
        tag: "Free",
        badgeColor: "#4559DC",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #4559DC30, #22c55e20)"
      },
      {
        id: 26,
        title: "Bitcoin Technical Analysis",
        excerpt: "Combining on-chain data with technical analysis to identify key support and resistance levels for Bitcoin.",
        date: "Dec 16, 2025",
        readTime: "8 min read",
        image: image26,
        category: "Market Vectors",
        tag: "Premium",
        badgeColor: "#22c55e",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #22c55e30, #9d4edd20)"
      },
      {
        id: 27,
        title: "Web3 Social Media Trends",
        excerpt: "Analysis of emerging Web3 social media platforms and their token economic models compared to traditional social media.",
        date: "Dec 15, 2025",
        readTime: "12 min read",
        image: image27,
        category: "Research",
        tag: "Free",
        badgeColor: "#9d4edd",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #9d4edd30, #f59e0b20)"
      },
      {
        id: 28,
        title: "Crypto Insurance Market",
        excerpt: "Overview of the growing crypto insurance market: coverage options, premium trends, and risk assessment methodologies.",
        date: "Dec 14, 2025",
        readTime: "11 min read",
        image: image27,
        category: "Market Intelligence",
        tag: "Premium",
        badgeColor: "#f59e0b",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #f59e0b30, #4559DC20)"
      },
      {
        id: 29,
        title: "Bitcoin Layer 2 Solutions",
        excerpt: "Comparative analysis of Bitcoin Layer 2 scaling solutions: Lightning Network, Stacks, Rootstock, and emerging protocols.",
        date: "Dec 13, 2025",
        readTime: "14 min read",
        image: image29,
        category: "Research",
        tag: "Free",
        badgeColor: "#4559DC",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #4559DC30, #22c55e20)"
      },
      {
        id: 30,
        title: "Crypto Market Forecast 2026",
        excerpt: "Data-driven forecast for crypto markets in 2026 based on historical patterns, on-chain indicators, and macro trends.",
        date: "Dec 12, 2025",
        readTime: "15 min read",
        image: image30,
        category: "Research",
        tag: "Premium",
        badgeColor: "#22c55e",
        isFeatured: false,
        gradient: "linear-gradient(135deg, #22c55e30, #9d4edd20)"
      }
    ];
  };