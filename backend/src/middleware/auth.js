const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate a cryptographically secure dynamic runtime secret if JWT_SECRET is unset in env
// This prevents attackers from forging tokens using public GitHub source fallbacks
const RUNTIME_FALLBACK_SECRET = crypto.randomBytes(64).toString('hex');
const JWT_SECRET = process.env.JWT_SECRET || RUNTIME_FALLBACK_SECRET;
const ADMIN_KEY = process.env.ADMIN_KEY ? process.env.ADMIN_KEY.trim() : null;

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('[Security Warning] JWT_SECRET is not configured in environment variables. Using dynamic runtime secret.');
}

/**
 * Constant-time string comparison to defend against timing attacks.
 * Hashing inputs to SHA-256 guarantees equal length buffers before comparison.
 */
function timingSafeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || !a || !b) return false;
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function requireAdmin(req, res, next) {
  // 1. Check for API admin key header (only allowed if ADMIN_KEY is explicitly configured)
  const adminKey = req.headers['x-admin-key'];
  if (adminKey && ADMIN_KEY && timingSafeCompare(adminKey, ADMIN_KEY)) {
    req.user = { role: 'admin', method: 'admin_key' };
    return next();
  }

  // 2. Check for Authorization Bearer JWT header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
      if (!decoded || decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Insufficient privileges.',
        });
      }
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired authorization token. Please log in again.',
      });
    }
  }

  // 3. Reject if no valid credentials provided
  return res.status(401).json({
    success: false,
    error: 'Access denied: Admin credentials or token required.',
  });
}

module.exports = {
  requireAdmin,
  JWT_SECRET,
  ADMIN_KEY,
  timingSafeCompare,
};

