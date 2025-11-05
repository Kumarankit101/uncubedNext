/**
 * Environment Variable Validation
 *
 * Validates required environment variables at build time and runtime.
 * Throws clear errors if required variables are missing or invalid.
 */

import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // Public variables (available in browser)
  NEXT_PUBLIC_API_URL: z.string().url().min(1, 'API URL is required'),
  NEXT_PUBLIC_SITE_URL: z.string().url().min(1, 'Site URL is required'),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'Clerk publishable key is required'),

  // Server-only variables
  CLERK_SECRET_KEY: z.string().min(1, 'Clerk secret key is required'),
  REVALIDATION_SECRET: z.string().min(1, 'Revalidation secret is required'),

  // Optional variables
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.literal('')),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_ENABLE_DEBUG: z.enum(['true', 'false']).optional(),
});

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables
 * @throws {Error} If validation fails with detailed error messages
 */
export function validateEnv(): Env {
  const env = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    REVALIDATION_SECRET: process.env.REVALIDATION_SECRET,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG,
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.format();
    const errorMessages = Object.entries(errors)
      .filter(([key]) => key !== '_errors')
      .map(([key, value]: [string, any]) => {
        const messages = value?._errors || [];
        return `  - ${key}: ${messages.join(', ')}`;
      })
      .join('\n');

    throw new Error(
      `❌ Invalid environment variables:\n\n${errorMessages}\n\n` +
      `Please check your .env.local file against .env.example\n`
    );
  }

  return result.data;
}

/**
 * Safe environment access with validation
 * Only validates in non-production or when explicitly enabled
 */
let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  // Only validate in development or if explicitly enabled
  if (process.env.NODE_ENV === 'development' || process.env.VALIDATE_ENV === 'true') {
    cachedEnv = validateEnv();
    return cachedEnv;
  }

  // In production, return raw values (assume validation happened at build time)
  return {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL!,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
    REVALIDATION_SECRET: process.env.REVALIDATION_SECRET!,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' ? 'true' : process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'false' ? 'false' : undefined,
    NEXT_PUBLIC_ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true' ? 'true' : process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'false' ? 'false' : undefined,
  };
}

// Validate at module load time in development
if (process.env.NODE_ENV === 'development') {
  try {
    validateEnv();
    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    console.error(error);
    // Don't throw in development to allow missing optional vars
  }
}
