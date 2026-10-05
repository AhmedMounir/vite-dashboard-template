/**
 * The sidebar's main navigation, built from the registry: each group with its
 * pages, a section as a collapsible item that is open while one of its pages
 * is shown. On the icon rail a section opens as a menu beside its icon
 * instead. Links close the phone sheet when followed.
 */
import type { ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import { IconChevronRight } from "@tabler/icons-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import type { Group } from "@/registry"
import { useT } from "@/lib/i18n"

/** A link that closes the phone sheet when followed; used as a menu button's `render`, which passes its props and children through. */
export function NavLink({
  to,
  children,
  onClick,
  ...props
}: { to: string; children?: ReactNode } & Omit<
  React.ComponentProps<"a">,
  "href"
>) {
  const { isMobile, setOpenMobile } = useSidebar()
  return (
    <Link
      to={to}
      {...props}
      onClick={(e) => {
        onClick?.(e)
        if (isMobile) setOpenMobile(false)
      }}
    >
      {children}
    </Link>
  )
}

/** Active on the page itself and on anything below it. */
export const isActive = (path: string, page: string) =>
  path === page || (page !== "/" && path.startsWith(`${page}/`))

export function NavMain({
  groups,
  path,
  badges,
}: {
  groups: Group[]
  path: string
  badges?: Record<string, ReactNode>
}) {
  const t = useT()
  const { state, isMobile } = useSidebar()
  const rail = state === "collapsed" && !isMobile
  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{t(group.title)}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.pages.map((p) => (
                <SidebarMenuItem key={p.path}>
                  <SidebarMenuButton
                    render={<NavLink to={p.path} />}
                    isActive={isActive(path, p.path)}
                    tooltip={t(p.title)}
                  >
                    <p.icon />
                    <span>{t(p.title)}</span>
                  </SidebarMenuButton>
                  {badges?.[p.path]}
                </SidebarMenuItem>
              ))}
              {group.sections?.map((s) => {
                const inside = s.pages.some((p) => isActive(path, p.path))
                if (rail)
                  return (
                    <SidebarMenuItem key={s.title}>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <SidebarMenuButton
                              isActive={inside}
                              tooltip={t(s.title)}
                            />
                          }
                        >
                          <s.icon />
                          <span>{t(s.title)}</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side="inline-end"
                          align="start"
                          className="min-w-44"
                        >
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>{t(s.title)}</DropdownMenuLabel>
                            {s.pages.map((p) => (
                              <DropdownMenuItem
                                key={p.path}
                                render={<Link to={p.path} />}
                                className={
                                  isActive(path, p.path)
                                    ? "font-medium"
                                    : undefined
                                }
                              >
                                {t(p.title)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  )
                return (
                  <Collapsible
                    key={s.title}
                    render={<SidebarMenuItem />}
                    defaultOpen={inside}
                    className="group/collapsible"
                  >
                    <CollapsibleTrigger
                      render={<SidebarMenuButton tooltip={t(s.title)} />}
                    >
                      <s.icon />
                      <span>{t(s.title)}</span>
                      <IconChevronRight className="ms-auto transition-transform group-data-open/collapsible:rotate-90 rtl:-scale-x-100" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {s.pages.map((p) => (
                          <SidebarMenuSubItem key={p.path}>
                            <SidebarMenuSubButton
                              render={<NavLink to={p.path} />}
                              isActive={isActive(path, p.path)}
                            >
                              <span>{t(p.title)}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
