# Task: Next.js Production Optimization - Transform to Production-Grade App

## Summary

This plan transforms the existing Next.js application into a fully optimized, production-grade application that leverages all modern Next.js features, performance best practices, and SEO optimizations. The application currently uses the App Router with basic optimizations including edge runtime on the landing page, bundle analyzer, and some revalidation strategies. However, it lacks comprehensive rendering strategy implementation, advanced caching mechanisms, structured data across all pages, and full performance optimization.

Successful implementation will result in:
- Optimized Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Comprehensive SEO with structured data on all public pages
- Strategic use of SSR, SSG, ISR, and CSR based on page requirements
- Advanced caching at multiple levels (Next.js, CDN, client)
- Minimal bundle sizes through code splitting and tree shaking
- Production-grade error handling and loading states
- Secure environment variable management
- Edge runtime optimization where applicable

## Knowledge Gathering

### Internal Codebase References

**Project Structure:**
- **App Router**: The application uses Next.js App Router (`app/` directory) with TypeScript
- **Configuration**: `next.config.ts` at line 1-106 defines bundle analyzer, image optimization, redirects, security headers, and CSP policies
- **Middleware**: `middleware.ts` implements Clerk authentication with route protection using `createRouteMatcher` pattern
- **Root Layout**: `app/layout.tsx` (lines 10-64) already implements the Metadata API with comprehensive OpenGraph and Twitter cards, using `next/font` for Inter font optimization
- **Providers**: Client-side providers separated into `root-providers.tsx` (Clerk + TopLoader) and `providers.tsx` (React Query with 5min staleTime)

**Current Rendering Strategies:**
- **Landing Page** (`app/page.tsx` line 10-11): Uses `export const runtime = 'edge'` and `export const revalidate = 3600` (1 hour ISR)
- **Protected Routes** (`app/(protected)/layout.tsx`): Server component with `currentUser()` check, but child pages primarily use client components
- **Shared Results** (`app/shared/result/[type]/[id]/page.tsx`): Implements edge runtime, `revalidate = 300` (5min), `dynamicParams = true`, and `generateMetadata` with structured data (JSON-LD)
- **Server Fetchers** (`lib/server/fetchers.ts`): Implements fetch with cache tags and revalidate timers (plans: 30m, agents: 10m, public results: 5m, projects: 1m)

**SEO Implementation:**
- `app/sitemap.ts`: Generates sitemap for `/`, `/privacy`, `/terms` only
- `app/robots.ts`: Basic robots.txt with disallow for `/api/`, `/_next/`, `/admin/`
- Metadata API used in root layout with comprehensive tags
- JSON-LD structured data only on shared result pages

**Optimization Status:**
- **Bundle Analysis**: `@next/bundle-analyzer` installed, can be triggered with `npm run analyze`
- **Image Optimization**: `next.config.ts` line 19-31 configures remote patterns for `uncubed.me` and `localhost`, `unoptimized: false`
- **Font Optimization**: Uses `next/font/google` for Inter font (line 6-8 in layout.tsx)
- **Security Headers**: Comprehensive headers including HSTS, CSP, X-Frame-Options, etc. (lines 46-101 in next.config.ts)
- **Experimental Features**: `optimizePackageImports: ['lucide-react']` enabled

**Dependencies Analysis (package.json):**
- **Next.js**: v15.5.6 (latest stable with App Router maturity)
- **React**: v18.3.1
- **Authentication**: `@clerk/nextjs` v6.34.1
- **State Management**: `@tanstack/react-query` v5.90.2, `zustand` v4.5.0
- **Animations**: `framer-motion` v11.0.0
- **UI**: `lucide-react` v0.344.0
- **Heavy Dependencies**: `pdfjs-dist`, `html2pdf.js`, `react-pdf` (potential bundle size issues)
- **DevDeps**: Bundle analyzer, TypeScript, Tailwind CSS with typography plugin

**API Architecture:**
- Client-side: `lib/api.ts` implements `ApiClient` class with request deduplication and base64 encoding
- Server-side: `lib/server/fetchers.ts` uses `server-only` import with tagged caching strategy
- Backend: External API at `NEXT_PUBLIC_API_URL` (defaults to localhost:3001)
- Authentication: Clerk tokens passed via Authorization header

### External Best Practices & Framework Documentation

**Next.js 15 App Router Rendering Strategies:**
- **Static Site Generation (SSG)**: Default for pages without data fetching; generated at build time
- **Incremental Static Regeneration (ISR)**: Use `revalidate` export for time-based revalidation or on-demand with `revalidatePath/revalidateTag`
- **Server-Side Rendering (SSR)**: Dynamic rendering when using cookies(), headers(), searchParams, or marking route as dynamic
- **Client-Side Rendering (CSR)**: Use 'use client' directive for interactive components requiring browser APIs
- **Edge Runtime**: Lightweight runtime for faster cold starts, limited Node.js API access, optimal for middleware and simple pages

**Caching Layers in Next.js 15:**
1. **Request Memoization**: Automatic deduplication during React render pass
2. **Data Cache**: Persistent HTTP cache across requests (fetch with cache options)
3. **Full Route Cache**: HTML + RSC payload cached at build time or revalidation
4. **Router Cache**: Client-side cache of RSC payload (prefetch/navigation)
5. **CDN Cache**: Cache-Control headers for static assets and edge caching

**Performance Best Practices:**
- **Code Splitting**: Automatic for each route; manual with `next/dynamic`
- **Image Optimization**: Use `next/image` with priority for LCP images, lazy loading for below-fold
- **Font Optimization**: `next/font` with `preload` and `display: 'swap'`
- **Script Optimization**: `next/script` with strategy (afterInteractive, lazyOnload, beforeInteractive)
- **Bundle Analysis**: Identify large dependencies, implement dynamic imports for heavy components
- **Tree Shaking**: ES6 imports to enable automatic dead code elimination

**SEO Optimization:**
- **Metadata API**: Export metadata object or generateMetadata function from page/layout
- **Structured Data**: JSON-LD format in metadata.other or script tag with type="application/ld+json"
- **Semantic HTML**: Use proper heading hierarchy, article, section, nav tags
- **Canonical URLs**: Specify in metadata.alternates.canonical
- **Dynamic Sitemaps**: Export function from sitemap.ts with dynamic route generation
- **Social Sharing**: OpenGraph and Twitter cards with images (1200x630 recommended)

**Security Best Practices:**
- **Environment Variables**: NEXT_PUBLIC_ prefix for client-exposed, server-only for secrets
- **CSP Headers**: Strict Content Security Policy to prevent XSS
- **CSRF Protection**: SameSite cookies, token validation
- **Rate Limiting**: Implement at API route level or middleware
- **Input Validation**: Sanitize all user inputs before processing

## Current Dependencies Summary

**Core Framework:**
- `next` (v15.5.6): App Router, Metadata API, Image/Font/Script optimization, Edge Runtime, ISR
- `react` (v18.3.1): Server Components, Suspense, Error Boundaries
- `react-dom` (v18.3.1): Hydration, streaming

**Authentication & Authorization:**
- `@clerk/nextjs` (v6.34.1): Used in middleware.ts and layouts for protected routes, provides auth() and currentUser()

**Data Fetching & State Management:**
- `@tanstack/react-query` (v5.90.2): Client-side data fetching with caching (5min stale time configured)
- `zustand` (v4.5.0): Lightweight state management for client components

**UI & Styling:**
- `tailwindcss` (v3.4.1): Utility-first CSS, configured in tailwind.config.js
- `lucide-react` (v0.344.0): Icon library with optimizePackageImports enabled
- `framer-motion` (v11.0.0): Animation library, potential bundle size concern

**PDF & Document Handling:**
- `pdfjs-dist` (v4.0.0): Heavy dependency (~8MB), needs dynamic import
- `react-pdf` (v7.7.1): PDF viewer component
- `html2pdf.js` (v0.10.3): HTML to PDF conversion

**Other Libraries:**
- `react-markdown` (v10.1.0): Markdown rendering
- `react-hook-form` (v7.50.0): Form validation
- `uuid` (v10.0.0): UUID generation
- `nextjs-toploader` (v3.9.17): Route transition progress bar

**Development Tools:**
- `@next/bundle-analyzer` (v16.0.1): Bundle size analysis
- TypeScript (v5.6.0): Type safety
- ESLint with Next.js config: Code quality

**Impact on Implementation:**
- PDF libraries must be dynamically imported to reduce initial bundle
- Framer Motion usage should be audited and potentially lazy loaded
- React Query already configured, can extend for better caching
- Clerk integration requires special handling in rendering strategies (server components)
- External API dependency requires proper error handling and fallback strategies

## Codebase Analysis

### Architecture Overview

**Route Structure:**
```
app/
├── layout.tsx                 (Root layout, metadata, providers)
├── page.tsx                   (Landing page: Edge + ISR 1h)
├── (protected)/              (Route group with auth layout)
│   ├── layout.tsx            (Server component with currentUser check)
│   ├── home/page.tsx         (Server component → Client with React Query)
│   ├── projects/page.tsx
│   ├── billing/page.tsx
│   ├── credits/page.tsx
│   ├── help/page.tsx
│   ├── settings/page.tsx
│   ├── agents/page.tsx
│   └── startup/[id]/page.tsx (Dynamic route, needs optimization)
├── shared/result/[type]/[id]/page.tsx (Public dynamic route with metadata generation)
├── sign-in/[[...sign-in]]/page.tsx
├── sign-up/[[...sign-up]]/page.tsx
├── privacy/page.tsx
├── terms/page.tsx
├── api/revalidate/           (API routes)
├── sitemap.ts                (Static sitemap generation)
└── robots.ts                 (Static robots.txt)
```

**Key Components:**
- `components/landing/`: Navigation, Hero, Features, Pricing, About, Contact, Footer
- `components/layout/`: Header for protected routes
- `components/ui/`: Reusable UI components
- `components/AuthSync.tsx`: Client component for syncing auth state
- `components/ThemeInitializer.tsx`: Theme management

**Data Flow:**
1. **Public Routes**: Server components fetch data with Next.js cache → hydrate client components
2. **Protected Routes**: Server layout validates auth → client components use React Query for data
3. **API Communication**: lib/api.ts for client, lib/server/fetchers.ts for server
4. **Authentication**: middleware.ts intercepts all routes, redirects based on auth state

**Integration Points:**
- **External API**: All data fetched from NEXT_PUBLIC_API_URL
- **Clerk**: Authentication provider with middleware integration
- **Vercel/CDN**: Deployment target with edge network
- **Build Process**: Next.js build with bundle analysis option

### Current Limitations

1. **Rendering Strategy Gaps:**
   - Protected routes don't leverage ISR or SSG where possible (e.g., static content pages)
   - No generateStaticParams for dynamic routes (startup/[id])
   - Mixed approach causing unnecessary client-side fetching

2. **Caching Inefficiencies:**
   - Limited use of cache tags for granular revalidation
   - No CDN cache headers for API responses that could be cached
   - React Query configuration could be more aggressive
   - Missing request deduplication at server level

3. **Bundle Size Issues:**
   - PDF libraries not dynamically imported
   - Framer Motion loaded for all pages
   - Potential unused Clerk components

4. **SEO Gaps:**
   - Sitemap only includes 3 routes (missing protected route variants)
   - No structured data on landing page features/pricing
   - Missing Organization schema
   - No breadcrumb navigation schema
   - Limited Open Graph customization per page

5. **Performance Opportunities:**
   - Images in public/ not using next/image optimally
   - No priority prop on above-fold images
   - No prefetching strategy for common navigation paths
   - Missing loading.tsx for several routes
   - No Suspense boundaries with fallbacks

6. **Monitoring & Observability:**
   - No performance monitoring (Web Vitals tracking)
   - No error tracking integration
   - Limited logging for production debugging

## Phase-Based Implementation Plan

### Phase 1: Audit & Baseline Performance Measurement

**Goal of the Phase:**
Establish a comprehensive baseline of current performance metrics, identify bottlenecks, and prioritize optimization opportunities. This phase provides data-driven insights to guide subsequent optimization phases.

**Detailed Implementation Steps:**

**Step 1.1: Run Bundle Analysis**
- Execute `npm run analyze` to generate bundle analysis report
- Examine the `.next/analyze/client.html` and `.next/analyze/server.html` reports
- Document all packages over 50KB in size
- Identify duplicate dependencies or unnecessary imports
- List all findings in a `docs/optimization-audit.md` file
- Verification: Confirm bundle reports exist in analyze directory

**Step 1.2: Lighthouse Performance Audit**
- Install Lighthouse CLI if not present: `npm install -g lighthouse`
- Build production version: `npm run build && npm start`
- Run Lighthouse on key pages:
  - Landing page: `lighthouse http://localhost:3000 --output=json --output-path=./reports/landing.json`
  - Home page (requires auth): Manual audit using Chrome DevTools
  - Shared result page: `lighthouse http://localhost:3000/shared/result/competitor-finder/test-id --output=json`
- Document Core Web Vitals scores (LCP, FID, CLS, TTFB) for each page
- Identify specific performance opportunities from Lighthouse recommendations
- Store all reports in `reports/` directory
- Verification: All JSON reports generated and scores documented

**Step 1.3: Image Optimization Audit**
- Use bash to find all image references: search for `<img`, `Image`, background-image in components
- Check public directory: `find public -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" \)`
- For each image, document: original size, format, usage location, if it uses next/image
- Identify images that should be converted to WebP/AVIF
- Identify images needing priority prop (above-fold, LCP candidates)
- List images that could be lazy loaded
- Verification: Complete inventory in optimization-audit.md

**Step 1.4: Current Rendering Strategy Audit**
- Review every page.tsx file and document:
  - Current rendering mode (SSR/SSG/ISR/CSR)
  - Use of runtime export (edge/nodejs)
  - Revalidate settings
  - Dynamic params configuration
  - Metadata implementation
- For each protected route, determine if it truly needs full dynamic rendering or could use ISR
- Identify routes that could benefit from partial prerendering (PPR)
- Document findings in `docs/rendering-strategy-matrix.md`
- Verification: Complete matrix with recommendations per route

**Step 1.5: Dependency Analysis for Code Splitting**
- For each heavy dependency identified in bundle analysis:
  - Document where it's imported
  - Determine if it can be dynamically imported
  - Estimate potential savings
- Specific targets to analyze:
  - pdfjs-dist usage locations
  - html2pdf.js usage
  - framer-motion usage across components
  - react-markdown usage
- Create priority list for dynamic import implementation
- Verification: Prioritized list with estimated bundle reduction

**Reasoning:**
Without baseline metrics, optimizations are speculative. This phase ensures data-driven decisions and provides measurable targets for improvement. Bundle analysis reveals quick wins (dynamic imports), while Lighthouse identifies user-facing performance issues. The rendering strategy audit prevents premature optimization and ensures we apply the right strategy to each route.

**Expected Outcome:**
- Complete performance baseline documented in `docs/optimization-audit.md`
- Bundle analysis report identifying 3-5 major optimization opportunities
- Lighthouse scores documented for key pages with specific improvement targets
- Image optimization inventory with action items
- Rendering strategy matrix mapping each route to optimal rendering mode
- Prioritized list of dependencies for dynamic import (Phase 3)
- Clear understanding of current bottlenecks to guide subsequent phases

### Phase 2: Implement Optimal Rendering Strategies Per Route

**Goal of the Phase:**
Apply the optimal rendering strategy (SSR, SSG, ISR, or CSR) to each route based on its characteristics, data requirements, and SEO importance. This phase transforms the mixed rendering approach into a strategic, performance-optimized architecture.

**Detailed Implementation Steps:**

**Step 2.1: Landing Page Optimization (Already Partial)**
- Confirm edge runtime is active: `app/page.tsx` already has `export const runtime = 'edge'`
- Verify revalidate setting: Currently set to 3600 (1 hour), consider increasing to 7200 (2 hours) if content is more static
- Ensure all landing components are server components (Navigation, Hero, Features, etc.)
- If any landing component uses client-side state, split into server wrapper + client interactive portion
- Add `export const dynamic = 'force-static'` if landing page data is truly static
- Verification: Check `.next/server/app/page.html` exists (static generation successful)

**Step 2.2: Public Static Pages (Privacy, Terms)**
- Open `app/privacy/page.tsx` and `app/terms/page.tsx`
- Add metadata export with specific title and description
- Add `export const dynamic = 'force-static'` to force static generation
- Add `export const revalidate = false` to prevent unnecessary revalidation
- Ensure pages are pure server components with no dynamic data fetching
- Verification: Build and confirm static HTML generated in `.next/server/app/privacy/` and `.next/server/app/terms/`

**Step 2.3: Shared Result Pages Enhancement**
- Review `app/shared/result/[type]/[id]/page.tsx` (already has good foundation)
- Current settings: edge runtime, revalidate 300, dynamicParams true, generateMetadata implemented
- Consider implementing `generateStaticParams` for common result IDs if applicable:
  ```typescript
  export async function generateStaticParams() {
    // Fetch popular/common result IDs to pre-generate
    // Return array of { type, id } objects
  }
  ```
- Verify cache tags implementation in fetchResult function (already uses TAGS.PUBLIC_RESULT)
- Add error boundary specific to this route to handle stale/deleted results gracefully
- Verification: Test with multiple result IDs, confirm ISR behavior with revalidation

**Step 2.4: Protected Routes Optimization Strategy**
- These routes must remain dynamic due to Clerk authentication, but can optimize data fetching
- For routes like `/home`, `/agents`, `/projects`:
  - Keep server component for initial auth check (already implemented)
  - Server component fetches initial data with proper caching tags
  - Pass initial data to client component for React Query hydration
  - Client component handles interactive updates
- Example pattern (already used in home/page.tsx, replicate for others):
  ```typescript
  // Server Component
  export default async function Page() {
    const { getToken } = await auth();
    const token = await getToken();
    const initialData = await fetchDataWithCacheTags(token);
    return <ClientComponent initialData={initialData} />;
  }
  ```
- Verification: Each protected route has server component wrapper with data fetching

**Step 2.5: Dynamic Startup Routes**
- Open `app/(protected)/startup/[id]/page.tsx`
- Add generateMetadata function to generate dynamic metadata per startup
- Implement server-side data fetching with appropriate cache tags:
  ```typescript
  export async function generateMetadata({ params }): Promise<Metadata> {
    const { id } = await params;
    const startup = await fetchStartup(id);
    return { title: `${startup.name} | Uncubed`, description: startup.description };
  }
  ```
- Add proper revalidation strategy: `export const revalidate = 300` (5 minutes)
- Consider generateStaticParams if there's a finite set of startups to pre-generate
- Implement not-found handling for invalid IDs
- Verification: Test dynamic routes, confirm metadata appears correctly, check revalidation behavior

**Step 2.6: Sign-In/Sign-Up Routes**
- These routes are managed by Clerk, but can optimize surrounding
- Ensure routes use default SSR (no edge runtime needed)
- Add metadata specific to auth pages
- Verify Clerk components are not unnecessarily bundled in other routes
- Verification: Check bundle for Clerk component tree shaking

**Step 2.7: API Routes Optimization**
- Review `app/api/revalidate/` routes
- Ensure on-demand revalidation uses proper cache tags
- Add validation for revalidation requests (check for valid tokens/secrets)
- Implement rate limiting on revalidation endpoints
- Add proper error responses and logging
- Verification: Test revalidation endpoints, confirm cache invalidation works

**Reasoning:**
Different routes have vastly different requirements. Landing pages benefit from static generation and edge delivery for global performance. Protected routes must be dynamic for authentication but can optimize initial data loading. Dynamic routes need ISR to balance freshness and performance. This strategic approach maximizes performance while maintaining functionality.

**Expected Outcome:**
- Landing page optimized with edge runtime, 2-hour revalidation, confirmed static generation
- Privacy/Terms pages fully static with no revalidation
- Shared result pages using ISR with 5-minute revalidation and proper cache tags
- All protected routes using optimized server component + client component pattern
- Dynamic startup routes with metadata generation, ISR, and proper error handling
- API routes secured with validation and rate limiting
- Clear separation of server/client components with explicit 'use client' directives
- Documentation updated with rendering strategy per route
- Measurable improvement in TTFB for static pages, reduced data fetching delays

### Phase 3: Advanced Caching Implementation

**Goal of the Phase:**
Implement a multi-layered caching strategy leveraging Next.js fetch cache, cache tags, React Query optimization, and CDN-level caching to minimize redundant data fetching and maximize response speed.

**Detailed Implementation Steps:**

**Step 3.1: Expand Cache Tag System**
- Open `lib/server/fetchers.ts` and review existing TAGS object (lines 10-18)
- Add additional granular tags:
  ```typescript
  export const TAGS = {
    ...existing,
    STARTUP: (id: string) => `startup:${id}`,
    USER_DATA: (userId: string) => `user:${userId}`,
    BILLING: 'billing',
    CREDITS: 'credits',
    SETTINGS: (userId: string) => `settings:${userId}`,
  } as const;
  ```
- Update all serverFetchJSON calls to include appropriate tags
- Implement tag-based revalidation in API routes
- Verification: Test revalidatePath and revalidateTag functionality

**Step 3.2: Optimize DEFAULT_REVALIDATE Timers**
- Review current revalidation times (lines 20-26 in fetchers.ts)
- Adjust based on data volatility:
  - Static data (plans, feature flags): 3600 (1 hour) or more
  - Semi-static (agents): Keep at 600 (10 minutes)
  - Dynamic but cacheable (public results): Keep at 300 (5 minutes)
  - Frequently changing (projects, credits): 60 seconds or consider no cache
- Document reasoning for each timer in code comments
- Verification: Monitor cache hit rates in development logs

**Step 3.3: Implement Request Deduplication for Client-Side**
- Review `lib/api.ts` ApiClient class (already has deduplication, lines 19-84)
- Extend deduplication to include timestamp-based expiration:
  - Store request timestamp with promise
  - Clear cache after configurable timeout (e.g., 5 seconds)
  - Prevents stale promise returns
- Consider implementing request batching for parallel requests
- Verification: Test rapid duplicate API calls, confirm single network request

**Step 3.4: Enhance React Query Configuration**
- Open `app/providers.tsx` and review QueryClient configuration
- Current settings: staleTime 5min, gcTime 10min, retry 1, refetchOnWindowFocus false
- Add optimizations:
  ```typescript
  {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30, // Increase to 30 minutes for longer cache
      retry: (failureCount, error) => {
        // Custom retry logic: don't retry on 401/403
        if ([401, 403].includes(error.status)) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Rely on cache unless explicitly invalidated
      refetchOnReconnect: 'always', // Refresh after connection loss
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        // Global error handling for mutations
      }
    }
  }
  ```
- Add React Query Devtools in development mode
- Verification: Test cache behavior, confirm stale data not refetched unnecessarily

**Step 3.5: Implement Optimistic Updates**
- Identify mutation-heavy components (CreateProjectModal, EditProjectModal, etc.)
- For each mutation, implement optimistic updates:
  - Update React Query cache immediately on mutation
  - Revert on error
  - Invalidate/refetch on success
- Example pattern for project creation:
  ```typescript
  const mutation = useMutation({
    mutationFn: createProject,
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previous = queryClient.getQueryData(['projects']);
      queryClient.setQueryData(['projects'], (old) => [...old, newProject]);
      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['projects'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
  ```
- Verification: Test mutations, confirm instant UI updates with proper rollback

**Step 3.6: CDN Cache Headers Optimization**
- Review `next.config.ts` headers section (lines 46-101)
- Current implementation: static assets cached for 1 year, API routes no-cache
- Add stale-while-revalidate for certain routes:
  ```typescript
  {
    source: '/shared/result/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, s-maxage=300, stale-while-revalidate=600',
      }
    ]
  }
  ```
- Add Vary header for authenticated requests
- Implement cache busting for dynamic content when needed
- Verification: Test with curl -I to verify Cache-Control headers

**Step 3.7: Implement SWR Pattern for Non-Critical Data**
- Identify components that display non-critical data (activity logs, notifications)
- Consider implementing SWR library alongside React Query for these specific use cases
- Or extend React Query with background refetch:
  ```typescript
  useQuery({
    queryKey: ['activity'],
    queryFn: fetchActivity,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 5, // Poll every 5 minutes
  });
  ```
- Verification: Confirm background updates don't impact performance

**Reasoning:**
Caching is the single most impactful performance optimization. Next.js provides multiple caching layers that, when properly orchestrated, eliminate redundant computations and network requests. Cache tags enable surgical invalidation without full cache purges. React Query with optimistic updates provides instant UI feedback while ensuring data consistency.

**Expected Outcome:**
- Comprehensive cache tag system covering all data entities
- Optimized revalidation timers balancing freshness and performance
- Client-side request deduplication preventing duplicate API calls
- React Query configuration maximizing cache hits while maintaining data freshness
- Optimistic updates providing instant feedback on mutations
- CDN cache headers enabling edge caching for public content
- SWR pattern for background updates of non-critical data
- Documented caching strategy in `docs/caching-architecture.md`
- Measurable reduction in API calls and improved perceived performance
- Cache hit rate metrics instrumented for monitoring

### Phase 4: Image Optimization & Asset Management

**Goal of the Phase:**
Optimize all images using next/image, implement proper lazy loading, convert images to modern formats, and ensure optimal delivery for Core Web Vitals (especially LCP).

**Detailed Implementation Steps:**

**Step 4.1: Audit All Image Usage**
- Search codebase for image references: `<img`, `background-image`, hardcoded URLs
- List all images in `public/` directory with sizes and formats
- Identify images in components:
  - Landing page: Hero images, feature images, about images
  - Protected routes: User avatars, project thumbnails, result visualizations
- Document which images use next/image vs. raw <img> tags
- Create spreadsheet: image path, current size, format, usage location, priority level
- Verification: Complete inventory in `docs/image-optimization-audit.md`

**Step 4.2: Convert Critical Images to Modern Formats**
- For each PNG/JPG image over 100KB:
  - Convert to WebP using `cwebp` or online tools
  - Consider AVIF for even better compression (if browser support acceptable)
  - Maintain originals as fallback
- Place converted images in `public/images/optimized/` directory
- Update next.config.ts to prioritize WebP/AVIF:
  ```typescript
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  }
  ```
- Verification: Check file sizes reduced by 30-60%, test browser rendering

**Step 4.3: Implement next/image for All Images**
- Replace all <img> tags with next/image Image component
- For each landing page section (Hero, Features, About):
  - Import Image from 'next/image'
  - Replace <img src="/path.jpg" /> with <Image src="/path.jpg" width={X} height={Y} alt="..." />
  - Specify exact dimensions for layout stability (prevents CLS)
  - Use placeholder="blur" for local images to improve perceived performance
- For remote images (user avatars, project images):
  - Ensure domain is in remotePatterns in next.config.ts (already configured for uncubed.me)
  - Specify width/height or use fill with relative parent container
- Verification: No <img> tags remain (except in Clerk components), all images use next/image

**Step 4.4: Implement Priority Loading for LCP Images**
- Identify LCP candidates (typically hero images, first visible content):
  - Landing page: Hero background or main image
  - Protected routes: First visible dashboard chart or card image
- Add priority prop to LCP images:
  ```tsx
  <Image src="/hero.webp" priority width={1920} height={1080} alt="Hero" />
  ```
- This generates <link rel="preload"> in document head
- Verify only 1-2 images per page have priority (not overused)
- Verification: Check page HTML for preload links, measure LCP improvement with Lighthouse

**Step 4.5: Implement Lazy Loading for Below-Fold Images**
- For all images not in initial viewport (features section, footer, etc.):
  - Ensure no priority prop (default is lazy loading)
  - Consider adding loading="lazy" explicitly for clarity
  - Use placeholder="blur" or placeholder="empty" as appropriate
- For components with many images (gallery, project list):
  - Implement intersection observer pattern if needed
  - Or rely on next/image default lazy loading
- Verification: Network tab shows images loading only on scroll

**Step 4.6: Optimize Image Sizing and Responsive Images**
- For each image, determine optimal sizes for different viewports
- Use sizes prop to serve appropriate image size:
  ```tsx
  <Image
    src="/feature.jpg"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    width={800}
    height={600}
    alt="Feature"
  />
  ```
- This ensures mobile devices don't download desktop-sized images
- Review deviceSizes and imageSizes in next.config.ts, adjust based on actual viewport distribution
- Verification: Test on multiple devices, confirm appropriate image sizes loaded

**Step 4.7: Optimize Video Assets**
- Review `public/demo_1080.mp4` (likely heavy file)
- Consider:
  - Compressing with H.264 codec at lower bitrate
  - Creating multiple resolutions (480p, 720p, 1080p) and serving based on viewport
  - Using poster image with lazy loading for video
  - Implementing <video preload="metadata"> instead of preload="auto"
- For above-fold videos, ensure they don't block LCP
- Verification: Check video file size, test loading behavior

**Step 4.8: Implement Static Asset Optimization**
- For SVG icons (Logo.svg, window.svg, etc.):
  - Inline critical SVGs directly in components for faster rendering
  - For non-critical SVGs, use next/image or dynamic import
  - Consider SVGO optimization to reduce SVG file size
- Review font files and ensure proper loading strategy
- Verify favicon sizes and formats (favicon.svg, favicon-96x96.png)
- Verification: Reduce number of requests for small assets, inline critical SVGs

**Reasoning:**
Images typically account for 50%+ of page weight and directly impact LCP (Largest Contentful Paint). next/image provides automatic optimization, responsive images, and lazy loading. Modern formats (WebP/AVIF) reduce bandwidth by 30-60% without quality loss. Priority loading ensures critical images load immediately while lazy loading defers non-critical images.

**Expected Outcome:**
- All images converted to WebP/AVIF with 30-60% size reduction
- 100% of images using next/image with proper width/height
- LCP images marked with priority prop, preloaded in document head
- Below-fold images lazy loading automatically
- Responsive images serving appropriate sizes per viewport
- Video assets optimized and lazy loaded
- Critical SVGs inlined for faster rendering
- Measurable improvements: LCP under 2.5s, reduced bandwidth by 40%+
- No Cumulative Layout Shift from images (CLS score improved)
- Complete image optimization documentation

### Phase 5: Bundle Size Optimization & Code Splitting

**Goal of the Phase:**
Minimize JavaScript bundle size through dynamic imports, tree shaking, and strategic code splitting to reduce Time to Interactive (TTI) and First Input Delay (FID).

**Detailed Implementation Steps:**

**Step 5.1: Analyze Bundle Composition**
- Run `npm run analyze` and open bundle analyzer reports
- Identify the top 10 largest packages in client bundle
- Expected targets: pdfjs-dist, html2pdf.js, framer-motion, react-markdown
- Document which pages/components actually need each heavy dependency
- Create prioritized list of dynamic import candidates
- Verification: Bundle analysis report reviewed, targets documented

**Step 5.2: Dynamic Import for PDF Libraries**
- Search for pdfjs-dist and react-pdf imports across codebase
- Likely locations: components for viewing/generating PDFs
- Replace static imports with dynamic imports:
  ```typescript
  // Instead of: import { Document, Page } from 'react-pdf';
  const ReactPDF = dynamic(() => import('react-pdf'), {
    ssr: false,
    loading: () => <div>Loading PDF viewer...</div>
  });
  ```
- For html2pdf.js (PDF generation):
  ```typescript
  const generatePDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    // Use html2pdf here
  };
  ```
- Wrap PDF components in Suspense boundaries with loading fallbacks
- Verification: Check bundle analysis, confirm PDF libraries moved to separate chunks

**Step 5.3: Dynamic Import for Framer Motion**
- Audit all framer-motion usage across components
- Identify if animations are critical (hero section) or non-critical (modals, transitions)
- For non-critical animations, implement dynamic import:
  ```typescript
  const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), {
    ssr: false
  });
  ```
- Consider alternative: use CSS animations for simple transitions, reserve framer-motion for complex animations
- Implement feature flag to disable animations on low-end devices
- Verification: Framer-motion code split into separate chunks, only loaded when needed

**Step 5.4: Code Split Modal Components**
- Modals are not needed on initial page load
- Identify all modal components: CreateProjectModal, EditProjectModal, DirectoryModal, ReviewModal
- Implement dynamic imports:
  ```typescript
  const CreateProjectModal = dynamic(() => import('@/components/CreateProjectModal'), {
    ssr: false,
    loading: () => <div>Loading...</div>
  });
  ```
- Trigger loading only when user clicks "Create Project" button
- Apply pattern to all modals across application
- Verification: Modal code not in main bundle, loads on-demand

**Step 5.5: Optimize Lucide React Icon Imports**
- Currently optimizePackageImports: ['lucide-react'] is enabled (good)
- Audit icon imports to ensure tree-shaking works properly:
  ```typescript
  // Good: import { Home, User } from 'lucide-react';
  // Bad: import * as Icons from 'lucide-react';
  ```
- Replace any wildcard imports with specific icon imports
- Consider creating icon component library that imports only used icons
- Verification: Bundle analysis shows only used icons included

**Step 5.6: Split Clerk Components**
- Clerk components only needed on auth pages and protected routes
- Ensure SignIn/SignUp components not bundled in landing page
- Review Clerk provider configuration in root-providers.tsx
- Consider splitting ClerkProvider into separate client component loaded only when needed
- Verification: Clerk bundle impact minimized on public pages

**Step 5.7: Implement Route-Based Code Splitting**
- Next.js automatically code splits by route, but verify it's working optimally
- Review each route's JavaScript bundle in `.next/static/chunks/app/`
- Identify shared chunks that are unnecessarily large
- Consider extracting common components into shared chunks
- Use webpack bundle analyzer to visualize chunk relationships
- Verification: Each route has minimal JavaScript, shared chunks appropriately sized

**Step 5.8: Tree Shaking Audit**
- Ensure all imports use ES6 modules (import/export) not CommonJS (require)
- Review package.json dependencies for packages with poor tree shaking
- For packages with multiple modules, import from specific subpaths:
  ```typescript
  // Good: import debounce from 'lodash-es/debounce';
  // Bad: import { debounce } from 'lodash';
  ```
- Enable production builds with optimization: ensure `NODE_ENV=production`
- Verification: Bundle analysis confirms dead code elimination working

**Step 5.9: Remove Unused Dependencies**
- Review package.json for dependencies that may no longer be used
- Use `npx depcheck` to identify unused dependencies
- Carefully remove dependencies that are truly unused
- Test application thoroughly after removal
- Document why each dependency is kept or removed
- Verification: Reduced node_modules size, faster install times

**Reasoning:**
JavaScript bundle size directly impacts Time to Interactive. Dynamic imports ensure code is only loaded when needed, reducing initial bundle size. Heavy libraries like PDF processors can be deferred until user actually needs PDF functionality. Tree shaking eliminates dead code, and proper code splitting ensures users only download code for routes they visit.

**Expected Outcome:**
- PDF libraries (8MB+) moved to separate chunks, loaded on-demand
- Framer Motion code split, reducing main bundle by 200-300KB
- All modals dynamically imported, not in initial bundle
- Lucide React tree-shaken properly, only used icons included
- Clerk components isolated to auth routes
- Route-based code splitting optimized with minimal shared chunks
- Tree shaking verified, dead code eliminated
- Unused dependencies removed
- Main bundle reduced by 40-60% (target: <200KB gzipped for landing page)
- Measurable improvements: TTI under 3.5s, FID under 100ms
- Updated bundle analysis report documenting improvements

### Phase 6: SEO Enhancement & Structured Data

**Goal of the Phase:**
Implement comprehensive SEO optimization including dynamic sitemaps, rich structured data (JSON-LD), enhanced metadata per route, and proper semantic HTML to maximize search engine visibility and rich snippet eligibility.

**Detailed Implementation Steps:**

**Step 6.1: Expand Dynamic Sitemap**
- Open `app/sitemap.ts` (currently only 3 static routes)
- Fetch dynamic routes from API or database:
  - Public shared results (if they should be indexed)
  - Static help pages, documentation, blog posts (if any)
  - Protected routes metadata (if publicly accessible alternatives exist)
- Implement dynamic sitemap generation:
  ```typescript
  export default async function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://uncubed.me';
    const staticRoutes = [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
      { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ];

    // Fetch dynamic routes
    const publicResults = await fetchPublicResults();
    const dynamicRoutes = publicResults.map(result => ({
      url: `${baseUrl}/shared/result/${result.type}/${result.id}`,
      lastModified: result.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  }
  ```
- Implement caching for sitemap generation: `export const revalidate = 3600`
- Verification: Access `/sitemap.xml`, confirm all expected routes listed

**Step 6.2: Implement Organization Schema**
- Add Organization structured data to root layout metadata:
  ```typescript
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Uncubed',
    url: 'https://uncubed.me',
    logo: 'https://uncubed.me/logo.png',
    description: 'AI-powered startup co-pilot...',
    sameAs: [
      'https://twitter.com/uncubed',
      'https://linkedin.com/company/uncubed',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@uncubed.me'
    }
  };
  ```
- Add to root layout.tsx metadata.other with proper serialization
- Verification: Test with Google Rich Results Test tool

**Step 6.3: Add Product Schema for Pricing**
- Open landing page pricing section component
- For each pricing plan, add Product or Offer schema:
  ```typescript
  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Uncubed Pro Plan',
    description: 'Full access to AI-powered startup tools',
    offers: {
      '@type': 'Offer',
      price: '29.99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    }
  };
  ```
- Inject schema into page metadata or via script tag in component
- Verification: Google Rich Results Test shows pricing properly parsed

**Step 6.4: Implement FAQPage Schema**
- If there's a help or FAQ section, add FAQPage schema:
  ```typescript
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does Uncubed work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Uncubed uses AI to analyze your startup idea...'
        }
      },
      // More Q&A pairs
    ]
  };
  ```
- Add to relevant page metadata
- Verification: FAQ rich snippets appear in search results

**Step 6.5: Enhance Per-Page Metadata**
- Audit all pages and add specific metadata where missing
- For each protected route (even if not indexed), add metadata for browser tabs:
  ```typescript
  export const metadata: Metadata = {
    title: 'Dashboard | Uncubed',
    description: 'Manage your startup projects',
  };
  ```
- For dynamic routes, implement generateMetadata if not already present
- Ensure all pages have unique titles (not just "Uncubed")
- Add relevant keywords and description per page
- Verification: Check each page's <head> in browser DevTools

**Step 6.6: Implement Breadcrumb Schema**
- For pages with navigation hierarchy (e.g., startup/[id]), add BreadcrumbList:
  ```typescript
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://uncubed.me' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://uncubed.me/projects' },
      { '@type': 'ListItem', position: 3, name: startup.name, item: currentUrl }
    ]
  };
  ```
- Add to page metadata
- Consider adding visual breadcrumb navigation UI that matches schema
- Verification: Google Rich Results Test shows breadcrumb structure

**Step 6.7: Optimize robots.txt**
- Review `app/robots.ts` (currently basic configuration)
- Add specific directives for crawl budget optimization:
  ```typescript
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/sign-in/', '/sign-up/', '/(protected)/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
        crawlDelay: 0,
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
  ```
- Verification: Access `/robots.txt`, confirm proper directives

**Step 6.8: Implement Canonical URLs**
- For pages with potential duplicate content or parameters, add canonical URLs
- Already implemented in root layout for base site
- For dynamic routes, ensure canonical URL points to preferred version:
  ```typescript
  export async function generateMetadata({ params }): Promise<Metadata> {
    const { id } = await params;
    return {
      alternates: {
        canonical: `https://uncubed.me/shared/result/${id}`,
      }
    };
  }
  ```
- Verification: Check <link rel="canonical"> in page HTML

**Step 6.9: Semantic HTML Audit**
- Review landing page components and ensure proper semantic structure:
  - Use <header> for navigation
  - Use <main> for primary content
  - Use <article> for standalone content (blog posts, results)
  - Use <section> for thematic grouping
  - Use proper heading hierarchy (single h1, logical h2-h6 progression)
- Replace generic <div> with semantic elements where appropriate
- Add ARIA labels for accessibility (also improves SEO)
- Verification: Run accessibility audit, confirm proper HTML5 structure

**Reasoning:**
SEO is critical for organic traffic. Structured data enables rich snippets in search results, increasing click-through rates. Dynamic sitemaps ensure all valuable content is discovered by search engines. Per-page metadata optimization prevents duplicate content issues and improves relevance signals. Semantic HTML helps search engines understand content hierarchy and context.

**Expected Outcome:**
- Dynamic sitemap including all public routes and dynamic content
- Organization schema providing business context to search engines
- Product/Offer schema enabling pricing rich snippets
- FAQPage schema for eligible FAQ content
- Comprehensive per-page metadata with unique titles and descriptions
- Breadcrumb schema for hierarchical navigation
- Optimized robots.txt with specific crawl directives
- Canonical URLs preventing duplicate content issues
- Semantic HTML throughout application
- Measurable improvements: Rich snippets in search results, increased click-through rates
- Full structured data validation with Google Rich Results Test
- Documentation of SEO strategy in `docs/seo-implementation.md`

### Phase 7: Font & Script Optimization

**Goal of the Phase:**
Optimize font loading to eliminate FOIT/FOUT, implement proper script loading strategies with next/script, and ensure third-party scripts don't block rendering or degrade performance.

**Detailed Implementation Steps:**

**Step 7.1: Audit Current Font Implementation**
- Review `app/layout.tsx` lines 6-8: currently uses next/font/google for Inter
- Current implementation:
  ```typescript
  const inter = Inter({ subsets: ["latin"] });
  ```
- Document any other font usage in the application
- Check for any font files in public/ directory
- Review globals.css for any @font-face declarations
- Verification: Complete font inventory documented

**Step 7.2: Optimize Next Font Configuration**
- Enhance Inter font configuration with optimal settings:
  ```typescript
  const inter = Inter({
    subsets: ["latin"],
    display: 'swap', // Prevents FOIT (Flash of Invisible Text)
    preload: true,
    fallback: ['system-ui', 'arial'],
    adjustFontFallback: true, // Reduces CLS by matching fallback metrics
    variable: '--font-inter', // CSS variable for flexibility
  });
  ```
- Apply font via CSS variable in body className:
  ```typescript
  <body className={`${inter.variable} font-sans`}>
  ```
- Update tailwind.config.js to use CSS variable:
  ```javascript
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      }
    }
  }
  ```
- Verification: Check Network tab for font preload link in document head

**Step 7.3: Implement Font Subsetting**
- If supporting only English, ensure only latin subset is included (already done)
- For multi-language support, add additional subsets:
  ```typescript
  subsets: ["latin", "latin-ext"]
  ```
- Consider using `text` parameter to include only specific characters for custom fonts
- Verification: Check font file size, confirm only needed glyphs included

**Step 7.4: Self-Host Google Fonts (Optional)**
- For maximum performance and privacy, consider self-hosting Inter
- Use `fontsource` package or manual download from Google Fonts
- Place font files in `public/fonts/`
- Use next/font/local instead:
  ```typescript
  const inter = localFont({
    src: [
      { path: './fonts/Inter-Regular.woff2', weight: '400', style: 'normal' },
      { path: './fonts/Inter-Bold.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-inter',
    display: 'swap',
    preload: true,
  });
  ```
- Trade-off: Removes Google CDN but increases control and reduces third-party dependencies
- Verification: Fonts load from own domain, no external requests

**Step 7.5: Audit Third-Party Scripts**
- Search codebase for <script> tags or external script inclusions
- Check for analytics scripts (Google Analytics, Plausible, etc.)
- Check for chat widgets, marketing pixels, or other third-party integrations
- Document each script: purpose, loading strategy, performance impact
- Create priority list: critical vs. non-critical scripts
- Verification: Complete script inventory in docs

**Step 7.6: Implement next/script for Third-Party Scripts**
- Replace any raw <script> tags with next/script
- For analytics scripts (typically in root layout):
  ```typescript
  import Script from 'next/script';

  <Script
    src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
    strategy="afterInteractive" // Loads after page interactive
  />
  <Script id="google-analytics" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    `}
  </Script>
  ```
- For non-critical scripts (chat widgets):
  ```typescript
  <Script
    src="https://widget.example.com/script.js"
    strategy="lazyOnload" // Loads after everything else
  />
  ```
- For critical scripts (payment processing):
  ```typescript
  <Script
    src="https://js.stripe.com/v3/"
    strategy="beforeInteractive" // Loads before page interactive
  />
  ```
- Verification: Network waterfall shows scripts loading at appropriate time

**Step 7.7: Implement Script Optimization for Clerk**
- Clerk already optimized by the library, but verify:
- Ensure Clerk scripts not blocking rendering
- Consider implementing Clerk with dynamic loading if only needed on specific routes
- Review Clerk configuration for any performance settings
- Verification: Clerk doesn't negatively impact Core Web Vitals

**Step 7.8: Add Resource Hints**
- For critical third-party domains, add resource hints in root layout metadata:
  ```typescript
  export const metadata: Metadata = {
    ...existing,
    other: {
      ...existing.other,
      'link': [
        { rel: 'dns-prefetch', href: 'https://api.clerk.com' },
        { rel: 'preconnect', href: 'https://uncubed.me' },
      ],
    },
  };
  ```
- Or use next/head in layout:
  ```typescript
  <link rel="dns-prefetch" href="https://api.clerk.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  ```
- Verification: Check Network timing for reduced connection time to third-party domains

**Step 7.9: Implement Font Display Strategy for Icons**
- If using icon fonts (not lucide-react, which uses SVG), optimize loading
- For lucide-react (SVG-based), ensure icons are tree-shaken and optimized
- Consider critical icon inlining for above-fold icons
- Verification: Icons don't cause layout shift or blocking

**Reasoning:**
Fonts and scripts are common performance bottlenecks. Improper font loading causes FOIT (invisible text) or FOUT (unstyled text), degrading user experience. Third-party scripts often block rendering or consume resources. next/font automatically optimizes font loading with preloading and fallback matching. next/script provides granular control over script loading timing, ensuring critical scripts load early and non-critical scripts defer.

**Expected Outcome:**
- Inter font optimized with swap display, preload, and fallback adjustment
- Font configuration using CSS variables for flexibility
- Self-hosted fonts (if implemented) eliminating third-party dependency
- All third-party scripts using next/script with appropriate strategy
- Analytics and marketing scripts deferred with lazyOnload strategy
- Resource hints reducing connection time to critical third-party domains
- No FOIT or FOUT, improved CLS score
- Measurable improvements: Reduced font load time, no script-blocking render
- Documentation of font and script strategy in `docs/asset-optimization.md`

### Phase 8: Security & Environment Variable Management

**Goal of the Phase:**
Ensure secure environment variable handling, enhance Content Security Policy, implement proper API key management, and harden application security for production deployment.

**Detailed Implementation Steps:**

**Step 8.1: Environment Variable Audit**
- List all environment variables currently used in the application:
  - NEXT_PUBLIC_API_URL (client-exposed)
  - NEXT_PUBLIC_SITE_URL (client-exposed)
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (client-exposed)
  - CLERK_SECRET_KEY (server-only)
  - Any other API keys or secrets
- Create `.env.example` file documenting all required variables:
  ```env
  # Public variables (client-accessible)
  NEXT_PUBLIC_API_URL=https://api.uncubed.me/api
  NEXT_PUBLIC_SITE_URL=https://uncubed.me
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx

  # Server-only variables (never exposed to client)
  CLERK_SECRET_KEY=sk_live_xxxxx
  DATABASE_URL=postgresql://...
  REVALIDATION_SECRET=your_secret_here
  ```
- Verification: `.env.example` exists with all required variables documented

**Step 8.2: Validate Environment Variables at Build**
- Create `lib/env.ts` to validate environment variables at build time:
  ```typescript
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
  ] as const;

  export function validateEnv() {
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }
  }

  // Call at module load
  if (process.env.NODE_ENV === 'production') {
    validateEnv();
  }
  ```
- Import in `next.config.ts` to fail build if variables missing
- Verification: Build fails gracefully with clear error if env var missing

**Step 8.3: Implement Runtime Environment Validation**
- For API routes and server components that require specific env vars:
  ```typescript
  // lib/server/env.ts
  export function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  // Usage
  const apiUrl = getRequiredEnv('NEXT_PUBLIC_API_URL');
  ```
- Verification: Runtime errors properly caught and logged

**Step 8.4: Enhance Content Security Policy**
- Review current CSP in `next.config.ts` (connect-src defined at lines 48-50)
- Expand CSP to include all directives:
  ```typescript
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `connect-src 'self' ${connectSrc}`,
      `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.uncubed.me https://*.clerk.com`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data: https: blob:`,
      `font-src 'self' data:`,
      `frame-src 'self' https://clerk.uncubed.me`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors 'none'`,
    ].join('; '),
  }
  ```
- Test CSP doesn't break Clerk or other integrations
- Gradually tighten CSP by removing 'unsafe-inline' where possible
- Verification: No CSP violations in browser console, test all features

**Step 8.5: Implement API Key Rotation Strategy**
- Document process for rotating API keys in `docs/security.md`
- Implement support for multiple API keys during rotation period:
  ```typescript
  const validKeys = process.env.API_KEYS?.split(',') || [];
  function validateApiKey(key: string): boolean {
    return validKeys.includes(key);
  }
  ```
- Set up reminders for regular key rotation (every 90 days)
- Verification: Process documented and tested

**Step 8.6: Secure API Route Revalidation**
- Review `app/api/revalidate/` routes
- Implement secret-based authentication:
  ```typescript
  export async function POST(request: Request) {
    const secret = request.headers.get('x-revalidation-secret');
    if (secret !== process.env.REVALIDATION_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Proceed with revalidation
    revalidatePath('/');
    return Response.json({ revalidated: true });
  }
  ```
- Implement rate limiting on revalidation endpoints
- Add logging for revalidation attempts
- Verification: Test unauthorized revalidation attempts are blocked

**Step 8.7: Implement Rate Limiting for API Routes**
- Install rate limiting library or implement custom solution:
  ```typescript
  // lib/rateLimit.ts
  const rateLimit = new Map<string, { count: number; resetTime: number }>();

  export function checkRateLimit(identifier: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const record = rateLimit.get(identifier);

    if (!record || now > record.resetTime) {
      rateLimit.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= limit) {
      return false;
    }

    record.count++;
    return true;
  }
  ```
- Apply to API routes:
  ```typescript
  const clientId = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(clientId, 10, 60000)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }
  ```
- Verification: Rate limiting prevents abuse, returns 429 status

**Step 8.8: Implement Request Validation**
- For API routes accepting user input, implement validation:
  ```typescript
  import { z } from 'zod';

  const requestSchema = z.object({
    projectName: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
  });

  export async function POST(request: Request) {
    const body = await request.json();
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      return Response.json({ error: result.error.issues }, { status: 400 });
    }

    // Proceed with validated data
  }
  ```
- Apply validation to all API routes accepting input
- Verification: Invalid requests rejected with clear error messages

**Step 8.9: Add Security Headers for All Responses**
- Review existing headers in `next.config.ts` (lines 46-101)
- Already implemented: HSTS, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- Ensure headers apply to all routes including dynamic routes
- Add additional headers if needed:
  ```typescript
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Feature-Policy',
    value: "camera 'none'; microphone 'none'; geolocation 'none'"
  }
  ```
- Verification: curl -I https://uncubed.me shows all security headers

**Reasoning:**
Security is paramount for production applications. Environment variables must be validated to prevent runtime failures. Proper secret management prevents credential leaks. CSP protects against XSS attacks. Rate limiting prevents abuse. Input validation prevents injection attacks. Security headers provide defense-in-depth against common vulnerabilities.

**Expected Outcome:**
- `.env.example` documenting all required environment variables
- Build-time and runtime validation preventing missing env vars
- Enhanced CSP protecting against XSS without breaking functionality
- API key rotation strategy documented and implemented
- API route revalidation secured with secret-based authentication
- Rate limiting on all public API endpoints preventing abuse
- Input validation on all API routes preventing injection attacks
- Comprehensive security headers on all responses
- Security audit passed with no critical vulnerabilities
- Documentation of security practices in `docs/security.md`

### Phase 9: Error Handling, Loading States & Monitoring

**Goal of the Phase:**
Implement comprehensive error boundaries, loading states with Suspense, graceful fallbacks, and production monitoring for performance and errors.

**Detailed Implementation Steps:**

**Step 9.1: Implement Global Error Boundary Enhancement**
- Review existing `app/error.tsx` (already exists)
- Enhance with better error reporting and user experience:
  ```typescript
  'use client';

  export default function Error({
    error,
    reset,
  }: {
    error: Error & { digest?: string };
    reset: () => void;
  }) {
    useEffect(() => {
      // Log error to monitoring service
      console.error('Global error:', error);
      // Send to error tracking service (Sentry, etc.)
    }, [error]);

    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>Error ID: {error.digest}</p>
        <button onClick={reset}>Try again</button>
        <Link href="/">Return home</Link>
      </div>
    );
  }
  ```
- Ensure error includes useful context without exposing sensitive info
- Verification: Trigger error, confirm boundary catches and displays properly

**Step 9.2: Add Route-Specific Error Boundaries**
- For critical routes (startup/[id], shared/result/[type]/[id]), add specific error.tsx:
  ```typescript
  // app/(protected)/startup/[id]/error.tsx
  'use client';

  export default function StartupError({ error, reset }) {
    return (
      <div>
        <h2>Failed to load startup</h2>
        <p>The startup you're looking for might not exist or you don't have access.</p>
        <button onClick={reset}>Try again</button>
        <Link href="/projects">Back to projects</Link>
      </div>
    );
  }
  ```
- Provide context-specific error messages and recovery actions
- Verification: Test with invalid IDs, confirm custom errors display

**Step 9.3: Implement Loading States with Suspense**
- Review existing `app/loading.tsx` (already exists)
- Add loading.tsx for routes that don't have them:
  ```typescript
  // app/(protected)/startup/[id]/loading.tsx
  export default function Loading() {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading startup details...</p>
      </div>
    );
  }
  ```
- For client components with async data, wrap in Suspense:
  ```typescript
  <Suspense fallback={<LoadingSkeleton />}>
    <DashboardContent />
  </Suspense>
  ```
- Verification: Navigate between routes, confirm loading states appear

**Step 9.4: Create Skeleton Loading Components**
- Design skeleton screens matching actual content layout:
  ```typescript
  // components/LoadingSkeleton.tsx
  export function ProjectCardSkeleton() {
    return (
      <div className="card">
        <div className="skeleton h-6 w-3/4 mb-2" />
        <div className="skeleton h-4 w-full mb-1" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    );
  }
  ```
- Use in loading states for better perceived performance
- Verification: Loading states closely match actual content layout

**Step 9.5: Implement Graceful Degradation for Failed Components**
- For non-critical components (activity logs, notifications), handle errors gracefully:
  ```typescript
  function ActivityLog() {
    const { data, error, isLoading } = useQuery(['activity'], fetchActivity);

    if (error) {
      return <div className="text-muted">Unable to load activity</div>;
    }

    if (isLoading) return <ActivitySkeleton />;

    return <ActivityList data={data} />;
  }
  ```
- Don't let non-critical component failures crash entire page
- Verification: Simulate API failure, confirm partial page still functional

**Step 9.6: Implement Not Found Handling**
- Review existing `app/not-found.tsx` (already exists)
- Ensure all dynamic routes properly call notFound() when appropriate:
  ```typescript
  // app/shared/result/[type]/[id]/page.tsx
  import { notFound } from 'next/navigation';

  export default async function Page({ params }) {
    const data = await fetchResult(params.id);
    if (!data) {
      notFound(); // Triggers not-found.tsx
    }
    return <ResultDisplay data={data} />;
  }
  ```
- Add custom not-found.tsx for specific route groups if needed
- Verification: Test with invalid IDs, confirm 404 page displays

**Step 9.7: Implement Web Vitals Tracking**
- Create Web Vitals tracking in root layout:
  ```typescript
  // app/web-vitals.tsx
  'use client';

  import { useReportWebVitals } from 'next/web-vitals';

  export function WebVitals() {
    useReportWebVitals((metric) => {
      // Send to analytics service
      console.log(metric);

      // Example: send to Google Analytics
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.value),
          event_label: metric.id,
          non_interaction: true,
        });
      }
    });

    return null;
  }
  ```
- Import in root layout: `<WebVitals />`
- Track: LCP, FID, CLS, TTFB, FCP, INP
- Verification: Check analytics dashboard for Web Vitals data

**Step 9.8: Integrate Error Tracking Service (Optional)**
- Choose error tracking service: Sentry, Bugsnag, Rollbar, etc.
- Install Sentry (example):
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```
- Configure sentry.client.config.ts and sentry.server.config.ts
- Add SENTRY_DSN to environment variables
- Update error boundaries to report to Sentry:
  ```typescript
  import * as Sentry from '@sentry/nextjs';

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  ```
- Verification: Trigger error, confirm it appears in Sentry dashboard

**Step 9.9: Implement Performance Monitoring**
- Add performance marks for critical operations:
  ```typescript
  performance.mark('fetch-start');
  await fetchData();
  performance.mark('fetch-end');
  performance.measure('data-fetch', 'fetch-start', 'fetch-end');
  ```
- Monitor long tasks and input delay
- Consider using Next.js built-in instrumentation:
  ```typescript
  // instrumentation.ts
  export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      // Server-side monitoring
    }
    if (process.env.NEXT_RUNTIME === 'edge') {
      // Edge runtime monitoring
    }
  }
  ```
- Verification: Performance data collected and available for analysis

**Reasoning:**
Production applications must gracefully handle failures. Error boundaries prevent entire app crashes. Loading states improve perceived performance and reduce user anxiety. Monitoring provides visibility into real-world performance and errors, enabling data-driven improvements. Web Vitals tracking ensures Core Web Vitals remain optimized post-deployment.

**Expected Outcome:**
- Global and route-specific error boundaries handling all error scenarios
- Loading states with Suspense for all async operations
- Skeleton screens providing content-aware loading states
- Graceful degradation for non-critical component failures
- Proper 404 handling for all invalid routes
- Web Vitals tracking integrated with analytics
- Error tracking service (Sentry) capturing all production errors
- Performance monitoring providing insights into bottlenecks
- User experience improved with clear feedback for all states
- Documentation of error handling patterns in `docs/error-handling.md`

### Phase 10: Edge Runtime Optimization & Advanced Features

**Goal of the Phase:**
Maximize use of Edge Runtime for globally distributed low-latency responses, implement advanced Next.js features like partial prerendering, and optimize for global audience.

**Detailed Implementation Steps:**

**Step 10.1: Audit Edge Runtime Compatibility**
- Review all pages and API routes to determine Edge Runtime compatibility
- Landing page already uses Edge Runtime (app/page.tsx line 10)
- Check Node.js API usage that would prevent Edge compatibility:
  - File system operations (fs)
  - Native Node.js modules
  - Large dependencies not compatible with Edge
- Create compatibility matrix: route → compatible/incompatible → blockers
- Verification: Document edge-compatible routes in `docs/edge-compatibility.md`

**Step 10.2: Migrate API Routes to Edge Runtime**
- For simple API routes (revalidation endpoints), add Edge Runtime:
  ```typescript
  // app/api/revalidate/route.ts
  export const runtime = 'edge';

  export async function POST(request: Request) {
    // Revalidation logic using only Web APIs
  }
  ```
- Ensure routes only use Web standard APIs (fetch, Request, Response)
- Avoid Node.js-specific APIs
- Test edge functions locally: `next dev` automatically simulates Edge
- Verification: Build and check `.next/server/` for edge functions

**Step 10.3: Optimize Shared Result Pages for Edge**
- Shared result page already uses Edge Runtime (line 12 in shared/result/[type]/[id]/page.tsx)
- Verify edge compatibility of fetchResult function
- Ensure no Node.js dependencies in rendering path
- Test edge runtime performance vs. Node.js runtime:
  - Deploy both versions
  - Compare TTFB using Lighthouse or WebPageTest
- Verification: Confirm faster TTFB with Edge Runtime

**Step 10.4: Implement Edge Middleware Enhancements**
- Review current middleware.ts (Clerk authentication)
- Middleware already runs on Edge by default
- Add performance optimizations:
  ```typescript
  export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const { pathname } = req.nextUrl;

    // Add custom headers for CDN caching
    const response = NextResponse.next();

    if (pathname.startsWith('/shared/')) {
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    }

    return response;
  });
  ```
- Consider A/B testing in middleware for feature flags
- Verification: Test middleware performance with high request volume

**Step 10.5: Evaluate Partial Prerendering (PPR)**
- Next.js 15 supports experimental PPR (static shell + dynamic content)
- Enable in next.config.ts:
  ```typescript
  experimental: {
    ppr: 'incremental', // Enable per-route
  }
  ```
- For pages with static layout and dynamic content (e.g., dashboard):
  ```typescript
  export const experimental_ppr = true;

  export default function Dashboard() {
    return (
      <div>
        <StaticHeader />
        <Suspense fallback={<Skeleton />}>
          <DynamicContent />
        </Suspense>
      </div>
    );
  }
  ```
- Test PPR impact on performance and TTFB
- Verification: Measure TTFB improvement, static shell served instantly

**Step 10.6: Implement Internationalization Preparation**
- If planning global expansion, prepare for i18n:
- Structure for i18n-ready paths:
  ```typescript
  // middleware.ts
  const locales = ['en', 'es', 'fr'];
  const defaultLocale = 'en';

  function getLocale(req: NextRequest) {
    // Detect from Accept-Language header or cookie
  }

  if (!locales.some(locale => pathname.startsWith(`/${locale}`))) {
    const locale = getLocale(req);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
  }
  ```
- Set up directory structure for future i18n: `app/[locale]/`
- Document i18n strategy for future implementation
- Verification: Structure prepared, localization can be added without refactor

**Step 10.7: Implement Prefetching Strategy**
- For common navigation paths, implement Link prefetching:
  ```typescript
  <Link href="/projects" prefetch={true}>
    Projects
  </Link>
  ```
- Consider prefetch strategy per route:
  - High-traffic routes: prefetch={true}
  - Low-traffic routes: prefetch={false}
  - Dynamic routes: conditional prefetching based on likelihood
- Implement custom prefetch for API data:
  ```typescript
  function useProjectsPrefetch() {
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
      queryClient.prefetchQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
      });
    }, []);
  }
  ```
- Verification: Network tab shows prefetched resources, instant navigation

**Step 10.8: Implement Route Groups Optimization**
- Review route group structure: `(protected)` already implemented
- Consider additional route groups for organizational purposes:
  ```
  app/
  ├── (marketing)/     # Landing, pricing, about
  ├── (legal)/         # Privacy, terms
  ├── (auth)/          # Sign in, sign up
  ├── (protected)/     # Dashboard routes
  ├── (public-tools)/  # Shared results, public pages
  ```
- Each group can have its own layout with specific optimizations
- Verification: Clear separation of concerns, optimal rendering per group

**Step 10.9: Advanced Caching with CDN Integration**
- If using Vercel, leverage Edge Network caching automatically
- For custom CDN (Cloudflare), implement cache headers strategically:
  ```typescript
  // next.config.ts
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'CDN-Cache-Control',
            value: 'public, s-maxage=31536000, immutable',
          },
        ],
      },
    ];
  }
  ```
- Implement cache versioning for immutable resources
- Use Vercel's Edge Config for dynamic configuration without redeployment
- Verification: CDN cache hit rates above 80% for static content

**Reasoning:**
Edge Runtime provides globally distributed compute, reducing latency for users worldwide. PPR combines static and dynamic content for optimal performance. Strategic prefetching makes navigation feel instant. Proper route organization and CDN integration ensure maximum performance at scale.

**Expected Outcome:**
- Maximum routes migrated to Edge Runtime where compatible
- API routes running on Edge for global low latency
- Shared result pages optimized for edge delivery
- Enhanced middleware with caching and performance optimizations
- PPR evaluated and implemented for applicable pages
- I18n structure prepared for future expansion
- Prefetching strategy improving perceived performance
- Route groups organized for optimal rendering
- CDN integration maximizing cache hit rates
- Measurable improvements: TTFB reduced by 30-50% globally
- Documentation of edge optimization strategy in `docs/edge-optimization.md`

## Integration Details

### Phase-to-Phase Dependencies

**Sequential Dependencies:**
- Phase 1 must complete before all others (provides baseline and audit data)
- Phase 2 should complete before Phase 3 (caching strategy depends on rendering strategy)
- Phase 4 can run parallel to Phases 2-3 (image optimization is independent)
- Phase 5 can run parallel to Phases 2-4 (bundle optimization is independent)
- Phase 6 can run after Phase 2 (SEO depends on stable rendering)
- Phase 7 can run parallel to Phases 4-6 (font/script optimization is independent)
- Phase 8 should complete early (security is foundational)
- Phase 9 should run toward end (monitoring captures all optimizations)
- Phase 10 is final (edge optimization builds on all previous phases)

**Recommended Execution Order:**
1. Phase 1 (Audit) - Required first
2. Phase 8 (Security) - Foundational, run early
3. Phases 2, 4, 5, 7 (Parallel) - Core optimizations
4. Phase 3 (Caching) - After Phase 2
5. Phase 6 (SEO) - After Phase 2
6. Phase 9 (Monitoring) - After core optimizations
7. Phase 10 (Edge) - Final polish

### Backend Integration

**API Communication:**
- All data fetching flows through lib/api.ts (client) and lib/server/fetchers.ts (server)
- Maintain existing API contract with NEXT_PUBLIC_API_URL
- No backend changes required for frontend optimizations
- Backend should support cache headers for optimal caching
- Backend should implement proper CORS headers for edge requests

**Authentication Flow:**
- Clerk handles authentication, tokens passed to backend via Authorization header
- Middleware intercepts all requests, validates auth before reaching pages
- Server components use auth() or currentUser() from @clerk/nextjs/server
- Client components receive auth state via ClerkProvider context

**Data Flow:**
1. User requests page → Middleware validates auth → Server component fetches initial data with cache tags → Client component hydrates with React Query → User interactions trigger client-side fetches via lib/api.ts

### Frontend Integration

**Component Architecture:**
- Maintain clear separation: server components for data fetching, client components for interactivity
- Server components should not import client components directly; use wrapper pattern
- Client components marked with 'use client' directive at top of file
- Shared types in lib/types for consistency across server/client boundary

**State Management:**
- React Query for server state (API data)
- Zustand for client state (UI state, local preferences)
- No mixing of concerns; clear boundaries between server and client state

**Styling:**
- Tailwind CSS for all styling, maintain consistency
- Use CSS variables for theming (already implemented)
- Avoid inline styles except for dynamic values

### CI/CD Integration

**Build Process:**
1. Install dependencies: `npm ci`
2. Run linter: `npm run lint` (fix errors found)
3. Type check: `npx tsc --noEmit`
4. Build: `npm run build`
5. Analyze bundle (optional): `ANALYZE=true npm run build`

**Deployment Process:**
1. Build succeeds → Static files generated in `.next/`
2. Deploy to Vercel (or alternative):
   - Vercel automatically detects Next.js and configures
   - Set environment variables in Vercel dashboard
   - Enable Edge Network for global distribution
3. Post-deployment:
   - Run Lighthouse audit on production URL
   - Verify all routes accessible
   - Check monitoring dashboards for errors

**Environment-Specific Configurations:**
- Development: Hot reload, verbose logging, no optimizations
- Staging: Production build, test environment variables
- Production: Full optimizations, minification, error tracking enabled

### Database Integration

- No direct database access from frontend
- All database operations via backend API
- Consider implementing GraphQL or tRPC for type-safe API communication (future enhancement)

### Testing Integration

**Testing After Each Phase:**
- Unit tests: Component rendering, utility functions
- Integration tests: API communication, data flow
- E2E tests: Critical user journeys (sign up, create project, view results)
- Performance tests: Lighthouse, WebPageTest, Core Web Vitals monitoring

**Testing Tools:**
- Jest for unit/integration tests
- Playwright or Cypress for E2E tests
- Lighthouse CI for automated performance checks
- React Testing Library for component tests

## Environment Variables

### Required Environment Variables

**Client-Side (NEXT_PUBLIC_ prefix):**

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.uncubed.me/api
# Used in: lib/api.ts, lib/server/fetchers.ts
# Purpose: Backend API endpoint for all data fetching
# Example: https://api.uncubed.me/api or http://localhost:3001/api for development

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://uncubed.me
# Used in: app/sitemap.ts, app/robots.ts, metadata generation
# Purpose: Canonical URL for the application, used in sitemaps and social metadata
# Example: https://uncubed.me (production) or http://localhost:3000 (development)

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
# Used in: ClerkProvider in root-providers.tsx
# Purpose: Clerk public key for client-side authentication
# Example: pk_test_xxxxx (development) or pk_live_xxxxx (production)
# Obtain from: Clerk dashboard → API Keys
```

**Server-Side (Private):**

```env
# Authentication
CLERK_SECRET_KEY=sk_live_xxxxx
# Used in: Server-side auth() and currentUser() calls
# Purpose: Clerk secret key for server-side authentication and token validation
# Security: NEVER expose to client, server-only
# Example: sk_test_xxxxx (development) or sk_live_xxxxx (production)
# Obtain from: Clerk dashboard → API Keys

# Revalidation
REVALIDATION_SECRET=random_secret_string_here
# Used in: app/api/revalidate/ routes
# Purpose: Secure revalidation endpoints to prevent unauthorized cache clearing
# Security: Use cryptographically strong random string
# Generate with: openssl rand -base64 32

# Monitoring (Optional)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
# Used in: Sentry configuration if Phase 9.8 implemented
# Purpose: Error tracking and monitoring
# Obtain from: Sentry dashboard → Project Settings

NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# Used in: Google Analytics script in root layout if implemented
# Purpose: Web analytics tracking
# Obtain from: Google Analytics dashboard
```

### Environment Variable Management

**Local Development:**
1. Copy `.env.example` to `.env.local`
2. Fill in all required variables with development values
3. Never commit `.env.local` to version control (already in .gitignore)

**Staging/Production:**
1. Set environment variables in hosting platform (Vercel, AWS, etc.)
2. Use different values for staging vs. production
3. Rotate secrets regularly (every 90 days)

**Validation:**
- Build-time validation in next.config.ts (Phase 8.2)
- Runtime validation in lib/env.ts helpers (Phase 8.3)
- Clear error messages if variables missing

## Testing After Implementation

### Phase-Specific Testing

**Phase 1 - Audit Testing:**
- [ ] Bundle analysis report generated successfully
- [ ] Lighthouse reports created for all key pages
- [ ] Image inventory complete with sizes and formats
- [ ] Rendering strategy matrix documents all routes
- [ ] Baseline metrics documented

**Phase 2 - Rendering Strategy Testing:**
- [ ] Landing page generates static HTML at build time
- [ ] Privacy/Terms pages fully static, no revalidation
- [ ] Shared result pages use ISR with correct revalidation
- [ ] Protected routes use server component + client pattern
- [ ] Dynamic routes have proper metadata and error handling
- [ ] Test with: `npm run build` and inspect `.next/server/` for static pages

**Phase 3 - Caching Testing:**
- [ ] Cache tags working, revalidation invalidates correct data
- [ ] React Query cache persisting between navigations
- [ ] Optimistic updates work with proper rollback on error
- [ ] CDN cache headers present in responses
- [ ] No duplicate API requests in Network tab
- [ ] Test with: React Query Devtools, Network tab monitoring

**Phase 4 - Image Testing:**
- [ ] All images using next/image component
- [ ] WebP/AVIF images loading correctly
- [ ] Priority images have preload link in HTML
- [ ] Below-fold images lazy loading
- [ ] No Cumulative Layout Shift from images
- [ ] Test with: Lighthouse (LCP, CLS), Network tab (image formats)

**Phase 5 - Bundle Testing:**
- [ ] PDF libraries not in main bundle
- [ ] Framer Motion code split
- [ ] Modals load on-demand
- [ ] Main bundle reduced to target size (<200KB gzipped)
- [ ] No unused dependencies remaining
- [ ] Test with: `npm run analyze`, bundle size comparison

**Phase 6 - SEO Testing:**
- [ ] Dynamic sitemap includes all public routes
- [ ] Structured data validates in Google Rich Results Test
- [ ] All pages have unique metadata
- [ ] Robots.txt has correct directives
- [ ] Semantic HTML structure correct
- [ ] Test with: Google Rich Results Test, Lighthouse SEO audit, sitemap.xml inspection

**Phase 7 - Font/Script Testing:**
- [ ] Fonts preloaded, no FOIT/FOUT
- [ ] Third-party scripts use next/script with correct strategy
- [ ] Analytics scripts load after interactive
- [ ] Font CSS variables working correctly
- [ ] Test with: Network waterfall, font loading timeline

**Phase 8 - Security Testing:**
- [ ] Build fails if required env vars missing
- [ ] CSP headers present, no violations in console
- [ ] API revalidation endpoint requires secret
- [ ] Rate limiting working on API routes
- [ ] Input validation rejecting invalid requests
- [ ] Test with: curl requests, browser console, rate limit testing

**Phase 9 - Error/Monitoring Testing:**
- [ ] Global error boundary catches errors
- [ ] Route-specific error boundaries work
- [ ] Loading states appear on navigation
- [ ] Skeleton screens match content layout
- [ ] 404 page displays for invalid routes
- [ ] Web Vitals tracked in analytics
- [ ] Test with: Intentional errors, slow network simulation, invalid routes

**Phase 10 - Edge Testing:**
- [ ] Edge Runtime routes deploy successfully
- [ ] TTFB improved with Edge Runtime
- [ ] Middleware performs well under load
- [ ] Prefetching working for common paths
- [ ] CDN cache hit rates high (>80%)
- [ ] Test with: WebPageTest from multiple locations, CDN analytics

### Critical Test Cases

**Functional Tests:**
1. User sign up flow completes successfully
2. User sign in redirects to /home
3. Create new project saves and appears in list
4. View project details loads correct data
5. Shared result page accessible without auth
6. Landing page loads without JavaScript (SSR test)

**Performance Tests:**
1. Landing page LCP < 2.5s
2. Landing page FID < 100ms
3. Landing page CLS < 0.1
4. TTFB < 600ms for static pages
5. Main bundle < 200KB gzipped
6. Total page weight < 2MB

**Security Tests:**
1. Protected routes redirect to sign-in when unauthenticated
2. API routes return 401 without valid token
3. CSP blocks inline scripts (test with violation)
4. Rate limiting returns 429 after limit exceeded
5. Environment variables not exposed in client bundle

**Compatibility Tests:**
1. Works in Chrome, Firefox, Safari, Edge (latest versions)
2. Mobile responsive on iOS and Android
3. Works with JavaScript disabled (for SSR pages)
4. Works with slow 3G connection
5. Works with high latency (500ms+)

### Automated Testing Setup

**GitHub Actions Workflow (example):**
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npx playwright test
      - name: Lighthouse CI
        run: |
          npm run start &
          sleep 5
          npx lighthouse http://localhost:3000 --output=json
```

**Continuous Monitoring:**
- Set up Vercel Analytics for automatic Web Vitals tracking
- Configure Sentry alerts for error rate thresholds
- Monitor bundle size in CI (fail if exceeds threshold)

## Progress Tracker

### Phase 1: Audit & Baseline
- [ ] 1.1 Bundle analysis complete
- [ ] 1.2 Lighthouse audits documented
- [ ] 1.3 Image optimization audit finished
- [ ] 1.4 Rendering strategy matrix created
- [ ] 1.5 Dependency analysis for code splitting
- [ ] Documentation: `docs/optimization-audit.md` created

### Phase 2: Rendering Strategies
- [ ] 2.1 Landing page optimization verified
- [ ] 2.2 Static pages (privacy/terms) configured
- [ ] 2.3 Shared result pages enhanced
- [ ] 2.4 Protected routes optimized
- [ ] 2.5 Dynamic startup routes configured
- [ ] 2.6 Auth routes optimized
- [ ] 2.7 API routes secured
- [ ] Documentation: `docs/rendering-strategy-matrix.md` updated

### Phase 3: Advanced Caching
- [ ] 3.1 Cache tag system expanded
- [ ] 3.2 Revalidation timers optimized
- [ ] 3.3 Request deduplication enhanced
- [ ] 3.4 React Query configuration improved
- [ ] 3.5 Optimistic updates implemented
- [ ] 3.6 CDN cache headers configured
- [ ] 3.7 SWR pattern for non-critical data
- [ ] Documentation: `docs/caching-architecture.md` created

### Phase 4: Image Optimization
- [ ] 4.1 Image usage audit complete
- [ ] 4.2 Images converted to WebP/AVIF
- [ ] 4.3 All images using next/image
- [ ] 4.4 Priority loading implemented
- [ ] 4.5 Lazy loading configured
- [ ] 4.6 Responsive images optimized
- [ ] 4.7 Video assets optimized
- [ ] 4.8 Static assets optimized
- [ ] Documentation: `docs/image-optimization-audit.md` complete

### Phase 5: Bundle Optimization
- [ ] 5.1 Bundle composition analyzed
- [ ] 5.2 PDF libraries dynamically imported
- [ ] 5.3 Framer Motion code split
- [ ] 5.4 Modal components code split
- [ ] 5.5 Lucide React imports optimized
- [ ] 5.6 Clerk components split
- [ ] 5.7 Route-based code splitting verified
- [ ] 5.8 Tree shaking audit complete
- [ ] 5.9 Unused dependencies removed
- [ ] Bundle size target achieved (<200KB gzipped)

### Phase 6: SEO Enhancement
- [ ] 6.1 Dynamic sitemap expanded
- [ ] 6.2 Organization schema implemented
- [ ] 6.3 Product schema for pricing added
- [ ] 6.4 FAQPage schema implemented
- [ ] 6.5 Per-page metadata enhanced
- [ ] 6.6 Breadcrumb schema added
- [ ] 6.7 robots.txt optimized
- [ ] 6.8 Canonical URLs implemented
- [ ] 6.9 Semantic HTML audit complete
- [ ] Documentation: `docs/seo-implementation.md` created

### Phase 7: Font & Script Optimization
- [ ] 7.1 Font implementation audited
- [ ] 7.2 Next Font configuration optimized
- [ ] 7.3 Font subsetting implemented
- [ ] 7.4 Self-hosted fonts (if applicable)
- [ ] 7.5 Third-party scripts audited
- [ ] 7.6 Scripts using next/script
- [ ] 7.7 Clerk script optimization verified
- [ ] 7.8 Resource hints added
- [ ] 7.9 Icon font strategy implemented
- [ ] Documentation: `docs/asset-optimization.md` created

### Phase 8: Security
- [ ] 8.1 Environment variables audited
- [ ] 8.2 Build-time validation implemented
- [ ] 8.3 Runtime validation implemented
- [ ] 8.4 CSP enhanced
- [ ] 8.5 API key rotation strategy documented
- [ ] 8.6 Revalidation endpoints secured
- [ ] 8.7 Rate limiting implemented
- [ ] 8.8 Request validation implemented
- [ ] 8.9 Security headers verified
- [ ] Documentation: `docs/security.md` created

### Phase 9: Error Handling & Monitoring
- [ ] 9.1 Global error boundary enhanced
- [ ] 9.2 Route-specific error boundaries added
- [ ] 9.3 Loading states with Suspense
- [ ] 9.4 Skeleton components created
- [ ] 9.5 Graceful degradation implemented
- [ ] 9.6 Not found handling verified
- [ ] 9.7 Web Vitals tracking implemented
- [ ] 9.8 Error tracking service integrated
- [ ] 9.9 Performance monitoring implemented
- [ ] Documentation: `docs/error-handling.md` created

### Phase 10: Edge Runtime & Advanced
- [ ] 10.1 Edge runtime compatibility audited
- [ ] 10.2 API routes migrated to Edge
- [ ] 10.3 Shared pages optimized for Edge
- [ ] 10.4 Middleware enhanced
- [ ] 10.5 PPR evaluated and implemented
- [ ] 10.6 i18n structure prepared
- [ ] 10.7 Prefetching strategy implemented
- [ ] 10.8 Route groups optimized
- [ ] 10.9 CDN integration optimized
- [ ] Documentation: `docs/edge-optimization.md` created

### Final Verification
- [ ] All Lighthouse scores meet targets (90+)
- [ ] Core Web Vitals pass thresholds (LCP<2.5s, FID<100ms, CLS<0.1)
- [ ] Bundle size reduced by 40%+ from baseline
- [ ] TTFB improved by 30%+ from baseline
- [ ] Error rate below 0.1% in production
- [ ] Cache hit rate above 80%
- [ ] All security headers present
- [ ] All critical test cases passing
- [ ] Production deployment successful
- [ ] Monitoring dashboards configured
- [ ] Complete documentation delivered

## Risks & Considerations

### Performance Risks

**Risk: Over-optimization Leading to Complexity**
- Mitigation: Measure impact of each optimization, only keep changes that provide measurable improvement (>5%)
- Rollback plan: Git branches per phase, easy to revert specific changes

**Risk: Edge Runtime Compatibility Issues**
- Mitigation: Thorough testing in Phase 10.1, maintain Node.js runtime fallback for incompatible routes
- Alternative: Keep critical routes on Node.js runtime if Edge causes issues

**Risk: Caching Causing Stale Data Issues**
- Mitigation: Implement proper cache invalidation with tags, add manual revalidation endpoints, monitor cache hit/miss rates
- Rollback: Reduce revalidation timers or disable caching for problematic routes

### Security Risks

**Risk: Environment Variable Exposure**
- Mitigation: Build-time and runtime validation (Phase 8), never use NEXT_PUBLIC_ prefix for secrets, audit client bundles
- Detection: Regular security scans with tools like Snyk or GitHub Dependabot

**Risk: CSP Too Restrictive Breaking Functionality**
- Mitigation: Incremental CSP tightening (Phase 8.4), test all features after changes, maintain CSP report-only mode initially
- Rollback: Keep previous CSP configuration in version control

**Risk: Rate Limiting Too Aggressive**
- Mitigation: Start with generous limits, monitor 429 responses, implement per-user limits instead of IP-based for authenticated routes
- Adjustment: Make rate limits configurable via environment variables

### Compatibility Risks

**Risk: Breaking Changes to Existing Features**
- Mitigation: Comprehensive testing after each phase, maintain feature parity, user acceptance testing
- Rollback: Git branches per phase, immediate revert capability

**Risk: Third-Party Service Degradation (Clerk, Backend API)**
- Mitigation: Implement proper error boundaries and fallbacks (Phase 9), add retry logic with exponential backoff
- Monitoring: Alert on elevated error rates for third-party calls

**Risk: Bundle Size Increases from New Dependencies**
- Mitigation: Audit every new dependency, use bundle analyzer after changes, set bundle size budgets in CI
- Prevention: Prefer native solutions over libraries where possible

### Maintenance Considerations

**Long-term Maintenance:**
- Keep Next.js updated to latest stable version (currently 15.x)
- Monitor Core Web Vitals in production monthly
- Review and rotate API keys quarterly (Phase 8.5)
- Audit dependencies for security vulnerabilities monthly
- Review caching strategy quarterly based on usage patterns
- Update bundle analysis and Lighthouse reports quarterly

**Technical Debt Prevention:**
- Document all optimization decisions with reasoning
- Maintain test coverage above 80%
- Regular code reviews focusing on adherence to patterns
- Quarterly refactoring sessions to address accumulating issues

**Knowledge Transfer:**
- Complete documentation of all phases in `docs/` directory
- Inline code comments explaining complex optimizations
- Runbook for common operational tasks (cache clearing, deployment, rollback)
- Training sessions for team members on optimization patterns

### Rollback Strategy

**Immediate Rollback (Production Issues):**
1. Identify problematic phase/feature via monitoring
2. Revert deployment to previous stable version
3. Investigate issue in staging environment
4. Fix and re-deploy with additional testing

**Gradual Rollback (Performance Regression):**
1. Disable feature flags for new optimizations
2. Compare metrics with previous baseline
3. Identify specific optimization causing regression
4. Revert that specific change while keeping others
5. Document why optimization didn't work for future reference

**Git Strategy:**
- Each phase in separate branch
- Merge to main only after testing
- Tag stable releases for easy rollback reference
- Maintain hotfix branch for critical production fixes

## Conclusion

This comprehensive plan provides a roadmap to transform the Next.js application into a production-grade, optimized application leveraging all modern Next.js features. The plan is structured in 10 distinct phases, each with detailed implementation steps, reasoning, and expected outcomes.

**Key Success Metrics:**
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Bundle size reduced by 40-60%
- TTFB improved by 30-50%
- SEO score above 90 in Lighthouse
- Error rate below 0.1%
- Cache hit rate above 80%

**Estimated Timeline:**
- Phase 1: 1-2 days (Audit)
- Phases 2-7: 2-3 weeks (Core optimizations, can be parallelized)
- Phase 8: 1 week (Security)
- Phase 9: 1 week (Monitoring)
- Phase 10: 1 week (Advanced features)
- Total: 5-7 weeks with a single developer, 3-4 weeks with a team

**Next Steps:**
1. Review and approve this plan
2. Set up development environment with all required tools
3. Create project board tracking all checklist items
4. Begin with Phase 1 audit to establish baseline
5. Execute phases sequentially or in parallel as outlined
6. Test thoroughly after each phase
7. Monitor metrics continuously in production
8. Iterate based on real-world performance data
