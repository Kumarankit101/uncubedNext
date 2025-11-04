'use client';

import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import { ThemeInitializer } from "./components/ThemeInitializer";
import NextTopLoader from 'nextjs-toploader';

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <Providers>
        <NextTopLoader
          color="#F59E0B"
          initialPosition={0.2}
          crawlSpeed={300}
          speed={200}
          height={3}
          showSpinner={false}
          zIndex={1600}
          data-testid="route-top-loader"
        />
        <ThemeInitializer />
        {children}
      </Providers>
    </ClerkProvider>
  );
}
