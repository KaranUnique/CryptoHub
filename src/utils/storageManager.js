/**
 * Local Storage Manager for CryptoHub
 * Comprehensive utilities for persistent data storage,
 * caching, user preferences, and state management.
 * 
 * Author: ayushap18
 * Date: January 2026
 * ECWoC 2026 Contribution
 */

// ============================================================
// STORAGE CONFIGURATION
// ============================================================

const STORAGE_PREFIX = 'cryptohub_';
const STORAGE_VERSION = '1.0';

/**
 * Storage keys enum
 */
export const StorageKeys = {
  // User preferences
  THEME: 'theme',
  CURRENCY: 'currency',
  LANGUAGE: 'language',
  TIMEZONE: 'timezone',
  
  // App state
  FAVORITES: 'favorites',
  WATCHLIST: 'watchlist',
  ALERTS: 'alerts',
  PORTFOLIO: 'portfolio',
  TRANSACTIONS: 'transactions',
  
  // Cache
  PRICE_CACHE: 'price_cache',
  MARKET_DATA_CACHE: 'market_data_cache',
  COIN_LIST_CACHE: 'coin_list_cache',
  
  // User data
  USER_SETTINGS: 'user_settings',
  RECENT_SEARCHES: 'recent_searches',
  CHART_PREFERENCES: 'chart_preferences',
  NOTIFICATION_SETTINGS: 'notification_settings',
  
  // Session
  LAST_VISITED: 'last_visited',
  SESSION_DATA: 'session_data'
};

// ============================================================
// BASE STORAGE CLASS
// ============================================================

/**
 * Base storage wrapper class
 */
class StorageManager {
  constructor(storage = localStorage) {
    this.storage = storage;
    this.prefix = STORAGE_PREFIX;
    this.version = STORAGE_VERSION;
    this.listeners = new Map();
  }
  
  /**
   * Gets full key with prefix
   * @param {string} key - Key name
   * @returns {string} Full key
   */
  getFullKey(key) {
    return `${this.prefix}${key}`;
  }
  
  /**
   * Checks if storage is available
   * @returns {boolean} Availability status
   */
  isAvailable() {
    try {
      const testKey = '__storage_test__';
      this.storage.setItem(testKey, testKey);
      this.storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Sets a value in storage
   * @param {string} key - Key name
   * @param {*} value - Value to store
   * @param {Object} options - Storage options
   * @returns {boolean} Success status
   */
  set(key, value, options = {}) {
    try {
      const fullKey = this.getFullKey(key);
      const data = {
        value,
        version: this.version,
        timestamp: Date.now(),
        expires: options.ttl ? Date.now() + options.ttl : null
      };
      
      this.storage.setItem(fullKey, JSON.stringify(data));
      this.notifyListeners(key, value);
      return true;
    } catch (error) {
      console.error(`Storage set error for ${key}:`, error);
      
      // Try to clear space if quota exceeded
      if (error.name === 'QuotaExceededError') {
        this.clearExpired();
        try {
          this.storage.setItem(
            this.getFullKey(key),
            JSON.stringify({ value, version: this.version, timestamp: Date.now() })
          );
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }
  
  /**
   * Gets a value from storage
   * @param {string} key - Key name
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Stored value or default
   */
  get(key, defaultValue = null) {
    try {
      const fullKey = this.getFullKey(key);
      const item = this.storage.getItem(fullKey);
      
      if (!item) return defaultValue;
      
      const data = JSON.parse(item);
      
      // Check expiration
      if (data.expires && Date.now() > data.expires) {
        this.remove(key);
        return defaultValue;
      }
      
      // Check version
      if (data.version !== this.version) {
        this.remove(key);
        return defaultValue;
      }
      
      return data.value;
    } catch (error) {
      console.error(`Storage get error for ${key}:`, error);
      return defaultValue;
    }
  }
  
  /**
   * Removes a value from storage
   * @param {string} key - Key name
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      const fullKey = this.getFullKey(key);
      this.storage.removeItem(fullKey);
      this.notifyListeners(key, null);
      return true;
    } catch (error) {
      console.error(`Storage remove error for ${key}:`, error);
      return false;
    }
  }
  
  /**
   * Checks if a key exists
   * @param {string} key - Key name
   * @returns {boolean} Existence status
   */
  has(key) {
    return this.get(key) !== null;
  }
  
  /**
   * Clears all stored data
   * @returns {boolean} Success status
   */
  clear() {
    try {
      const keysToRemove = [];
      
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => this.storage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }
  
  /**
   * Clears expired items
   * @returns {number} Number of items cleared
   */
  clearExpired() {
    let cleared = 0;
    
    for (let i = this.storage.length - 1; i >= 0; i--) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        try {
          const item = JSON.parse(this.storage.getItem(key));
          if (item.expires && Date.now() > item.expires) {
            this.storage.removeItem(key);
            cleared++;
          }
        } catch {
          // Invalid JSON, remove it
          this.storage.removeItem(key);
          cleared++;
        }
      }
    }
    
    return cleared;
  }
  
  /**
   * Gets all keys
   * @returns {Array} Array of keys
   */
  keys() {
    const keys = [];
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.replace(this.prefix, ''));
      }
    }
    
    return keys;
  }
  
  /**
   * Gets storage size info
   * @returns {Object} Size information
   */
  getSize() {
    let totalSize = 0;
    let itemCount = 0;
    const items = [];
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const value = this.storage.getItem(key);
        const size = new Blob([value]).size;
        totalSize += size;
        itemCount++;
        items.push({ key: key.replace(this.prefix, ''), size });
      }
    }
    
    return {
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      itemCount,
      items: items.sort((a, b) => b.size - a.size)
    };
  }
  
  /**
   * Adds a change listener
   * @param {string} key - Key to watch
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }
  
  /**
   * Notifies listeners of changes
   * @param {string} key - Changed key
   * @param {*} value - New value
   */
  notifyListeners(key, value) {
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(value, key);
        } catch (error) {
          console.error('Listener error:', error);
        }
      });
    }
  }
}

// ============================================================
// SPECIALIZED STORAGE MANAGERS
// ============================================================

/**
 * Watchlist storage manager
 */
export class WatchlistManager {
  constructor(storage = new StorageManager()) {
    this.storage = storage;
    this.key = StorageKeys.WATCHLIST;
  }
  
  /**
   * Gets watchlist
   * @returns {Array} Watchlist items
   */
  get() {
    return this.storage.get(this.key, []);
  }
  
  /**
   * Adds item to watchlist
   * @param {Object} coin - Coin to add
   * @returns {boolean} Success status
   */
  add(coin) {
    const watchlist = this.get();
    
    if (watchlist.some(item => item.id === coin.id)) {
      return false; // Already exists
    }
    
    watchlist.push({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      addedAt: Date.now()
    });
    
    return this.storage.set(this.key, watchlist);
  }
  
  /**
   * Removes item from watchlist
   * @param {string} coinId - Coin ID to remove
   * @returns {boolean} Success status
   */
  remove(coinId) {
    const watchlist = this.get().filter(item => item.id !== coinId);
    return this.storage.set(this.key, watchlist);
  }
  
  /**
   * Checks if coin is in watchlist
   * @param {string} coinId - Coin ID to check
   * @returns {boolean} Existence status
   */
  has(coinId) {
    return this.get().some(item => item.id === coinId);
  }
  
  /**
   * Toggles coin in watchlist
   * @param {Object} coin - Coin to toggle
   * @returns {boolean} New status (true if added)
   */
  toggle(coin) {
    if (this.has(coin.id)) {
      this.remove(coin.id);
      return false;
    } else {
      this.add(coin);
      return true;
    }
  }
  
  /**
   * Reorders watchlist
   * @param {Array} newOrder - Array of coin IDs in new order
   * @returns {boolean} Success status
   */
  reorder(newOrder) {
    const watchlist = this.get();
    const reordered = newOrder
      .map(id => watchlist.find(item => item.id === id))
      .filter(Boolean);
    
    return this.storage.set(this.key, reordered);
  }
  
  /**
   * Clears watchlist
   * @returns {boolean} Success status
   */
  clear() {
    return this.storage.set(this.key, []);
  }
}

/**
 * Portfolio storage manager
 */
export class PortfolioManager {
  constructor(storage = new StorageManager()) {
    this.storage = storage;
    this.portfolioKey = StorageKeys.PORTFOLIO;
    this.transactionsKey = StorageKeys.TRANSACTIONS;
  }
  
  /**
   * Gets all holdings
   * @returns {Array} Portfolio holdings
   */
  getHoldings() {
    return this.storage.get(this.portfolioKey, []);
  }
  
  /**
   * Gets all transactions
   * @returns {Array} Transactions
   */
  getTransactions() {
    return this.storage.get(this.transactionsKey, []);
  }
  
  /**
   * Adds a transaction
   * @param {Object} transaction - Transaction details
   * @returns {boolean} Success status
   */
  addTransaction(transaction) {
    const transactions = this.getTransactions();
    const newTransaction = {
      id: generateId(),
      ...transaction,
      createdAt: Date.now()
    };
    
    transactions.push(newTransaction);
    this.storage.set(this.transactionsKey, transactions);
    
    // Update holdings
    this.updateHoldings(transaction);
    
    return true;
  }
  
  /**
   * Updates holdings based on transaction
   * @param {Object} transaction - Transaction details
   */
  updateHoldings(transaction) {
    const holdings = this.getHoldings();
    const existingIndex = holdings.findIndex(h => h.coinId === transaction.coinId);
    
    if (transaction.type === 'buy') {
      if (existingIndex >= 0) {
        // Update existing holding
        const existing = holdings[existingIndex];
        const totalCost = (existing.averagePrice * existing.amount) + 
                         (transaction.price * transaction.amount);
        const totalAmount = existing.amount + transaction.amount;
        
        holdings[existingIndex] = {
          ...existing,
          amount: totalAmount,
          averagePrice: totalCost / totalAmount,
          updatedAt: Date.now()
        };
      } else {
        // Add new holding
        holdings.push({
          coinId: transaction.coinId,
          symbol: transaction.symbol,
          name: transaction.name,
          amount: transaction.amount,
          averagePrice: transaction.price,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
    } else if (transaction.type === 'sell' && existingIndex >= 0) {
      const existing = holdings[existingIndex];
      const newAmount = existing.amount - transaction.amount;
      
      if (newAmount <= 0) {
        holdings.splice(existingIndex, 1);
      } else {
        holdings[existingIndex] = {
          ...existing,
          amount: newAmount,
          updatedAt: Date.now()
        };
      }
    }
    
    this.storage.set(this.portfolioKey, holdings);
  }
  
  /**
   * Removes a transaction
   * @param {string} transactionId - Transaction ID
   * @returns {boolean} Success status
   */
  removeTransaction(transactionId) {
    const transactions = this.getTransactions().filter(t => t.id !== transactionId);
    this.storage.set(this.transactionsKey, transactions);
    
    // Recalculate holdings
    this.recalculateHoldings();
    
    return true;
  }
  
  /**
   * Recalculates holdings from transactions
   */
  recalculateHoldings() {
    const transactions = this.getTransactions();
    const holdings = new Map();
    
    for (const tx of transactions) {
      const existing = holdings.get(tx.coinId) || {
        coinId: tx.coinId,
        symbol: tx.symbol,
        name: tx.name,
        amount: 0,
        totalCost: 0
      };
      
      if (tx.type === 'buy') {
        existing.amount += tx.amount;
        existing.totalCost += tx.price * tx.amount;
      } else if (tx.type === 'sell') {
        existing.amount -= tx.amount;
        existing.totalCost -= tx.price * tx.amount;
      }
      
      holdings.set(tx.coinId, existing);
    }
    
    const holdingsArray = Array.from(holdings.values())
      .filter(h => h.amount > 0)
      .map(h => ({
        ...h,
        averagePrice: h.totalCost / h.amount,
        updatedAt: Date.now()
      }));
    
    this.storage.set(this.portfolioKey, holdingsArray);
  }
  
  /**
   * Gets portfolio summary
   * @param {Object} currentPrices - Current prices by coin ID
   * @returns {Object} Portfolio summary
   */
  getSummary(currentPrices = {}) {
    const holdings = this.getHoldings();
    let totalValue = 0;
    let totalCost = 0;
    
    const details = holdings.map(holding => {
      const currentPrice = currentPrices[holding.coinId] || 0;
      const value = holding.amount * currentPrice;
      const cost = holding.amount * holding.averagePrice;
      const profitLoss = value - cost;
      const profitLossPercent = cost > 0 ? (profitLoss / cost) * 100 : 0;
      
      totalValue += value;
      totalCost += cost;
      
      return {
        ...holding,
        currentPrice,
        value,
        cost,
        profitLoss,
        profitLossPercent
      };
    });
    
    return {
      holdings: details,
      totalValue,
      totalCost,
      totalProfitLoss: totalValue - totalCost,
      totalProfitLossPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0
    };
  }
  
  /**
   * Clears portfolio
   * @returns {boolean} Success status
   */
  clear() {
    this.storage.set(this.portfolioKey, []);
    this.storage.set(this.transactionsKey, []);
    return true;
  }
  
  /**
   * Exports portfolio data
   * @returns {Object} Export data
   */
  export() {
    return {
      holdings: this.getHoldings(),
      transactions: this.getTransactions(),
      exportedAt: new Date().toISOString()
    };
  }
  
  /**
   * Imports portfolio data
   * @param {Object} data - Import data
   * @returns {boolean} Success status
   */
  import(data) {
    if (data.holdings) {
      this.storage.set(this.portfolioKey, data.holdings);
    }
    if (data.transactions) {
      this.storage.set(this.transactionsKey, data.transactions);
    }
    return true;
  }
}

/**
 * Price alerts storage manager
 */
export class AlertsManager {
  constructor(storage = new StorageManager()) {
    this.storage = storage;
    this.key = StorageKeys.ALERTS;
  }
  
  /**
   * Gets all alerts
   * @returns {Array} Alerts
   */
  getAll() {
    return this.storage.get(this.key, []);
  }
  
  /**
   * Gets active alerts
   * @returns {Array} Active alerts
   */
  getActive() {
    return this.getAll().filter(alert => alert.active);
  }
  
  /**
   * Adds an alert
   * @param {Object} alert - Alert configuration
   * @returns {Object} Created alert
   */
  add(alert) {
    const alerts = this.getAll();
    const newAlert = {
      id: generateId(),
      coinId: alert.coinId,
      symbol: alert.symbol,
      condition: alert.condition, // 'above', 'below', 'percent_change'
      targetPrice: alert.targetPrice,
      percentChange: alert.percentChange,
      note: alert.note || '',
      active: true,
      triggered: false,
      createdAt: Date.now()
    };
    
    alerts.push(newAlert);
    this.storage.set(this.key, alerts);
    
    return newAlert;
  }
  
  /**
   * Updates an alert
   * @param {string} alertId - Alert ID
   * @param {Object} updates - Updates to apply
   * @returns {boolean} Success status
   */
  update(alertId, updates) {
    const alerts = this.getAll();
    const index = alerts.findIndex(a => a.id === alertId);
    
    if (index >= 0) {
      alerts[index] = { ...alerts[index], ...updates, updatedAt: Date.now() };
      this.storage.set(this.key, alerts);
      return true;
    }
    
    return false;
  }
  
  /**
   * Removes an alert
   * @param {string} alertId - Alert ID
   * @returns {boolean} Success status
   */
  remove(alertId) {
    const alerts = this.getAll().filter(a => a.id !== alertId);
    return this.storage.set(this.key, alerts);
  }
  
  /**
   * Toggles alert active status
   * @param {string} alertId - Alert ID
   * @returns {boolean} New status
   */
  toggle(alertId) {
    const alerts = this.getAll();
    const alert = alerts.find(a => a.id === alertId);
    
    if (alert) {
      alert.active = !alert.active;
      this.storage.set(this.key, alerts);
      return alert.active;
    }
    
    return false;
  }
  
  /**
   * Checks alerts against current prices
   * @param {Object} prices - Current prices
   * @returns {Array} Triggered alerts
   */
  checkAlerts(prices) {
    const alerts = this.getActive();
    const triggered = [];
    
    for (const alert of alerts) {
      const currentPrice = prices[alert.coinId];
      if (!currentPrice) continue;
      
      let isTriggered = false;
      
      if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
        isTriggered = true;
      } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
        isTriggered = true;
      } else if (alert.condition === 'percent_change') {
        // This would need reference price - simplified for demo
        isTriggered = false;
      }
      
      if (isTriggered) {
        this.update(alert.id, { triggered: true, triggeredAt: Date.now(), active: false });
        triggered.push({ ...alert, currentPrice });
      }
    }
    
    return triggered;
  }
  
  /**
   * Clears all alerts
   * @returns {boolean} Success status
   */
  clear() {
    return this.storage.set(this.key, []);
  }
}

/**
 * User preferences storage manager
 */
export class PreferencesManager {
  constructor(storage = new StorageManager()) {
    this.storage = storage;
    this.key = StorageKeys.USER_SETTINGS;
    this.defaults = {
      theme: 'dark',
      currency: 'USD',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      priceChangeFormat: 'percent', // 'percent' or 'absolute'
      chartTimeframe: '24h',
      chartType: 'line',
      notifications: {
        priceAlerts: true,
        portfolioUpdates: true,
        newsAlerts: false
      },
      display: {
        showMarketCap: true,
        showVolume: true,
        showSupply: true,
        compactNumbers: true
      }
    };
  }
  
  /**
   * Gets all preferences
   * @returns {Object} Preferences
   */
  getAll() {
    const stored = this.storage.get(this.key, {});
    return { ...this.defaults, ...stored };
  }
  
  /**
   * Gets a single preference
   * @param {string} key - Preference key
   * @returns {*} Preference value
   */
  get(key) {
    const prefs = this.getAll();
    return key.split('.').reduce((obj, k) => obj?.[k], prefs);
  }
/**
   * Sets a preference
   * @param {string} key - Preference key
   * @param {*} value - Preference value
   * @returns {boolean} Success status
   */
  set(key, value) {
    const prefs = this.getAll();
    const keys = key.split('.');
    let current = prefs;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const keyPart = keys[i];

      // SECURITY FIX: Prevent Prototype Pollution
      if (keyPart === '__proto__' || keyPart === 'constructor' || keyPart === 'prototype') {
        console.warn('Security Warning: Attempted prototype pollution blocked.');
        return false;
      }

      if (!current[keyPart]) current[keyPart] = {};
      current = current[keyPart];
    }
    
    const finalKey = keys[keys.length - 1];

    // SECURITY FIX: Check the final key as well
    if (finalKey === '__proto__' || finalKey === 'constructor' || finalKey === 'prototype') {
      console.warn('Security Warning: Attempted prototype pollution blocked.');
      return false;
    }

    current[finalKey] = value;
    return this.storage.set(this.key, prefs);
  }
  /**
   * Sets multiple preferences
   * @param {Object} preferences - Preferences to set
   * @returns {boolean} Success status
   */
  setMany(preferences) {
    const prefs = this.getAll();
    const merged = deepMerge(prefs, preferences);
    return this.storage.set(this.key, merged);
  }
  
  /**
   * Resets to defaults
   * @returns {boolean} Success status
   */
  reset() {
    return this.storage.set(this.key, this.defaults);
  }
}

/**
 * Recent searches storage manager
 */
export class RecentSearchesManager {
  constructor(storage = new StorageManager(), maxItems = 10) {
    this.storage = storage;
    this.key = StorageKeys.RECENT_SEARCHES;
    this.maxItems = maxItems;
  }
  
  /**
   * Gets recent searches
   * @returns {Array} Recent searches
   */
  get() {
    return this.storage.get(this.key, []);
  }
  
  /**
   * Adds a search
   * @param {Object} item - Search item
   * @returns {boolean} Success status
   */
  add(item) {
    let searches = this.get();
    
    // Remove if exists
    searches = searches.filter(s => s.id !== item.id);
    
    // Add to front
    searches.unshift({
      id: item.id,
      symbol: item.symbol,
      name: item.name,
      image: item.image,
      searchedAt: Date.now()
    });
    
    // Trim to max
    if (searches.length > this.maxItems) {
      searches = searches.slice(0, this.maxItems);
    }
    
    return this.storage.set(this.key, searches);
  }
  
  /**
   * Removes a search
   * @param {string} itemId - Item ID
   * @returns {boolean} Success status
   */
  remove(itemId) {
    const searches = this.get().filter(s => s.id !== itemId);
    return this.storage.set(this.key, searches);
  }
  
  /**
   * Clears recent searches
   * @returns {boolean} Success status
   */
  clear() {
    return this.storage.set(this.key, []);
  }
}

// ============================================================
// CACHE MANAGER
// ============================================================

/**
 * Cache manager for API responses
 */
export class CacheManager {
  constructor(storage = new StorageManager()) {
    this.storage = storage;
  }
  
  /**
   * Gets cached data
   * @param {string} key - Cache key
   * @param {number} maxAge - Maximum age in milliseconds
   * @returns {*} Cached data or null
   */
  get(key, maxAge = 300000) { // Default 5 minutes
    const cached = this.storage.get(`cache_${key}`);
    
    if (!cached) return null;
    
    if (Date.now() - cached.cachedAt > maxAge) {
      this.storage.remove(`cache_${key}`);
      return null;
    }
    
    return cached.data;
  }
  
  /**
   * Sets cached data
   * @param {string} key - Cache key
   * @param {*} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds
   * @returns {boolean} Success status
   */
  set(key, data, ttl = 300000) {
    return this.storage.set(`cache_${key}`, {
      data,
      cachedAt: Date.now()
    }, { ttl });
  }
  
  /**
   * Invalidates cache entry
   * @param {string} key - Cache key
   * @returns {boolean} Success status
   */
  invalidate(key) {
    return this.storage.remove(`cache_${key}`);
  }
  
  /**
   * Invalidates cache by pattern
   * @param {string} pattern - Key pattern
   */
  invalidatePattern(pattern) {
    const keys = this.storage.keys();
    const regex = new RegExp(pattern);
    
    keys.forEach(key => {
      if (regex.test(key)) {
        this.storage.remove(key);
      }
    });
  }
  
  /**
   * Clears all cache
   * @returns {boolean} Success status
   */
  clearAll() {
    const keys = this.storage.keys().filter(k => k.startsWith('cache_'));
    keys.forEach(key => this.storage.remove(key));
    return true;
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Generates a unique ID
 * @returns {string} Unique ID
 */
const generateId = () => {
  return `${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Formats bytes to human readable
 * @param {number} bytes - Bytes
 * @returns {string} Formatted string
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Deep merges objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
const deepMerge = (target, source) => {
  const output = { ...target };
  
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  
  return output;
};

// ============================================================
// SINGLETON INSTANCES
// ============================================================

// Create singleton storage manager
const storage = new StorageManager();

// Export singleton instances
export const watchlist = new WatchlistManager(storage);
export const portfolio = new PortfolioManager(storage);
export const alerts = new AlertsManager(storage);
export const preferences = new PreferencesManager(storage);
export const recentSearches = new RecentSearchesManager(storage);
export const cache = new CacheManager(storage);

// ============================================================
// EXPORTS
// ============================================================

export { StorageManager };

export default {
  StorageManager,
  StorageKeys,
  WatchlistManager,
  PortfolioManager,
  AlertsManager,
  PreferencesManager,
  RecentSearchesManager,
  CacheManager,
  watchlist,
  portfolio,
  alerts,
  preferences,
  recentSearches,
  cache
};
