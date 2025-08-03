import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

// Define log format
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
  return `[${timestamp}] ${level}: ${message} ${metaString}`;
});

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
    // File transport (useful in prod)
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

export default logger;
