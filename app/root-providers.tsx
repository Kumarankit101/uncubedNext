'use client';

import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <Providers>
        {children}
      </Providers>
    </ClerkProvider>
  );
}
