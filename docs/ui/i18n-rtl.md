# Language and direction (English / Arabic)

Works for any RTL language; Arabic is the one built.

## Translation

- `const t = useT();` then `t("English text", { var })`. **The English text is
  the key.** A missing translation shows the English, never a blank.
- Translations in `src/i18n/<lang>/*.json`, one file per area of the app,
  merged at build time with `import.meta.glob` (here: `common.json`,
  `app.json` for the shell, `demo.json` for the demo pages: delete it with
  them).
- Placeholders `{name}`: `t("Valued as of {date}", { date })`.
- One English word with two meanings: add a context after `|`:
  `t("Held|period")` shows "Held" in English and has its own Arabic entry.
- `Page`/`Section` titles, `Figure` labels, `Empty` titles are English keys the
  components translate themselves, so call sites pass plain English.
- `useT()` is stable while the language is unchanged, so it can be a
  `useMemo` dependency (table columns).
- The languages offered are one list, `LANGUAGES` in `lib/theme.ts`, each
  named in itself ("English", "العربية"); the header's dropdown, the
  Settings dropdown and the user menu all read it. Adding a language: an entry
  there, its `Lang` value, its `i18n/<lang>/` and `help/<lang>.json`, and
  `dirOf` if it is RTL.
- Help text has its own files (`help/en.json`, `help/ar.json`), merged per field.

## Direction

- Changing language sets `<html lang dir>` (pre-paint script + provider) and
  wraps the app in shadcn's `DirectionProvider` (`direction` prop) so Base UI parts flip.
- `components.json` has `"rtl": true`, so shadcn writes logical classes.
- **Always use logical classes:** `ms-/me-`, `ps-/pe-`, `start-/end-`,
  `text-start/text-end`, `border-s/border-e`, `rounded-s/e`. Never `ml-`,
  `left-`, `text-left` for layout.
- Directional icons: `rtl:rotate-180` (chevrons in breadcrumbs, "next"
  arrows) or `rtl:-scale-x-100`.
- The sidebar (and its phone sheet) is placed by a physical `side`;
  `AppSidebar` passes `side="right"` in Arabic. Menus and popovers take
  logical sides (`side="inline-end"`).
- Charts are wrapped in `dir="ltr"`.
- A marquee animates the other way in RTL.
- User-entered or mixed-script names: `dir="auto"`.

## Figures never flip

Numbers, dates, signs and units read left-to-right in both languages and use
Western digits and en-GB formats.

```css
/* packages/ui/src/styles/globals.css, base layer */
.figure, .font-mono { font-variant-numeric: tabular-nums; }
[dir="rtl"] .figure { direction: ltr; unicode-bidi: isolate; text-align: right; }
[dir="rtl"] .figure.text-end, [dir="rtl"] .figure.text-right { text-align: left; }
[dir="rtl"] .figure.text-center { text-align: center; }
```

- Inline figures: `<span dir="ltr" class="font-mono [unicode-bidi:isolate]">`
  (the `Mono` component).
- Dates inside running text are wrapped in Unicode isolates (`U+2066 … U+2069`)
  by `formatDate`, so "1 Oct 2026" stays one unit in an Arabic sentence.
- A translated phrase with a number in it ("12.0% below") is split so the
  number is set as a figure and the words in the text face.

## Fonts

Inter for Latin, IBM Plex Sans Arabic for Arabic letters, both in one
`font-family` stack: the browser picks per glyph, no switching needed.
