# Day 5: Trip Booking APIs

Endpoints Added:

- POST /trips/book
- GET /trips/list
  Both routes are protected (require JWT in Authorization header).

1. Create routes/trips.js

---

import express from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();
router.use(authMiddleware);
// Book a new trip
router.post("/book", async (req, res) => {
const { pickup, dropoff } = req.body;
const userId = req.user.id;
if (!pickup || !dropoff) {
return res.status(400).json({ error: "Pickup and dropoff are required" });
}
try {
const query = `INSERT INTO trips (user_id, pickup, dropoff, status)
VALUES ($1, $2, $3, 'pending')
RETURNING id, user_id, pickup, dropoff, status, created_at`;
const result = await pool.query(query, [userId, pickup, dropoff]);
res.json({ trip: result.rows[0] });
} catch (err) {
console.error("Error booking trip", err);
res.status(500).json({ error: "Failed to book trip" });
}
});
// List trips
router.get("/list", async (req, res) => {
const userId = req.user.id;
try {
const result = await pool.query(
"SELECT id, pickup, dropoff, status, created_at FROM trips WHERE user_id=$1 ORDER BY created_at DESC",
[userId]
);
res.json({ trips: result.rows });
} catch (err) {
console.error("Error fetching trips", err);
res.status(500).json({ error: "Failed to fetch trips" });
}
});
export default router;

---

2. Register trips routes in src/index.js

---

import tripsRoutes from "./routes/trips.js";
app.use("/trips", tripsRoutes);

---

3. Test using Postman

---

POST /trips/book
Header:
Authorization: Bearer <JWT_TOKEN>
Body:
{
"pickup": "Indiranagar Metro Station",
"dropoff": "MG Road"
}
GET /trips/list
Header:
Authorization: Bearer <JWT_TOKEN>

---

Example Response (book):
{
"trip": {
"id": 1,
"user_id": 1,
"pickup": "Indiranagar Metro Station",
"dropoff": "MG Road",
"status": "pending",
"created_at": "2025-08-03T12:30:00.000Z"
}
}
Example Response (list):
{
"trips": [
{
"id": 1,
"pickup": "Indiranagar Metro Station",
"dropoff": "MG Road",
"status": "pending",
"created_at": "2025-08-03T12:30:00.000Z"
}
]
}
Concepts Learned:

- Protected routes with JWT
- Insert & query data using SQL with parameters
- User-specific data filtering
