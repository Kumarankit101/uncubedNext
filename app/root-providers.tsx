'use client';

import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import { ThemeInitializer } from "./components/ThemeInitializer";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <Providers>
        <ThemeInitializer />
        {children}
      </Providers>
    </ClerkProvider>
  );
}
