# Component patterns

Stock shadcn components in `components/ui/`; the app's own patterns on top
of them in `components/`. Starter versions of the first four are in
[`apps/web/src/components/`](../../apps/web/src/components/); the demo pages
in `apps/web/src/pages/` use every one of them.

| Need | Use |
|---|---|
| Page wrapper | `Page` (`page.tsx`): column with `gap-4 md:gap-6`, optional heading (only when it differs from the header), `actions` row, page ⓘ portalled into the header |
| A block of content | `Section` (`page.tsx`): shadcn `Card` with `CardTitle` + ⓘ + `CardAction` |
| One figure | `Figure`: label, value, date, source badge, stale flag (below) |
| Help | `HelpTip id="…"`: one ⓘ; text from `help/en.json` |
| Loading / empty / error | `QueryState`, `Loading`, `Empty`, `ErrorState` (`states.tsx`) |
| A change | `Delta`: signed figure, `text-up`/`text-down` |
| 2–5 options | `Segmented` (shadcn `ToggleGroup`, outline, sm) |
| Table behind a chart | `TableView` (a `Collapsible`, closed by default) |
| Tables | `DataGrid` / `DataTable` (below) |
| Search | Command palette (below) |
| Settings | Settings dialog (below) |
| Forms | shadcn `Field`, `FieldLabel`, `FieldError`, `Select`, `Textarea` + react-hook-form + zod |
| Toasts | `sonner`, for results of an action, never for information that should stay |
| Notifications | `NotificationsButton` (`components/notifications.tsx`) on `useNotifications()` (`lib/notifications.ts`), below |

## Figure

The unit of a data page. Every number shows **what**, **when** and **who says so**.

```
Portfolio value  ⓘ                 ← text-sm text-muted-foreground
EGP 1,234,567                      ← figure text-xl (lg: text-3xl) font-semibold tracking-tight
as of 3 Oct 2026 · [our ledger]    ← text-xs muted; source = outline Badge h-5 text-[11px]
```

- `null` prints **"unknown"** in muted colour, never `0`.
- Older than its `staleAfterDays` → muted value, date in `text-status-warning`
  with "· stale".
- The source badge has a tooltip explaining the source.

## Help (ⓘ)

- `HelpTip`: a ghost icon button (`size-6 text-muted-foreground
  hover:text-foreground`) with `IconInfoCircle`, inside a shadcn `Tooltip`, so
  hover **and keyboard focus** open it.
- Content (`max-w-sm text-start text-pretty`): a bold one-line **tip**, then
  optional sections *What it shows*, *How it's calculated*, *Where the data
  comes from*, *What it doesn't tell you*.
- All words live in `src/help/en.json` (+ `ar.json`) keyed by widget id, never
  in page code. Generic: no user's data in help text.
- Place it beside a page title (in the header), a card title or a figure
  label. One ⓘ per thing; don't put it on every row.

## States

- **Loading:** `Skeleton` blocks (`h-16 w-full`, a few rows), `aria-busy`.
  No spinners for page content.
- **Empty:** shadcn `Empty` with a dashed border, an icon tile
  (`IconInbox`), a title, optional one-line content/action.
- **Error:** shadcn `Alert variant="destructive"` with `IconAlertTriangle`,
  title "Could not load", the error message as is.
- `QueryState query={q}>{(data) => …}</QueryState>` renders the page only
  once data exists.

## Tables

From shadcn dashboard-01's data table, made generic (TanStack Table v9 +
dnd-kit):

- **`DataGrid`** for one table, **`DataTable`** for tabs of views (tabs become
  a `Select` on phones).
- Features: sortable headers (`SortHeader`, Tabler sort icons), column picker
  (`IconLayoutColumns` dropdown), row selection (checkbox column), drag to
  reorder (grip handle; not persisted), pagination (10 rows), a **row drawer**
  (`RowDrawer` + `DetailList`) for detail.
- Columns via a typed helper in a `useMemo` keyed on the translator;
  `meta: { align: "end", label, className }`. Number columns are `align:
  "end"` and `figure`.
- **Record lists** keep every feature. **Small summary tables** (behind a
  chart, by year, check lines) turn them off: `drag={false} select={false}
  pageSize={false}`.
- The pagination bar shows only with more than one page or a selection.

```tsx
type Row = { id: string; name: string; amount: number | null };
const columns = useMemo(() => {
  const h = dataTableColumns<Row>();
  return [
    h.accessor("name", {
      header: ({ column }) => <SortHeader column={column} title={t("Name")} />,
      cell: ({ row }) => <RowDrawer title={row.original.name}><DetailList rows={[[t("Amount"), num(row.original.amount, 2)]]} /></RowDrawer>,
      meta: { label: t("Name") },
    }),
    h.accessor("amount", {
      header: ({ column }) => <SortHeader column={column} title={t("Amount")} />,
      cell: ({ getValue }) => num(getValue(), 2),
      meta: { align: "end", label: t("Amount") },
    }),
  ];
}, [t]);

<DataGrid rows={rows} columns={columns} getRowId={(r) => r.id} />
<DataTable views={[{ value: "all", label: t("All"), rows, columns, getRowId: (r) => r.id }]} />
```
- Optional `footer` totals row; `rowClassName` for state (muted, warning).
- Long text cells: `max-w-80 whitespace-normal` or `max-w-96 truncate
  text-muted-foreground`.

## Command palette (search)

- shadcn `CommandDialog` on **Ctrl/⌘K**, also opened by the sidebar's search
  box and by any "search" affordance on a page.
- Groups: pages (from the registry) and records. Rank results yourself and
  pass `shouldFilter={false}`.
- Show recent items first when the query is empty.
- On a landing page, a prominent search button: `rounded-xl border bg-card
  px-4 py-3.5 text-[15px] text-muted-foreground shadow-xs` with an icon and a
  `<kbd>Ctrl K</kbd>`.

## Notifications

- A ghost icon button with `IconBell` in the header; unread count as a small
  `bg-destructive` pill at the top end (`9+` above nine), and the count in
  the button's `aria-label`.
- Click opens a `Popover` (`align="end"`, `w-80`): a title row with **Mark all
  read**, then the newest first. Each row: an unread dot (`bg-series`), the
  title (medium weight while unread), one muted line of detail, the time in
  `text-faint-foreground`. Clicking marks it read and opens its `to`.
- Empty: `IconBellOff` and "No notifications".
- `lib/notifications.ts` is a small external store seeded with samples.
  Replace `SEED` with the app's source and call `pushNotification()` when one
  arrives.

## Settings dialog

One dialog (opened from the header ⚙ and the sidebar), every choice applies
immediately and is remembered in `localStorage`:

- **Mode:** Light / Dark / System (ToggleGroup with sun / moon / desktop icons).
- **Theme:** swatches for Default (warm) + shadcn bases.
- **Accent:** swatches for the 17 accents + Default.
- **Radius:** 0, 0.3, 0.5, 0.625, 0.75, 1.
- **Language:** English / العربية.
- **Reset** to defaults.

No hint text under the controls (see [content-rules.md](content-rules.md)).

## Small pieces (reading pages)

| Piece | Look |
|---|---|
| **Pill / rating chip** | `inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold`; positive `bg-chip-positive text-chip-positive-foreground`, neutral `bg-chip-neutral`, negative `bg-chip-negative text-chip-negative-foreground`, none = `border border-dashed border-line text-muted-foreground font-normal` |
| **Value chip** ("12.0% below") | `rounded-md px-2 py-0.5 text-xs font-medium`, same tints |
| **Tag** ("SAMPLE", "NEW") | `rounded-[3px] bg-sample px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide leading-none text-sample-foreground` |
| **Tile / avatar mark** | `grid place-items-center rounded-[9px] bg-primary text-primary-foreground font-mono font-medium`, 44 px (header) / 32 px (lists), text 11–12 px |
| **Segmented switch** | track `flex gap-0.5 rounded-[9px] bg-secondary p-[3px] text-[13px]`; segment `rounded-[7px] px-3.5 py-[7px]`; active `bg-card font-semibold shadow-[0_1px_2px_rgba(0,0,0,.1)]`, inactive `text-muted-foreground hover:text-foreground`; `role="tablist"`/`aria-selected` |
| **Small period switch** (1D 1W 1M) | same, smaller: `rounded-[7px] p-[3px] text-[11px]`, segments `rounded-[5px] px-2 py-[3px]`, `aria-pressed` |
| **Trend badge** | `Badge variant="outline"` with `IconTrendingUp/Down` and a signed %, `text-up`/`text-down` |
| **Status dot** | `size-2 rounded-full bg-status-*`; hollow (`border-2`) for "near", dashed for "none" |
| **Legend swatch** | a line `h-0.5 w-4 bg-chart-1`, a bar `h-3 w-0.5 bg-foreground`, a dot `size-2 rounded-full` |
| **Text link** | `text-[13px] font-medium underline-offset-2 hover:underline`, arrow "→" for "open" |

## Saving data (when a page writes)

A form on the zod schema → **preview** the change (what will be saved, what
it changes) → **confirm** dialog → save → toast with **Undo**. Every saved
item is dated and undoable. No silent writes.
