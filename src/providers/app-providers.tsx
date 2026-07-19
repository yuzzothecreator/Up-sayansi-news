"use client";

import { RegisterServiceWorker } from "@/components/pwa/register-sw";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import type { SessionUser } from "@/types/auth";

type AppProvidersProps = {
  children: React.ReactNode;
  initialUser?: SessionUser | null;
};

export function AppProviders({ children, initialUser }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider initialUser={initialUser}>
        <RegisterServiceWorker />
        {children}
        <Toaster richColors closeButton position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
