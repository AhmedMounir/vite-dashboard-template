/**
 * The header's bell: a count of unread notifications on the icon, and a
 * popover listing them, newest first, with "Mark all read". Reads
 * `useNotifications()` (lib/notifications.ts).
 */
import { useNavigate } from "@tanstack/react-router"
import { IconBell, IconBellOff } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"
import { formatDateTime } from "@/lib/format"
import { useT } from "@/lib/i18n"
import { useNotifications } from "@/lib/notifications"

export function NotificationsButton() {
  const t = useT()
  const navigate = useNavigate()
  const { items, unread, markRead, markAllRead } = useNotifications()
  const label =
    unread > 0
      ? t("Notifications, {n} unread", { n: unread })
      : t("Notifications")

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative size-8"
            aria-label={label}
            title={label}
          />
        }
      >
        <IconBell />
        {unread > 0 && (
          <span
            dir="ltr"
            className="absolute end-1 top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-destructive px-0.5 text-[9px] leading-none font-semibold text-white tabular-nums"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 gap-0 p-0">
        <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
          <span className="text-sm font-medium">{t("Notifications")}</span>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="xs"
              className="text-muted-foreground"
              onClick={markAllRead}
            >
              {t("Mark all read")}
            </Button>
          )}
        </div>
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-sm text-muted-foreground">
            <IconBellOff className="size-5" />
            {t("No notifications")}
          </div>
        ) : (
          <ul className="max-h-80 overflow-y-auto py-1">
            {items.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => {
                    markRead(n.id)
                    if (n.to) void navigate({ to: n.to })
                  }}
                  className="flex w-full items-start gap-2.5 px-3 py-2 text-start hover:bg-accent"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      n.read ? "bg-transparent" : "bg-series"
                    )}
                  />
                  <span className="grid min-w-0 flex-1 gap-0.5">
                    <span
                      className={cn(
                        "truncate text-[13px]",
                        !n.read && "font-medium"
                      )}
                    >
                      {t(n.title)}
                    </span>
                    {n.body && (
                      <span
                        dir="auto"
                        className="truncate text-xs text-muted-foreground"
                      >
                        {n.body}
                      </span>
                    )}
                    <span className="text-[11px] text-faint-foreground">
                      {formatDateTime(n.at)}
                    </span>
                  </span>
                  {!n.read && <span className="sr-only">{t("Unread")}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}
