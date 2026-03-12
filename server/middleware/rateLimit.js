const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Please try again later',
    retryAfter: '15 minutes',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP as key, but handle proxies
    return req.ip || req.connection.remoteAddress;
  },
  handler: (req, res) => {
    console.warn(`🚨 Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again in 15 minutes.',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }
});

// Stricter limiter for verification endpoint
const verifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Even stricter for verification
  message: {
    error: 'Too many verification attempts',
    message: 'Please try again later',
    code: 'VERIFY_LIMIT_EXCEEDED'
  },
  keyGenerator: (req) => {
    // Use reference + IP to prevent brute force
    return `${req.ip}_${req.params.reference}`;
  }
});

// Very strict limiter for download endpoint
const downloadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // Max 10 downloads per day per IP
  message: {
    error: 'Too many download attempts',
    message: 'Daily download limit exceeded',
    code: 'DOWNLOAD_LIMIT_EXCEEDED'
  }
});

module.exports = {
  apiLimiter,
  verifyLimiter,
  downloadLimiter
};