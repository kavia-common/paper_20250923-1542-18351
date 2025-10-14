# Development Seeding

This backend includes a development-only seeding mechanism to create a demo user for authentication workflow verification.

Seeded credentials:
- username: testuser
- password: Test@1234
- email used by API: testuser@example.com

Why email? The existing authentication API expects "email" for login. The seeding maps the username to an email form.

## How it works

- The seed script uses the existing file-backed store at `src/data/users.json`.
- Passwords are hashed with bcryptjs (10 rounds).
- Seeding is guarded to never run in production (NODE_ENV !== 'production').

## Running the seeder

- One-time manual run:
  - npm run seed:dev
- Automatic on server start (non-production):
  - The server will attempt to auto-seed on startup for development/test via `src/auth/devSeeder.js`.

Environment variables (optional):
- SEED_USER_EMAIL (default: testuser@example.com)
- SEED_USER_NAME (default: Test User)
- SEED_USER_PASSWORD (default: Test@1234)

## Logging in

Endpoint: POST /api/auth/login
Body:
{
  "email": "testuser@example.com",
  "password": "Test@1234"
}

Response:
{
  "accessToken": "<JWT>",
  "refreshToken": "<JWT>",
  "user": { "id": "...", "email": "testuser@example.com", "name": "Test User" }
}

Use the access token as:
Authorization: Bearer <accessToken>

You can verify the token with:
GET /api/secure/health

## Notes

- Do not use in production.
- Seeding uses simple JSON storage for demo and can be replaced with a database later.
