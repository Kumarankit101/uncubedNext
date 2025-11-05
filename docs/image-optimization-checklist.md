# Image Optimization Checklist

## Current Status
Images in public directory need optimization for production.

## Optimization Steps

### 1. Convert to Modern Formats
- [ ] Convert PNG/JPG to WebP (80-90% quality)
- [ ] Generate AVIF versions for supported browsers
- [ ] Keep original formats as fallback

### 2. Optimize Existing Images
```bash
# Using sharp or imagemin
npm install sharp --save-dev

# Optimize script
for file in public/**/*.{png,jpg,jpeg}; do
  # Convert to WebP
  npx sharp -i "$file" -o "${file%.*}.webp" --webp-quality 85

  # Optimize original
  npx sharp -i "$file" -o "$file" --quality 85
done
```

### 3. Replace <img> with next/image
Search for all `<img` tags and replace with `next/image`:

**Before:**
```jsx
<img src="/logo.png" alt="Logo" />
```

**After:**
```jsx
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={200} height={50} />
```

### 4. Add Priority to Above-Fold Images
Hero images and LCP candidates need `priority` prop:
```jsx
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority // Load immediately, don't lazy load
/>
```

### 5. Responsive Images
Use srcSet for different screen sizes:
```jsx
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 6. Video Optimization
- [ ] Compress videos using ffmpeg
- [ ] Generate poster images
- [ ] Use appropriate codecs (H.264 for compatibility, H.265 for size)

```bash
# Compress video
ffmpeg -i demo_1080.mp4 -vcodec h264 -crf 28 demo_1080_compressed.mp4

# Generate poster
ffmpeg -i demo_1080.mp4 -ss 00:00:01 -vframes 1 demo_poster.jpg
```

## Next.js Image Configuration
Already configured in `next.config.ts`:
- ✅ `unoptimized: false` - Image optimization enabled
- ✅ Remote patterns configured for external images
- ✅ Automatic format detection (WebP/AVIF)

## Files to Check
Run this to find all img tags:
```bash
grep -r "<img" app/ --include="*.tsx" --include="*.jsx"
```

## Expected Results
- **Bundle size reduction:** N/A (images are static assets)
- **Bandwidth reduction:** 40-60% with WebP
- **LCP improvement:** 20-30% with priority loading
- **Better caching:** Automatic next/image optimization

## Implementation Priority
1. **HIGH:** Replace <img> with next/image
2. **HIGH:** Add priority to hero/LCP images
3. **MEDIUM:** Convert to WebP
4. **LOW:** Generate AVIF versions
5. **LOW:** Optimize videos
