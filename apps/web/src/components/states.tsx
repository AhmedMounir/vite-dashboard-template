/**
 * Loading, empty and error states, one look everywhere. `QueryState` picks the
 * right one for a TanStack query and renders the page only once there is data.
 */
import type { ReactNode } from "react"
import type { UseQueryResult } from "@tanstack/react-query"
import { IconAlertTriangle, IconInbox } from "@tabler/icons-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Empty as EmptyRoot,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { useT } from "@/lib/i18n"

export function Loading({ rows = 3 }: { rows?: number }) {
  const t = useT()
  return (
    <div className="grid gap-3" aria-busy="true" aria-label={t("Loading")}>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  )
}

export function Empty({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  const t = useT()
  return (
    <EmptyRoot className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconInbox />
        </EmptyMedia>
        <EmptyTitle>{t(title)}</EmptyTitle>
      </EmptyHeader>
      {children && (
        <EmptyContent className="text-muted-foreground">
          {children}
        </EmptyContent>
      )}
    </EmptyRoot>
  )
}

export function ErrorState({
  title = "Could not load",
  error,
}: {
  title?: string
  error: unknown
}) {
  const t = useT()
  return (
    <Alert variant="destructive">
      <IconAlertTriangle />
      <AlertTitle>{t(title)}</AlertTitle>
      <AlertDescription className="break-words">
        {error instanceof Error ? error.message : String(error)}
      </AlertDescription>
    </Alert>
  )
}

export function QueryState<T>({
  query,
  children,
  rows,
}: {
  query: UseQueryResult<T>
  children: (data: T) => ReactNode
  rows?: number
}) {
  if (query.isPending) return <Loading rows={rows} />
  if (query.isError) return <ErrorState error={query.error} />
  return <>{children(query.data)}</>
}
