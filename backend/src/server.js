const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, getDBStatus } = require('./config/db');
const contactRoutes = require('./routes/contact');
const portfolioRoutes = require('./routes/portfolio');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Disable Express fingerprinting
app.disable('x-powered-by');

// Security: Enforce secure HTTP response headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Connect to MongoDB Atlas
connectDB();

// Middleware: Robust CORS policy supporting Vercel, localhost, and custom domains
const configuredClientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedStaticOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'https://abdulashiksre.vercel.app',
  ...configuredClientUrls,
];

const corsOptions = {
  origin: (origin, callback) => {
    // 1. Allow requests with no origin (curl, server-to-server, SSR, mobile, Next.js rewrite proxy)
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.replace(/\/+$/, '');

    // 2. Allow explicitly listed static origins
    if (allowedStaticOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // 3. Allow all Vercel deployments (production, staging, branch previews)
    if (/^https:\/\/([a-z0-9-]+\.)*vercel\.app$/i.test(cleanOrigin)) {
      return callback(null, true);
    }

    // 4. Allow all Render deployments (*.onrender.com)
    if (/^https:\/\/([a-z0-9-]+\.)*onrender\.com$/i.test(cleanOrigin)) {
      return callback(null, true);
    }

    // 5. In development or local IP addresses
    if (
      process.env.NODE_ENV !== 'production' ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }

    // 6. In production, reject unverified foreign origins
    if (process.env.NODE_ENV === 'production') {
      return callback(new Error(`CORS policy: origin ${cleanOrigin} is not authorized`));
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security: Payload size limits to mitigate Denial of Service (DoS) memory floods
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Request logger (in development or diagnostic)
app.use((req, res, next) => {
  console.log(`[API ${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    mongodb: getDBStatus() ? 'connected' : 'disconnected (in-memory mode)',
    service: "Ashik's Portfolio Backend API",
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/portfolio', portfolioRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler (OWASP A05: Information Disclosure Defense)
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  const isProd = process.env.NODE_ENV === 'production';
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: isProd && status === 500 ? 'An unexpected internal server error occurred.' : (err.message || 'Internal Server Error'),
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  Ashik Portfolio Backend Server         `);
  console.log(`  Port: http://localhost:${PORT}          `);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
