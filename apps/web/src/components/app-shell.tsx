/**
 * The shell (shadcn dashboard-01, with sidebar-07's icon rail): the inset
 * sidebar and the page under one site header. On a desktop the inset panel
 * is the height of the window and the page scrolls inside it, under the
 * header; on a phone the window scrolls and the header sticks. Use as the
 * root route's component. On a phone the menu becomes a sheet.
 */
import { useState } from "react"
import { Outlet, useRouterState } from "@tanstack/react-router"

import { AppSidebar } from "@/components/app-sidebar"
import { CommandSearch, openCommandSearch } from "@/components/command-search"
import { HeaderHelpSlot, HeaderTitleContext } from "@/components/page"
import { SiteHeader, headerTitle } from "@/components/site-header"
import { CustomizerProvider } from "@/components/theme-customizer"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

/** The sidebar starts as the icon rail, unless the reader left it open last time. */
const sidebarOpen = () =>
  /(?:^|;\s*)sidebar_state=true(?:;|$)/.test(document.cookie)

export function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const [helpSlot, setHelpSlot] = useState<HTMLElement | null>(null)

  return (
    <CustomizerProvider>
      <SidebarProvider
        defaultOpen={sidebarOpen()}
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 64)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar
          variant="inset"
          path={path}
          brand={{ name: "App", subtitle: "Workspace" }}
          onSearch={openCommandSearch}
        />
        {/* min-w-0: a wide table scrolls inside its card, never the page. */}
        <SidebarInset className="min-w-0 md:h-[calc(100svh-(--spacing(4)))] md:overflow-hidden">
          <SiteHeader path={path} helpSlot={setHelpSlot} />
          <div className="@container/main flex min-w-0 flex-1 flex-col md:overflow-y-auto">
            <div className="flex min-w-0 flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
              <HeaderTitleContext.Provider value={headerTitle(path)}>
                <HeaderHelpSlot.Provider value={helpSlot}>
                  <Outlet />
                </HeaderHelpSlot.Provider>
              </HeaderTitleContext.Provider>
            </div>
          </div>
        </SidebarInset>
        <CommandSearch />
      </SidebarProvider>
    </CustomizerProvider>
  )
}
