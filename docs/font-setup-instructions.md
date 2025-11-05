# Font Setup Instructions

## Current Issue
Google Fonts fetch fails during build, causing font loading issues.

## Solution: Self-Hosted Fonts
Use `next/font/local` with self-hosted Inter font files.

## Steps to Implement

### 1. Download Inter Font
```bash
# Download from official source
wget https://github.com/rsms/inter/releases/download/v4.0/Inter-4.0.zip

# Or use npm package
npm install @fontsource/inter
```

### 2. Create Font Directory
```bash
mkdir -p public/fonts/inter
```

### 3. Extract WOFF2 Files
Copy these files to `public/fonts/inter/`:
- Inter-Regular.woff2 (400)
- Inter-Medium.woff2 (500)
- Inter-SemiBold.woff2 (600)
- Inter-Bold.woff2 (700)

### 4. Update Layout
Replace the Google Fonts import in `app/layout.tsx`:

**Before:**
```typescript
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});
```

**After:**
```typescript
import { inter } from './fonts';
```

Then use in the body:
```tsx
<body className={inter.className}>
```

### 5. Alternative: Use Fontsource
If you installed @fontsource/inter:

```typescript
// app/layout.tsx
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
```

## Font Loading Strategy

### Preload Critical Fonts
Next.js automatically adds preload links:
```html
<link rel="preload" href="/fonts/inter/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous">
```

### Font Display Strategy
- `swap`: Show fallback immediately, swap when font loads (best for performance)
- `optional`: Only use custom font if available quickly (best for slow connections)
- `fallback`: Brief blocking period, then swap (balance)

Current: `swap` - Best for most cases

### Fallback Font Stack
```css
font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
```

## Performance Benefits

### Before (Google Fonts):
- External DNS lookup (~20-50ms)
- TLS negotiation (~50-100ms)
- Download time (~100-200ms)
- Total: ~170-350ms + network latency
- Risk of failure (as currently experienced)

### After (Self-Hosted):
- Same origin, no DNS lookup
- Already connected, no TLS negotiation
- Cacheable with long max-age
- Total: ~20-50ms from disk cache
- 100% reliability

## Font Subsetting
To further reduce size, subset fonts to only needed characters:

```bash
# Using pyftsubset (install fonttools)
pip install fonttools

# Subset to Latin only
pyftsubset Inter-Regular.ttf \
  --unicodes="U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" \
  --flavor=woff2 \
  --output-file=Inter-Regular-subset.woff2
```

## Verification

### Check Font Loading
Open DevTools → Network → Filter by "font"
- Should see fonts loading from same origin
- Should have proper cache headers
- Should use woff2 format

### Check Performance
- LCP should improve by 100-200ms
- CLS should improve with adjustFontFallback
- No external requests in Network waterfall

## Current Implementation
✅ Font configuration created in `app/fonts.ts`
⏳ Waiting for font files to be added to `public/fonts/inter/`
⏳ Layout needs to be updated to use new font config

## Next Steps
1. Download Inter WOFF2 files
2. Place in public/fonts/inter/
3. Update app/layout.tsx import
4. Test build
5. Verify performance improvement
