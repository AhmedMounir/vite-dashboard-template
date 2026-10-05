/**
 * Formatting. Unknown stays unknown: a null is never printed as 0. Figures use
 * Western digits and en-GB formats in every language.
 */

/** Set to the app's time zone so a date never shifts with the reader's machine. */
const TIME_ZONE = "UTC"

export function formatMoney(
  value: number | null | undefined,
  currency = "USD",
  digits = 0
): string {
  if (value == null || !Number.isFinite(value)) return "unknown"
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    currencyDisplay: "code",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
    .format(value)
    .replace(/\u00a0/g, " ")
}

/** A plain number at fixed decimals. */
export function num(value: number | null | undefined, digits = 0): string {
  if (value == null || !Number.isFinite(value)) return "unknown"
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function formatPct(
  value: number | null | undefined,
  digits = 1
): string {
  if (value == null || !Number.isFinite(value)) return "unknown"
  return `${value.toFixed(digits)}%`
}

/** With an explicit sign: "+1,234.50" or "−1,234.50" (a real minus sign). */
export function signed(value: number | null | undefined, digits = 2): string {
  if (value == null || !Number.isFinite(value)) return "unknown"
  return (value >= 0 ? "+" : "−") + num(Math.abs(value), digits)
}

/** Large figures for an axis or a ticker: 8.4bn, 628k. */
export function compact(value: number | null | undefined, digits = 1): string {
  if (value == null || !Number.isFinite(value)) return "unknown"
  const a = Math.abs(value)
  if (a >= 1e9) return (value / 1e9).toFixed(digits) + "bn"
  if (a >= 1e6) return (value / 1e6).toFixed(digits) + "mn"
  if (a >= 1e3) return (value / 1e3).toFixed(digits === 1 ? 0 : digits) + "k"
  return num(value, 0)
}

/** Wrapped in Unicode isolates so a date stays one LTR unit inside RTL text. */
const isolate = (s: string) => `\u2066${s}\u2069`

/** Newer ICU data writes September as "Sept" in en-GB; keep three letters like the other months. */
const threeLetters = (s: string) => s.replace("Sept", "Sep")

/** "23 Sep 2026", from YYYY-MM-DD or a timestamp. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "undated"
  const d = new Date(value.length === 10 ? `${value}T00:00:00Z` : value)
  if (Number.isNaN(d.getTime())) return value
  return isolate(
    threeLetters(
      new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: TIME_ZONE,
      }).format(d)
    )
  )
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "never"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return isolate(
    threeLetters(
      new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: TIME_ZONE,
      }).format(d)
    )
  )
}
