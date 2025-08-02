import pool from "./db.js";

async function init() {
  const client = await pool.connect();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password_hash TEXT,
        role VARCHAR(50)
      );
    `);

    // Drivers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS drivers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        license_number VARCHAR(50)
      );
    `);

    // Trips table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        driver_id INT REFERENCES drivers(id),
        pickup VARCHAR(255),
        dropoff VARCHAR(255),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database tables initialized");
  } finally {
    client.release();
  }
  process.exit();
}

init();
