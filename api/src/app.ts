import express from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import { auth } from "./config/auth.js";
import { logger } from "./core/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiRateLimit } from "./middleware/rateLimit.js";
import { profileRoutes } from "./modules/profiles/profile.routes.js";
import { walletRoutes } from "./modules/wallets/wallet.routes.js";
import { clubRoutes } from "./modules/clubs/club.routes.js";
import { contractRoutes } from "./modules/contracts/contract.routes.js";
import { paymentRoutes, paymentWebhookRoutes } from "./modules/payments/payment.routes.js";
import { pitchRoutes } from "./modules/pitches/pitch.routes.js";
import { matchRoutes } from "./modules/matches/match.routes.js";
import { tournamentRoutes } from "./modules/tournaments/tournament.routes.js";
import { betRoutes } from "./modules/bets/bet.routes.js";
import { storeRoutes } from "./modules/store/store.routes.js";
import { env } from "./config/env.js";
export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: [env.FRONTEND_URL, "https://www.turfing.club"],
      credentials: true,
    }),
  );
  // 1. Core global middleware first (Logging & Parsing)
  app.use(pinoHttp({ logger }));
  app.use("/api/payments", paymentWebhookRoutes); // Keep webhook before JSON body parser if it needs raw bodies
  // 🔥 FIXED: Moved JSON parser up here so request.body is available for BetterAuth
  app.use(express.json({ limit: "1mb" }));
  app.use(apiRateLimit);
  // 2. BetterAuth Route Handler (Now request.body will be defined)
  app.all("/api/auth/*splat", async (request, response) => {
    const url = new URL(request.originalUrl, "https://www.turfing.club");
    const authRequest = new Request(url, {
      method: request.method,
      headers: new Headers(request.headers as Record<string, string>),
      body: ["GET", "HEAD"].includes(request.method) ? undefined : JSON.stringify(request.body),
    });
    return auth.handler(authRequest).then((authResponse) => {
      response.status(authResponse.status);
      authResponse.headers.forEach((value, key) => response.setHeader(key, value));
      return authResponse.arrayBuffer().then((body) => response.send(Buffer.from(body)));
    });
  });
  // 3. Regular Application Routes
  app.get("/", (_request, response) => {
    response.json({
      name: "Football API",
      health: "/api/health",
    });
  });
  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });
  app.get("/.well-known/appspecific/com.chrome.devtools.json", (_request, response) => {
    response.json({});
  });
  app.use("/api/profiles", profileRoutes);
  app.use("/api/wallets", walletRoutes);
  app.use("/api/clubs", clubRoutes);
  app.use("/api/contracts", contractRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/pitches", pitchRoutes);
  app.use("/api/matches", matchRoutes);
  app.use("/api/tournaments", tournamentRoutes);
  app.use("/api/bets", betRoutes);
  app.use("/api/store", storeRoutes);
  app.use(errorHandler);
  return app;
}
// 🔥 VERCEL COMPATIBILITY: Initialize and export the app instance as the default export
const app = createApp();
export default app;
