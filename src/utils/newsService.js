// News service for fetching cryptocurrency news
const NEWS_API_BASE = 'https://api.coingecko.com/api/v3';

export const fetchCoinNews = async (coinId) => {
  try {
    const apiKey = import.meta.env.VITE_CG_API_KEY;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        ...(apiKey && { 'x-cg-demo-api-key': apiKey })
      }
    };

    // Fetch coin data to get more info for news context
    const coinResponse = await fetch(`${NEWS_API_BASE}/coins/${coinId}`, options);
    const coinData = await coinResponse.json();

    // Mock news data based on coin performance (since CoinGecko doesn't have news endpoint)
    const mockNews = generateMockNews(coinData);

    return mockNews;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

const generateMockNews = (coinData) => {
  const priceChange = coinData?.market_data?.price_change_percentage_24h || 0;
  const coinName = coinData?.name || 'Cryptocurrency';
  const symbol = coinData?.symbol?.toUpperCase() || 'CRYPTO';

  const newsTemplates = [
    {
      title: `${coinName} (${symbol}) Shows ${priceChange > 0 ? 'Strong' : 'Volatile'} Performance`,
      source: 'CryptoHub Analysis',
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      url: '#',
      sentiment: priceChange > 5 ? 'bullish' : priceChange < -5 ? 'bearish' : 'neutral'
    },
    {
      title: `Market Update: ${coinName} Trading Volume ${Math.random() > 0.5 ? 'Increases' : 'Fluctuates'}`,
      source: 'Market Watch',
      timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
      url: '#',
      sentiment: priceChange > 0 ? 'bullish' : 'neutral'
    },
    {
      title: `Technical Analysis: ${symbol} Price Action and Key Levels`,
      source: 'Crypto Insights',
      timestamp: new Date(Date.now() - Math.random() * 10800000).toISOString(),
      url: '#',
      sentiment: 'neutral'
    }
  ];

  return newsTemplates.slice(0, Math.floor(Math.random() * 3) + 2);
};

export const analyzeSentiment = (news) => {
  if (!news || news.length === 0) return 'neutral';

  const sentimentCounts = news.reduce((acc, article) => {
    acc[article.sentiment] = (acc[article.sentiment] || 0) + 1;
    return acc;
  }, {});

  const total = news.length;
  const bullishRatio = (sentimentCounts.bullish || 0) / total;
  const bearishRatio = (sentimentCounts.bearish || 0) / total;

  if (bullishRatio > 0.5) return 'bullish';
  if (bearishRatio > 0.5) return 'bearish';
  return 'neutral';
};