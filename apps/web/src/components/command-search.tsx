/**
 * The command palette (Ctrl/⌘K, or the sidebar's search box): the registry's
 * built pages. Add record groups (customers, documents…) beside Pages; rank
 * them yourself, which is why cmdk's own filter is off for those.
 */
import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"
import { ALL_PAGES } from "@/registry"
import { useT } from "@/lib/i18n"

const OPEN = "command-search:open"

/** Opens the palette from anywhere (a button, a menu item). */
export const openCommandSearch = () => window.dispatchEvent(new Event(OPEN))

export function CommandSearch() {
  const t = useT()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener("keydown", onKey)
    window.addEventListener(OPEN, onOpen)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener(OPEN, onOpen)
    }
  }, [])

  const pages = ALL_PAGES.filter((p) => p.component)

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={t("Search")}
      description={t("Find a page")}
    >
      <Command>
        <CommandInput placeholder={t("Search")} />
        <CommandList>
          <CommandEmpty>{t("No results.")}</CommandEmpty>
          <CommandGroup heading={t("Pages")}>
            {pages.map((p) => (
              <CommandItem
                key={p.path}
                value={`${t(p.title)} ${p.path}`}
                onSelect={() => {
                  setOpen(false)
                  void navigate({ to: p.path })
                }}
              >
                <p.icon />
                {t(p.title)}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
