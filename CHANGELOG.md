# Changelog

All notable changes to this project will be documented in this file.

## 2025-08-14

- Setup Vite + React build for Vercel deployment
  - Added: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `postcss.config.js`.
  - Configured Tailwind v4 via `styles/globals.css` and `@tailwindcss/postcss` plugin.
  - Replaced non-standard imports to ensure bundling works:
    - Removed `figma:asset/...` imports; added `public/logo.png` and `public/favorite-categories.png` and updated references in `App.tsx` and `components/Navigation.tsx`.
    - Removed version-suffixed imports (e.g. `@radix-ui/react-...@x.y.z`, `lucide-react@...`, etc.) in `components/ui/**` and switched to standard package imports.
  - Installed required dependencies for UI and utilities (Radix UI packages, `class-variance-authority`, `lucide-react`, `motion`, `embla-carousel-react`, `cmdk`, `input-otp`, `next-themes`, `react-day-picker`, `react-resizable-panels`, `recharts`, `sonner`, `tailwind-merge`).
  - Fixed PostCSS config to use `@tailwindcss/postcss` and removed invalid `@radix-ui/react-sheet` dependency.
  - Verified production build via `npm run build` (output directory: `dist/`).

