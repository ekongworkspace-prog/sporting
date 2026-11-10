import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1),
  MONGODB_DATABASE: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  WEB_ORIGIN: z.string().url(),
  CLOUDINARY_CLOUD_NAME: z.string().default(""),
  CLOUDINARY_API_KEY: z.string().default(""),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  CLOUDINARY_API_SECRET: z.string().default(""),
  PAYSTACK_SECRET_KEY: z.string().default(""),
  PAYSTACK_CALLBACK_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  RESEND_API_KEY: z.string().default(""),
  RESEND_FROM_EMAIL: z.string().default(""),
});

export const env = envSchema.parse(process.env);
