import logger from "../logger.js";

export default function errorHandler(err, req, res) {
  logger.error(`[Error] ${req.method} ${req.url}:`, err.stack || err);

  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
}
