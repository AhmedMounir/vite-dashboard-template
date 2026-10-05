# Styling guidelines

All values live in [`packages/ui/src/styles/globals.css`](../../packages/ui/src/styles/globals.css)
and [`themes.css`](../../packages/ui/src/styles/themes.css). This page explains
them and how to use them.

## 1. How theming works

Everything lives on `<html>`, so CSS does the work and React never
re-renders for a theme change:

| Attribute | Values | Effect |
|---|---|---|
| `class="dark"` | present or absent | Mode, as in shadcn: `@custom-variant dark (&:is(.dark *));` |
| `data-base` | absent (= the **warm** default) or `neutral stone zinc gray slate mauve olive mist taupe` | Surfaces and text (shadcn's themes, `themes.css`) |
| `data-accent` | absent or `amber blue cyan emerald fuchsia green indigo lime orange pink purple red rose sky teal violet yellow` | Overrides `--primary` (and ring/sidebar primary) |
| `style="--radius: …"` | `0, .3, .5, .625, .75, 1` rem | Corner radius scale |
| `lang`, `dir` | `en`/`ltr`, `ar`/`rtl` | Language and direction |

The **warm** palette is light-only by design: in dark mode the default
theme draws as shadcn **neutral** (the pre-paint script and `theme.ts` set
`data-base="neutral"` when warm + dark). The warm dark tokens are kept in
`globals.css` (`:root.dark`) for apps that want a warm dark.

The choice is applied **before first paint** by an inline script in
`index.html` (no flash of the wrong theme or direction) and again by
`PreferencesProvider` on every change.

**Never themed:** chart series, up/down and status colours keep their meaning
in every theme and accent.

## 2. Colour tokens

shadcn's token names, plus a few roles shadcn lacks. Use them as Tailwind
classes (`bg-card`, `text-faint-foreground`, `border-line`, `text-up`).

### Surfaces and text (warm light / warm dark)

| Token | Light | Dark | Use |
|---|---|---|---|
| `background` | `#f7f6f2` | `#161513` | Page behind the cards (warm off-white) |
| `card` / `popover` | `#ffffff` | `#1f1e1b` | Cards, menus, dialogs |
| `foreground` | `#1c1b19` | `#f1efea` | Ink |
| `subtle-foreground` | `#4a4843` | `#cfccc3` | Secondary body text |
| `muted-foreground` | `#6b6862` | `#a29f97` | Labels, captions, axis text |
| `faint-foreground` | `#8a877f` | `#8a877f` | Dates, meta |
| `faintest-foreground` | `#a29f97` | `#6b6862` | Placeholders, disabled |
| `primary` | `#1c1b19` | `#f1efea` | Primary buttons, ticker tiles, active segment: ink, not a hue |
| `secondary` / `muted` | `#efede8` | `#2a2925` | Segmented-control track, chips, muted fills |
| `accent` | `#f3f1ec` | `#2a2925` | Hover rows, menu hover |
| `border` | `#e4e2dc` | `#34322e` | Card and table borders |
| `input` | `#e0ddd6` | `#3d3b36` | Field borders |
| `ring` | `#a29f97` | `#6b6862` | Focus ring (used at 50%: `outline-ring/50`) |
| `line` | `#c9c5bc` | `#4a4843` | Dashed/dotted rules, empty placeholders, scale lines |
| `well` | `#faf9f6` | `#1b1a17` | Inset areas inside a card |
| `sidebar` | `#f1efea` | `#1b1a17` | Sidebar (slightly darker than the page) |
| `sidebar-accent` | `#ffffff` | `#2a2925` | Active sidebar item (a white pill on warm grey) |
| `destructive` | `#dc2626` | `#f87171` | Errors, destructive actions |

Under a shadcn theme (`data-base` set) the extra roles are **derived** with
`color-mix` from that theme's own tokens, so they always match:

```css
:root[data-base] {
  --faint-foreground: color-mix(in oklab, var(--muted-foreground) 82%, var(--background));
  --faintest-foreground: color-mix(in oklab, var(--muted-foreground) 64%, var(--background));
  --line: color-mix(in oklab, var(--muted-foreground) 40%, var(--background));
  --well: color-mix(in oklab, var(--muted) 50%, var(--card));
  --chip-neutral: var(--secondary);
}
```

### Signals (never themed)

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `up` / `positive` | `#16a34a` | `#4ade80` | Gain, better, good side |
| `down` / `negative` | `#dc2626` | `#f87171` | Loss, worse |
| `chip-positive` (+ `-foreground`) | `#dcfce7` / `#166534` | `#10291a` / `#86efac` | Positive pill |
| `chip-negative` (+ `-foreground`) | `#fee2e2` / `#991b1b` | `#3a1517` / `#fca5a5` | Negative pill |
| `chip-neutral` | `#e6e3dc` | `#34322e` | Neutral pill |
| `status-good` / `-warning` / `-neutral` | `#16a34a` / `#c9971f` / `#a29f97` | `#4ade80` / `#e3c070` / `#6b6862` | Status dots, stale dates |
| `warning-foreground` | `#8f6a14` | `#e3c070` | Warning text |
| `sample` (+ `-foreground`) | `#efe6c8` / `#6b5a1e` | `#3a3420` / `#e3d28f` | "SAMPLE"/placeholder tag |

(In the source app the pill pair was named `chip-below`/`chip-above` for a
domain reason; here it is `positive`/`negative`.)

### Chart colours (never themed)

| Token | Light | Dark | Role |
|---|---|---|---|
| `series` | `#2563eb` | `#60a5fa` | Neutral marks: progress and score bars, a marker on a scale, "ours" highlights. **Not** the line charts |
| `chart-1` | `#16a34a` | `#4ade80` | **The default series colour:** every line, area and column chart in `charts.tsx`; also positive |
| `chart-2` | `#dc2626` | `#f87171` | Negative / second |
| `chart-3` | `#1c1b19` | `#f1efea` | Ink |
| `chart-4` | `#c9971f` | `#e3c070` | Amber |
| `chart-5` | `#8a877f` | `#a29f97` | Grey |
| `chart-6..8` | `#166534 #991b1b #4a4843` | `#86efac #fca5a5 #cfccc3` | Deeper variants |
| `chart-other` | `#c9c5bc` | `#4a4843` | "Other", comparison line, de-emphasised series |

### Colour rules

- **Ink and greys first.** A page should read correctly in greyscale.
- **Green and red mean good and bad only.** Never decorative, never as an
  accent, never for a category that has no "better".
- **Colour is never the only cue.** A change prints its sign (`+1.2%`,
  `−3.4%` with a real minus `−`), a trend has an arrow icon, a buy/sell marker
  is a triangle up/down.
- **Amber = attention** (stale, warning), not error. Red = error or loss.
- **No hex in components.** If you need a new colour, add a token with a light
  and a dark value.
- Tinted hero cards: `bg-linear-to-t from-primary/5 to-card` (light), plain
  `bg-card` in dark (`dark:bg-card`).

## 3. Typography

- **Inter** for everything, Latin and figures; **IBM Plex Sans Arabic** for
  Arabic letters (fallback in the same stack):
  `"Inter", "IBM Plex Sans Arabic", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`.
- **Figures use tabular digits** (`font-variant-numeric: tabular-nums`) via the
  `.figure` class or `font-mono`. `--font-mono` is mapped to the *same* Inter
  face: "mono" is a *role* (a figure), not a monospace font.
- Weights: 400 body, 500 labels/emphasis, 600 titles and key figures, 700 rarely.
- `antialiased` on `body`.

### Type scale

The dense dashboard pages use Tailwind's scale; the reading pages use a
finer pixel scale. Stick to these steps:

| Step | Size | Where |
|---|---|---|
| Micro | `text-[10px]`–`text-[10.5px]` | Tags (uppercase, tracking-wide), tiny axis notes |
| Caption | `text-[11px]`–`text-[11.5px]` / `text-xs` | Dates, meta, card labels on reading pages, bottom bar |
| Small body | `text-[12.5px]`–`text-[13px]` / `text-sm` | **Default body on reading pages (13 px)**, table cells, controls |
| Body | `text-[15px]` / `text-base` | Card titles on reading pages, header page title |
| Figure M | `text-xl` / `text-[20px]` | A figure in a grid of figures |
| Title | `text-[19px]`–`text-[22px]` / `text-xl` | Section heading, page heading |
| Figure L | `text-2xl`→`text-3xl` (`text-[28px]`–`text-[34px]`) | The headline number of a card or page |

- Headings: `font-semibold tracking-tight`.
- A unit next to a big figure is smaller and greyer:
  `127.69 <span class="text-[0.54em]">EGP</span>` or
  `<span class="text-sm font-normal text-muted-foreground">EGP</span>`.
- Long text: `leading-relaxed`, `text-pretty`, max ~65 characters per line.

## 4. Radius

`--radius: 0.75rem` (12 px) by default, user-adjustable. Derived scale
(base-nova's multipliers): `sm = r × 0.6`, `md = r × 0.8`, `lg = r`,
`xl = r × 1.4`, `2xl = r × 1.8`, `3xl = r × 2.2`, `4xl = r × 2.6`.

| Element | Class |
|---|---|
| Cards, empty states, big panels | `rounded-xl` (base-nova's Card: `ring-1 ring-foreground/10`, 16 px padding; its footer has no grey band here) |
| Buttons, inputs, menus | shadcn default (`rounded-md`) |
| Chips / pills | `rounded-full` (ratings) or `rounded-md` (value chips) |
| Segmented control | track `rounded-[9px]` with `p-[3px]`, segment `rounded-[7px]` |
| Tags | `rounded-[3px]` |
| Ticker/logo tile | `rounded-[9px]` |

## 5. Spacing and elevation

- Page padding: `px-4 py-4 md:py-6 lg:px-6` (16 px gutter on phones).
- Gaps between cards: `gap-4 md:gap-6` (dashboard) or `gap-3.5 md:gap-4` (reading grid).
- Card padding: shadcn Card's default, or `px-5 py-4` / `px-5 py-6 md:px-8 md:py-8` on reading pages.
- **Elevation is a border plus at most `shadow-xs`.** Floating things
  (tooltips, popovers) get `shadow-xl`. No coloured shadows, no glows.
- Separators are `border-border`; dashed/dotted rules use `border-line`.
- Focus: every element gets `outline-ring/50` from the base layer.

## 6. Icons

- Tabler icons in app code; size comes from the parent (`[&_svg]:size-4`),
  not from a class on every icon.
- In a `Button`, mark icons with `data-icon="inline-start"` / `"inline-end"`
  and no size class.
- Directional icons (chevrons, arrows) get `rtl:rotate-180` (or
  `rtl:-scale-x-100`).
- Icon-only buttons: `variant="ghost" size="icon" className="size-8"`, an
  `aria-label`, and a Tooltip with the same label.
- Favicon: a plain ink rounded square (SVG data URI), no logo.

## 7. Motion

- Quiet: shadcn/Base UI defaults (`tw-animate-css`), no page transitions,
  charts with `isAnimationActive={false}`.
- Respect `prefers-reduced-motion`: anything that moves on its own (a
  marquee ticker) stops and wraps instead.
