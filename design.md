# Uncubed Design System

This document describes the visual design system used in the Uncubed Next.js application. It captures the current design language, tokens, and component patterns to help designers and developers build new UI that feels consistent.

## 1. Overview
- Philosophy: pragmatic, clean, and motion‑enhanced UI built on Tailwind, with a glassmorphism layer for depth and polish.
- Visual tone: modern, minimal, high-contrast; first‑class dark mode with tasteful gradients and soft blurs.
- Goals: consistency via tokens and utilities, strong accessibility defaults, responsive ergonomics (touch targets ≥ 44px), and lightweight implementation using Tailwind utilities + a small set of custom components.

## 2. Color Palette
Tailwind is extended with dark, light, accent, and glass tokens. Dark mode is class‑based.

- Core palettes (tailwind.config.js:16–48)
  - Dark
    - 900 `#0D0D0D` (page background, dark surfaces)
    - 800 `#111111`
    - 700 `#1A1A1A`
    - 600 `#2A2A2A`
  - Light
    - 50 `#FAFAFA` (page background, light surfaces)
    - 100 `#F5F5F5`
    - 200 `#EEEEEE`
    - 300 `#E0E0E0`
    - 400 `#BDBDBD`
    - 500 `#9E9E9E`
    - 600 `#757575`
    - 700 `#616161`
    - 800 `#424242`
    - 900 `#212121` (primary text on light)
  - Accent
    - Blue `#3B82F6`
    - Purple `#8B5CF6`
    - Green `#10B981`
    - Orange `#F59E0B`
    - Red `#EF4444`
  - Glass (overlays)
    - White `rgba(255,255,255,0.1)`
    - Black `rgba(0,0,0,0.2)`
    - Light `rgba(255,255,255,0.8)`
    - Dark `rgba(0,0,0,0.1)`

- Gradient variables (app/globals.css:5–10)
  - `--gradient-opacity: 0.8`
  - `--primary-color: rgba(249,115,22,var(--gradient-opacity))` `#F97316`
  - `--secondary-color: rgba(234,88,12,var(--gradient-opacity))` `#EA580C`
  - `--accent-color: rgba(251,146,60,var(--gradient-opacity))` `#FB923C`
  - Used by Background Rays to render soft ambient gradients.

- Semantic usage
  - Primary actions: dark surfaces → white text on white/near‑white buttons; light surfaces → gray‑900 on gray/black buttons (see Button variants).
  - Success: Accent Green `#10B981`
  - Warning: Accent Orange `#F59E0B`
  - Error: Accent Red `#EF4444`
  - Info/Link: Accent Blue `#3B82F6`
  - Neutrals: Light and Dark scales above; prefer high contrast in dark mode.

## 3. Typography
- Font family
  - Inter (via next/font) set globally on the body (app/layout.tsx:2–8, 76–79; app/globals.css:12–16).
- Scale and weights
  - Headings: Tailwind utilities; common sizes: `text-xl` (modal titles), `text-lg`/`text-xl` (brand), `font-semibold`/`font-bold` for emphasis.
  - Body: default `text-base` on light/dark; subdued text uses light palette 600–700 or `text-gray-400` in dark.
  - Buttons: `text-sm`; inputs: `text-base` or `text-sm` depending on context.
- Usage
  - Prefer semantic HTML elements and Tailwind utilities for size/weight.
  - Avoid custom font weights outside Inter defaults unless required.

## 4. Spacing & Layout
- Spacing scale
  - Tailwind default spacing units (`px`, `0.5`, `1` … `96`) are used across components.
  - Common paddings: `px-4|6|8`, `py-2|2.5|3`; cards use `p-6`.
- Border radius
  - Buttons: `rounded-xl` (12px).
  - Cards/Modals: `rounded-2xl` (16px).
  - Clerk UI overrides use `0.75rem` for consistency (lib/hooks/useClerkAppearance.ts:19–20).
- Shadows & blur
  - Glass surfaces rely on `backdrop-blur` (`backdrop-blur-sm/md`) and thin borders (white/gray with low alpha).
  - Modals use elevated box‑shadows with mode‑specific tints.
- Touch ergonomics
  - Minimum target: 44×44px enforced in CSS (app/globals.css:42–47, 70–74, 196–201). Buttons also set min heights per size.
- Scrolling
  - Custom scrollbars for light/dark (app/globals.css:150–182) and utilities `scrollbar-thin`/`scrollbar-hide`.

## 5. Components
Styled with Tailwind utilities and small theme‑aware branches using the Zustand theme store.

- Button (app/components/ui/Button.tsx)
  - Variants: `primary`, `secondary`, `glass`, `outline`.
    - Dark
      - primary: white bg, black text, subtle shadow; hover lightens.
      - secondary: gray‑800 bg, white text.
      - glass: white/10 bg, white text, border white/20 + blur.
      - outline: transparent bg, white text, white/30 border.
    - Light
      - primary: gray‑900 bg, white text.
      - secondary: gray‑100 bg, gray‑900 text.
      - glass: white/80 bg, gray‑900 text, blur.
      - outline: transparent bg, gray‑900 text, gray‑300 border.
  - Sizes: `sm` (min-h 36), `md` (min-h 44), `lg` (min-h 48).
  - States: hover scale, active scale, `disabled:opacity-50 disabled:cursor-not-allowed`, optional loading spinner.

- Card (app/components/ui/Card.tsx)
  - Base: glass card in dark; semi‑opaque white in light; `rounded-2xl p-6`.
  - Props: `hover` (scale on hover), `gradient` (switch to border‑only container for gradient use).

- Input (app/components/ui/Input.tsx)
  - Uses utility `input-glass` (app/globals.css:66–68) for backdrop blur and subtle borders.
  - Label: `text-sm font-medium text-gray-300` (primarily dark contexts).
  - Error: `text-red-400 text-sm` helper.

- Modal (app/components/ui/Modal.tsx)
  - Overlay: blurred, mode‑aware black alpha backdrop.
  - Container: `rounded-2xl`, theme‑specific border/background, elevated shadow; sizes `sm|md|lg|xl` with max heights.
  - Header: title + action area; close button with hover states per theme.
  - Body: padded, scrollable with `scrollbar-thin`.

- Theming Controls
  - ThemeToggle (app/components/ui/ThemeToggle.tsx): toggles `dark`/`light` with accessible label; Sun/Moon icon.
  - Logo (app/components/ui/Logo.tsx): switches SVG based on theme.

- Utilities (app/globals.css)
  - `.glass-card`, `.glass-button`, `.input-glass`, `.btn-modern`, variant helpers `.btn-*`, `.text-gradient`.

- Background Rays (app/components/BackgroundRays/styles.css)
  - Uses CSS variables from globals for ambient gradient accents; blend modes adapt to `.dark`/`.light` contexts.

## 6. Theming
- Mode strategy
  - Tailwind dark mode is class‑based (`darkMode: 'class'` in tailwind.config.js:13).
  - Zustand store persists theme and toggles `document.documentElement.classList` (lib/store/themeStore.ts:16–25).
  - ThemeInitializer applies theme before first paint to avoid FOUC/hydration issues (app/components/ThemeInitializer.tsx).
- CSS variables
  - Global gradient tokens in `:root` (app/globals.css) power decorative rays and can be extended for other gradient accents.
- Component behavior
  - Components read `theme` from the store and switch Tailwind class sets accordingly (e.g., Button, Card, Modal).

## 7. Best Practices
- Tokens first
  - Prefer palette tokens from Tailwind extension (`dark.*`, `light.*`, `accent.*`) and global utilities over ad‑hoc hex values.
- Dark/light parity
  - Ensure both modes have equivalent contrast and borders. Favor subtle borders (`/10–/30`) with backdrop blur for depth.
- Touch & motion
  - Keep 44px min tap targets; use small scale transitions (`whileHover`, `whileTap`) for affordance; avoid excessive motion for critical interactions.
- Accessibility
  - Maintain WCAG AA contrast (text vs background). Use semantic colors for status and provide text alternatives.
  - Provide `aria-label`/titles on icon buttons (see ThemeToggle pattern).
- Composition
  - Build on utilities: `.glass-card`, `.input-glass`, `.btn-modern` when possible; keep component APIs small (`variant`, `size`).
- Responsiveness
  - Use Tailwind breakpoints; ensure mobile-friendly spacing (`sm:px-6`, larger tap areas in media queries in globals.css).

## 8. File References
- Global Styles
  - app/globals.css:1
  - tailwind.config.js:1
- Theming
  - lib/store/themeStore.ts:1
  - app/components/ThemeInitializer.tsx:1
  - app/components/ui/ThemeToggle.tsx:1
  - app/root-providers.tsx:1
- Core UI
  - app/components/ui/Button.tsx:1
  - app/components/ui/Card.tsx:1
  - app/components/ui/Input.tsx:1
  - app/components/ui/Modal.tsx:1
  - app/components/ui/Logo.tsx:1
- Decorative
  - app/components/BackgroundRays/styles.css:1
- Layout & font
  - app/layout.tsx:1

---

Notes and future extension
- Consider extracting color tokens to CSS variables for day‑two theming (HSL-based) while keeping Tailwind utilities in sync.
- If adding new components, start with `variant` and `size` props mirroring Button, use the same radii, and prefer the glass pattern where appropriate.
