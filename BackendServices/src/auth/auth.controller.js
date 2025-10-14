const { validationResult } = require('express-validator');
const authService = require('./auth.service');

// PUBLIC_INTERFACE
async function handleSignup(req, res) {
  /** Handles POST /signup: validates input and registers a user. */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password, name } = req.body || {};
  try {
    const user = await authService.signup({ email, password, name });
    return res.status(201).json({ user });
  } catch (e) {
    if (e.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error('Signup error:', e);
    return res.status(500).json({ error: 'Failed to signup' });
  }
}

// PUBLIC_INTERFACE
async function handleLogin(req, res) {
  /** Handles POST /login: validates input and returns tokens. */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body || {};
  try {
    const result = await authService.login({ email, password });
    return res.status(200).json(result);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ error: e.message || 'Login failed' });
  }
}

// PUBLIC_INTERFACE
async function handleRefresh(req, res) {
  /** Handles POST /refresh: validates input and returns new tokens. */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { refreshToken } = req.body || {};
  try {
    const result = await authService.refresh({ refreshToken });
    return res.status(200).json(result);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ error: e.message || 'Refresh failed' });
  }
}

// PUBLIC_INTERFACE
async function handleLogout(req, res) {
  /** Handles POST /logout: invalidates refresh token. */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { refreshToken } = req.body || {};
  try {
    const result = await authService.logout({ refreshToken });
    return res.status(200).json(result);
  } catch (e) {
    console.error('Logout error:', e);
    return res.status(500).json({ error: 'Logout failed' });
  }
}

module.exports = {
  handleSignup,
  handleLogin,
  handleRefresh,
  handleLogout,
};
