/**
 * The route registry: every page, once. The sidebar, the router and the
 * breadcrumb are all built from it, so adding a page is one entry here.
 * A page without a `component` is not built yet and is not listed in the menu.
 *
 * Replace the example groups and pages (src/pages) with the app's own.
 */
import type { ReactNode } from "react"
import { DashboardPage } from "@/pages/dashboard"
import {
  ActivityPage,
  DataSettingsPage,
  LibraryPage,
  MembersPage,
} from "@/pages/examples"
import { ReadingPage } from "@/pages/reading"
import {
  IconChartBar,
  IconFileText,
  IconHome,
  IconListDetails,
  IconSettings2,
  IconUsers,
  type Icon,
} from "@tabler/icons-react"

export type Page = {
  path: string
  /** An English key; translated where shown. */
  title: string
  icon: Icon
  component?: () => ReactNode
}

export type Group = {
  title: string
  /** Pages directly in the group. */
  pages: Page[]
  /** Collapsible sub-sections, each with its own pages. */
  sections?: { title: string; icon: Icon; pages: Page[] }[]
  /** "documents": each page gets an Open / new tab / copy-link menu (NavDocuments). */
  kind?: "main" | "documents"
}

export const REGISTRY: Group[] = [
  {
    title: "Overview",
    pages: [
      { path: "/", title: "Home", icon: IconHome, component: DashboardPage },
      {
        path: "/reports",
        title: "Reports",
        icon: IconChartBar,
        component: ReadingPage,
      },
    ],
  },
  {
    title: "Workspace",
    pages: [],
    sections: [
      {
        title: "Team",
        icon: IconUsers,
        pages: [
          {
            path: "/team/members",
            title: "Members",
            icon: IconUsers,
            component: MembersPage,
          },
          {
            path: "/team/activity",
            title: "Activity",
            icon: IconListDetails,
            component: ActivityPage,
          },
        ],
      },
    ],
  },
  {
    title: "Data",
    kind: "documents",
    pages: [
      {
        path: "/data/library",
        title: "Library",
        icon: IconFileText,
        component: LibraryPage,
      },
      {
        path: "/data/settings",
        title: "Data settings",
        icon: IconSettings2,
        component: DataSettingsPage,
      },
    ],
  },
]

export const ALL_PAGES: Page[] = REGISTRY.flatMap((g) => [
  ...g.pages,
  ...(g.sections ?? []).flatMap((s) => s.pages),
])

/** Only what is built goes in the menu. */
export const builtGroups = (): Group[] =>
  REGISTRY.map((g) => ({
    ...g,
    pages: g.pages.filter((p) => p.component),
    sections: g.sections
      ?.map((s) => ({ ...s, pages: s.pages.filter((p) => p.component) }))
      .filter((s) => s.pages.length > 0),
  })).filter((g) => g.pages.length > 0 || (g.sections?.length ?? 0) > 0)
