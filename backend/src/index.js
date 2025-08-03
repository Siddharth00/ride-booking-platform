import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import authMiddleware from "./middleware/auth.js";
import authRoutes from './routes/auth.js';
import tripsRoutes from "./routes/trips.js";

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ride Booking API is running!");
});

app.use('/auth', authRoutes);
app.use('/trips', tripsRoutes);

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: "You have access!", user: req.user });
})

// Simple health endpoint to verify server is up
app.get('/health', (req,res) => {
  res.json({ status: 'ok', uptime:
    process.uptime() // How long server has been running
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
