"use client"

import { useTheme } from 'next-themes'
import React, { createContext, ReactNode, useContext, useEffect,useState } from 'react'

export type StatusLevel = 'operational' | 'warning' | 'critical' | 'offline'
export type EquipmentState = 'active' | 'idle' | 'maintenance' | 'fault'
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical'
export type FleetTheme = 'light' | 'dark' | 'high-contrast'

interface FleetThemeContextValue {
  theme: FleetTheme
  setTheme: (theme: FleetTheme) => void
  statusColors: Record<StatusLevel, string>
  equipmentStateColors: Record<EquipmentState, string>
  alertSeverityColors: Record<AlertSeverity, string>
  isHighContrast: boolean
  toggleHighContrast: () => void
}

const FleetThemeContext = createContext<FleetThemeContextValue | undefined>(undefined)

export const useFleetTheme = () => {
  const context = useContext(FleetThemeContext)
  if (!context) {
    throw new Error('useFleetTheme must be used within FleetThemeProvider')
  }
  return context
}

interface FleetThemeProviderProps {
  children: ReactNode
  defaultTheme?: FleetTheme
}

export const FleetThemeProvider = ({ 
  children, 
  defaultTheme = 'light' 
}: FleetThemeProviderProps) => {
  const { theme: nextTheme, setTheme: setNextTheme } = useTheme()
  const [isHighContrast, setIsHighContrast] = useState(false)

  // Get current theme, fallback to defaultTheme
  const currentTheme = (nextTheme as FleetTheme) || defaultTheme

  // Industrial color schemes optimized for field conditions
  const statusColors: Record<StatusLevel, string> = {
    operational: 'hsl(var(--fleet-status-operational))',
    warning: 'hsl(var(--fleet-status-warning))',
    critical: 'hsl(var(--fleet-status-critical))',
    offline: 'hsl(var(--fleet-status-offline))'
  }

  const equipmentStateColors: Record<EquipmentState, string> = {
    active: 'hsl(var(--fleet-equipment-active))',
    idle: 'hsl(var(--fleet-equipment-idle))',
    maintenance: 'hsl(var(--fleet-equipment-maintenance))',
    fault: 'hsl(var(--fleet-equipment-fault))'
  }

  const alertSeverityColors: Record<AlertSeverity, string> = {
    info: 'hsl(var(--fleet-alert-info))',
    warning: 'hsl(var(--fleet-alert-warning))',
    error: 'hsl(var(--fleet-alert-error))',
    critical: 'hsl(var(--fleet-alert-critical))'
  }

  const setTheme = (theme: FleetTheme) => {
    if (theme === 'high-contrast') {
      setNextTheme('dark')
      setIsHighContrast(true)
      document.documentElement.classList.add('high-contrast')
    } else {
      setNextTheme(theme)
      setIsHighContrast(false)
      document.documentElement.classList.remove('high-contrast')
    }
  }

  const toggleHighContrast = () => {
    if (isHighContrast) {
      setTheme('light')
    } else {
      setTheme('high-contrast')
    }
  }

  // Handle high-contrast mode detection
  useEffect(() => {
    const hasHighContrast = document.documentElement.classList.contains('high-contrast')
    setIsHighContrast(hasHighContrast)
  }, [nextTheme])

  return (
    <FleetThemeContext.Provider
      value={{
        theme: isHighContrast ? 'high-contrast' : currentTheme,
        setTheme,
        statusColors,
        equipmentStateColors,
        alertSeverityColors,
        isHighContrast,
        toggleHighContrast
      }}
    >
      {children}
    </FleetThemeContext.Provider>
  )
}