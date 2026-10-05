/**
 * Help: an ⓘ tooltip on a page, a card or a figure. The words live in
 * `help/en.json` (and `help/ar.json`), keyed by widget id, never in page code.
 * A field missing in Arabic falls back to the English.
 *
 * help/en.json:
 *   { "card-total": { "tip": "One line.", "what": "…", "how": "…", "source": "…", "limits": "…" } }
 */
import { IconInfoCircle } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { useLang, useT } from "@/lib/i18n"
import type { Lang } from "@/lib/theme"
import en from "@/help/en.json"
import ar from "@/help/ar.json"

export type HelpEntry = {
  tip: string
  what?: string
  how?: string
  source?: string
  limits?: string
}
const HELP: Record<Lang, Record<string, Partial<HelpEntry>>> = {
  en: en as Record<string, HelpEntry>,
  ar,
}

export function help(id: string, lang: Lang = "en"): HelpEntry {
  const h = HELP.en[id] as HelpEntry | undefined
  if (!h && import.meta.env.DEV)
    console.warn(`No help text for '${id}' in help/en.json`)
  return { ...(h ?? { tip: "" }), ...(lang === "en" ? {} : HELP[lang][id]) }
}

const SECTIONS: [keyof HelpEntry, string][] = [
  ["what", "What it shows"],
  ["how", "How it's calculated"],
  ["source", "Where the data comes from"],
  ["limits", "What it doesn't tell you"],
]

/** shadcn's Tooltip on a ghost icon button, so it opens on hover and on keyboard focus. */
export function HelpTip({ id, className }: { id: string; className?: string }) {
  const h = help(id, useLang())
  const t = useT()
  const rows = SECTIONS.filter(([k]) => h[k])
  if (!h.tip && rows.length === 0) return null
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-6 text-muted-foreground hover:text-foreground",
              className
            )}
            aria-label={t("About this")}
          />
        }
      >
        <IconInfoCircle />
      </TooltipTrigger>
      <TooltipContent className="max-w-sm text-start text-pretty">
        <div className="flex flex-col gap-2 py-1">
          {h.tip && <p className="font-medium">{h.tip}</p>}
          {rows.map(([k, label]) => (
            <div key={k}>
              <div className="font-medium opacity-80">{t(label)}</div>
              <p className="opacity-90">{h[k]}</p>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
