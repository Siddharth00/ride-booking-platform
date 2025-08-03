import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// Signup route
router.post('/signup', async (req,res,next) => {
  const { name, email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const query = `
     INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4) RETURNING id, name, email, role
    `;
    const values = [name, email, hashed, role || 'user'];

    const result = await pool.query(query, values);
    const user = result.rows[0];
    res.json({ user });
  } catch (error) {
    next(error); // Pass error to centralized errorHandler
  }
});

// Login route
router.post('/login', async (req,res,next) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    const user = result.rows[0];

    if(!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if(!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.json({ token })
    ;
  } catch (error) {
    next(error); // Pass error to centralized errorHandler
  }
});

export default router;
