const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import middleware
const { apiLimiter } = require('./middleware/rateLimit');
const feedbackRoutes = require('./routes/feedback');
// Import routes
const verifyRoutes = require('./routes/verify');
const webhookRoutes = require('./routes/webhook');

// Import controllers
const { healthCheck } = require('./controllers/cardController');

// Import utils
const { cleanupOldFiles } = require('./utils/cardGenerator');

const app = express();

// ===== SECURITY MIDDLEWARE =====

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression
app.use(compression());

// 🔴 CRITICAL: Strict CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Webhook needs raw body - apply BEFORE other middleware
app.use('/webhook', express.raw({ type: 'application/json' }));

// ===== RATE LIMITING =====
// Apply rate limiting to API routes ONLY (not webhooks)
app.use('/api', apiLimiter);

// ===== STATIC FILES =====
// Serve generated cards (with security)
app.use('/temp', (req, res, next) => {
  // Only allow access to PNG files
  if (!req.path.endsWith('.png')) {
    return res.status(403).send('Forbidden');
  }
  next();
}, express.static(path.join(__dirname, 'temp'), {
  maxAge: '1h',
  immutable: true
}));

// ===== ROUTES =====
app.use('/api', verifyRoutes);
app.use('/webhook', webhookRoutes);

// Health check
app.get('/health', healthCheck);

// ===== ERROR HANDLING =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    code: 'NOT_FOUND'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  
  res.status(500).json({ 
    error: 'Internal server error',
    code: 'SERVER_ERROR',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== CLEANUP JOB =====
// Run cleanup every hour
setInterval(async () => {
  try {
    await cleanupOldFiles();
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}, 60 * 60 * 1000);
app.use('/api', feedbackRoutes);
// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🚀 ================================== 🚀
        EidCards.io Backend Server
  🚀 ================================== 🚀
  
  📡 Server: http://localhost:${PORT}
  🔒 Environment: ${process.env.NODE_ENV || 'development'}
  🌐 CORS enabled for: ${process.env.FRONTEND_URL}
  ⏱️  Rate limiting: Active on /api routes
  🔓 Webhooks: No rate limiting
  
  📊 Endpoints:
     • GET  /health              - Server health
     • GET  /api/verify/:ref     - Verify payment
     • POST /webhook/paystack    - Paystack webhook
     • GET  /temp/:file          - Download cards
  
  🚀 ================================== 🚀
  `);
});