import { StrictMode, type ReactNode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "@tanstack/react-router"

import "@workspace/ui/globals.css"
import { Toaster } from "@workspace/ui/components/sonner"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { PreferencesProvider, usePreferences } from "@/lib/preferences"
import { router } from "@/router"

// The API decides freshness, so there is nothing to gain by re-asking on focus or on a timer.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity, refetchOnWindowFocus: false, retry: false },
  },
})

/** Toasts follow the app's light or dark, not the system's. */
function ThemedToaster(): ReactNode {
  const { dark } = usePreferences()
  return <Toaster theme={dark ? "dark" : "light"} />
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PreferencesProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delay={200}>
          <RouterProvider router={router} />
          <ThemedToaster />
        </TooltipProvider>
      </QueryClientProvider>
    </PreferencesProvider>
  </StrictMode>
)
