/**
 * Translation. The English text is the key: `t("Holdings")`. Arabic lives in
 * `src/i18n/ar/*.json`, one file per area, merged here; a missing key falls
 * back to the English. Placeholders are `{name}`. When one English word means
 * two things, a context after `|` tells them apart: `t("Held|period")`.
 */
import { useCallback } from "react"

import { usePreferences } from "@/lib/preferences"
import type { Lang } from "@/lib/theme"

const files = import.meta.glob<Record<string, string>>("../i18n/ar/*.json", {
  eager: true,
  import: "default",
})
const AR: Record<string, string> = Object.assign({}, ...Object.values(files))

export type Vars = Record<string, string | number>

export function translate(lang: Lang, text: string, vars?: Vars): string {
  const bar = text.indexOf("|")
  const english = bar < 0 ? text : text.slice(0, bar)
  const s = lang === "ar" ? (AR[text] ?? AR[english] ?? english) : english
  return vars
    ? s.replace(/\{(\w+)\}/g, (m, k: string) =>
        k in vars ? String(vars[k]) : m
      )
    : s
}

export type T = (text: string, vars?: Vars) => string

/** Stable while the language stays the same, so it can sit in a memo's dependencies. */
export function useT(): T {
  const lang = usePreferences().prefs.lang
  return useCallback((text, vars) => translate(lang, text, vars), [lang])
}

export function useLang(): Lang {
  return usePreferences().prefs.lang
}
