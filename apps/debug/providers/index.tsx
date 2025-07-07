"use client"

import * as React from "react"

import { FleetThemeProvider } from "@/lib/theme/fleet-theme-context"
import { QueryProvider } from "@/providers/query-provider"
import { ThemeProvider } from "@/providers/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <FleetThemeProvider>
          {children}
        </FleetThemeProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}