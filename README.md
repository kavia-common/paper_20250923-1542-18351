# paper_20250923-1542-18351

BackendServices: Development seed user
- To create the demo user: `cd BackendServices && npm run seed:dev`
- Credentials: testuser@example.com / Test@1234
- Login: POST /api/auth/login with { "email": "testuser@example.com", "password": "Test@1234" }
- See BackendServices/SEEDING.md for details.