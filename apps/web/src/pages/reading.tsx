/**
 * The reading layout: a centred column of cards, one number and one sentence
 * each, chips for status, a list as one bordered card. A demo of docs/ui's
 * layout B; every figure is sample data.
 */
import { Link } from "@tanstack/react-router"
import { IconSearch } from "@tabler/icons-react"

import { Chip, Mono, SwitchTrack, Tag, switchSegment } from "@/components/bits"
import { openCommandSearch } from "@/components/command-search"
import { HelpTip } from "@/components/help"
import { formatDate } from "@/lib/format"
import { useT } from "@/lib/i18n"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"

const ROWS = [
  {
    name: "Northwind",
    code: "NWD",
    status: "positive",
    label: "Healthy",
    change: 4.2,
  },
  {
    name: "Contoso",
    code: "CTS",
    status: "neutral",
    label: "Watch",
    change: -0.6,
  },
  {
    name: "Fabrikam",
    code: "FBK",
    status: "negative",
    label: "At risk",
    change: -7.9,
  },
  {
    name: "Litware",
    code: "LTW",
    status: "none",
    label: "Not rated",
    change: 1.1,
  },
] as const

export function ReadingPage() {
  const t = useT()
  const [view, setView] = useState<"overview" | "detail">("overview")
  return (
    <div className="mx-auto w-full max-w-[920px] py-2 md:py-4">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <SwitchTrack label={t("View")}>
          {(["overview", "detail"] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={view === k}
              onClick={() => setView(k)}
              className={switchSegment(view === k)}
            >
              {t(k === "overview" ? "Overview" : "Detail")}
            </button>
          ))}
        </SwitchTrack>
      </div>

      <button
        type="button"
        onClick={openCommandSearch}
        className="mt-4 flex w-full items-center gap-3 rounded-xl border bg-card px-4 py-3.5 text-start text-[15px] text-muted-foreground shadow-xs hover:bg-muted/40"
      >
        <IconSearch className="size-5" />
        <span className="flex-1">{t("Search")}</span>
        <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[11px]">
          Ctrl K
        </kbd>
      </button>

      <div className="mt-6 grid grid-cols-12 gap-3.5 md:gap-4">
        <section className="col-span-12 rounded-xl border bg-card bg-linear-to-t from-primary/5 to-card px-5 py-6 shadow-xs md:px-8 lg:col-span-7 dark:bg-card">
          <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
            {t("Score")}
            <HelpTip id="card-score" className="size-5 [&_svg]:size-3.5" />
          </div>
          <Mono className="mt-1 block text-[34px] font-semibold">72</Mono>
          <p className="mt-1 text-[13px] leading-relaxed text-subtle-foreground">
            {t("Up five points since last quarter.")}
          </p>
          <div className="mt-2 text-[11px] text-faint-foreground">
            {t("as of {date}", { date: formatDate("2026-10-03") })}
          </div>
        </section>
        <section className="col-span-12 rounded-xl border bg-card px-5 py-6 shadow-xs md:px-7 lg:col-span-5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-[15px] font-semibold">{t("Status")}</h3>
            <Tag>{t("Sample")}</Tag>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip tone="positive">{t("Healthy")}</Chip>
            <Chip tone="neutral">{t("Watch")}</Chip>
            <Chip tone="negative">{t("At risk")}</Chip>
            <Chip tone="none">{t("Not rated")}</Chip>
          </div>
          <Link
            to="/"
            className="mt-5 inline-block text-[13px] font-medium underline-offset-2 hover:underline"
          >
            {t("Open dashboard →")}
          </Link>
        </section>
      </div>

      <h3 className="mt-8 text-[15px] font-semibold">
        {t("Accounts")} · <Mono>{ROWS.length}</Mono>
      </h3>
      <section className="mt-3 overflow-hidden rounded-xl border bg-card shadow-xs">
        {ROWS.map((r) => (
          <div
            key={r.code}
            className="flex items-center justify-between gap-3 border-b px-5 py-3 last:border-b-0 hover:bg-muted/40"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                dir="ltr"
                className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-primary font-mono text-[10px] font-medium text-primary-foreground"
              >
                {r.code}
              </div>
              <div className="min-w-0">
                <div dir="auto" className="truncate text-[13.5px] font-medium">
                  {r.name}
                </div>
                <div className="font-mono text-[11px] text-muted-foreground">
                  {r.code}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mono
                className={cn(
                  "text-[13px]",
                  r.change >= 0 ? "text-up" : "text-down"
                )}
              >
                {r.change >= 0 ? "+" : "−"}
                {Math.abs(r.change).toFixed(1)}%
              </Mono>
              <Chip tone={r.status}>{t(r.label)}</Chip>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
