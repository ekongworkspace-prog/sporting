
import { rateLimit, ipKeyGenerator } from "express-rate-limit";

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  keyGenerator: (request) =>
    ipKeyGenerator(
      request.ip ?? request.socket.remoteAddress ?? "127.0.0.1",
    ),
});
