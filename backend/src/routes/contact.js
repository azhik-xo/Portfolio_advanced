const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { getDBStatus } = require('../config/db');

// In-memory fallback storage if MongoDB is not currently running
const fallbackMessages = [];

// Lightweight in-memory rate limiter per IP (prevents spam and DDoS)
const ipRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = ipRateMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + RATE_LIMIT_WINDOW_MS;
    ipRateMap.set(ip, entry);
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count++;
  ipRateMap.set(ip, entry);
  return true;
}

// Clean up stale rate limit entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipRateMap.entries()) {
    if (now > entry.resetTime) ipRateMap.delete(ip);
  }
}, 30 * 60 * 1000);

// Basic HTML sanitization to prevent XSS attacks
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// POST /api/contact - Submit a new inquiry
router.post('/', async (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || req.ip || 'unknown';

    // 1. Rate limiting check
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'Too many submissions from this connection. Please try again after 15 minutes.',
      });
    }

    const { name, email, service, budget, timeline, clientType, message } = req.body;

    // 2. Strict type check (prevents NoSQL query injection via object payload)
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format. Name, email, and message must be text.',
      });
    }

    // 3. Length validation (prevents buffer and memory exhaustion DoS)
    if (name.length > 80 || email.length > 120 || message.length > 3000) {
      return res.status(400).json({
        success: false,
        error: 'Field length exceeds maximum limit (Name: 80 chars, Email: 120 chars, Message: 3000 chars).',
      });
    }

    const trimmedName = sanitizeString(name);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = sanitizeString(message);

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and a message description.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.',
      });
    }

    const payload = {
      name: trimmedName,
      email: trimmedEmail,
      service: sanitizeString(service || 'Web Development').slice(0, 80),
      budget: sanitizeString(budget || 'Flexible').slice(0, 80),
      timeline: sanitizeString(timeline || 'Ready to start').slice(0, 80),
      clientType: sanitizeString(clientType || 'Direct Client').slice(0, 80),
      message: trimmedMessage,
      ip: clientIp,
      createdAt: new Date(),
    };

    let savedMessage = null;

    if (getDBStatus()) {
      savedMessage = await Message.create(payload);
      console.log(`[Contact API] Saved secure message to MongoDB from ${payload.name} (${payload.email})`);
    } else {
      payload._id = 'mem_' + Date.now();
      fallbackMessages.unshift(payload);
      savedMessage = payload;
      console.log(`[Contact API] Saved message to memory fallback from ${payload.name} (${payload.email})`);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out, Ashik will reply within 5 hours.',
      data: {
        id: savedMessage._id,
        name: savedMessage.name,
        service: savedMessage.service,
        createdAt: savedMessage.createdAt,
      },
    });
  } catch (err) {
    console.error('[Contact API] Error handling contact form submission:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process inquiry. Please try again or reach out directly.',
    });
  }
});

// GET /api/contact - List recent inquiries (Protected: requires admin secret or development mode)
router.get('/', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
    const expectedKey = process.env.ADMIN_SECRET || 'dev_secret_preview';

    // Prevent open public scraping of private visitor email submissions
    if (process.env.NODE_ENV === 'production' && (!adminKey || adminKey !== expectedKey)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Admin credentials required to view inquiries.',
      });
    }

    if (getDBStatus()) {
      const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
      return res.json({ success: true, count: messages.length, data: messages });
    } else {
      return res.json({ success: true, count: fallbackMessages.length, data: fallbackMessages });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
