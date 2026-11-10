import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://sporting-puce.vercel.app/"}/api/auth`,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [emailOTPClient()], 
});
