/**
 * Routes from the registry: the shell is the root, every built page a child.
 * Typed per-page routes (search params, loaders) can replace this when a page
 * needs them.
 */
import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router"

import { AppShell } from "@/components/app-shell"
import { Page } from "@/components/page"
import { Empty } from "@/components/states"
import { ALL_PAGES } from "@/registry"

const rootRoute = createRootRoute({
  component: AppShell,
  notFoundComponent: () => (
    <Page title="Not found">
      <Empty title="This page does not exist" />
    </Page>
  ),
})

const pageRoutes = ALL_PAGES.filter((p) => p.component).map((p) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: p.path,
    component: p.component,
  })
)

export const router = createRouter({
  routeTree: rootRoute.addChildren(pageRoutes),
})
