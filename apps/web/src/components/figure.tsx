/**
 * One figure, with its date and its source. A null prints "unknown", never 0.
 * A figure older than `staleAfterDays` is greyed and says it is stale.
 * Rename the sources to fit the app; each needs a `source-<key>` help entry.
 */
import type { ReactNode } from "react"

import { Badge } from "@workspace/ui/components/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { help, HelpTip } from "@/components/help"
import { formatDate } from "@/lib/format"
import { useLang, useT } from "@/lib/i18n"
import { cn } from "@workspace/ui/lib/utils"

export type Source = "provider" | "ours" | "entered"

const LABEL: Record<Source, string> = {
  provider: "{provider} says",
  ours: "calculated",
  entered: "entered by you",
}

export function SourceLabel({
  source,
  provider = "provider",
}: {
  source: Source
  provider?: string
}) {
  const t = useT()
  const lang = useLang()
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Badge
            variant="outline"
            className="h-5 cursor-default px-1.5 text-[11px] font-normal text-muted-foreground"
          />
        }
      >
        {t(LABEL[source], { provider })}
      </TooltipTrigger>
      <TooltipContent>{help(`source-${source}`, lang).tip}</TooltipContent>
    </Tooltip>
  )
}

export function isStale(
  asOf: string | null | undefined,
  staleAfterDays: number | undefined,
  now = Date.now()
): boolean {
  if (!asOf || staleAfterDays == null) return false
  const t = Date.parse(asOf.length === 10 ? `${asOf}T00:00:00Z` : asOf)
  return Number.isFinite(t) && now - t > staleAfterDays * 86_400_000
}

export function Figure({
  label,
  value,
  asOf,
  source,
  provider,
  helpId,
  staleAfterDays,
  note,
  size = "md",
}: {
  label: ReactNode
  /** Already formatted, or "unknown". */
  value: string
  asOf: string | null | undefined
  source?: Source
  provider?: string
  helpId?: string
  staleAfterDays?: number
  note?: ReactNode
  size?: "md" | "lg"
}) {
  const t = useT()
  const stale = isStale(asOf, staleAfterDays)
  const unknown = value === "unknown"
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="truncate">
          {typeof label === "string" ? t(label) : label}
        </span>
        {helpId && <HelpTip id={helpId} />}
      </div>
      <div
        className={cn(
          "figure font-semibold tracking-tight",
          size === "lg" ? "text-3xl" : "text-xl",
          (stale || unknown) && "text-muted-foreground"
        )}
      >
        {unknown ? t("unknown") : value}
      </div>
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span className={cn(stale && "text-status-warning")}>
          {asOf ? t("as of {date}", { date: formatDate(asOf) }) : t("undated")}
          {stale && ` · ${t("stale")}`}
        </span>
        {source && <SourceLabel source={source} provider={provider} />}
      </div>
      {note && (
        <div className="text-xs text-muted-foreground">
          {typeof note === "string" ? t(note) : note}
        </div>
      )}
    </div>
  )
}
