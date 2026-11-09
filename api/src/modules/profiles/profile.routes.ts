import { Router } from "express";
import { z } from "zod";
import { createHash } from "node:crypto";
import { requireSession } from "../../middleware/auth.js";
import { requireProfileRole, requireRole } from "../../middleware/roleGuard.js";
import { env } from "../../config/env.js";
import { HttpError } from "../../core/errors.js";
import {
  coachCreateSchema,
  ownerCreateSchema,
  playerCreateSchema,
  profileTypeSchema,
  refereeCreateSchema,
} from "./profile.schema.js";
import { getProfile, upsertProfile, type ProfileType } from "./profile.service.js";
import { sendClubInvitation } from "../emails/emails.service.js";

export const profileRoutes = Router();

const schemas = {
  player: playerCreateSchema,
  coach: coachCreateSchema,
  referee: refereeCreateSchema,
  owner: ownerCreateSchema,
};

profileRoutes.get("/:type/me", requireSession, requireProfileRole, async (request, response, next) => {
 
  try {
    const type = profileTypeSchema.parse(request.params.type) as ProfileType;
    const profile = await getProfile(type, request.user!.id);
    response.json({ profile });
  } catch (error) {
    next(error);
  }
});

profileRoutes.put("/:type/me", requireSession, requireProfileRole, async (request, response, next) => {
  try {
    console.log("request: ", request.body)
    const type = profileTypeSchema.parse(request.params.type) as ProfileType;
    const result = schemas[type].safeParse(request.body);
    if (!result.success) {
      return next(new HttpError(400, "Invalid request", "VALIDATION_ERROR"));
    }

    const profile = await upsertProfile(type, request.user!.id, result.data);
    response.status(200).json({ success:true, profile });
  } catch (error) {
    next(error);
  }
});

profileRoutes.post("/club-invitations", requireSession, requireRole("owner", "admin"), async (request, response, next) => {
  try {
    const result = z.object({
      clubName: z.string().trim().min(2).max(100),
      ownerName: z.string().trim().min(2).max(100),
      emails: z.array(z.string().email()).min(1).max(50),
    }).safeParse(request.body);
    if (!result.success) {
      return next(new HttpError(400, "Invalid invitation request", "VALIDATION_ERROR"));
    }
    await Promise.all(result.data.emails.map((email) => sendClubInvitation({
      email,
      clubName: result.data.clubName,
      ownerName: result.data.ownerName,
    })));
    response.status(202).json({ invited: result.data.emails.length });
  } catch (error) {
    next(error);
  }
});

profileRoutes.post("/upload-signature", requireSession, (_request, response) => {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new HttpError(503, "Cloudinary is not configured", "CLOUDINARY_NOT_CONFIGURED");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "turfing/profile-pictures";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`)
    .digest("hex");

  response.json({
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    timestamp,
    folder,
    signature,
  });
});
