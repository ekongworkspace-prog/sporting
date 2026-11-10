import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${process.env.API_PROXY_ORIGIN ?? "http://localhost:3000"}/api/auth`,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [emailOTPClient()], 
});
