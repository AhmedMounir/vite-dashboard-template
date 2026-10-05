/**
 * Appearance and language: light / dark / system, a base colour and an accent
 * (themes.css), the corner radius, and the language (which sets direction).
 * All live on <html> (the `.dark` class, `data-base`, `data-accent`, `--radius`,
 * `lang`, `dir`), so CSS does the work; index.html applies the saved choice
 * before the first paint with the same keys.
 */
export type Mode = "light" | "dark" | "system"
export type Lang = "en" | "ar"

/** The languages offered, each named in itself. Add one here (and its i18n files). */
export const LANGUAGES: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
]

/** "warm" is the default palette (index.css, no data-base); its dark mode draws as shadcn's neutral. */
export const BASES = [
  "warm",
  "neutral",
  "stone",
  "zinc",
  "gray",
  "slate",
  "mauve",
  "olive",
  "mist",
  "taupe",
] as const
export const ACCENTS = [
  "default",
  "amber",
  "blue",
  "cyan",
  "emerald",
  "fuchsia",
  "green",
  "indigo",
  "lime",
  "orange",
  "pink",
  "purple",
  "red",
  "rose",
  "sky",
  "teal",
  "violet",
  "yellow",
] as const
export const RADII = [0, 0.3, 0.5, 0.625, 0.75, 1] as const

export type Base = (typeof BASES)[number]
export type Accent = (typeof ACCENTS)[number]
export type Preferences = {
  mode: Mode
  base: Base
  accent: Accent
  radius: number
  lang: Lang
}

export const DEFAULTS: Preferences = {
  mode: "system",
  base: "warm",
  accent: "default",
  radius: 0.75,
  lang: "en",
}

const KEY = "preferences"

export function loadPreferences(): Preferences {
  try {
    const saved = JSON.parse(
      localStorage.getItem(KEY) ?? "null"
    ) as Partial<Preferences> | null
    return { ...DEFAULTS, ...saved }
  } catch {
    return DEFAULTS
  }
}

export function savePreferences(p: Preferences): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    // Storage can be blocked; the choice then lasts for this page only.
  }
}

const systemDark = () => matchMedia("(prefers-color-scheme: dark)").matches

export const resolvedMode = (mode: Mode): "light" | "dark" =>
  mode === "system" ? (systemDark() ? "dark" : "light") : mode

export const dirOf = (lang: Lang): "ltr" | "rtl" =>
  lang === "ar" ? "rtl" : "ltr"

/** The surfaces actually drawn: warm in light, shadcn neutral for warm in dark, else the chosen theme. */
export const drawnBase = (base: Base, dark: boolean): Base | null =>
  base === "warm" ? (dark ? "neutral" : null) : base

/** Switching themes without every transition animating at once. */
function withoutTransitions(change: () => void): void {
  const style = document.createElement("style")
  style.textContent = "*,*::before,*::after{transition:none!important}"
  document.head.appendChild(style)
  change()
  window.getComputedStyle(document.body)
  requestAnimationFrame(() => requestAnimationFrame(() => style.remove()))
}

export function applyPreferences(p: Preferences): void {
  withoutTransitions(() => apply(p))
}

function apply(p: Preferences): void {
  const html = document.documentElement
  const mode = resolvedMode(p.mode)
  html.classList.toggle("dark", mode === "dark")
  const base = drawnBase(p.base, mode === "dark")
  if (base) html.setAttribute("data-base", base)
  else html.removeAttribute("data-base")
  if (p.accent !== "default") html.setAttribute("data-accent", p.accent)
  else html.removeAttribute("data-accent")
  html.style.setProperty("--radius", `${p.radius}rem`)
  html.lang = p.lang
  html.dir = dirOf(p.lang)
}
