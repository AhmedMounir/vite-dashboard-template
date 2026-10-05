/** Small shared pieces on shadcn: a figure, a signed change, a chip, a tag, a "Table view" disclosure, a segmented toggle. */
import type { ReactNode } from "react"
import { IconChevronRight } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import { signed } from "@/lib/format"
import { useT } from "@/lib/i18n"
import { cn } from "@workspace/ui/lib/utils"

/** An inline figure: tabular digits, read left to right in RTL too. */
export function Mono({
  children,
  className,
  title,
}: {
  children: ReactNode
  className?: string
  title?: string
}) {
  return (
    <span
      dir="ltr"
      title={title}
      className={cn("font-mono [unicode-bidi:isolate]", className)}
    >
      {children}
    </span>
  )
}

/** A change with its sign and direction colour. Colour is never the only cue: the sign is always printed. */
export function Delta({
  value,
  digits = 2,
  suffix = "",
  className,
}: {
  value: number | null | undefined
  digits?: number
  suffix?: string
  className?: string
}) {
  const dir = value == null ? "" : value >= 0 ? "text-up" : "text-down"
  return (
    <span className={cn("figure", dir, className)}>
      {signed(value, digits)}
      {value != null && suffix}
    </span>
  )
}

type Tone = "positive" | "neutral" | "negative" | "none"
const CHIP: Record<Tone, string> = {
  positive: "bg-chip-positive text-chip-positive-foreground",
  neutral: "bg-chip-neutral text-foreground",
  negative: "bg-chip-negative text-chip-negative-foreground",
  none: "border border-dashed border-line bg-transparent font-normal text-muted-foreground",
}

/** A status pill. */
export function Chip({
  tone,
  size = "sm",
  children,
  className,
}: {
  tone: Tone
  size?: "sm" | "lg"
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold whitespace-nowrap",
        size === "lg" ? "px-3.5 py-1 text-[15px]" : "px-2.5 py-0.5 text-xs",
        CHIP[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

/** A small uppercase tag ("SAMPLE", "NEW"). */
export function Tag({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-[3px] bg-sample px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium tracking-wide text-sample-foreground uppercase",
        className
      )}
    >
      {children}
    </span>
  )
}

/** The table behind every chart, collapsed by default. */
export function TableView({
  children,
  label = "Table view",
}: {
  children: ReactNode
  label?: string
}) {
  const t = useT()
  return (
    <Collapsible className="group/tableview mt-3 text-sm">
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="-ms-2 h-7 px-2 font-normal text-muted-foreground"
          />
        }
      >
        <IconChevronRight
          data-icon="inline-start"
          className="transition-transform group-data-open/tableview:rotate-90 rtl:-scale-x-100 rtl:group-data-open/tableview:-rotate-90"
        />
        {t(label)}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

/** A choice of two to five options: shadcn's ToggleGroup. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  label: string
}) {
  const t = useT()
  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      spacing={0}
      value={[value]}
      onValueChange={(v) => v[0] && onChange(v[0] as T)}
      aria-label={t(label)}
    >
      {options.map((o) => (
        <ToggleGroupItem key={o.value} value={o.value} className="px-3">
          {t(o.label)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

/** The reading pages' segmented switch (links or buttons), as a tab list. */
export function SwitchTrack({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex gap-0.5 rounded-[9px] bg-secondary p-[3px] text-[13px]"
    >
      {children}
    </div>
  )
}
export const switchSegment = (on: boolean) =>
  cn(
    "rounded-[7px] px-3.5 py-[7px] whitespace-nowrap",
    on
      ? "bg-card font-semibold shadow-[0_1px_2px_rgba(0,0,0,.1)]"
      : "text-muted-foreground hover:text-foreground"
  )
