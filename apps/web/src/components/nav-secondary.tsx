/** The sidebar's bottom links: help pages, and buttons such as "Customize". */
import * as React from "react"
import { Link } from "@tanstack/react-router"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { useT } from "@/lib/i18n"

export type SecondaryItem = {
  title: string
  icon: React.ComponentType
} & ({ url: string; onClick?: never } | { onClick: () => void; url?: never })

export function NavSecondary({
  items,
  path,
  ...props
}: { items: SecondaryItem[]; path: string } & React.ComponentPropsWithoutRef<
  typeof SidebarGroup
>) {
  const t = useT()
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.url ? (
                <SidebarMenuButton
                  render={<Link to={item.url} />}
                  isActive={path === item.url}
                  tooltip={t(item.title)}
                >
                  <item.icon />
                  <span>{t(item.title)}</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  onClick={item.onClick}
                  tooltip={t(item.title)}
                >
                  <item.icon />
                  <span>{t(item.title)}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
