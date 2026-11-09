import { Router } from "express";
import { asyncHandler } from "../../core/http.js";
import { requireSession } from "../../middleware/auth.js";
import { HttpError } from "../../core/errors.js";
import { ContractModel } from "./contract.model.js";
import { createContractSchema } from "./contract.schema.js";
import { requireClubOwner } from "../clubs/club.service.js";
import { createActiveContract, endActiveContract } from "./contract.service.js";
import { requireRole } from "../../middleware/roleGuard.js";
import { withTransaction } from "../../core/transactions.js";

export const contractRoutes = Router();

contractRoutes.get("/player/:playerId", asyncHandler(async (request, response) => {
  const contracts = await ContractModel.find({ playerId: request.params.playerId }).sort({ startDate: -1 }).lean();
  response.json({ contracts });
}));

contractRoutes.post("/", requireSession, requireRole("coach", "admin"), asyncHandler(async (request, response) => {
  const result = createContractSchema.safeParse(request.body);
  if (!result.success) throw new HttpError(400, "Invalid request", "VALIDATION_ERROR");
  await requireClubOwner(result.data.clubId, request.user!.id, request.user!.roles);
  const contract = await createActiveContract(result.data);
  response.status(201).json({ contract });
}));

contractRoutes.post("/:contractId/end", requireSession, requireRole("coach", "admin"), asyncHandler(async (request, response) => {
  const contractId = Array.isArray(request.params.contractId) ? request.params.contractId[0] : request.params.contractId;
  const contract = await ContractModel.findById(contractId).lean();
  if (!contract) throw new HttpError(404, "Contract not found", "CONTRACT_NOT_FOUND");
  await requireClubOwner(contract.clubId.toString(), request.user!.id, request.user!.roles);

  const ended = await withTransaction((session) => endActiveContract(contractId, session));
  response.json({ contract: ended });
}));
