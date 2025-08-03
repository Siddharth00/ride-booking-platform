import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import authMiddleware from "./middleware/auth.js";
import authRoutes from './routes/auth.js';
import tripsRoutes from "./routes/trips.js";
import { authRateLimiter } from "./rateLimiter.js";
import morgan from "morgan";
import { metrics } from "./metrics.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./logger.js";

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  metrics.totalRequests += 1;
  next();
});

app.get("/metrics", (req, res) => {
  res.json({
    totalRequests: metrics.totalRequests,
    uptime: process.uptime(),
  });
});

app.get("/", (req, res) => {
  res.send("Ride Booking API is running!");
});

app.use('/auth', authRateLimiter, authRoutes);
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

// Error handler must be last
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
})
