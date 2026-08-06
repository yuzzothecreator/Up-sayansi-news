import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const authPlugins = [
  inferAdditionalFields({
    user: {
      role: { type: "string" },
      banned: { type: "boolean" },
      banReason: { type: "string" },
      banExpires: { type: "date" },
      verified: { type: "boolean" },
    },
  }),
];

/** Type-only client so plugin fields (role, etc.) infer on session types. */
const authClientForTypes = createAuthClient({
  baseURL: "http://placeholder",
  plugins: authPlugins,
});
type AuthClient = typeof authClientForTypes;

function serverAuthBaseURL() {
  return (
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}

let browserClient: AuthClient | undefined;
let serverClient: AuthClient | undefined;

/** Lazily create the client so browser auth always uses window.location.origin. */
function getAuthClient(): AuthClient {
  if (typeof window !== "undefined") {
    browserClient ??= createAuthClient({
      baseURL: window.location.origin,
      plugins: authPlugins,
    }) as AuthClient;
    return browserClient;
  }

  serverClient ??= createAuthClient({
    baseURL: serverAuthBaseURL(),
    plugins: authPlugins,
  }) as AuthClient;
  return serverClient;
}

function lazyAuthExport<K extends keyof AuthClient>(key: K): AuthClient[K] {
  return new Proxy({} as AuthClient[K], {
    get(_target, prop) {
      const namespace = getAuthClient()[key];
      const value = (namespace as Record<string | symbol, unknown>)[prop];
      if (typeof value === "function") {
        return (...args: unknown[]) => value.apply(namespace, args);
      }
      return value;
    },
  });
}

export const authClient = new Proxy({} as AuthClient, {
  get(_target, prop) {
    const client = getAuthClient();
    const value = client[prop as keyof AuthClient];
    if (typeof value === "function") {
      return value.bind(client);
    }
    if (value !== null && typeof value === "object") {
      return lazyAuthExport(prop as keyof AuthClient);
    }
    return value;
  },
});

export const signIn = lazyAuthExport("signIn");
export const signUp = lazyAuthExport("signUp");
export const signOut = lazyAuthExport("signOut");
export const useSession: AuthClient["useSession"] = (...args) =>
  getAuthClient().useSession(...args);
export const getSession = lazyAuthExport("getSession");
export const requestPasswordReset = lazyAuthExport("requestPasswordReset");
export const resetPassword = lazyAuthExport("resetPassword");
export const sendVerificationEmail = lazyAuthExport("sendVerificationEmail");
