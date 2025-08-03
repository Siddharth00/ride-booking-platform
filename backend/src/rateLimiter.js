import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "./redisClient.js";

export const authRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { error: "Too many requests, please try again later." },
});
