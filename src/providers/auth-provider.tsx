"use client";

import * as React from "react";
import type { SessionUser } from "@/types/auth";

type AuthContextValue = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
  initialUser?: SessionUser | null;
};

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user] = React.useState<SessionUser | null>(initialUser);
  const [isLoading] = React.useState(false);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
