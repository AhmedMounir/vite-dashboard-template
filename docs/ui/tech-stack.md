# Tech stack (UI)

Versions as installed in October 2026. Pin majors; let minors float.

## Monorepo

pnpm workspaces + Turborepo (`pnpm dev | build | lint | typecheck | format`
at the root).

| Package | Holds |
|---|---|
| `packages/ui` (`@workspace/ui`) | shadcn primitives, `globals.css` + `themes.css`, `useIsMobile`, `cn` |
| `apps/web` | The app: shell, patterns, pages, i18n, help. Imports `@workspace/ui/components/<name>` |

App-level patterns (data table, sidebar, Figure…) live in `apps/web` because
they use the app's translator (`useT`) and router; move one into
`packages/ui` only once it no longer needs either.

## Core

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 19** + **TypeScript 6** (strict, `verbatimModuleSyntax`, `noUnusedLocals`) | |
| Build / dev | **Vite 8** + `@vitejs/plugin-react` | No SSR needed for an app behind a login |
| CSS | **Tailwind CSS 4** via `@tailwindcss/vite`, tokens in CSS (`@theme inline`), `tw-animate-css`, `shadcn/tailwind.css` | |
| Components | **shadcn/ui**, style **`base-nova`** (on **Base UI**, `@base-ui/react`), base colour `neutral`, CSS variables, `rtl: true` | Components are source you own |
| Icons | **`@tabler/icons-react`** in app code (as dashboard-01); **`lucide-react`** inside `packages/ui` because the CLI writes it | |
| Routing | **TanStack Router** (code-based routes from the registry, `src/router.tsx`) | Typed routes and search params when a page needs them |
| Server state | **TanStack Query** (`staleTime: Infinity`, no refetch on focus) | Loading/error states, caching |
| Tables | **TanStack Table v9** + **dnd-kit** | dashboard-01's data table: sorting, column picker, selection, drag-reorder, pagination |
| Charts | **shadcn Chart** on **Recharts 3** | Themed by tokens |
| Forms | react-hook-form + zod + shadcn `Field` (add when needed) | One schema validates the form and the request |
| Toasts | **sonner**, theme passed from our preferences | |
| Command palette | **cmdk** (shadcn `Command`) | Ctrl/⌘K |
| Class helper | `cn` package (re-exported as `@workspace/ui/lib/utils`) + `class-variance-authority` | |
| Fonts | `@fontsource/inter` (300–700), `@fontsource/ibm-plex-sans-arabic` (400–600), imported by `globals.css` | Self-hosted |
| Format / lint | Prettier (no semicolons, 80 columns, `prettier-plugin-tailwindcss`), ESLint 10 with react-hooks | |

## Base UI, not Radix

Most shadcn examples online are Radix. On Base UI:

| Radix habit | Here |
|---|---|
| `<Trigger asChild><Button/></Trigger>` | `<Trigger render={<Button />}>children</Trigger>`; also for `SidebarMenuButton render={<NavLink to="…" />}`, `BreadcrumbLink render={<Link …/>}`, `Collapsible render={<SidebarMenuItem />}` |
| `data-[state=open]:` | `data-open:` (collapsible root, popups), `data-popup-open:` (a menu's trigger), `data-closed:` |
| `ToggleGroup type="single" value="x"` | `value={["x"]}`, `onValueChange={(v) => v[0] && …}`; base-nova's default `spacing={2}` separates the buttons, so pass `spacing={0}` for a joined group |
| `Select` shows the item's label | `Select.Value` shows the **value** unless `<Select items={[{ value, label }]}>` |
| `Select onValueChange(value: string)` | value may be `null`: guard it |
| `Checkbox checked="indeterminate"` | `checked={bool} indeterminate={bool}` |
| `TooltipProvider delayDuration` | `delay` |
| `DirectionProvider dir` | `direction` |
| Drawer (vaul) `direction="right"` | Base UI drawer: `swipeDirection="down" \| "left" \| "right" \| "up"` |
| `DropdownMenuLabel` anywhere | it is a `GroupLabel`: wrap it in `DropdownMenuGroup` |
| `DropdownMenuItem onSelect={…}` | `onClick`. `onSelect` still type-checks (it is a DOM event) but never fires: the item silently does nothing (cmdk's `CommandItem` keeps `onSelect`) |
| A radio or checkbox menu item closes the menu | it stays open: add `closeOnClick` where a pick should close it (language, mode) |

## Adding shadcn components

From the repo root:

```bash
pnpm dlx shadcn@latest add <name> -c apps/web
```

Files land in `packages/ui/src/components`. **Check after every add**:

- **Dependencies:** the CLI adds them to `apps/web/package.json`. Move them to
  `packages/ui` (`pnpm --filter @workspace/ui add …`) and revert the
  `apps/web` entry.
- **Hooks:** it writes hooks to `apps/web/src/hooks` and imports them in
  `packages/ui` as `@/hooks/...`, which does not resolve there. Move the file
  to `packages/ui/src/hooks` and import `@workspace/ui/hooks/<name>`.
- **next-themes:** `sonner.tsx` comes with `next-themes`. Drop it: `Toaster`
  takes `theme` as a prop and `main.tsx` passes it from `usePreferences()`.
- **Stray `.dark` block:** if it appends a `:root`/`.dark` block to
  `globals.css`, delete it. The tokens are already there.

## Commands

```bash
pnpm dev          # turbo: vite on apps/web
pnpm typecheck    # apps/web checks tsconfig.app.json (its tsconfig.json only references)
pnpm lint
pnpm format
pnpm build
```

## Supply chain

pnpm 11 checks the lockfile against its supply-chain policies on every
install; dependency build scripts run only where `pnpm-workspace.yaml`
allows them (`allowBuilds`). Consider `minimumReleaseAge` (a version must be
a day old before it installs) with no exclusions.
