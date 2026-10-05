/** The preferences as React state, applied to <html> on every change and saved. */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import { DirectionProvider } from "@workspace/ui/components/direction"
import {
  applyPreferences,
  dirOf,
  loadPreferences,
  resolvedMode,
  savePreferences,
  type Preferences,
} from "@/lib/theme"

type Ctx = {
  prefs: Preferences
  set: (patch: Partial<Preferences>) => void
  /** Light or dark as shown now: "system" resolved. */
  dark: boolean
}

const PreferencesContext = createContext<Ctx | null>(null)

const DARK_QUERY = "(prefers-color-scheme: dark)"
const subscribeSystem = (onChange: () => void) => {
  const mq = matchMedia(DARK_QUERY)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}
const systemDark = () => matchMedia(DARK_QUERY).matches

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(loadPreferences)
  // The system's choice, followed while "system" is chosen.
  const sysDark = useSyncExternalStore(subscribeSystem, systemDark, () => false)
  const dark = prefs.mode === "system" ? sysDark : prefs.mode === "dark"

  useEffect(() => {
    applyPreferences(prefs)
    savePreferences(prefs)
  }, [prefs, sysDark])

  const set = (patch: Partial<Preferences>) =>
    setPrefs((p) => ({ ...p, ...patch }))

  // "d" toggles light and dark, outside text fields (the monorepo template's shortcut).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.repeat ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.key.toLowerCase() !== "d"
      )
        return
      const el = e.target instanceof HTMLElement ? e.target : null
      if (
        el &&
        (el.isContentEditable ||
          el.closest("input, textarea, select, [contenteditable='true']"))
      )
        return
      setPrefs((p) => ({
        ...p,
        mode: resolvedMode(p.mode) === "dark" ? "light" : "dark",
      }))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <PreferencesContext.Provider value={{ prefs, set, dark }}>
      <DirectionProvider direction={dirOf(prefs.lang)}>
        {children}
      </DirectionProvider>
    </PreferencesContext.Provider>
  )
}

export function usePreferences(): Ctx {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error("usePreferences outside PreferencesProvider")
  return ctx
}
