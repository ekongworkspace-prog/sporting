import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { env } from "./env.js";
import { emailOTP } from "better-auth/plugins";
import { sendOtpEmail } from "../modules/emails/emails.service.js";
import { mongoClient } from "./db.js";

const database = mongoClient.db(env.MONGODB_DATABASE);

export const auth = betterAuth({
 database: mongodbAdapter(database, {
    client: mongoClient,
  }),
  
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  baseURL: env.BETTER_AUTH_URL,

  secret: env.BETTER_AUTH_SECRET,

  trustedOrigins: [env.WEB_ORIGIN],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
    emailVerification: {
    sendOnSignUp: true, // Triggers verification automatically on signUp.email
    autoSignInAfterVerification: true, // Logs user in right after verifyEmail succeeds
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,

      otpLength: 6,

      expiresIn: 300,

      allowedAttempts: 3,

      async sendVerificationOTP( { email, otp, type = "" },user) {
        await sendOtpEmail({
          email,
          otp,
          type,
          
        });
      },
    }),
  ],


  user: {
    additionalFields: {
      role: {
        type: ["PLAYER", "COACH", "REFEREE", "ADMIN", "OWNER"],
        required: false,
        defaultValue: "PLAYER",
        input: false,
      },
    },
  },
});
