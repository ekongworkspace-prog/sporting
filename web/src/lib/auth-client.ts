import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [emailOTPClient()], 
});
