import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

let useLimiter = false;
let limiterInstance: ReturnType<typeof rateLimit>;

export function setLimiterOptions(
  durationInSeconds: number,
  maxRequests: number,
  customMessage = "Too many requests, please try again later.",
  customStatusCode = 429
) {
  useLimiter = true;

  limiterInstance = rateLimit({
    windowMs: durationInSeconds * 1000,
    max: maxRequests,
    statusCode: customStatusCode,
    message: customMessage,
    standardHeaders: true,
    legacyHeaders: false,
  });
}

export function getLimiterMiddleware() {
  return useLimiter ? limiterInstance : undefined;
}
