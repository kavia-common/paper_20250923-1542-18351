const fs = require('fs');
const path = require('path');

/**
 * Simple file-backed in-memory user store.
 * Users are stored as:
 * {
 *   id: string,
 *   email: string,
 *   name?: string,
 *   passwordHash: string,
 *   createdAt: string
 * }
 */

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// In-memory cache
let users = [];
let initialized = false;

/**
 * Ensure data directory and file exist.
 */
function init() {
  if (initialized) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf-8');
    }
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    users = JSON.parse(raw);
    if (!Array.isArray(users)) users = [];
    initialized = true;
  } catch (e) {
    // Fallback to memory only
    console.error('Failed to initialize user store, using in-memory only:', e.message);
    users = [];
    initialized = true;
  }
}

function persist() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to persist users to file:', e.message);
    // Non-fatal for demo purposes
  }
}

function toId(email) {
  // Simple deterministic id for demo; in real use UUIDv4
  return Buffer.from(email.toLowerCase()).toString('base64url');
}

// PUBLIC_INTERFACE
function createUser({ email, name, passwordHash }) {
  /** Create a user and persist. Throws on duplicate email. */
  init();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    const err = new Error('Email already registered');
    err.code = 'DUPLICATE_EMAIL';
    throw err;
  }
  const user = {
    id: toId(email),
    email,
    name: name || '',
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  persist();
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
}

// PUBLIC_INTERFACE
function findByEmail(email) {
  /** Find a user by email. Returns full user including passwordHash or null. */
  init();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// PUBLIC_INTERFACE
function findById(id) {
  /** Find a user by id. Returns user or null. */
  init();
  return users.find((u) => u.id === id) || null;
}

module.exports = {
  createUser,
  findByEmail,
  findById,
};
