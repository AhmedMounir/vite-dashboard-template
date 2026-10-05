/**
 * The header over every page, fixed while the page scrolls under it: where
 * you are (breadcrumb from the registry; the last crumb is the page's <h1>,
 * with the page's ⓘ beside it), then page-specific `actions`, notifications,
 * language (a menu), light or dark, and Settings. On
 * a phone it starts with the menu button (on a desktop the app's icon in the
 * sidebar is the toggle).
 */
import { Fragment, type ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import {
  IconLanguage,
  IconMoon,
  IconSettings,
  IconSun,
} from "@tabler/icons-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { NotificationsButton } from "@/components/notifications"
import { useOpenCustomizer } from "@/components/theme-customizer"
import { REGISTRY } from "@/registry"
import { usePreferences } from "@/lib/preferences"
import { LANGUAGES, type Lang } from "@/lib/theme"
import { useT } from "@/lib/i18n"

type Crumb = { title: string; path?: string }

/** Group › section › page for a path, from the registry. */
export function crumbsFor(path: string): Crumb[] {
  for (const g of REGISTRY) {
    const page = g.pages.find((p) => p.path === path)
    if (page) return [{ title: g.title }, { title: page.title }]
    for (const s of g.sections ?? []) {
      const sp = s.pages.find((p) => p.path === path)
      if (sp)
        return [
          { title: g.title },
          { title: s.title, path: s.pages[0]!.path },
          { title: sp.title },
        ]
    }
  }
  return []
}

/** The title the header shows for a path: the last crumb, an English key. */
export const headerTitle = (path: string): string | null =>
  crumbsFor(path).at(-1)?.title ?? null

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onClick}
            aria-label={label}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

/** The language, as a menu of the languages offered (each named in itself). */
function LanguageMenu() {
  const t = useT()
  const { prefs, set } = usePreferences()
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={t("Language")}
                />
              }
            />
          }
        >
          <IconLanguage />
        </TooltipTrigger>
        <TooltipContent>{t("Language")}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuGroup>
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SiteHeader({
  path,
  helpSlot,
  crumbs,
  actions,
}: {
  path: string
  helpSlot: (el: HTMLElement | null) => void
  crumbs?: Crumb[]
  actions?: ReactNode
}) {
  const t = useT()
  const { set, dark } = usePreferences()
  const openCustomizer = useOpenCustomizer()
  const trail = crumbs ?? crumbsFor(path)

  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/85 backdrop-blur-md md:rounded-t-xl">
      <div className="flex w-full min-w-0 items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ms-1 md:hidden" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 md:hidden"
        />
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList className="flex-nowrap">
            {trail.map((c, i) => {
              const last = i === trail.length - 1
              return (
                <Fragment key={c.title}>
                  {i > 0 && (
                    <BreadcrumbSeparator className="hidden xl:block rtl:rotate-180" />
                  )}
                  <BreadcrumbItem
                    className={
                      last ? "min-w-0" : "hidden shrink-0 xl:inline-flex"
                    }
                  >
                    {last ? (
                      <BreadcrumbPage className="flex min-w-0 items-center gap-1 text-base font-medium">
                        <h1 className="truncate">{t(c.title)}</h1>
                        <span ref={helpSlot} className="contents" />
                      </BreadcrumbPage>
                    ) : c.path ? (
                      <BreadcrumbLink render={<Link to={c.path} />}>
                        {t(c.title)}
                      </BreadcrumbLink>
                    ) : (
                      <span>{t(c.title)}</span>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ms-auto flex shrink-0 items-center gap-2">
          {actions}
          <div className="flex items-center">
            <NotificationsButton />
            <LanguageMenu />
            <IconButton
              label={dark ? t("Light mode") : t("Dark mode")}
              onClick={() => set({ mode: dark ? "light" : "dark" })}
            >
              {dark ? <IconSun /> : <IconMoon />}
            </IconButton>
            <IconButton
              label={t("Settings")}
              onClick={() => openCustomizer(true)}
            >
              <IconSettings />
            </IconButton>
          </div>
        </div>
      </div>
    </header>
  )
}
