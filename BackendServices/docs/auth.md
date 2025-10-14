# Authentication Module

This backend implements a simple email/password authentication flow using bcrypt for password hashing and JWT for access and refresh tokens.

## Endpoints

- POST /api/auth/signup
  - Body: { email, password, name? }
  - Creates a user with a hashed password. Prevents duplicate emails.
  - 201: { user }

- POST /api/auth/login
  - Body: { email, password }
  - 200: { accessToken, refreshToken, user }

- POST /api/auth/refresh
  - Body: { refreshToken }
  - 200: { accessToken, refreshToken } (refresh token rotates)

- POST /api/auth/logout
  - Body: { refreshToken }
  - 200: { success: true }
  - The refresh token is invalidated in-memory.

- GET /api/secure/health
  - Header: Authorization: Bearer <accessToken>
  - 200: { status: "ok", user: { id, email } }

## Security

- Access tokens:
  - Signed with JWT_SECRET
  - Expiry: TOKEN_EXPIRY (default 15m)

- Refresh tokens:
  - Signed with JWT_REFRESH_SECRET
  - Expiry: REFRESH_TOKEN_EXPIRY (default 7d)
  - Stored in-memory as an allow-list and rotated on refresh.

- Password hashing:
  - bcryptjs with 10 salt rounds.

## Environment

Create a `.env` file based on `.env.example`:

```
PORT=3001
HOST=0.0.0.0
JWT_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

## Notes

- User storage is implemented as a simple JSON file at `src/data/users.json` for demo purposes and can be replaced by a proper database later.
- Basic rate limiting is applied on `/signup` and `/login`.
- Input validation uses `express-validator`.
