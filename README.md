# Vite dashboard template

A Vite monorepo template with shadcn/ui (`base-nova`, on Base UI): a
dashboard-01 shell (inset sidebar, breadcrumb header, ⌘K search), a generic
data table, charts, a Settings dialog (light/dark/system, theme, accent,
radius), English/Arabic with RTL, and a warm light palette. Demo pages in
`apps/web/src/pages` show every pattern; replace them.

**UI guide: [docs/ui/](docs/ui/README.md)**: styling, layout, components,
charts, i18n and the rules the pages follow.

```bash
pnpm install
pnpm dev
```

Press `d` outside a text field to toggle dark mode.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.
Then check where the CLI put dependencies and hooks; see
[docs/ui/tech-stack.md](docs/ui/tech-stack.md#adding-shadcn-components).

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```
