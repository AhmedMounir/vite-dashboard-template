/**
 * A sidebar group whose pages each carry a "more" menu: open, open in a new
 * tab, copy the link (dashboard-01's Documents group).
 */
import { useNavigate } from "@tanstack/react-router"
import {
  IconDots,
  IconExternalLink,
  IconFolder,
  IconLink,
} from "@tabler/icons-react"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { isActive, NavLink } from "@/components/nav-main"
import type { Group } from "@/registry"
import { useT } from "@/lib/i18n"

export function NavDocuments({ group, path }: { group: Group; path: string }) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const t = useT()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(group.title)}</SidebarGroupLabel>
      <SidebarMenu>
        {group.pages.map((page) => {
          const url = new URL(page.path, window.location.origin).toString()
          return (
            <SidebarMenuItem key={page.path}>
              <SidebarMenuButton
                render={<NavLink to={page.path} />}
                isActive={isActive(path, page.path)}
                tooltip={t(page.title)}
              >
                <page.icon />
                <span>{t(page.title)}</span>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuAction
                      showOnHover
                      className="rounded-sm data-popup-open:bg-accent"
                    />
                  }
                >
                  <IconDots />
                  <span className="sr-only">{t("More")}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-44 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => void navigate({ to: page.path })}
                    >
                      <IconFolder />
                      <span>{t("Open|verb")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => window.open(url, "_blank", "noopener")}
                    >
                      <IconExternalLink />
                      <span>{t("Open in a new tab")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        void navigator.clipboard.writeText(url).then(
                          () => toast.success(t("Link copied")),
                          () => toast.error(t("Could not copy the link"))
                        )
                      }}
                    >
                      <IconLink />
                      <span>{t("Copy link")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
