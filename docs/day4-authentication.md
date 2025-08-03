# Day 4: Setup Authentication

Step 1: Install Required Packages (inside backend/)
npm install bcrypt jsonwebtoken cors

Step 2: Update .env
Open backend/.env and add:

---

JWT_SECRET=supersecretkey123
JWT_EXPIRES_IN=1h

---

Step 3: Enable CORS
Edit backend/src/index.js:

---

import cors from "cors";
app.use(cors());

---

Step 4: Create routes/auth.js
Add signup and login routes:

- POST /auth/signup (create user)
- POST /auth/login (verify password and return JWT)
  Step 5: Middleware
  Create backend/src/middleware/auth.js:
- Verify JWT from Authorization header
- Attach decoded user info to req.user
  Step 6: Use middleware in index.js
  Add:

---

import authMiddleware from "./middleware/auth.js";
app.get("/protected", authMiddleware, (req, res) => {
res.json({ message: "You have access!", user: req.user });
});

---

Step 7: Test with Postman

1. POST /auth/signup
   {
   "name": "Alice",
   "email": "alice@example.com",
   "password": "mypassword"
   }
2. POST /auth/login
   {
   "email": "alice@example.com",
   "password": "mypassword"
   }
   -> Copy the token from response
3. GET /protected
   Add header:
   Authorization: Bearer <your-token>
   Expected Response:
   {
   "message": "You have access!",
   "user": {
   "id": 1,
   "email": "alice@example.com",
   "role": "user",
   "iat": 1720000000,
   "exp": 1720003600
   }
   }
   Notes:

- /health route is public
- /protected requires a valid JWT
