const app = require('./app');
const { seedDevUserIfNeeded } = require('./auth/devSeeder');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Fire-and-forget seeding for development/test
seedDevUserIfNeeded().catch((e) => {
  console.warn('Dev seeding encountered an error:', e?.message || e);
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = server;
