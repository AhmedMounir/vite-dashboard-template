/**
 * Page and card layout every page uses. As in shadcn's dashboard-01, the page
 * title lives in the site header, and the page's ⓘ sits beside it there. A
 * page shows its own heading only when it says more than the header; its
 * actions sit in a slim row above the content.
 *
 * The shell provides both contexts: HeaderTitleContext with the registry
 * title for the current route, HeaderHelpSlot with the element beside the
 * header's <h1>.
 */
import { createContext, useContext, type ReactNode } from "react"
import { createPortal } from "react-dom"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { HelpTip } from "@/components/help"
import { useT } from "@/lib/i18n"

export const HeaderTitleContext = createContext<string | null>(null)
export const HeaderHelpSlot = createContext<HTMLElement | null>(null)

/** Titles are English keys, translated here. */
export function Page({
  title,
  helpId,
  actions,
  children,
}: {
  title: string
  helpId?: string
  actions?: ReactNode
  children: ReactNode
}) {
  const t = useT()
  const header = useContext(HeaderTitleContext)
  const slot = useContext(HeaderHelpSlot)
  const showTitle = header !== title
  const tip = helpId ? <HelpTip id={helpId} /> : null
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
      {!showTitle && slot && tip && createPortal(tip, slot)}
      {(showTitle || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {showTitle ? (
            <h2 className="flex items-center gap-1 text-xl font-semibold tracking-tight">
              {t(title)}
              {tip}
            </h2>
          ) : (
            <span />
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export function Section({
  title,
  helpId,
  actions,
  children,
}: {
  title: string
  helpId?: string
  actions?: ReactNode
  children: ReactNode
}) {
  const t = useT()
  return (
    <Card className="@container/card min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          {t(title)}
          {helpId && <HelpTip id={helpId} />}
        </CardTitle>
        {actions && (
          <CardAction className="flex flex-wrap items-center gap-2">
            {actions}
          </CardAction>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
