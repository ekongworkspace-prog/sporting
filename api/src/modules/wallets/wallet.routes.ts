import { Router } from "express";
import { requireSession } from "../../middleware/auth.js";
import { asyncHandler } from "../../core/http.js";
import { getLedgerEntries, getOrCreateWallet } from "./wallet.service.js";

export const walletRoutes = Router();

walletRoutes.get("/me", requireSession, asyncHandler(async (request, response) => {
  const wallet = await getOrCreateWallet(request.user!.id);
  response.json({ wallet });
}));

walletRoutes.get("/me/ledger", requireSession, asyncHandler(async (request, response) => {
  const entries = await getLedgerEntries(request.user!.id);
  response.json({ entries });
}));
