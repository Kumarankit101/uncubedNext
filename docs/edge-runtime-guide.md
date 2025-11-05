# Edge Runtime Optimization Guide

## Current Status
Landing page (`app/page.tsx`) already uses edge runtime:
```typescript
export const runtime = 'edge';
export const revalidate = 3600;
```

## What is Edge Runtime?

Edge Runtime runs your code at the edge (close to users) for:
- ⚡ **Faster response times** (reduced latency)
- 🌍 **Global distribution** (runs worldwide)
- 📦 **Smaller bundle size** (limited APIs)
- 💰 **Lower costs** (less compute time)

## When to Use Edge Runtime

### ✅ Good Candidates:
- Static/ISR pages with simple data fetching
- API routes that don't need Node.js APIs
- Middleware
- Image optimization endpoints
- Authentication checks
- Simple redirects

### ❌ Not Suitable:
- Pages using Node.js-specific APIs (fs, crypto, etc.)
- Heavy computational tasks
- Database connections requiring Node.js drivers
- File uploads
- WebSocket connections

## Current Implementation

### Already Using Edge:
1. **Landing Page** (`app/page.tsx`)
   - Edge runtime ✅
   - ISR with 1-hour revalidation ✅
   - Good candidate (mostly static)

2. **Shared Results** (`app/shared/result/[type]/[id]/page.tsx`)
   - Edge runtime ✅
   - ISR with 5-minute revalidation ✅
   - Dynamic metadata ✅

### Candidates for Edge Migration:
1. **Privacy Page** (`app/privacy/page.tsx`)
   - Fully static content
   - No server-side logic
   - **Recommendation:** Add `export const runtime = 'edge'`

2. **Terms Page** (`app/terms/page.tsx`)
   - Fully static content
   - No server-side logic
   - **Recommendation:** Add `export const runtime = 'edge'`

3. **API Routes** (if any)
   - Check for Node.js dependency
   - Migrate simple routes to edge

### Not Suitable for Edge:
- Protected routes (use Clerk, need Node.js)
- Agent execution pages (heavy computation)
- File upload/download routes
- Database-heavy operations

## Migration Checklist

### For Each Page:
- [ ] Check for Node.js API usage
- [ ] Verify all dependencies are edge-compatible
- [ ] Test with `export const runtime = 'edge'`
- [ ] Monitor bundle size (edge has limits)
- [ ] Verify external API calls work
- [ ] Check for proper error handling

### Edge-Compatible Libraries:
- ✅ fetch (native)
- ✅ Response/Request (native)
- ✅ Web Crypto API
- ✅ URL/URLSearchParams
- ✅ Most React Server Components
- ❌ fs, path, crypto (Node.js)
- ❌ Most database drivers

## Performance Benefits

### Estimated Improvements:
- **TTFB:** 30-50% faster (edge vs. serverless)
- **Global latency:** Up to 200ms improvement
- **Cold start:** ~50ms vs ~200ms (serverless)
- **Cost:** ~40% reduction in compute costs

### Real-World Example:
```
Before (Node.js Serverless):
- Mumbai request to US server: ~300ms TTFB
- Cold start overhead: ~200ms
- Total: ~500ms

After (Edge Runtime):
- Mumbai request to nearest edge: ~50ms TTFB
- No cold start (always warm)
- Total: ~50ms

Improvement: 90% faster! 🚀
```

## Implementation Steps

### Step 1: Test Locally
Add to page:
```typescript
export const runtime = 'edge';
```

Run dev server and check for errors.

### Step 2: Check Compatibility
Look for:
- `require()` statements (use `import` instead)
- Node.js APIs (`fs`, `path`, etc.)
- Database clients (may need edge-compatible versions)

### Step 3: Deploy & Monitor
- Deploy to Vercel/Edge platform
- Monitor error rates
- Check performance metrics
- Verify functionality

### Step 4: Optimize
- Minimize dependencies
- Use edge-native APIs
- Implement proper caching
- Add error handling

## Edge Runtime Limits

### Bundle Size:
- Maximum: 1MB (after compression)
- Recommendation: Keep under 500KB
- Strategy: Dynamic imports, code splitting

### Execution Time:
- Maximum: 30 seconds (Vercel)
- Recommendation: < 10 seconds
- Strategy: Optimize algorithms, use streaming

### Memory:
- Limited compared to Node.js
- No file system access
- Use in-memory caching wisely

## Best Practices

### 1. Streaming Responses
```typescript
export const runtime = 'edge';

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode('chunk 1'));
      controller.enqueue(encoder.encode('chunk 2'));
      controller.close();
    },
  });

  return new Response(stream);
}
```

### 2. Proper Error Handling
```typescript
export const runtime = 'edge';

export async function GET() {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    console.error('Edge function error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 3. Caching Headers
```typescript
export const runtime = 'edge';
export const revalidate = 3600; // 1 hour

// Or manual cache control
return new Response(data, {
  headers: {
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  },
});
```

## Monitoring

### Key Metrics to Track:
- Edge invocations count
- Execution time (p50, p95, p99)
- Error rate
- Cache hit rate
- Geographic distribution

### Tools:
- Vercel Analytics
- Cloudflare Analytics
- Custom logging (structured logs)
- Real User Monitoring (RUM)

## Current Recommendation

### Immediate Actions:
1. ✅ Keep edge runtime on landing page (already done)
2. ✅ Keep edge runtime on shared results (already done)
3. ⚠️ DON'T add to protected routes (Clerk needs Node.js)
4. ✅ Consider for privacy/terms if build issue resolved

### Future Optimizations:
1. Migrate simple API routes to edge
2. Implement edge caching strategies
3. Use edge for image optimization
4. Consider edge for static asset serving

## Conclusion

Edge runtime is already well-implemented for appropriate routes. The main optimization opportunity is to ensure we're not adding edge runtime to incompatible routes and to monitor performance of existing edge deployments.

**Current Score:** 8/10 ✅
**Improvement Potential:** Minimal (already well-optimized)
