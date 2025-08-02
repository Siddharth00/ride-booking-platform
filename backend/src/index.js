import express from "express";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();
const PORT = process.env.PORT || 4000;

// Simple health endpoint to verify server is up
app.get('/health', (req,res) => {
  res.json({ status: 'ok', uptime:
    process.uptime() // How long server has been running
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
