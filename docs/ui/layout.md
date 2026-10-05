# Layout

## 1. The shell

shadcn's **dashboard-01** shell with **sidebar-07**'s icon rail: an **inset
sidebar** beside a rounded content panel, one slim **site header** fixed on
top of every page.

```
Expanded                                    Collapsed (icon rail)
┌──────────────┬─────────────────────────┐  ┌───┬──────────────────────────────┐
│ [A] App      │ Page ⓘ        🔔² ☾ ⚙  │  │[A]│ Page ⓘ             🔔² ☾ ⚙  │ ← fixed header
│ [🔍 Search ⌘K]├─────────────────────────┤  │ 🔍├──────────────────────────────┤
│ AREA         │                         │  │ ⌂ │                              │
│  ⌂ Item  (3) │   page content          │  │ ▤ │   page content               │
│  ▸ Group     │   (scrolls under the    │  │ 👥│   (wider)                    │
│     Sub      │    header)              │  │   │                              │
│ ⚙ Settings   │                         │  │ ⚙ │                              │
│ (◉) user ⋯   │                         │  │(◉)│                              │
└──────────────┴─────────────────────────┘  └───┴──────────────────────────────┘
 [A] is the toggle: on hover it shows the sidebar icon; Ctrl/⌘B also toggles.
```

```tsx
<SidebarProvider
  style={{ "--sidebar-width": "calc(var(--spacing) * 64)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}
>
  <AppSidebar variant="inset" />                 {/* collapsible="icon" */}
  {/* Desktop: the panel is the window's height and scrolls inside, under the header. */}
  <SidebarInset className="min-w-0 md:h-[calc(100svh-(--spacing(4)))] md:overflow-hidden">
    <SiteHeader />                                {/* sticky top-0 on phones */}
    <div className="@container/main flex min-w-0 flex-1 flex-col md:overflow-y-auto">
      <div className="flex min-w-0 flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <Outlet />
      </div>
    </div>
  </SidebarInset>
</SidebarProvider>
```

### Sidebar (top to bottom)

1. **Brand = toggle**: an 8×8 `rounded-lg bg-primary` tile with one bold
   letter (ink by default, the accent when one is chosen), the app name
   (`text-sm font-semibold`) and a one-word subtitle. Clicking it collapses
   or expands the sidebar; on hover the letter fades into the sidebar icon.
   Home is reached from the menu, not the logo. On a phone (sheet) it is a
   plain brand row.
2. **Search box** that opens the command palette: `h-8 rounded-md border
   bg-background ps-8`, a search icon at `start-2`, placeholder text, a
   `<kbd>` with the shortcut. On the rail it becomes a search icon.
3. **Groups** (`SidebarGroupLabel`), items with Tabler icons and tooltips
   (shown on the rail only). A group with sub-pages is a `Collapsible` with a
   chevron (`ms-auto`, rotates 90° when open, mirrored in RTL); it is open
   when the current page is inside it. **On the rail it is a dropdown menu
   beside its icon** (`side="inline-end"`). Counts are `SidebarMenuBadge`.
4. **Secondary** (`mt-auto`): Settings (opens the Settings dialog), Help.
5. **Footer**: `NavUser` (avatar + menu: mode, language, Settings, and the
   app's own items such as sign-out). On the rail only the avatar shows.
6. `SidebarRail`: the thin edge you can click or drag to toggle.

Rules: **pages not built yet are not listed**; detail pages (one record) are
never menu items; search reaches them. The menu is built from a **route
registry** (one entry per page: `path`, `title`, `icon`, `component`), which
also feeds the router and the breadcrumb. Adding a page = one registry entry.

**The sidebar starts collapsed** (the icon rail). shadcn's provider writes a
`sidebar_state` cookie but never reads it, so `AppShell` reads it into
`defaultOpen`: a reader who opens the sidebar finds it open next time.
On phones the sidebar is a **sheet** that closes when a link is followed. In
Arabic the sidebar, rail and sheet are on the right: base-nova places the
sidebar by its `side` prop (physical), so `AppSidebar` passes
`side="right"` for RTL.

### Site header

`sticky top-0 z-20 h-(--header-height) border-b bg-background/85
backdrop-blur-md md:rounded-t-xl`, inside: `px-4 lg:px-6`. On a desktop it
stays because the page scrolls inside the panel; on a phone it sticks to the
top of the window.

- Phones only: `SidebarTrigger` · vertical `Separator` (`h-4`). On a
  desktop the brand in the sidebar is the toggle.
- **Breadcrumb** from the registry. The last crumb is the page's **`<h1>`**
  (`text-base font-medium`, truncates) with the page's ⓘ beside it (portalled
  into a slot). Earlier crumbs show only at `xl` and up.
- End side (`ms-auto`): page-specific `actions` (sync line, alerts), then
  four ghost icon buttons: **notifications** (bell with an unread count; see
  components.md), **language** (a dropdown of the languages offered, each
  named in itself), **light/dark** (shows the icon of the mode you'd switch
  to), **Settings**. Language is also a dropdown in Settings and a submenu in
  the user menu; all three read `LANGUAGES` in `lib/theme.ts`.

So pages normally **don't render their own title**: the header has it. A page
shows its own heading only when it says more than the header (e.g. a record's
name).

### Starter wiring

The root route renders `AppShell` (`apps/web/src/components/app-shell.tsx`). Change its
`AppSidebar` props for the app:

```tsx
<AppSidebar
  variant="inset"
  path={path}
  brand={{ name: "Acme", subtitle: "Finance", letter: "A", home: "/" }}
  onSearch={openCommandSearch}           // omit: no search box
  searchLabel="Search"
  helpUrl="/help"                        // omit: no Get Help link
  badges={{ "/inbox": <SidebarMenuBadge>3</SidebarMenuBadge> }}
  user={{ name: "…", email: "…" }}       // omit: shows Preferences instead
  items={<DropdownMenuItem>Sign out</DropdownMenuItem>}
/>
```

The menu comes from `registry.tsx`: each `Group` becomes a sidebar group;
`sections` become collapsible items; `kind: "documents"` gives each page an
Open / new tab / copy-link menu. Pages without a `component` are hidden.
`SiteHeader` takes `actions` for page-specific controls and `crumbs` to
override the breadcrumb (e.g. a record's name on a detail route).

## 2. Two page layouts

### A. Dashboard layout (dense: lists, ledgers, admin)

- Full width of the inset panel, page padding `px-4 py-4 md:py-6 lg:px-6`,
  vertical rhythm `gap-4 md:gap-6`.
- A row of **section cards** at the top (KPI cards), then charts, then tables.
- Section cards grid (dashboard-01):

```tsx
const GRID =
  "grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 " +
  "*:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 " +
  "dark:*:data-[slot=card]:bg-card";
```

  A KPI card: `CardDescription` (label, a link that covers the card via
  `after:absolute after:inset-0`), `CardTitle` (`figure text-2xl font-semibold
  @[250px]/card:text-3xl`), `CardAction` (trend badge), `CardFooter` (one
  bold line + one muted line with the date).
- Content blocks are `Section`s (a Card with title, ⓘ and actions).
- Use **container queries** (`@container/main`, `@container/card`,
  `@xl/main:`, `@[250px]/card:`) rather than viewport breakpoints for things
  inside the panel, because the sidebar changes the available width.

### B. Reading layout (detail pages, research, anything to be *read*)

For pages a person reads rather than scans (modelled on Alpha Spread's
security pages):

- A **centred column**: `mx-auto w-full max-w-[920px]` for a single-column
  page, up to `~1200px` for a card grid; `px-4 py-6 md:py-10`.
- Page title `text-[28px] font-semibold`; section titles
  `text-[15px] font-semibold`, with a count in figures (`· 12`).
- A **sticky header** for a record (name, key figures, chips, tabs) that stays
  the same across its tabs, so switching tabs keeps the context.
- A **12-column grid** of cards: `grid grid-cols-12 gap-3.5 md:gap-4`, cards
  `col-span-12 lg:col-span-7` + `col-span-12 lg:col-span-5`, or
  `md:col-span-6`.
- Card: `rounded-xl border bg-card px-5 py-4 shadow-xs`; label
  `text-[13px] text-muted-foreground` with ⓘ; **one number and one sentence**.
- Lists as one bordered card with rows (`overflow-hidden rounded-xl border
  bg-card`, rows `border-b px-5 py-3 hover:bg-muted/40`), max ~7 columns.
- A "needs attention" band inside a list: `border-y bg-sample/40 px-5 py-2.5
  text-[12.5px] text-sample-foreground`.
- Placeholders for what is not there yet: `rounded-xl border border-dashed
  border-line bg-card px-6 py-10 text-center text-[13px] text-muted-foreground`.

Pick one layout per page; don't mix densities on one screen.

## 3. Responsive rules

- **Breakpoint for "phone": 768 px** (`useIsMobile()`); Tailwind `md:`.
- **No horizontal page scroll at 375 px.** `min-w-0` on every flex/grid child
  that holds a table or long text; wide tables scroll *inside* their card
  (`max-w-full overflow-x-auto`).
- 16 px side gutter on phones (`px-4`).
- Tables: on phones, tabs become a `Select`, a row opens a bottom **Drawer**
  with its detail.
- **Bottom bar** on phones for the main areas (optional, for apps with 3–5
  top-level areas):

```tsx
<nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t bg-card pt-1.5
  pb-[max(env(safe-area-inset-bottom),12px)] text-center text-[11px] text-muted-foreground md:hidden">
  <Link className="py-2.5" aria-current="page" /* active: font-semibold text-foreground */ />
</nav>
```

  …and give `main` `pb-16 md:pb-0` so content clears it.
- Headers wrap (`flex-wrap`), actions go under the title on narrow screens.
- A marquee/ticker that doesn't fit scrolls as an animation, never with a
  scrollbar; under reduced motion it wraps.
