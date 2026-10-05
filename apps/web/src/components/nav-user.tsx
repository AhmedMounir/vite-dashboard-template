/**
 * The sidebar footer. dashboard-01 shows the signed-in user here; pass `user`
 * for that. Without one it shows the reader's preferences. Either way the menu
 * has mode and language at hand, Settings one click away, and any `items`
 * (account, sign out…).
 */
import type { ReactNode } from "react"
import {
  IconDeviceDesktop,
  IconDotsVertical,
  IconLanguage,
  IconMoon,
  IconSettings,
  IconSun,
  IconUser,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { useOpenCustomizer } from "@/components/theme-customizer"
import { usePreferences } from "@/lib/preferences"
import { LANGUAGES, type Lang, type Mode } from "@/lib/theme"
import { useT } from "@/lib/i18n"

const MODE_ICON = {
  light: IconSun,
  dark: IconMoon,
  system: IconDeviceDesktop,
} as const

export type NavUserProps = {
  user?: { name: string; email: string; avatar?: string }
  /** Extra menu entries below the preferences, e.g. DropdownMenuItems for account and sign-out. */
  items?: ReactNode
}

function Who({
  user,
  subtitle,
}: {
  user?: NavUserProps["user"]
  subtitle: string
}) {
  const t = useT()
  const initials = user?.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <>
      <Avatar className="size-8 rounded-lg grayscale">
        {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
        <AvatarFallback className="rounded-lg">
          {initials ?? <IconUser className="size-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-start text-sm leading-tight">
        <span className="truncate font-medium">
          {user?.name ?? t("Preferences")}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {user?.email ?? subtitle}
        </span>
      </div>
    </>
  )
}

export function NavUser({ user, items }: NavUserProps) {
  const { isMobile } = useSidebar()
  const { prefs, set } = usePreferences()
  const openCustomizer = useOpenCustomizer()
  const t = useT()
  const ModeIcon = MODE_ICON[prefs.mode]
  const langName =
    LANGUAGES.find((l) => l.value === prefs.lang)?.label ?? prefs.lang
  const modeName = t(
    prefs.mode === "system"
      ? "System"
      : prefs.mode === "dark"
        ? "Dark"
        : "Light"
  )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            <Who user={user} subtitle={`${langName} · ${modeName}`} />
            <IconDotsVertical className="ms-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm text-foreground">
                  <Who user={user} subtitle={t("Saved in this browser")} />
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ModeIcon />
                  {t("Mode")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={prefs.mode}
                    onValueChange={(v) => set({ mode: v as Mode })}
                  >
                    <DropdownMenuRadioItem value="light" closeOnClick>
                      {t("Light")}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark" closeOnClick>
                      {t("Dark")}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system" closeOnClick>
                      {t("System")}
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <IconLanguage />
                  {t("Language")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={prefs.lang}
                    onValueChange={(v) => set({ lang: v as Lang })}
                  >
                    {LANGUAGES.map((l) => (
                      <DropdownMenuRadioItem
                        closeOnClick
                        key={l.value}
                        value={l.value}
                        lang={l.value}
                      >
                        {l.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={() => openCustomizer(true)}>
                <IconSettings />
                {t("Settings…")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {items && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>{items}</DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
