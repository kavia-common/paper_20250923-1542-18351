#!/usr/bin/env node
/**
 * Development-only seeding script to create a demo user:
 *   username: testuser
 *   password: Test@1234
 *
 * - Uses the existing file-backed user store (src/auth/userStore.js)
 * - Hashes password with bcryptjs
 * - Guarded to avoid running in production
 *
 * Usage:
 *   NODE_ENV=development node scripts/seed-dev-user.js
 *   or via npm script: npm run seed:dev
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');

// Use the same store used by the app
const { findByEmail, createUser } = require('../src/auth/userStore');

async function main() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  if (nodeEnv === 'production') {
    console.error('Seeding is disabled in production. Aborting.');
    process.exit(1);
  }

  // Ensure data dir exists for the file store before requiring it (handled inside userStore too)
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch (e) {
    // Non-fatal, userStore will fallback to memory
    console.warn('Could not ensure data dir, continuing with userStore fallback...', e.message);
  }

  // For compatibility with existing login (email-based), map "username" to an email form.
  const email = process.env.SEED_USER_EMAIL || 'testuser@example.com';
  const name = process.env.SEED_USER_NAME || 'Test User';
  const password = process.env.SEED_USER_PASSWORD || 'Test@1234';

  const existing = findByEmail(email);
  if (existing) {
    console.log(`Seed user already exists: ${email}`);
    process.exit(0);
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  try {
    const user = createUser({ email, name, passwordHash });
    console.log('Seed user created:', { id: user.id, email: user.email, name: user.name });
    process.exit(0);
  } catch (e) {
    if (e && e.code === 'DUPLICATE_EMAIL') {
      console.log('Seed user already present.');
      process.exit(0);
    }
    console.error('Failed to create seed user:', e);
    process.exit(1);
  }
}

main();
