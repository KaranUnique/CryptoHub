/**
 * Advanced Cryptocurrency Utilities for CryptoHub
 * Comprehensive utilities for crypto calculations, formatting,
 * price analysis, portfolio management, and market data processing.
 * 
 * Author: ayushap18
 * Date: January 2026
 * ECWoC 2026 Contribution
 */

// ============================================================
// PRICE FORMATTING UTILITIES
// ============================================================

/**
 * Formats a price value with appropriate precision
 * @param {number} price - Price to format
 * @param {string} currency - Currency code (default: USD)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted price
 */
export const formatPrice = (price, currency = 'USD', options = {}) => {
  if (price === null || price === undefined || isNaN(price)) {
    return 'N/A';
  }

  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = price < 1 ? 8 : price < 100 ? 4 : 2,
    compact = false,
    showSign = false
  } = options;

  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
      notation: compact ? 'compact' : 'standard',
      signDisplay: showSign ? 'exceptZero' : 'auto'
    });

    return formatter.format(price);
  } catch {
    // Fallback for unsupported currencies
    const prefix = showSign && price > 0 ? '+' : '';
    return `${prefix}${currency} ${price.toFixed(maximumFractionDigits)}`;
  }
};

/**
 * Formats a crypto amount with appropriate precision
 * @param {number} amount - Amount to format
 * @param {string} symbol - Crypto symbol (e.g., BTC, ETH)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted amount
 */
export const formatCryptoAmount = (amount, symbol = '', options = {}) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'N/A';
  }

  const {
    precision = 8,
    trimZeros = true,
    showSymbol = true
  } = options;

  let formatted = amount.toFixed(precision);

  if (trimZeros) {
    formatted = parseFloat(formatted).toString();
  }

  return showSymbol && symbol ? `${formatted} ${symbol}` : formatted;
};

/**
 * Formats percentage values
 * @param {number} value - Percentage value
 * @param {Object} options - Formatting options
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, options = {}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  const {
    decimals = 2,
    showSign = true,
    suffix = '%'
  } = options;

  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}${suffix}`;
};

/**
 * Formats large numbers with abbreviations
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
export const formatLargeNumber = (num, decimals = 2) => {
  if (num === null || num === undefined || isNaN(num)) {
    return 'N/A';
  }

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1e12) {
    return `${sign}${(absNum / 1e12).toFixed(decimals)}T`;
  }
  if (absNum >= 1e9) {
    return `${sign}${(absNum / 1e9).toFixed(decimals)}B`;
  }
  if (absNum >= 1e6) {
    return `${sign}${(absNum / 1e6).toFixed(decimals)}M`;
  }
  if (absNum >= 1e3) {
    return `${sign}${(absNum / 1e3).toFixed(decimals)}K`;
  }

  return `${sign}${absNum.toFixed(decimals)}`;
};

/**
 * Formats market cap
 * @param {number} marketCap - Market cap value
 * @param {string} currency - Currency code
 * @returns {string} Formatted market cap
 */
export const formatMarketCap = (marketCap, currency = 'USD') => {
  if (!marketCap || isNaN(marketCap)) return 'N/A';

  const formatted = formatLargeNumber(marketCap);
  const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
  const symbol = symbols[currency] || currency + ' ';

  return `${symbol}${formatted}`;
};

/**
 * Formats volume
 * @param {number} volume - Trading volume
 * @param {boolean} as24h - Whether it's 24h volume
 * @returns {string} Formatted volume
 */
export const formatVolume = (volume, as24h = true) => {
  if (!volume || isNaN(volume)) return 'N/A';

  const formatted = formatLargeNumber(volume);
  return as24h ? `${formatted} (24h)` : formatted;
};

// ============================================================
// PRICE CALCULATION UTILITIES
// ============================================================

/**
 * Calculates percentage change between two values
 * @param {number} oldValue - Previous value
 * @param {number} newValue - Current value
 * @returns {number} Percentage change
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (!oldValue || oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Calculates profit/loss
 * @param {number} buyPrice - Purchase price
 * @param {number} currentPrice - Current price
 * @param {number} amount - Amount held
 * @returns {Object} Profit/loss details
 */
export const calculateProfitLoss = (buyPrice, currentPrice, amount) => {
  const invested = buyPrice * amount;
  const currentValue = currentPrice * amount;
  const profitLoss = currentValue - invested;
  const percentageChange = calculatePercentageChange(invested, currentValue);

  return {
    invested,
    currentValue,
    profitLoss,
    percentageChange,
    isProfit: profitLoss >= 0
  };
};

/**
 * Calculates average buy price (DCA)
 * @param {Array} purchases - Array of {price, amount} objects
 * @returns {number} Average price
 */
export const calculateAveragePrice = (purchases) => {
  if (!purchases || purchases.length === 0) return 0;

  let totalCost = 0;
  let totalAmount = 0;

  for (const purchase of purchases) {
    totalCost += purchase.price * purchase.amount;
    totalAmount += purchase.amount;
  }

  return totalAmount > 0 ? totalCost / totalAmount : 0;
};

/**
 * Calculates break-even price
 * @param {number} averagePrice - Average buy price
 * @param {number} fees - Total fees paid
 * @param {number} amount - Amount held
 * @returns {number} Break-even price
 */
export const calculateBreakEven = (averagePrice, fees, amount) => {
  if (!amount || amount === 0) return averagePrice;
  return averagePrice + (fees / amount);
};

/**
 * Calculates position size based on risk
 * @param {number} accountBalance - Total account balance
 * @param {number} riskPercentage - Risk percentage (e.g., 2%)
 * @param {number} entryPrice - Entry price
 * @param {number} stopLoss - Stop loss price
 * @returns {Object} Position size details
 */
export const calculatePositionSize = (accountBalance, riskPercentage, entryPrice, stopLoss) => {
  const riskAmount = accountBalance * (riskPercentage / 100);
  const priceRisk = Math.abs(entryPrice - stopLoss);
  const positionSize = riskAmount / priceRisk;
  const positionValue = positionSize * entryPrice;

  return {
    riskAmount,
    positionSize,
    positionValue,
    maxLoss: riskAmount,
    riskRewardRatio: entryPrice / priceRisk
  };
};

/**
 * Calculates liquidation price for leveraged positions
 * @param {number} entryPrice - Entry price
 * @param {number} leverage - Leverage multiplier
 * @param {boolean} isLong - Whether position is long
 * @param {number} maintenanceMargin - Maintenance margin percentage (default: 0.5%)
 * @returns {number} Liquidation price
 */
export const calculateLiquidationPrice = (entryPrice, leverage, isLong = true, maintenanceMargin = 0.5) => {
  const marginPercentage = (100 / leverage) - maintenanceMargin;

  if (isLong) {
    return entryPrice * (1 - marginPercentage / 100);
  } else {
    return entryPrice * (1 + marginPercentage / 100);
  }
};

// ============================================================
// PORTFOLIO CALCULATIONS
// ============================================================

/**
 * Calculates portfolio allocation
 * @param {Array} holdings - Array of {symbol, value} objects
 * @returns {Array} Holdings with allocation percentages
 */
export const calculateAllocation = (holdings) => {
  if (!holdings || holdings.length === 0) return [];

  const totalValue = holdings.reduce((sum, h) => sum + (h.value || 0), 0);

  return holdings.map(holding => ({
    ...holding,
    allocation: totalValue > 0 ? (holding.value / totalValue) * 100 : 0
  }));
};

/**
 * Calculates portfolio value
 * @param {Array} holdings - Array of holdings
 * @param {Object} prices - Current prices by symbol
 * @returns {Object} Portfolio value details
 */
export const calculatePortfolioValue = (holdings, prices) => {
  let totalValue = 0;
  let totalInvested = 0;
  const breakdown = [];

  for (const holding of holdings) {
    const currentPrice = prices[holding.symbol] || 0;
    const value = holding.amount * currentPrice;
    const invested = holding.amount * (holding.averagePrice || currentPrice);

    totalValue += value;
    totalInvested += invested;

    breakdown.push({
      ...holding,
      currentPrice,
      value,
      invested,
      profitLoss: value - invested,
      percentageChange: calculatePercentageChange(invested, value)
    });
  }

  return {
    totalValue,
    totalInvested,
    totalProfitLoss: totalValue - totalInvested,
    totalPercentageChange: calculatePercentageChange(totalInvested, totalValue),
    breakdown: calculateAllocation(breakdown)
  };
};

/**
 * Calculates portfolio diversification score
 * @param {Array} holdings - Holdings with allocation percentages
 * @returns {Object} Diversification metrics
 */
export const calculateDiversificationScore = (holdings) => {
  if (!holdings || holdings.length === 0) {
    return { score: 0, rating: 'None', recommendation: 'Add some holdings' };
  }

  // Calculate Herfindahl-Hirschman Index (HHI)
  const hhi = holdings.reduce((sum, h) => {
    const allocation = h.allocation || 0;
    return sum + Math.pow(allocation / 100, 2);
  }, 0);

  // Convert HHI to diversification score (0-100)
  const maxHHI = 1; // All in one asset
  const minHHI = 1 / holdings.length; // Equal distribution
  const score = Math.round((1 - (hhi - minHHI) / (maxHHI - minHHI)) * 100);

  // Get rating
  let rating, recommendation;
  if (score >= 80) {
    rating = 'Excellent';
    recommendation = 'Well diversified portfolio';
  } else if (score >= 60) {
    rating = 'Good';
    recommendation = 'Consider adding a few more assets';
  } else if (score >= 40) {
    rating = 'Moderate';
    recommendation = 'Consider rebalancing to reduce concentration';
  } else if (score >= 20) {
    rating = 'Poor';
    recommendation = 'Portfolio is too concentrated';
  } else {
    rating = 'Very Poor';
    recommendation = 'Significant concentration risk';
  }

  return {
    score,
    rating,
    recommendation,
    hhi,
    numberOfAssets: holdings.length
  };
};

/**
 * Suggests portfolio rebalancing
 * @param {Array} currentHoldings - Current holdings with allocations
 * @param {Array} targetAllocations - Target allocations by symbol
 * @param {number} totalValue - Total portfolio value
 * @returns {Array} Rebalancing suggestions
 */
export const suggestRebalancing = (currentHoldings, targetAllocations, totalValue) => {
  const suggestions = [];
  const targetMap = new Map(targetAllocations.map(t => [t.symbol, t.target]));

  for (const holding of currentHoldings) {
    const target = targetMap.get(holding.symbol) || 0;
    const current = holding.allocation || 0;
    const difference = target - current;

    if (Math.abs(difference) > 1) { // Only suggest if difference > 1%
      const valueChange = (totalValue * difference) / 100;
      const action = difference > 0 ? 'BUY' : 'SELL';

      suggestions.push({
        symbol: holding.symbol,
        action,
        currentAllocation: current,
        targetAllocation: target,
        difference,
        valueChange: Math.abs(valueChange),
        amountChange: holding.currentPrice ? Math.abs(valueChange / holding.currentPrice) : 0
      });
    }
  }

  return suggestions.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
};

// ============================================================
// TECHNICAL ANALYSIS UTILITIES
// ============================================================

/**
 * Calculates Simple Moving Average (SMA)
 * @param {Array} data - Array of price values
 * @param {number} period - SMA period
 * @returns {Array} SMA values
 */
export const calculateSMA = (data, period) => {
  if (!data || data.length < period) return [];

  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }

  return sma;
};

/**
 * Calculates Exponential Moving Average (EMA)
 * @param {Array} data - Array of price values
 * @param {number} period - EMA period
 * @returns {Array} EMA values
 */
export const calculateEMA = (data, period) => {
  if (!data || data.length < period) return [];

  const multiplier = 2 / (period + 1);
  const ema = [data.slice(0, period).reduce((a, b) => a + b, 0) / period];

  for (let i = period; i < data.length; i++) {
    ema.push((data[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]);
  }

  return ema;
};

/**
 * Calculates Relative Strength Index (RSI)
 * @param {Array} data - Array of price values
 * @param {number} period - RSI period (default: 14)
 * @returns {Array} RSI values
 */
export const calculateRSI = (data, period = 14) => {
  if (!data || data.length < period + 1) return [];

  const changes = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i] - data[i - 1]);
  }

  const gains = changes.map(c => c > 0 ? c : 0);
  const losses = changes.map(c => c < 0 ? Math.abs(c) : 0);

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  const rsi = [];
  rsi.push(100 - (100 / (1 + avgGain / avgLoss)));

  for (let i = period; i < changes.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      rsi.push(100 - (100 / (1 + avgGain / avgLoss)));
    }
  }

  return rsi;
};

/**
 * Calculates MACD (Moving Average Convergence Divergence)
 * @param {Array} data - Array of price values
 * @param {number} fastPeriod - Fast EMA period (default: 12)
 * @param {number} slowPeriod - Slow EMA period (default: 26)
 * @param {number} signalPeriod - Signal line period (default: 9)
 * @returns {Object} MACD values
 */
export const calculateMACD = (data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (!data || data.length < slowPeriod) return { macd: [], signal: [], histogram: [] };

  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  const macd = [];
  const diff = slowPeriod - fastPeriod;

  for (let i = 0; i < slowEMA.length; i++) {
    macd.push(fastEMA[i + diff] - slowEMA[i]);
  }

  const signal = calculateEMA(macd, signalPeriod);
  const histogram = [];

  for (let i = signalPeriod - 1; i < macd.length; i++) {
    histogram.push(macd[i] - signal[i - signalPeriod + 1]);
  }

  return { macd, signal, histogram };
};

/**
 * Calculates Bollinger Bands
 * @param {Array} data - Array of price values
 * @param {number} period - Moving average period (default: 20)
 * @param {number} stdDev - Standard deviation multiplier (default: 2)
 * @returns {Object} Bollinger Bands values
 */
export const calculateBollingerBands = (data, period = 20, stdDev = 2) => {
  if (!data || data.length < period) return { upper: [], middle: [], lower: [] };

  const middle = calculateSMA(data, period);
  const upper = [];
  const lower = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const mean = middle[i - period + 1];
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
    const std = Math.sqrt(variance);

    upper.push(mean + std * stdDev);
    lower.push(mean - std * stdDev);
  }

  return { upper, middle, lower };
};

/**
 * Calculates Average True Range (ATR)
 * @param {Array} candles - Array of {high, low, close} objects
 * @param {number} period - ATR period (default: 14)
 * @returns {Array} ATR values
 */
export const calculateATR = (candles, period = 14) => {
  if (!candles || candles.length < period + 1) return [];

  const trueRanges = [];

  for (let i = 1; i < candles.length; i++) {
    const current = candles[i];
    const previous = candles[i - 1];

    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - previous.close),
      Math.abs(current.low - previous.close)
    );
    trueRanges.push(tr);
  }

  return calculateEMA(trueRanges, period);
};

/**
 * Identifies support and resistance levels
 * @param {Array} data - Array of price values
 * @param {number} lookback - Lookback period
 * @returns {Object} Support and resistance levels
 */
export const findSupportResistance = (data, lookback = 20) => {
  if (!data || data.length < lookback * 2) return { support: [], resistance: [] };

  const support = [];
  const resistance = [];

  for (let i = lookback; i < data.length - lookback; i++) {
    const leftSlice = data.slice(i - lookback, i);
    const rightSlice = data.slice(i + 1, i + lookback + 1);
    const current = data[i];

    // Check for local minimum (support)
    if (Math.min(...leftSlice) >= current && Math.min(...rightSlice) >= current) {
      support.push({ index: i, price: current });
    }

    // Check for local maximum (resistance)
    if (Math.max(...leftSlice) <= current && Math.max(...rightSlice) <= current) {
      resistance.push({ index: i, price: current });
    }
  }

  // Cluster nearby levels
  const clusterLevels = (levels, threshold = 0.02) => {
    if (levels.length === 0) return [];

    const sorted = [...levels].sort((a, b) => a.price - b.price);
    const clustered = [];
    let currentCluster = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const diff = (sorted[i].price - currentCluster[0].price) / currentCluster[0].price;

      if (diff < threshold) {
        currentCluster.push(sorted[i]);
      } else {
        const avgPrice = currentCluster.reduce((sum, l) => sum + l.price, 0) / currentCluster.length;
        clustered.push({ price: avgPrice, strength: currentCluster.length });
        currentCluster = [sorted[i]];
      }
    }

    const avgPrice = currentCluster.reduce((sum, l) => sum + l.price, 0) / currentCluster.length;
    clustered.push({ price: avgPrice, strength: currentCluster.length });

    return clustered;
  };

  return {
    support: clusterLevels(support),
    resistance: clusterLevels(resistance)
  };
};

// ============================================================
// MARKET SENTIMENT UTILITIES
// ============================================================

/**
 * Calculates Fear & Greed index based on various metrics
 * @param {Object} metrics - Market metrics
 * @returns {Object} Fear & Greed analysis
 */
export const calculateFearGreedIndex = (metrics) => {
  const {
    priceChange24h = 0,
    volumeChange = 0,
    marketCapChange = 0,
    volatility = 0,
    socialSentiment = 50
  } = metrics;

  // Weighted scoring
  const priceScore = Math.min(100, Math.max(0, 50 + priceChange24h * 2));
  const volumeScore = Math.min(100, Math.max(0, 50 + volumeChange * 1.5));
  const marketCapScore = Math.min(100, Math.max(0, 50 + marketCapChange * 2));
  const volatilityScore = Math.min(100, Math.max(0, 100 - volatility * 10));
  const sentimentScore = socialSentiment;

  // Weighted average
  const index = Math.round(
    priceScore * 0.25 +
    volumeScore * 0.2 +
    marketCapScore * 0.2 +
    volatilityScore * 0.15 +
    sentimentScore * 0.2
  );

  // Determine sentiment
  let sentiment, color;
  if (index <= 20) {
    sentiment = 'Extreme Fear';
    color = '#ff0000';
  } else if (index <= 40) {
    sentiment = 'Fear';
    color = '#ff6600';
  } else if (index <= 60) {
    sentiment = 'Neutral';
    color = '#ffcc00';
  } else if (index <= 80) {
    sentiment = 'Greed';
    color = '#99cc00';
  } else {
    sentiment = 'Extreme Greed';
    color = '#00cc00';
  }

  return {
    index,
    sentiment,
    color,
    components: {
      price: priceScore,
      volume: volumeScore,
      marketCap: marketCapScore,
      volatility: volatilityScore,
      social: sentimentScore
    }
  };
};

/**
 * Analyzes market trend
 * @param {Array} prices - Array of price values
 * @returns {Object} Trend analysis
 */
export const analyzeTrend = (prices) => {
  if (!prices || prices.length < 20) {
    return { trend: 'Unknown', strength: 0 };
  }

  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, Math.min(50, prices.length));
  const currentPrice = prices[prices.length - 1];
  const latestSMA20 = sma20[sma20.length - 1];
  const latestSMA50 = sma50[sma50.length - 1];

  // Calculate RSI
  const rsi = calculateRSI(prices);
  const latestRSI = rsi[rsi.length - 1];

  // Determine trend
  let trend, strength;

  if (currentPrice > latestSMA20 && latestSMA20 > latestSMA50) {
    trend = 'Bullish';
    strength = Math.min(100, 50 + (currentPrice / latestSMA20 - 1) * 100 + (latestRSI - 50));
  } else if (currentPrice < latestSMA20 && latestSMA20 < latestSMA50) {
    trend = 'Bearish';
    strength = Math.min(100, 50 + (1 - currentPrice / latestSMA20) * 100 + (50 - latestRSI));
  } else {
    trend = 'Neutral';
    strength = 50;
  }

  return {
    trend,
    strength: Math.round(strength),
    sma20: latestSMA20,
    sma50: latestSMA50,
    rsi: latestRSI,
    priceAboveSMA20: currentPrice > latestSMA20,
    priceAboveSMA50: currentPrice > latestSMA50,
    goldenCross: latestSMA20 > latestSMA50,
    deathCross: latestSMA20 < latestSMA50
  };
};

// ============================================================
// PRICE ALERT UTILITIES
// ============================================================

/**
 * Alert conditions
 */
export const AlertConditions = {
  PRICE_ABOVE: 'price_above',
  PRICE_BELOW: 'price_below',
  PERCENTAGE_CHANGE: 'percentage_change',
  RSI_OVERSOLD: 'rsi_oversold',
  RSI_OVERBOUGHT: 'rsi_overbought',
  VOLUME_SPIKE: 'volume_spike'
};

/**
 * Checks if alert condition is met
 * @param {Object} alert - Alert configuration
 * @param {Object} marketData - Current market data
 * @returns {Object} Alert check result
 */
export const checkAlertCondition = (alert, marketData) => {
  const { condition, value, symbol } = alert;
  const { price, price24hAgo, volume, volume24hAgo, rsi } = marketData;

  let triggered = false;
  let message = '';

  switch (condition) {
    case AlertConditions.PRICE_ABOVE:
      triggered = price >= value;
      message = `${symbol} price is now above ${formatPrice(value)}`;
      break;

    case AlertConditions.PRICE_BELOW:
      triggered = price <= value;
      message = `${symbol} price is now below ${formatPrice(value)}`;
      break;

    case AlertConditions.PERCENTAGE_CHANGE: {
      const change = calculatePercentageChange(price24hAgo, price);
      triggered = Math.abs(change) >= value;
      message = `${symbol} changed ${formatPercentage(change)} in 24h`;
      break;
    }

    case AlertConditions.RSI_OVERSOLD:
      triggered = rsi <= (value || 30);
      message = `${symbol} RSI is oversold at ${rsi?.toFixed(2)}`;
      break;

    case AlertConditions.RSI_OVERBOUGHT:
      triggered = rsi >= (value || 70);
      message = `${symbol} RSI is overbought at ${rsi?.toFixed(2)}`;
      break;

    case AlertConditions.VOLUME_SPIKE: {
      const volumeChange = calculatePercentageChange(volume24hAgo, volume);
      triggered = volumeChange >= (value || 100);
      message = `${symbol} volume spiked ${formatPercentage(volumeChange)}`;
      break;
    }

    default:
      message = 'Unknown alert condition';
  }

  return {
    triggered,
    message,
    timestamp: new Date().toISOString(),
    data: { price, rsi, volume }
  };
};

// ============================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================

/**
 * Converts OHLCV data to different timeframes
 * @param {Array} candles - Source candles
 * @param {number} targetMinutes - Target timeframe in minutes
 * @returns {Array} Aggregated candles
 */
export const aggregateCandles = (candles, targetMinutes) => {
  if (!candles || candles.length === 0) return [];

  const aggregated = [];
  let currentCandle = null;

  for (const candle of candles) {
    const candleTime = new Date(candle.timestamp).getTime();
    const periodStart = Math.floor(candleTime / (targetMinutes * 60000)) * (targetMinutes * 60000);

    if (!currentCandle || currentCandle.timestamp !== periodStart) {
      if (currentCandle) {
        aggregated.push(currentCandle);
      }
      currentCandle = {
        timestamp: periodStart,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume
      };
    } else {
      currentCandle.high = Math.max(currentCandle.high, candle.high);
      currentCandle.low = Math.min(currentCandle.low, candle.low);
      currentCandle.close = candle.close;
      currentCandle.volume += candle.volume;
    }
  }

  if (currentCandle) {
    aggregated.push(currentCandle);
  }

  return aggregated;
};

/**
 * Calculates statistics from price data
 * @param {Array} prices - Array of price values
 * @returns {Object} Statistics
 */
export const calculateStatistics = (prices) => {
  if (!prices || prices.length === 0) {
    return { min: 0, max: 0, mean: 0, median: 0, stdDev: 0 };
  }

  const sorted = [...prices].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const median = prices.length % 2 === 0
    ? (sorted[prices.length / 2 - 1] + sorted[prices.length / 2]) / 2
    : sorted[Math.floor(prices.length / 2)];

  const variance = prices.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);

  return { min, max, mean, median, stdDev };
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Formatting
  formatPrice,
  formatCryptoAmount,
  formatPercentage,
  formatLargeNumber,
  formatMarketCap,
  formatVolume,

  // Calculations
  calculatePercentageChange,
  calculateProfitLoss,
  calculateAveragePrice,
  calculateBreakEven,
  calculatePositionSize,
  calculateLiquidationPrice,

  // Portfolio
  calculateAllocation,
  calculatePortfolioValue,
  calculateDiversificationScore,
  suggestRebalancing,

  // Technical Analysis
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateATR,
  findSupportResistance,

  // Market Sentiment
  calculateFearGreedIndex,
  analyzeTrend,

  // Alerts
  AlertConditions,
  checkAlertCondition,

  // Data Transformation
  aggregateCandles,
  calculateStatistics
};
