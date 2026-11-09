import type { ClientSession } from "mongoose";
import { HttpError } from "../../core/errors.js";
import { withTransaction } from "../../core/transactions.js";
import { PlayerProfileModel } from "../profiles/profile.model.js";
import { ClubModel } from "../clubs/club.model.js";
import { ContractModel } from "./contract.model.js";

export function contractsOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
) {
  return startA <= endB && startB <= endA;
}

export async function createActiveContract(input: {
  playerId: string;
  clubId: string;
  startDate: Date;
  endDate: Date;
}) {
  return withTransaction(async (session) => {
    const player = await PlayerProfileModel.findOne({ userId: input.playerId }).session(session);
    if (!player) throw new HttpError(404, "Player profile not found", "PLAYER_NOT_FOUND");

    const club = await ClubModel.findById(input.clubId).session(session);
    if (!club) throw new HttpError(404, "Club not found", "CLUB_NOT_FOUND");

    const existing = await ContractModel.find({
      playerId: input.playerId,
      status: "active",
    }).session(session);
    if (existing.some((contract) => contractsOverlap(
      input.startDate,
      input.endDate,
      contract.startDate,
      contract.endDate,
    ))) {
      throw new HttpError(409, "Player already has an active contract in this period", "CONTRACT_OVERLAP");
    }

    await ContractModel.updateMany(
      { playerId: input.playerId, status: "active" },
      { $set: { status: "ended" } },
      { session },
    );
    const created = await ContractModel.create([{
      ...input,
      status: "active",
    }], { session });

    player.club = club.name;
    player.contractLength = Math.max(0, Math.ceil(
      (input.endDate.getTime() - input.startDate.getTime()) / 86_400_000,
    ));
    await player.save({ session });
    return created[0];
  });
}

export async function endActiveContract(contractId: string, session: ClientSession) {
  const contract = await ContractModel.findById(contractId).session(session);
  if (!contract) throw new HttpError(404, "Contract not found", "CONTRACT_NOT_FOUND");
  contract.status = "ended";
  await contract.save({ session });

  const hasActiveContract = await ContractModel.exists({
    playerId: contract.playerId,
    status: "active",
    _id: { $ne: contract._id },
  }).session(session);
  if (!hasActiveContract) {
    await PlayerProfileModel.updateOne(
      { userId: contract.playerId },
      { $set: { club: "", contractLength: 0 } },
      { session },
    );
  }
  return contract;
}
