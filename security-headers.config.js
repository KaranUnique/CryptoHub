// Security headers configuration for production deployment
// Use these headers in your hosting platform (Vercel, Netlify, etc.)

export const securityHeaders = {
  // Content Security Policy - prevents XSS attacks
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.coingecko.com https://*.firebaseapp.com https://*.firebase.com; frame-ancestors 'none';",

  // Prevents clickjacking attacks
  "X-Frame-Options": "DENY",

  // Prevents MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Enables XSS protection in older browsers
  "X-XSS-Protection": "1; mode=block",

  // Referrer Policy
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Feature Policy (Permissions Policy)
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",

  // HSTS - forces HTTPS for 1 year
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

// For Vercel: Add to vercel.json in headers array
// For Netlify: Add to netlify.toml as custom headers
// For Firebase Hosting: Configure in firebase.json
