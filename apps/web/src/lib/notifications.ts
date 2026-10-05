/**
 * Notifications: a small store the header's bell reads. The template seeds
 * it with sample items; an app replaces `SEED` with its own source (a query,
 * a websocket) and calls `pushNotification` when one arrives.
 */
import { useSyncExternalStore } from "react"

export type Notification = {
  id: string
  /** English key, translated where shown. */
  title: string
  body?: string
  /** ISO timestamp. */
  at: string
  read: boolean
  /** Opens on click, when set. */
  to?: string
}

const SEED: Notification[] = [
  {
    id: "n1",
    title: "Order paid",
    body: "A-1011 · Woodgrove",
    at: "2026-10-05T09:12:00Z",
    read: false,
    to: "/",
  },
  {
    id: "n2",
    title: "New member joined",
    body: "Alex Kim",
    at: "2026-10-04T15:40:00Z",
    read: false,
    to: "/team/members",
  },
  {
    id: "n3",
    title: "Weekly report ready",
    at: "2026-10-03T07:00:00Z",
    read: true,
    to: "/reports",
  },
]

let items = SEED
const listeners = new Set<() => void>()

function set(next: Notification[]) {
  items = next
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function pushNotification(n: Notification) {
  set([n, ...items])
}

export function useNotifications() {
  const list = useSyncExternalStore(subscribe, () => items)
  return {
    items: list,
    unread: list.filter((n) => !n.read).length,
    markRead: (id: string) =>
      set(items.map((n) => (n.id === id ? { ...n, read: true } : n))),
    markAllRead: () => set(items.map((n) => ({ ...n, read: true }))),
  }
}
