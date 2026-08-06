import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const authPlugins = [
  inferAdditionalFields({
    user: {
      role: { type: "string", input: false },
      banned: { type: "boolean", input: false },
      banReason: { type: "string", input: false },
      banExpires: { type: "date", input: false },
      verified: { type: "boolean", input: false },
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

/** Defer client creation without re-wrapping Better Auth's internal proxies. */
function lazyNamespace<K extends keyof AuthClient>(key: K): AuthClient[K] {
  return new Proxy({} as AuthClient[K], {
    get(_target, prop) {
      const namespace = getAuthClient()[key];
      return namespace[prop as keyof AuthClient[K]];
    },
  });
}

export const authClient = new Proxy({} as AuthClient, {
  get(_target, prop) {
    return getAuthClient()[prop as keyof AuthClient];
  },
});

export const signIn = lazyNamespace("signIn");
export const signUp = lazyNamespace("signUp");
export const signOut = lazyNamespace("signOut");
export const useSession: AuthClient["useSession"] = (...args) =>
  getAuthClient().useSession(...args);
export const getSession = lazyNamespace("getSession");
export const requestPasswordReset = lazyNamespace("requestPasswordReset");
export const resetPassword = lazyNamespace("resetPassword");
export const sendVerificationEmail = lazyNamespace("sendVerificationEmail");
