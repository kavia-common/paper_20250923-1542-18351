const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { findByEmail, createUser } = require('./userStore');

/**
 * Attempts to seed a development demo user if not present.
 * This is safe to call on startup; it is a no-op in production.
 */
async function seedDevUserIfNeeded() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  if (nodeEnv === 'production') return;

  try {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch {
    // Ignore, userStore will fallback to memory
  }

  const email = process.env.SEED_USER_EMAIL || 'testuser@example.com';
  const name = process.env.SEED_USER_NAME || 'Test User';
  const password = process.env.SEED_USER_PASSWORD || 'Test@1234';

  const existing = findByEmail(email);
  if (existing) {
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  try {
    createUser({ email, name, passwordHash: hash });
    // eslint-disable-next-line no-console
    console.log(`Dev seed user created: ${email}`);
  } catch (e) {
    if (e && e.code === 'DUPLICATE_EMAIL') {
      // Already present
      return;
    }
    // eslint-disable-next-line no-console
    console.warn('Dev seed user creation failed:', e.message || e);
  }
}

module.exports = {
  seedDevUserIfNeeded,
};
