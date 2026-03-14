const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs').promises;

// Load environment variables
dotenv.config();

// Import middleware
const { apiLimiter } = require('./middleware/rateLimit');

// Import routes
const verifyRoutes = require('./routes/verify');
const webhookRoutes = require('./routes/webhook');
const feedbackRoutes = require('./routes/feedback');
const downloadRoutes = require('./routes/download');

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
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.paystack.co", "https://www.googletagmanager.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https://api.paystack.co", "https://www.google-analytics.com", "https://analytics.google.com"],
    },
  },
}));

// Compression
app.use(compression());

// ===== CORS CONFIGURATION - FIXED FOR TRAILING SLASH =====
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://eidcards-io.vercel.app',
  'https://www.eidcards-io.vercel.app',
  'https://eidcards-io.vercel.app/',  // Include with trailing slash
  'https://www.eidcards-io.vercel.app/',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://127.0.0.1:5173',
  'https://eidcards-client.vercel.app'
].filter(Boolean);

// Custom CORS middleware to handle trailing slash issue
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin) {
    // Normalize both by removing trailing slash for comparison
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    
    // Check if normalized origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      const normalizedAllowed = allowed.endsWith('/') ? allowed.slice(0, -1) : allowed;
      return normalizedAllowed === normalizedOrigin;
    });
    
    if (isAllowed) {
      // Set the exact origin that came in (not normalized)
      res.header('Access-Control-Allow-Origin', origin);
    }
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Keep cors middleware as backup but configure it to be permissive
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, allow all these origins
    if (!origin) return callback(null, true);
    
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    const isAllowed = allowedOrigins.some(allowed => {
      const normalizedAllowed = allowed.endsWith('/') ? allowed.slice(0, -1) : allowed;
      return normalizedAllowed === normalizedOrigin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('🚫 Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Handle OPTIONS requests for CORS preflight
app.options('*', cors(corsOptions));

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
  // Only allow access to specific file types
  if (!req.path.match(/\.(png|jpg|jpeg|gif|svg|pdf|html)$/)) {
    return res.status(403).json({ error: 'Forbidden file type' });
  }
  next();
}, express.static(path.join(__dirname, 'temp'), {
  maxAge: '1h',
  immutable: true,
  setHeaders: (res, filepath) => {
    // Set proper content types
    if (filepath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (filepath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filepath.endsWith('.jpg') || filepath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filepath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (filepath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    }
    
    // Force download for certain files
    if (filepath.endsWith('.pdf')) {
      res.setHeader('Content-Disposition', 'attachment');
    }
  }
}));

// ===== ROUTES =====
app.use('/api', verifyRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', downloadRoutes);
app.use('/webhook', webhookRoutes);

// Health check endpoint
app.get('/health', healthCheck);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'EidCards.io API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    frontend: 'https://eidcards-io.vercel.app',
    endpoints: {
      health: 'GET /health',
      verify: 'GET /api/verify/:reference',
      feedback: 'POST /api/feedback',
      download: 'GET /temp/:filename',
      regenerate: 'POST /api/regenerate/:reference',
      formats: 'GET /api/formats/:reference',
      webhook: 'POST /webhook/paystack'
    }
  });
});

// ===== ERROR HANDLING =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    code: 'NOT_FOUND',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(500).json({ 
    error: 'Internal server error',
    code: 'SERVER_ERROR',
    message: message
  });
});

// ===== CREATE TEMP DIRECTORY IF NOT EXISTS =====
const ensureTempDir = async () => {
  const tempDir = path.join(__dirname, 'temp');
  try {
    await fs.access(tempDir);
  } catch {
    await fs.mkdir(tempDir, { recursive: true });
    console.log('✅ Created temp directory');
  }
};

// ===== CLEANUP JOB =====
// Run cleanup every hour
setInterval(async () => {
  try {
    await cleanupOldFiles();
    console.log('🧹 Cleaned up old files');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}, 60 * 60 * 1000);

// ===== START SERVER =====
const startServer = async (port) => {
  try {
    // Ensure temp directory exists
    await ensureTempDir();
    
    const server = app.listen(port)
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying ${port + 1}...`);
          startServer(port + 1);
        } else {
          console.error('Server error:', err);
          process.exit(1);
        }
      })
      .on('listening', () => {
        const address = server.address();
        console.log(`
  🚀 ================================== 🚀
        EidCards.io Backend Server
  🚀 ================================== 🚀
  
  📡 Server: http://localhost:${address.port}
  🔒 Environment: ${process.env.NODE_ENV || 'development'}
  🌐 Frontend: https://eidcards-io.vercel.app
  🌐 CORS enabled for: ${allowedOrigins.length} origins
  ⏱️  Rate limiting: Active on /api routes
  🔓 Webhooks: No rate limiting
  📁 Temp directory: ${path.join(__dirname, 'temp')}
  
  📊 Available Endpoints:
     • GET  /                      - API info
     • GET  /health                 - Server health
     • GET  /api/verify/:ref        - Verify payment
     • POST /api/feedback           - Submit feedback
     • POST /api/regenerate/:ref    - Regenerate card
     • GET  /api/formats/:ref       - Check available formats
     • POST /webhook/paystack       - Paystack webhook
     • GET  /temp/:file             - Download cards
  
  🚀 ================================== 🚀
        `);
      });
      
    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

const PORT = parseInt(process.env.PORT) || 5001;
startServer(PORT);

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;