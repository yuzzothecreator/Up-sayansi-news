import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "@/lib/auth";
import { absoluteUrl } from "@/lib/utils";

export const authClient = createAuthClient({
  baseURL: absoluteUrl(""),
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
} = authClient;
