import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "@/lib/email";
import type { SessionUser } from "@/types/auth";
import type { Role } from "@prisma/client";

function getSocialProviders() {
  const providers: Record<string, { clientId: string; clientSecret: string }> = {};

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    };
  }

  return providers;
}

const emailConfigured = Boolean(
  process.env.RESEND_API_KEY &&
    !process.env.RESEND_API_KEY.includes("your_api_key") &&
    process.env.RESEND_API_KEY.startsWith("re_"),
);

export const auth = betterAuth({
  appName: "UpSayansi News",
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
    // Without Resend configured, allow sign-in immediately so local/dev auth works.
    requireEmailVerification: emailConfigured,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: !emailConfigured,
    sendResetPassword: async ({ user, token }) => {
      if (!emailConfigured) return;
      await sendPasswordResetEmail(user.email, token);
    },
  },
  emailVerification: {
    sendOnSignUp: emailConfigured,
    sendOnSignIn: emailConfigured,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      if (!emailConfigured) return;
      await sendVerificationEmail(user.email, token);
    },
    afterEmailVerification: async (user) => {
      if (!emailConfigured) return;
      await sendWelcomeEmail(user.email, user.name);
    },
  },
  socialProviders: getSocialProviders(),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "READER",
        input: false,
      },
      banned: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      banReason: {
        type: "string",
        required: false,
        input: false,
      },
      banExpires: {
        type: "date",
        required: false,
        input: false,
      },
      verified: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;

export function mapSessionUser(
  user: AuthSession["user"] | null | undefined,
): SessionUser | null {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    role: (user.role as Role) ?? "READER",
    banned: Boolean(user.banned),
    banReason: (user.banReason as string | null | undefined) ?? null,
    verified: Boolean(user.verified),
  };
}

export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) return null;

    return {
      ...session,
      user: mapSessionUser(session.user),
    };
  } catch {
    // Auth depends on the database — return null when the DB is offline.
    return null;
  }
}

export async function requireServerSession() {
  const session = await getServerSession();

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  if (session.user.banned) {
    throw new Error("Account is banned");
  }

  return session;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession();
  return session?.user ?? null;
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await requireServerSession();

  if (!session.user) {
    throw new Error("Authentication required");
  }

  return session.user;
}
