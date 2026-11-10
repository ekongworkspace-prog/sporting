import { rateLimit } from "express-rate-limit";

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
   // 🔥 FIX FOR VERCEL LOG ERROR: Tell express-rate-limit to use the proxy IP parsed by Express
  keyGenerator: (request) => request.ip || request.socket.remoteAddress || "unknown",
});
