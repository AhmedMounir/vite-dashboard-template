# UI guide

The look, the stack and the page patterns this template ships with, taken
from a data-heavy dashboard (October 2026). **UI only:** nothing here is
about a backend, a database or a domain.

In short, the look:
- **Shell:** shadcn's **dashboard-01** shell: an inset sidebar and one slim site header with a breadcrumb.
- **Palette:** a **warm off-white light palette** with near-black ink and white cards, and a neutral dark mode.
- **Type:** **Inter**, with tabular digits for every figure.
- **Shape:** 12 px radii, with quiet borders instead of shadows.
- **Colour:** **green and red only as signals**.
- **Settings dialog:** light/dark/system, theme, accent, corner radius, and **English/Arabic (RTL)**.

## Read in this order

| Doc | What it settles |
|---|---|
| [tech-stack.md](tech-stack.md) | Packages, the monorepo layout, Base UI notes, shadcn CLI caveats |
| [styling.md](styling.md) | Colour tokens (light, dark, themes), type, radius, spacing, elevation, icons |
| [layout.md](layout.md) | The shell, the two page layouts (dense dashboard, reading column), grids, phone |
| [components.md](components.md) | Page-level patterns: Page/Section, Figure, help ⓘ, states, tables, forms, search, chips |
| [charts.md](charts.md) | Chart rules and the stock chart components |
| [i18n-rtl.md](i18n-rtl.md) | Translation by English key, Arabic/RTL, figures that never flip |
| [content-rules.md](content-rules.md) | How data and words appear on a page (dates, unknowns, no explainer text) |
| [checklist.md](checklist.md) | A pre-merge checklist for any new page |

## Where things live

| Path | What |
|---|---|
| `packages/ui/src/styles/globals.css` | Tailwind 4 entry: fonts, the warm palette (light + dark) as shadcn tokens plus the extra roles, `@theme inline`, base layer (tabular figures, RTL isolation) |
| `packages/ui/src/styles/themes.css` | shadcn's theme registry (neutral, stone, zinc, gray, slate, mauve, olive, mist, taupe; 17 accents) on `data-base` / `data-accent` |
| `packages/ui/src/components/` | The shadcn primitives (style `base-nova`, on Base UI) |
| `packages/ui/src/hooks/use-mobile.ts` | `useIsMobile()` (768 px) |
| `apps/web/index.html` | The pre-paint script: theme, direction and radius applied before React loads |
| `apps/web/src/lib/` | `theme.ts` + `preferences.tsx` (mode, base, accent, radius, language), `i18n.ts` (`useT()`), `format.ts` (unknown stays unknown) |
| `apps/web/src/components/` | The app's patterns: `app-shell`, `app-sidebar`, `nav-*`, `site-header`, `command-search`, `theme-customizer` (Settings), `data-table`, `charts`, `page`, `states`, `help`, `figure`, `bits` |
| `apps/web/src/registry.tsx` | The route registry; the menu, router and breadcrumb are built from it |
| `apps/web/src/pages/` | **Demo pages:** dashboard layout (`dashboard.tsx`), reading layout (`reading.tsx`), small examples. Replace them |
| `apps/web/src/help/*.json`, `apps/web/src/i18n/ar/*.json` | Help text and Arabic strings |

**Where the shell and table come from:** shadcn's `dashboard-01` block
(`npx shadcn@latest add dashboard-01`,
https://ui.shadcn.com/view/new-york-v4/dashboard-01). They were then reworked:
- the menu is built from the route registry;
- i18n and RTL throughout;
- TanStack Router links;
- the table is generic over row types and columns;
- ported from Radix to Base UI.

## The five rules that make it look like this

1. **shadcn first.** Use the stock component; restyle with tokens, not with
   one-off colours. A new shape (gauge, range bar) is a small SVG component.
2. **Tokens, never hex in components.** Every colour is a CSS variable with a
   light and a dark value; components use `bg-card`, `text-muted-foreground`,
   `text-up`… so a theme switch restyles everything.
3. **Colour is a signal, not decoration.** Ink, greys and white do the work;
   green/red mean better/worse; amber means warning. Colour is never the only
   cue (signs, arrows and shapes carry it too).
4. **Figures are typography.** Tabular digits, left-to-right even in Arabic,
   one weight heavier than their label, unit smaller and greyer.
5. **Calm pages.** One number and one sentence per card, one question per
   chart, ≤ 7 table columns on reading pages, help behind ⓘ, no notes to the
   user written into the UI.
