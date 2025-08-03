import express from 'express';
import pool from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/book', async (req, res) => {
  const { pickup, dropoff } = req.body;
  const userId = req.user.id;

  if (!pickup || !dropoff) {
    return res.status(400).json({ error: "Pickup and dropoff are required" });
  }

  try {
    const query = `
      INSERT INTO trips (user_id, pickup, dropoff, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING id, user_id, pickup, dropoff, status, created_at
    `;
    const values = [userId, pickup, dropoff];
    const result = await pool.query(query, values);
    res.json({ trip: result.rows[0] });
  } catch (err) {
    console.error("Error booking trip", err);
    res.status(500).json({ error: "Failed to book trip" });
  }
});

// List trips for logged-in user
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
