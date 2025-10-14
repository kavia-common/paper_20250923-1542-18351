const bcrypt = require('bcryptjs');
const { createUser, findByEmail } = require('./userStore');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('./token.util');

// In-memory store of valid refresh tokens per user id for demo purposes
// Map<userId, Set<refreshToken>>
const refreshStore = new Map();

function rememberRefreshToken(userId, token) {
  if (!refreshStore.has(userId)) {
    refreshStore.set(userId, new Set());
  }
  refreshStore.get(userId).add(token);
}

function forgetRefreshToken(userId, token) {
  if (!refreshStore.has(userId)) return;
  const set = refreshStore.get(userId);
  set.delete(token);
  if (set.size === 0) {
    refreshStore.delete(userId);
  }
}

function isRefreshTokenActive(userId, token) {
  if (!refreshStore.has(userId)) return false;
  return refreshStore.get(userId).has(token);
}

// PUBLIC_INTERFACE
async function signup({ email, password, name }) {
  /** Registers a new user with hashed password. */
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = createUser({ email, name, passwordHash });
  return user;
}

// PUBLIC_INTERFACE
async function login({ email, password }) {
  /** Validates credentials and returns access + refresh tokens. */
  const user = findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.code = 'INVALID_LOGIN';
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.code = 'INVALID_LOGIN';
    err.status = 401;
    throw err;
  }
  const payload = { sub: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  rememberRefreshToken(user.id, refreshToken);
  return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name } };
}

// PUBLIC_INTERFACE
async function refresh({ refreshToken }) {
  /** Verifies refresh token and returns new access token (and new refresh). */
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (e) {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }
  const userId = decoded.sub;
  if (!isRefreshTokenActive(userId, refreshToken)) {
    const err = new Error('Refresh token revoked');
    err.status = 401;
    throw err;
  }
  const payload = { sub: userId, email: decoded.email };
  const newAccessToken = signAccessToken(payload);
  // Optionally rotate refresh token
  const newRefreshToken = signRefreshToken(payload);
  // Revoke old and store new
  forgetRefreshToken(userId, refreshToken);
  rememberRefreshToken(userId, newRefreshToken);
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

// PUBLIC_INTERFACE
async function logout({ refreshToken }) {
  /** Revokes a given refresh token. */
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    // If invalid, treat as already logged out
    return { success: true };
  }
  forgetRefreshToken(decoded.sub, refreshToken);
  return { success: true };
}

module.exports = {
  signup,
  login,
  refresh,
  logout,
};
