const { verifyAccessToken } = require('./token.util');

// PUBLIC_INTERFACE
function verifyAccess(req, res, next) {
  /** Express middleware to verify Bearer access token and attach req.user. */
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub, email: decoded.email, token: decoded };
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = {
  verifyAccess,
};
