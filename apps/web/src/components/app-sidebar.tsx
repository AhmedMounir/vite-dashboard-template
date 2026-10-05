/**
 * The menu, on shadcn's sidebar parts (dashboard-01's groups, sidebar-07's
 * icon rail): the brand, a search box (opens the command palette), the
 * registry's groups (NavMain, or NavDocuments for a "documents" group),
 * Settings and Get Help at the bottom, and the user / preferences menu in the
 * footer. Pages not built yet are not listed.
 *
 * The app's icon is the toggle: on hover it turns into the collapse icon; when
 * collapsed the menu is a rail of icons with tooltips and the icon opens it
 * again (Ctrl/⌘B too). On a phone the menu is a sheet (the header has its
 * menu button) that closes when a link is followed; in RTL it sits on the
 * right.
 */
import type { ReactNode } from "react"
import {
  IconHelp,
  IconLayoutSidebar,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary, type SecondaryItem } from "@/components/nav-secondary"
import { NavUser, type NavUserProps } from "@/components/nav-user"
import { useOpenCustomizer } from "@/components/theme-customizer"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { builtGroups } from "@/registry"
import { useLang, useT } from "@/lib/i18n"

/** The search shortcut as shown on this platform. */
export const SHORTCUT =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
    ? "⌘K"
    : "Ctrl K"

export type AppSidebarProps = {
  path: string
  brand: { name: string; subtitle?: string; letter?: string }
  /** Opens the command palette; no search box without it. */
  onSearch?: () => void
  searchLabel?: string
  helpUrl?: string
  /** A badge per page path (a count, a dot), rendered as SidebarMenuBadge. */
  badges?: Record<string, ReactNode>
} & NavUserProps &
  React.ComponentProps<typeof Sidebar>

/** The app's icon, which opens and closes the menu. */
function BrandToggle({ brand }: { brand: AppSidebarProps["brand"] }) {
  const t = useT()
  const { toggleSidebar, state, isMobile } = useSidebar()
  const label =
    state === "expanded" ? t("Collapse sidebar") : t("Expand sidebar")
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2">
        <SidebarMenuButton
          size="lg"
          onClick={isMobile ? undefined : toggleSidebar}
          aria-label={isMobile ? undefined : label}
          tooltip={label}
          className="group/brand hover:bg-transparent active:bg-transparent"
        >
          <span className="relative grid aspect-square size-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            <span className="transition-opacity md:group-hover/brand:opacity-0">
              {brand.letter ?? brand.name.charAt(0)}
            </span>
            {!isMobile && (
              <IconLayoutSidebar
                aria-hidden
                className="absolute size-4 opacity-0 transition-opacity group-hover/brand:opacity-100"
              />
            )}
          </span>
          <span className="grid flex-1 text-start leading-tight">
            <span className="truncate text-sm font-semibold">
              {t(brand.name)}
            </span>
            {brand.subtitle && (
              <span className="truncate text-xs text-muted-foreground">
                {t(brand.subtitle)}
              </span>
            )}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar({
  path,
  brand,
  onSearch,
  searchLabel = "Search",
  helpUrl,
  badges,
  user,
  items,
  ...props
}: AppSidebarProps) {
  const t = useT()
  // base-nova places the sidebar by `side` (physical), so RTL puts it on the right.
  const side = useLang() === "ar" ? "right" : "left"
  const openSettings = useOpenCustomizer()
  const groups = builtGroups()
  const secondary: SecondaryItem[] = [
    {
      title: "Settings",
      icon: IconSettings,
      onClick: () => openSettings(true),
    },
    ...(helpUrl ? [{ title: "Get Help", icon: IconHelp, url: helpUrl }] : []),
  ]

  return (
    <Sidebar collapsible="icon" side={side} {...props}>
      <SidebarHeader>
        <BrandToggle brand={brand} />
        {onSearch && (
          <>
            {/* sidebar-01's search form, opening the command palette. */}
            <button
              type="button"
              onClick={onSearch}
              className="relative flex h-8 w-full items-center rounded-md border border-input bg-background ps-8 pe-2 text-start text-sm text-muted-foreground shadow-xs outline-none group-data-[collapsible=icon]:hidden hover:bg-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <IconSearch className="pointer-events-none absolute start-2 top-1/2 size-4 -translate-y-1/2 opacity-60" />
              <span className="flex-1 truncate">{t(searchLabel)}</span>
              <kbd
                dir="ltr"
                className="pointer-events-none rounded border bg-muted px-1.5 font-mono text-[10px] leading-4 font-medium"
              >
                {SHORTCUT}
              </kbd>
            </button>
            {/* On the rail, the same search as an icon. */}
            <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSearch} tooltip={t(searchLabel)}>
                  <IconSearch />
                  <span>{t(searchLabel)}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </>
        )}
      </SidebarHeader>

      <SidebarContent>
        {groups.map((g) =>
          g.kind === "documents" ? (
            <NavDocuments key={g.title} group={g} path={path} />
          ) : (
            <NavMain key={g.title} groups={[g]} path={path} badges={badges} />
          )
        )}
        <NavSecondary items={secondary} path={path} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} items={items} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
