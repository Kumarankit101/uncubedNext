'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useMemo } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useMemo(
    () => [
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache configuration
            staleTime: 1000 * 60 * 5, // 5 minutes - data considered fresh
            gcTime: 1000 * 60 * 30, // 30 minutes - keep in memory (increased from 10m)

            // Network configuration
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors (client errors)
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              // Retry up to 2 times for 5xx or network errors
              return failureCount < 2;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff

            // Refetch configuration
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnReconnect: true, // Refetch on reconnect
            refetchOnMount: true, // Refetch on component mount if stale

            // Deduplication
            networkMode: 'online', // Only fetch when online
          },
          mutations: {
            // Mutation configuration
            retry: 0, // Don't retry mutations by default
            networkMode: 'online',
          },
        },
      }),
    ],
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
