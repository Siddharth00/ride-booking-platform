import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || "rideuser",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ride_booking_dev",
  password: process.env.DB_PASS || "ridepass",
  port: process.env.DB_PORT || 5432,
});

export default pool;
