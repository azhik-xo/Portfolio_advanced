const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ashik_portfolio_jwt_secret_dev_2026';
const ADMIN_KEY = process.env.ADMIN_KEY || 'ashik_secret_admin_key_2026';

function requireAdmin(req, res, next) {
  // 1. Check for API admin key header
  const adminKey = req.headers['x-admin-key'];
  if (adminKey && adminKey === ADMIN_KEY) {
    req.user = { role: 'admin', method: 'admin_key' };
    return next();
  }

  // 2. Check for Authorization Bearer JWT header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
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
};

