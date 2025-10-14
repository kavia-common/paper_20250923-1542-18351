const jwt = require('jsonwebtoken');

/**
 * Token utilities for signing and verifying JWTs.
 * Access tokens use JWT_SECRET and expire in TOKEN_EXPIRY (default 15m).
 * Refresh tokens use JWT_REFRESH_SECRET and expire in REFRESH_TOKEN_EXPIRY (default 7d).
 */

function getEnv(name, fallback) {
  const val = process.env[name];
  return val && val.trim().length ? val : fallback;
}

const ACCESS_SECRET = () => getEnv('JWT_SECRET', '');
const REFRESH_SECRET = () => getEnv('JWT_REFRESH_SECRET', '');
const ACCESS_EXPIRY = () => getEnv('TOKEN_EXPIRY', '15m');
const REFRESH_EXPIRY = () => getEnv('REFRESH_TOKEN_EXPIRY', '7d');

// PUBLIC_INTERFACE
function signAccessToken(payload) {
  /** Signs and returns an access token. */
  const secret = ACCESS_SECRET();
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.sign(payload, secret, { expiresIn: ACCESS_EXPIRY() });
}

// PUBLIC_INTERFACE
function verifyAccessToken(token) {
  /** Verifies an access token and returns payload. Throws on invalid. */
  const secret = ACCESS_SECRET();
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.verify(token, secret);
}

// PUBLIC_INTERFACE
function signRefreshToken(payload) {
  /** Signs and returns a refresh token. */
  const secret = REFRESH_SECRET();
  if (!secret) throw new Error('JWT_REFRESH_SECRET not configured');
  return jwt.sign(payload, secret, { expiresIn: REFRESH_EXPIRY() });
}

// PUBLIC_INTERFACE
function verifyRefreshToken(token) {
  /** Verifies a refresh token and returns payload. Throws on invalid. */
  const secret = REFRESH_SECRET();
  if (!secret) throw new Error('JWT_REFRESH_SECRET not configured');
  return jwt.verify(token, secret);
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
