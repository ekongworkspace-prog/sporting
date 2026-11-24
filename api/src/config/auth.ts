import { betterAuth } from "better-auth";
import { getOAuthState } from "better-auth/api";
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

   baseURL: env.BETTER_AUTH_URL,

  
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

 
  secret: env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    "https://www.turfing.club",
    "https://turfing.club",
  ],

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

      async sendVerificationOTP( { email, otp, type  },user) {
        await sendOtpEmail({
          email,
          otp,
          type,
          
        });
      },
    }),
  ],

  databaseHooks: {
    user: {
      create: {
         before: async (user, ctx) => {
          // Only run this logic during an OAuth callback
          if (!ctx || ctx.path !== "/callback/:id") {
            return;
          }

          const oauthState = await getOAuthState<{
            callbackURL?: string;
          }>();

          const callbackURL = oauthState?.callbackURL;

          // Only new users coming through the planner Google flow
          // should receive the PLANNER role.
          if (callbackURL?.includes("/dashboard/owner")) {
            return {
              data: {
                ...user,
                role: "OWNER",
              },
            };
          }
        },
      },
    },
  },

  user: {
    additionalFields: {
      role: {
        type: ["PLAYER", "COACH", "REFEREE", "ADMIN", "OWNER"],
        required: false,
        defaultValue: "PLAYER",
        input: true,
      },
    },
  },
});
