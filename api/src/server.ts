import express from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import { toNodeHandler } from "better-auth/node";

import { connectDatabase } from "./config/db.js";
import { auth } from "./config/auth.js";
import { logger } from "./core/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiRateLimit } from "./middleware/rateLimit.js";

import { profileRoutes } from "./modules/profiles/profile.routes.js";
import { walletRoutes } from "./modules/wallets/wallet.routes.js";
import { clubRoutes } from "./modules/clubs/club.routes.js";
import { contractRoutes } from "./modules/contracts/contract.routes.js";
import {
  paymentRoutes,
  paymentWebhookRoutes,
} from "./modules/payments/payment.routes.js";
import { pitchRoutes } from "./modules/pitches/pitch.routes.js";
import { matchRoutes } from "./modules/matches/match.routes.js";
import { tournamentRoutes } from "./modules/tournaments/tournament.routes.js";
import { betRoutes } from "./modules/bets/bet.routes.js";
import { storeRoutes } from "./modules/store/store.routes.js";
import { env } from "./config/env.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "https://www.turfing.club",
      "https://turfing.club",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

// Better Auth before express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(pinoHttp({ logger }));

app.use("/api/payments", paymentWebhookRoutes);

app.use(express.json({ limit: "1mb" }));

app.use(apiRateLimit);

app.get("/", (_req, res) => {
  res.json({ name: "Football API", health: "/api/health" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
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

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, "Football API listening");
    });
  } catch (error) {
    logger.error(error, "Failed to start server");
    process.exit(1);
  }
};

void startServer();