# New-page checklist

- [ ] Base UI props (`render`, not `asChild`; see tech-stack.md).
- [ ] One entry in the route registry (path, title, icon, component); sidebar,
      router and breadcrumb pick it up.
- [ ] Title comes from the header; the page renders a heading only if it adds
      something.
- [ ] Chose **one** layout: dashboard (dense) or reading (centred column).
- [ ] Only tokens: no hex, no `ml-`/`left-`/`text-left`; dark styles through tokens, `dark:` only when a token cannot do it.
- [ ] Every figure: `.figure`/`Mono`, its date, its source where ambiguous,
      `unknown` for null.
- [ ] Green/red only for better/worse; sign or icon printed too.
- [ ] Charts: one measure, one axis, `aria-label`, `dir="ltr"`, a table view.
- [ ] Tables: number columns end-aligned; summary tables without drag/select/paging.
- [ ] Loading = skeleton, empty = `Empty`, error = `ErrorState`.
- [ ] ⓘ on the page and on non-obvious cards; words in `help/en.json`.
- [ ] Every string through `t()`; Arabic entries added; checked in RTL.
- [ ] Checked in light and dark, and with one shadcn theme + accent.
- [ ] 375 px wide: no horizontal page scroll, 16 px gutter, drawer for row
      detail, bottom bar clearance.
- [ ] Keyboard: every control reachable, ⓘ opens on focus, dialogs trap focus.
- [ ] No explainer text in the UI; no user data in code or help.
- [ ] No console errors.
