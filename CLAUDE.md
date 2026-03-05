# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check with tsc, then bundle with Vite
npm run preview   # Preview the production build locally
```

There are no tests or linters configured.

## Architecture

This is a **vanilla TypeScript + Vite multi-page app (MPA)** for Cove Learning, a tutoring service. There is no framework (no React, Vue, etc.).

**Three entry points**, each defined in `vite.config.ts`:

| Route | HTML | TypeScript |
|---|---|---|
| `/` | `index.html` | `src/main.ts` |
| `/tutors/` | `tutors/index.html` | `src/tutors.ts` |
| `/parents/` | `parents/index.html` | `src/parents.ts` |

**Shared stylesheet**: `src/style.css` is imported in all three TypeScript entry files. All visual design tokens (colors, fonts) live as CSS custom properties at the top of this file.

**How pages are built**: Each `.ts` entry file sets `document.querySelector('#app')!.innerHTML` to a large HTML template literal. DOM interactivity is wired up immediately after via `querySelector`/`addEventListener`.

**Animations**: Scroll-triggered reveal animations use `IntersectionObserver` — elements start with `opacity: 0` and gain a `.visible` class when they enter the viewport. The hero section uses a `requestAnimationFrame` loop with CSS custom properties (`--mx`, `--my`) for mouse parallax.

**Forms**: Both `/tutors/` and `/parents/` have contact/interest forms with `e.preventDefault()` submit handlers that show a success state. **No backend is connected yet** — form submissions are not persisted anywhere.

## Design Tokens

```css
--background: #FAFAF8   /* off-white page background */
--primary:    #153243   /* dark navy, main text/UI color */
--accent:     #F0CF65   /* yellow, CTAs and highlights */
--white:      #FFFFFF

--font-title: 'Instrument Serif'   /* headings */
--font-body:  'DM Sans'            /* body text */
```
