# Next.js Production Optimization Audit

**Date:** 2025-11-05
**Project:** Uncubed Next.js Application
**Next.js Version:** 15.5.6
**Node Version:** Latest

---

## Executive Summary

This audit establishes a baseline for the current state of the application and identifies key optimization opportunities across performance, bundle size, rendering strategies, and SEO.

### Key Findings:
- ✅ Bundle analysis successfully generated (2.6MB total reports)
- ⚠️ Build process has issues with static page generation
- ⚠️ Font loading from Google Fonts fails (network issue)
- ⚠️ Heavy dependencies identified: pdfjs-dist, html2pdf.js, framer-motion
- ⚠️ Missing structured optimization documentation

---

## 1. Bundle Analysis Results

### Generated Reports:
- **Client Bundle:** `/home/user/uncubedNext/.next/analyze/client.html` (888KB)
- **Node.js Bundle:** `/home/user/uncubedNext/.next/analyze/nodejs.html` (994KB)
- **Edge Bundle:** `/home/user/uncubedNext/.next/analyze/edge.html` (708KB)

### Major Dependencies Identified:

**Heavy Libraries (require code splitting):**
1. **pdfjs-dist** (~8MB) - Used in:
   - `/app/components/StartupResults/PitchDeckGeneratorResult.tsx`
   - Status: Already dynamically imported with `ssr: false`

2. **html2pdf.js** (~500KB+) - Used in:
   - Various result generation components
   - Status: Needs dynamic import implementation

3. **framer-motion** (~200-300KB) - Used in:
   - `/app/components/ui/Button.tsx`
   - `/app/(protected)/startup/[id]/page.tsx`
   - Multiple other components
   - Status: Needs conditional loading/code splitting

4. **react-pdf** - Depends on pdfjs-dist
   - Status: Already using dynamic imports

5. **@clerk/nextjs** - Authentication provider
   - Status: Properly configured, used only where needed

6. **@tanstack/react-query** - Data fetching
   - Status: Configured with 5-minute stale time

7. **zustand** - State management (lightweight, ~3KB)
   - Status: Good choice, minimal impact

8. **lucide-react** - Icon library
   - Status: optimizePackageImports enabled, but wildcard imports found:
     - Line 25 in `/app/(protected)/startup/[id]/page.tsx`: `import * as Icons from 'lucide-react';`
     - **Action Required:** Replace with specific imports

### Optimization Opportunities:
- [ ] Dynamic import html2pdf.js when PDF generation is triggered
- [ ] Code-split framer-motion for non-critical animations
- [ ] Replace wildcard lucide-react imports with specific imports
- [ ] Implement dynamic imports for modal components
- [ ] Consider removing unused dependencies

---

## 2. Current Rendering Strategy Analysis

### Landing Page (`app/page.tsx`)
- **Strategy:** Edge Runtime + ISR
- **Config:**
  - `export const runtime = 'edge'` ✅
  - `export const revalidate = 3600` (1 hour) ✅
- **Assessment:** Good implementation
- **Recommendation:** Consider increasing revalidate to 7200 (2 hours) for more cache stability

### Public Static Pages
- **Privacy (`app/privacy/page.tsx`):**
  - Current: Server component, no explicit config
  - Recommendation: Add `export const dynamic = 'force-static'` and `export const revalidate = false`

- **Terms (`app/terms/page.tsx`):**
  - Current: Server component, no explicit config
  - Recommendation: Add `export const dynamic = 'force-static'` and `export const revalidate = false`

### Shared Result Pages (`app/shared/result/[type]/[id]/page.tsx`)
- **Strategy:** Edge Runtime + ISR
- **Config:**
  - `export const runtime = 'edge'` ✅
  - `export const revalidate = 300` (5 minutes) ✅
  - `export const dynamicParams = true` ✅
  - `generateMetadata` implemented ✅
- **Assessment:** Excellent implementation
- **Recommendation:** Consider implementing `generateStaticParams` for popular results

### Protected Routes
- **Pattern:** Server component wrapper → Client component with React Query
- **Routes:**
  - `/home` - ✅ Implements server fetch + client hydration
  - `/projects` - Needs verification
  - `/agents` - Needs verification
  - `/billing` - Needs verification
  - `/credits` - Needs verification
  - `/help` - Needs verification
  - `/settings` - Needs verification
  - `/startup/[id]` - Client-only, needs server component wrapper

**Issue:** `/startup/[id]/page.tsx` is `'use client'` only
- Missing: `generateMetadata` for dynamic metadata
- Missing: Server-side initial data fetch
- Missing: Proper ISR configuration

### Authentication Routes
- **Sign-In/Sign-Up:** Client components using Clerk
- **Assessment:** Appropriate for authentication flows
- **Recommendation:** Ensure Clerk components are tree-shaken from non-auth routes

### Root Layout
- **Current Config:** `export const dynamic = 'force-dynamic'` (temporary)
- **Issue:** This disables static optimization globally
- **Recommendation:** Remove after fixing build issues, use per-route configuration

---

## 3. Build Issues Identified

### Critical Build Error:
```
Error: <Html> should not be imported outside of pages/_document.
Read more: https://nextjs.org/docs/messages/no-document-import-in-page
at x (.next/server/chunks/611.js:6:1351)
Error occurred prerendering page "/404"
```

### Analysis:
- Error occurs during static page generation
- Affects `/404` and `/_error` pages
- Persists even with simplified error pages
- Likely caused by a dependency during SSR/build time

### Attempted Fixes:
1. ✅ Simplified error.tsx and not-found.tsx (removed theme store, Button component)
2. ✅ Added `export const dynamic = 'force-dynamic'` to error pages
3. ✅ Added `output: 'standalone'` to next.config.ts
4. ❌ Issue persists - needs deeper investigation

### Workaround:
- Bundle analysis succeeds before build fails
- Can continue with optimization work
- Must resolve before production deployment

### Potential Causes:
1. react-pdf CSS imports (commented out for now)
2. Framer Motion during SSR
3. Clerk components during static generation
4. Theme store accessing `document` during build

### Next Steps:
- Investigate chunk 611.js source
- Check Clerk configuration for build-time issues
- Consider using `next.config.ts` to skip problematic page prerendering
- May need to upgrade/downgrade specific dependencies

---

## 4. Font Optimization Status

### Current Implementation:
- **Font:** Inter from Google Fonts
- **Status:** ⚠️ Disabled due to network fetch failure
- **Fallback:** Using system fonts (`font-sans`)

### Issues:
```
Failed to fetch font `Inter`: https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap
Please check your network connection.
```

### Recommendations (Phase 7):
1. Implement proper `next/font` configuration with:
   - `display: 'swap'`
   - `preload: true`
   - `fallback: ['system-ui', 'arial']`
   - `adjustFontFallback: true`
2. Consider self-hosting fonts using `next/font/local`
3. Use CSS variables for font family

---

## 5. Image Optimization Audit

### Images Found in Public Directory:
```bash
# To be executed:
find public -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" -o -name "*.svg" \)
```

### Current Configuration (next.config.ts):
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'uncubed.me' },
    { protocol: 'http', hostname: 'localhost' },
  ],
  unoptimized: false, // ✅ Optimization enabled
}
```

### Assessment:
- ✅ Image optimization enabled
- ✅ Remote patterns configured for external images
- ❌ Need to verify all images use `next/image`
- ❌ Need to identify LCP images for priority loading
- ❌ Need to check for WebP/AVIF conversion opportunities

### Action Items (Phase 4):
1. Audit all `<img>` tags and replace with `next/image`
2. Convert large images to WebP/AVIF
3. Add `priority` prop to above-fold images
4. Implement lazy loading for below-fold images
5. Optimize video assets (demo_1080.mp4)

---

## 6. Caching Implementation Status

### Server-Side Caching (`lib/server/fetchers.ts`):
```typescript
TAGS = {
  PLANS: 'plans',
  AGENTS: 'agents',
  PUBLIC_RESULT: (id: string) => `result:${id}`,
  USER_RESULTS: (userId: string) => `user-results:${userId}`,
  PROJECTS: (userId: string) => `projects:${userId}`,
}

DEFAULT_REVALIDATE = {
  PLANS: 1800,        // 30 minutes
  AGENTS: 600,        // 10 minutes
  PUBLIC_RESULT: 300, // 5 minutes
  PROJECTS: 60,       // 1 minute
}
```

**Assessment:**
- ✅ Cache tags implemented
- ✅ Revalidation timers configured
- ⚠️ Limited tag coverage (missing: STARTUP, USER_DATA, BILLING, CREDITS, SETTINGS)
- ✅ Using Next.js fetch cache with tags

### Client-Side Caching (`app/providers.tsx`):
```typescript
QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes
      gcTime: 1000 * 60 * 10,     // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

**Assessment:**
- ✅ React Query configured with conservative caching
- ⚠️ Could increase `gcTime` to 30 minutes for longer cache retention
- ⚠️ Missing optimistic updates
- ⚠️ No custom retry logic for different error types

### Request Deduplication (`lib/api.ts`):
```typescript
class ApiClient {
  private pendingRequests = new Map<string, Promise<any>>();
  // Implements request deduplication
}
```

**Assessment:**
- ✅ Basic deduplication implemented
- ⚠️ No timestamp-based expiration
- ⚠️ Could implement request batching

---

## 7. SEO Implementation Status

### Sitemap (`app/sitemap.ts`):
- **Current:** Only 3 static routes (/, /privacy, /terms)
- **Missing:** Dynamic routes for shared results
- **Recommendation:** Implement dynamic sitemap with all public routes

### Robots.txt (`app/robots.ts`):
- **Current:** Basic configuration with disallows
- **Assessment:** Adequate but could be enhanced with specific crawl directives

### Metadata:
- **Root Layout:** ✅ Comprehensive metadata with OpenGraph and Twitter cards
- **Landing Page:** ✅ Good metadata
- **Shared Results:** ✅ Implements `generateMetadata`
- **Protected Routes:** ⚠️ Missing specific metadata
- **Dynamic Routes:** ⚠️ `/startup/[id]` missing `generateMetadata`

### Structured Data:
- **Current:** Only on shared result pages (JSON-LD)
- **Missing:**
  - Organization schema
  - Product/Offer schema for pricing
  - FAQPage schema
  - Breadcrumb schema

---

## 8. Security Headers Status

### Current Implementation (next.config.ts lines 46-101):
- ✅ Comprehensive Content Security Policy
- ✅ HSTS
- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Permissions-Policy

**Assessment:** Strong security header implementation

### Environment Variables:
- ⚠️ No `.env.example` file
- ⚠️ No build-time validation
- ⚠️ No runtime validation
- Current vars in use:
  - NEXT_PUBLIC_API_URL
  - NEXT_PUBLIC_SITE_URL
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  - CLERK_SECRET_KEY

---

## 9. Performance Baseline (Estimated)

### Without Lighthouse (due to build issues):
**Estimated Metrics Based on Code Analysis:**

#### Positive Factors:
- ✅ Edge runtime on landing page
- ✅ ISR with reasonable revalidation
- ✅ Image optimization enabled
- ✅ Bundle analyzer configured
- ✅ React Query caching

#### Negative Factors:
- ❌ Large PDF libraries not fully optimized
- ❌ Framer Motion loaded globally
- ❌ Wildcard icon imports
- ❌ Force-dynamic on root layout (temporary)
- ❌ Missing font optimization

**Estimated Scores (to be verified with Lighthouse):**
- Performance: 70-80
- Accessibility: 85-95
- Best Practices: 80-90
- SEO: 75-85

**Core Web Vitals (Estimated):**
- LCP: 2.5-3.5s (needs improvement)
- FID: < 100ms (likely good)
- CLS: Unknown (depends on image implementation)

---

## 10. Priority Optimization Opportunities

### High Impact, Low Effort:
1. ✅ **Fix wildcard lucide-react import** - Immediate bundle size reduction
2. ✅ **Add static config to privacy/terms pages** - Better caching
3. ✅ **Expand cache tags** - Better granular invalidation
4. ✅ **Create `.env.example`** - Better DX and security

### High Impact, Medium Effort:
1. **Fix build issue** - Enable full static optimization
2. **Implement proper font loading** - Improve LCP and CLS
3. **Dynamic import html2pdf.js** - Reduce initial bundle
4. **Add generateMetadata to startup/[id]** - Better SEO

### Medium Impact, High Effort:
1. **Implement optimistic updates** - Better perceived performance
2. **Create dynamic sitemap** - Better SEO
3. **Add structured data schemas** - Rich snippets in search
4. **Optimize all images to WebP/AVIF** - Reduce bandwidth

---

## 11. Dependencies Analysis

### Production Dependencies (package.json):
- next: 15.5.6 ✅
- react: 18.3.1 ✅
- @clerk/nextjs: 6.34.1 ✅
- @tanstack/react-query: 5.90.2 ✅
- zustand: 4.5.0 ✅
- framer-motion: 11.0.0 ⚠️ (heavy, needs optimization)
- pdfjs-dist: 4.0.0 ⚠️ (very heavy, ~8MB)
- html2pdf.js: 0.10.3 ⚠️ (heavy, needs dynamic import)
- react-pdf: 7.7.1 ⚠️ (depends on pdfjs-dist)
- lucide-react: 0.344.0 ✅ (with optimizePackageImports)

### Security Vulnerabilities:
```
2 high severity vulnerabilities
Run `npm audit` for details
```
- **Action Required:** Review and fix security issues in Phase 8

### Unused Dependencies:
- **Action Required:** Run `npx depcheck` to identify unused packages

---

## 12. Next Steps

### Immediate (Phase 2-3):
1. Fix build issue preventing static generation
2. Implement optimal rendering strategies per route
3. Expand caching system with additional tags
4. Fix lucide-react wildcard import

### Short Term (Phase 4-7):
1. Image optimization audit and conversion
2. Bundle size optimization with dynamic imports
3. SEO enhancement with structured data
4. Font and script optimization

### Medium Term (Phase 8-10):
1. Security hardening and environment validation
2. Error handling and monitoring setup
3. Edge runtime optimization
4. Performance monitoring implementation

---

## Conclusion

The application has a solid foundation with Next.js 15, proper authentication, and modern tooling. However, there are significant optimization opportunities:

**Strengths:**
- Modern Next.js 15 with App Router
- Edge runtime on key pages
- Good security headers
- Proper authentication setup
- Caching foundation in place

**Weaknesses:**
- Build issues preventing full static optimization
- Heavy dependencies need code splitting
- Missing comprehensive SEO implementation
- Font loading issues
- Limited monitoring and error tracking

**Estimated Improvement Potential:**
- Bundle size reduction: 40-60%
- LCP improvement: 30-50%
- Lighthouse score improvement: +15-25 points

With systematic implementation of all 10 phases, this application can achieve production-grade performance with Core Web Vitals in the "Good" range and Lighthouse scores above 90 across all categories.
