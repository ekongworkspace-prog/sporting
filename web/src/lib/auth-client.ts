import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

const baseURL = "https://sporting-puce.vercel.app";

export const authClient = createAuthClient({
  baseURL,

  plugins: [emailOTPClient()], 
});
