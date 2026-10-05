/**
 * Settings, in a dialog opened from the sidebar or the header: Appearance
 * (light, dark or system, the theme, the accent and the corner radius) and
 * Language. "Default" is the warm palette, drawn in shadcn's neutral when
 * dark; the other themes are shadcn's own. Every choice applies at once and
 * is remembered in this browser.
 */
import { createContext, useContext, useState, type ReactNode } from "react"
import {
  IconDeviceDesktop,
  IconLanguage,
  IconMoon,
  IconPalette,
  IconRotate,
  IconSettings,
  IconSun,
} from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import { usePreferences } from "@/lib/preferences"
import {
  ACCENTS,
  BASES,
  DEFAULTS,
  LANGUAGES,
  RADII,
  type Accent,
  type Base,
  type Lang,
  type Mode,
} from "@/lib/theme"
import { useT } from "@/lib/i18n"
import { cn } from "@workspace/ui/lib/utils"

const CustomizerContext = createContext<(open: boolean) => void>(() => {})

/** Lets any control open the settings. */
export const useOpenCustomizer = () => useContext(CustomizerContext)

export function CustomizerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <CustomizerContext.Provider value={setOpen}>
      {children}
      <SettingsDialog open={open} onOpenChange={setOpen} />
    </CustomizerContext.Provider>
  )
}

/*
 * Swatch colours: a mid tone of each theme, so the picker shows what it picks.
 * Display only; the themes themselves are in index.css and themes.css.
 */
const BASE_SWATCH: Record<Base, string> = {
  warm: "#8a877f",
  neutral: "oklch(0.556 0 0)",
  stone: "oklch(0.553 0.013 58.071)",
  zinc: "oklch(0.552 0.016 285.938)",
  gray: "oklch(0.551 0.027 264.364)",
  slate: "oklch(0.554 0.046 257.417)",
  mauve: "oklch(0.542 0.034 322.5)",
  olive: "oklch(0.58 0.031 107.3)",
  mist: "oklch(0.56 0.021 213.5)",
  taupe: "oklch(0.547 0.021 43.1)",
}

const ACCENT_SWATCH: Record<Accent, string> = {
  default: "var(--foreground)",
  amber: "oklch(0.666 0.179 58.318)",
  blue: "oklch(0.546 0.245 262.881)",
  cyan: "oklch(0.609 0.126 221.723)",
  emerald: "oklch(0.596 0.145 163.225)",
  fuchsia: "oklch(0.591 0.293 322.896)",
  green: "oklch(0.627 0.194 149.214)",
  indigo: "oklch(0.511 0.262 276.966)",
  lime: "oklch(0.648 0.2 131.684)",
  orange: "oklch(0.646 0.222 41.116)",
  pink: "oklch(0.592 0.249 0.584)",
  purple: "oklch(0.558 0.288 302.321)",
  red: "oklch(0.577 0.245 27.325)",
  rose: "oklch(0.586 0.253 17.585)",
  sky: "oklch(0.588 0.158 241.966)",
  teal: "oklch(0.6 0.118 184.704)",
  violet: "oklch(0.541 0.281 293.009)",
  yellow: "oklch(0.795 0.184 86.047)",
}

const nameOf = (s: string) =>
  s === "warm" ? "Default" : s.charAt(0).toUpperCase() + s.slice(1)

function Swatches<T extends string>({
  label,
  hint,
  value,
  options,
  colors,
  onChange,
}: {
  label: string
  hint?: string
  value: T
  options: readonly T[]
  colors: Record<T, string>
  onChange: (v: T) => void
}) {
  const t = useT()
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {hint && <p className="-mt-1 text-xs text-muted-foreground">{hint}</p>}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((o) => (
          <Button
            key={o}
            variant="outline"
            size="sm"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={cn(
              "justify-start",
              value === o && "border-primary ring-1 ring-primary"
            )}
          >
            <span
              className="size-3.5 shrink-0 rounded-full border"
              style={{ background: colors[o] }}
            />
            <span className="truncate">{t(nameOf(o))}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

type Section = "appearance" | "language"
const SECTIONS: { key: Section; title: string; icon: typeof IconPalette }[] = [
  { key: "appearance", title: "Appearance", icon: IconPalette },
  { key: "language", title: "Language", icon: IconLanguage },
]

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { prefs, set } = usePreferences()
  const t = useT()
  const [section, setSection] = useState<Section>("appearance")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(640px,90svh)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[760px]">
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <nav
            className="flex shrink-0 gap-1 border-b bg-sidebar p-2 md:w-48 md:flex-col md:border-e md:border-b-0 md:p-3"
            aria-label={t("Settings")}
          >
            <div className="hidden items-center gap-2 px-2 pt-1 pb-3 text-sm font-semibold md:flex">
              <IconSettings className="size-4" />
              {t("Settings")}
            </div>
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                type="button"
                aria-current={section === s.key ? "page" : undefined}
                onClick={() => setSection(s.key)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent",
                  section === s.key && "bg-sidebar-accent font-medium"
                )}
              >
                <s.icon className="size-4" />
                {t(s.title)}
              </button>
            ))}
          </nav>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b px-6 py-4">
              <DialogTitle>
                {t(section === "appearance" ? "Appearance" : "Language")}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t(
                  section === "appearance"
                    ? "Light or dark, the theme and its colours. Saved in this browser."
                    : "Arabic reads right to left. Figures keep Western digits."
                )}
              </DialogDescription>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
              {section === "appearance" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <Label>{t("Mode")}</Label>
                    <ToggleGroup
                      variant="outline"
                      spacing={0}
                      value={[prefs.mode]}
                      onValueChange={(v) => v[0] && set({ mode: v[0] as Mode })}
                      className="w-full"
                    >
                      <ToggleGroupItem value="light" className="flex-1">
                        <IconSun />
                        {t("Light")}
                      </ToggleGroupItem>
                      <ToggleGroupItem value="dark" className="flex-1">
                        <IconMoon />
                        {t("Dark")}
                      </ToggleGroupItem>
                      <ToggleGroupItem value="system" className="flex-1">
                        <IconDeviceDesktop />
                        {t("System")}
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <Swatches
                    label={t("Theme")}
                    value={prefs.base}
                    options={BASES}
                    colors={BASE_SWATCH}
                    onChange={(base) => set({ base })}
                  />
                  <Swatches
                    label={t("Accent")}
                    value={prefs.accent}
                    options={ACCENTS}
                    colors={ACCENT_SWATCH}
                    onChange={(accent) => set({ accent })}
                  />
                  <div className="flex flex-col gap-2">
                    <Label>{t("Radius")}</Label>
                    <ToggleGroup
                      variant="outline"
                      spacing={0}
                      value={[String(prefs.radius)]}
                      onValueChange={(v) =>
                        v[0] && set({ radius: Number(v[0]) })
                      }
                      className="w-full"
                    >
                      {RADII.map((r) => (
                        <ToggleGroupItem
                          key={r}
                          value={String(r)}
                          className="figure flex-1"
                        >
                          {r}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Label>{t("Language")}</Label>
                  <Select
                    value={prefs.lang}
                    items={LANGUAGES}
                    onValueChange={(v) => v && set({ lang: v as Lang })}
                  >
                    <SelectTrigger className="w-full sm:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {LANGUAGES.map((l) => (
                          <SelectItem
                            key={l.value}
                            value={l.value}
                            lang={l.value}
                          >
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t px-6 py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => set({ ...DEFAULTS, lang: prefs.lang })}
              >
                <IconRotate data-icon="inline-start" />
                {t("Reset to default")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
