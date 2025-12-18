// Centralized application routes and helpers

export const ROUTES = {
  HOME: "/",
  PRICING: "/pricing",
  BLOG: "/blog",
  FEATURES: "/features",
  COIN: "/coin/:coinId",
};

// Helpers for building concrete paths from patterns
export const buildCoinPath = (coinId) => `/coin/${coinId}`;
