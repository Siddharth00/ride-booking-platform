import express from 'express';
import pool from '../db.js';
import authMiddleware from '../middleware/auth.js';
import redis from "../redisClient.js";


const router = express.Router();

router.use(authMiddleware);

router.post('/book', async (req, res,next) => {
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
    next(err); // Pass error to centralized errorHandler
  }
});

// List trips for logged-in user
router.get("/list", async (req, res,next) => {
  const userId = req.user.id;
  const forceRefresh = req.query.forceRefresh === "true";
  const cacheKey = `trips:${userId}`;

  try {
    if (!forceRefresh) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.json({ trips: JSON.parse(cached), source: "cache" });
      }
    }

    const result = await pool.query(
      "SELECT id, pickup, dropoff, status, created_at FROM trips WHERE user_id=$1 ORDER BY created_at DESC",
      [userId]
    );

    await redis.setex(cacheKey, 60, JSON.stringify(result.rows)); // cache for 60 seconds
    res.json({ trips: result.rows, source: "db" });
  } catch (err) {
    next(err); // Pass error to centralized errorHandler
  }
});

export default router;
