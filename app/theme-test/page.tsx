"use client"

import { BarChart, Card as TremorCard, Metric, Text } from "@tremor/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { measureThemeSwitch } from "@/lib/performance"

// Sample data for Tremor chart
const chartdata = [
  { name: "Mon", "Check-ins": 245 },
  { name: "Tue", "Check-ins": 312 },
  { name: "Wed", "Check-ins": 289 },
  { name: "Thu", "Check-ins": 334 },
  { name: "Fri", "Check-ins": 390 },
  { name: "Sat", "Check-ins": 456 },
  { name: "Sun", "Check-ins": 234 },
]

export default function ThemeTestPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleThemeSwitch = (newTheme: string) => {
    measureThemeSwitch(() => {
      setTheme(newTheme)
    })
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Theme System Test</h1>
            <p className="text-muted-foreground">Testing unified theme with shadcn/ui and Tremor</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <p className="text-sm text-muted-foreground">Current: {theme}</p>
          </div>
        </div>

        {/* Performance Test Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Test</CardTitle>
            <CardDescription>Click buttons to measure theme switch performance</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={() => handleThemeSwitch("light")} variant="outline">
              Switch to Light
            </Button>
            <Button onClick={() => handleThemeSwitch("dark")} variant="outline">
              Switch to Dark
            </Button>
            <Button onClick={() => handleThemeSwitch("system")} variant="outline">
              Switch to System
            </Button>
          </CardContent>
        </Card>

        {/* Side by Side Comparison */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* shadcn/ui Components */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">shadcn/ui Components</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Gym Members</CardTitle>
                <CardDescription>Active members this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Monthly recurring revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,678</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>
          </div>

          {/* Tremor Components */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tremor Components</h2>
            
            <TremorCard>
              <Text>Daily Check-ins</Text>
              <Metric>2,543</Metric>
              <Text className="mt-2">Peak hour: 6:00 PM</Text>
            </TremorCard>

            <TremorCard>
              <Text>Weekly Attendance</Text>
              <BarChart
                className="mt-4 h-72"
                data={chartdata}
                index="name"
                categories={["Check-ins"]}
                colors={["blue"]}
                yAxisWidth={48}
              />
            </TremorCard>
          </div>
        </div>

        {/* Color Palette Test */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Verify color consistency across themes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <div className="h-20 rounded bg-background border" />
                <p className="mt-1 text-xs">Background</p>
              </div>
              <div>
                <div className="h-20 rounded bg-foreground" />
                <p className="mt-1 text-xs">Foreground</p>
              </div>
              <div>
                <div className="h-20 rounded bg-primary" />
                <p className="mt-1 text-xs">Primary</p>
              </div>
              <div>
                <div className="h-20 rounded bg-secondary" />
                <p className="mt-1 text-xs">Secondary</p>
              </div>
              <div>
                <div className="h-20 rounded bg-muted" />
                <p className="mt-1 text-xs">Muted</p>
              </div>
              <div>
                <div className="h-20 rounded bg-accent" />
                <p className="mt-1 text-xs">Accent</p>
              </div>
              <div>
                <div className="h-20 rounded bg-card" />
                <p className="mt-1 text-xs">Card</p>
              </div>
              <div>
                <div className="h-20 rounded bg-destructive" />
                <p className="mt-1 text-xs">Destructive</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}