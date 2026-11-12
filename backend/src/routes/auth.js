const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { requireAdmin, JWT_SECRET } = require('../middleware/auth');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@2906';

// POST /api/auth/login - Admin Login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both username and password.',
      });
    }

    if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin username or password.',
      });
    }

    // Sign JWT token valid for 7 days
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
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
    res.status(500).json({ success: false, error: err.message });
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

