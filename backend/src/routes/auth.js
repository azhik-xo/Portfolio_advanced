const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { requireAdmin, JWT_SECRET, timingSafeCompare } = require('../middleware/auth');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@2906';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

// ========================================================
// BRUTE-FORCE RATE LIMITER FOR ADMIN LOGIN
// Max 5 failed attempts per IP within 15 minutes
// ========================================================
const failedLoginMap = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

function checkLoginRateLimit(ip) {
  const now = Date.now();
  const entry = failedLoginMap.get(ip) || { failures: 0, lockedUntil: 0 };

  if (entry.lockedUntil > now) {
    const minutesLeft = Math.ceil((entry.lockedUntil - now) / 60000);
    return {
      allowed: false,
      message: `Account temporarily locked due to excessive failed attempts. Please try again in ${minutesLeft} minute(s).`,
    };
  }

  return { allowed: true };
}

function recordFailedLogin(ip) {
  const now = Date.now();
  const entry = failedLoginMap.get(ip) || { failures: 0, lockedUntil: 0 };
  entry.failures++;

  if (entry.failures >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOGIN_WINDOW_MS;
    console.warn(`[Security Alert] IP ${ip} exceeded maximum failed login attempts. Temporarily locked for 15 minutes.`);
  }

  failedLoginMap.set(ip, entry);
}

function resetFailedLogin(ip) {
  failedLoginMap.delete(ip);
}

// Clean up stale lockouts every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of failedLoginMap.entries()) {
    if (now > entry.lockedUntil && entry.failures === 0) {
      failedLoginMap.delete(ip);
    }
  }
}, 30 * 60 * 1000);

// POST /api/auth/login - Admin Login with brute force defense & constant-time validation
router.post('/login', (req, res) => {
  try {
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      'unknown';

    // 1. Check brute force lockout
    const rateCheck = checkLoginRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: rateCheck.message,
      });
    }

    const { username, password } = req.body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide both username and password as valid strings.',
      });
    }

    // 2. Validate username in constant time
    const usernameMatch = timingSafeCompare(username.trim(), ADMIN_USERNAME);

    // 3. Validate password (supports bcrypt hash if provided, otherwise constant-time string comparison)
    let passwordMatch = false;
    if (ADMIN_PASSWORD_HASH) {
      passwordMatch = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
    } else if (ADMIN_PASSWORD) {
      passwordMatch = timingSafeCompare(password, ADMIN_PASSWORD);
    }

    if (!usernameMatch || !passwordMatch) {
      recordFailedLogin(clientIp);
      return res.status(401).json({
        success: false,
        error: 'Invalid admin username or password.',
      });
    }

    // Reset failed login counter on success
    resetFailedLogin(clientIp);

    // Sign JWT token valid for 24 hours (least privilege lifetime)
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h', algorithm: 'HS256' }
    );

    res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        username: ADMIN_USERNAME,
        role: 'admin',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Authentication service error' });
  }
});

// GET /api/auth/me - Verify current session
router.get('/me', requireAdmin, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;

