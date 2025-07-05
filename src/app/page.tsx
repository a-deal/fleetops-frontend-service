"use client";

import { BarChart, Card as TremorCard, DonutChart, Grid, Metric } from "@tremor/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Component,
  Cpu,
  Gauge,
  LineChart,
  Sparkles,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Logo Components
const NextLogo = () => (
  <svg viewBox="0 0 180 180" fill="none" className="h-10 w-10">
    <mask id="mask0_408_134" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
      <circle cx="90" cy="90" r="90" fill="black"/>
    </mask>
    <g mask="url(#mask0_408_134)">
      <circle cx="90" cy="90" r="90" fill="black"/>
      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)"/>
      <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_134)"/>
    </g>
    <defs>
      <linearGradient id="paint0_linear_408_134" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="white"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="paint1_linear_408_134" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
        <stop stopColor="white"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
);

const ShadcnLogo = () => <Component className="h-8 w-8" />;
const TremorLogo = () => <BarChart3 className="h-8 w-8" />;
const LucideLogo = () => <Sparkles className="h-8 w-8" />;
const FramerMotionLogo = () => (
  <svg viewBox="0 0 14 20" className="h-8 w-8" fill="currentColor">
    <path d="M0 0H14V6H7L0 0Z" />
    <path d="M7 7H14V13H7L14 20H7L0 13H7V7Z" />
  </svg>
);

// Main Page Component
export default function FleetOpsShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white/75 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
              <NextLogo />
            </div>
            <div>
              <h1 className="text-xl font-bold">FleetOps Platform Showcase</h1>
              <p className="text-xs text-gray-600">Next.js 15 + TypeScript + Tailwind CSS v4</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">Fleet-Aware Foundations</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-7xl space-y-16">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="mb-4 text-4xl font-bold tracking-tight">
              Industrial Fleet Management Platform
            </h2>
            <p className="text-lg text-gray-600">
              Real-time monitoring, predictive maintenance, and fleet optimization for industrial IoT equipment
            </p>
          </motion.section>

          <ShadcnShowcase />
          <TremorShowcase />
          <LucideShowcase />
          <FramerMotionShowcase />
        </div>
      </main>

      <footer className="mt-24 border-t py-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-600">
          <p>Built with Next.js, TypeScript, and industrial-grade UI components</p>
          <p className="mt-1">Real-time telemetry • Offline-first PWA • WebSocket architecture</p>
        </div>
      </footer>
    </div>
  );
}

// Showcase Header Component
function ShowcaseHeader({ 
  title, 
  description, 
  logo, 
  docsUrl 
}: { 
  title: string; 
  description: string; 
  logo: React.ReactNode;
  docsUrl?: string;
}) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
          {logo}
        </div>
        <div>
          <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      {docsUrl && (
        <Button variant="ghost" size="sm" asChild>
          <a href={docsUrl} target="_blank" rel="noopener noreferrer">
            Docs <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </Button>
      )}
    </div>
  );
}

// shadcn/ui Showcase
function ShadcnShowcase() {
  const [open, setOpen] = useState(false);
  
  return (
    <section id="shadcn" className="scroll-mt-20">
      <ShowcaseHeader
        logo={<ShadcnLogo />}
        title="shadcn/ui"
        description="Industrial-grade UI components built with Radix UI and Tailwind CSS"
        docsUrl="https://ui.shadcn.com"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Equipment Status Card */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle>Equipment Monitoring</CardTitle>
            <CardDescription>Real-time equipment status and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">47</p>
                <p className="text-xs text-gray-600">Active machines</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button size="sm" variant="outline">View Fleet</Button>
            <Button size="sm">Generate Report</Button>
          </CardFooter>
        </Card>

        {/* Alert Management Dialog */}
        <Card className="flex flex-col justify-center p-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Configure Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Equipment Alert</DialogTitle>
                <DialogDescription>
                  Configure threshold alerts for equipment monitoring
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="threshold">Pressure Threshold (PSI)</Label>
                  <Input id="threshold" placeholder="e.g., 150" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact">Alert Contact</Label>
                  <Input id="contact" placeholder="e.g., maintenance@company.com" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => setOpen(false)}>Save Alert</Button>
              </div>
            </DialogContent>
          </Dialog>
          <p className="mt-3 text-center text-sm text-gray-600">
            Configure real-time alerts
          </p>
        </Card>

        {/* Dashboard Views Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Fleet Status</p>
                  <p className="text-xs text-gray-600">Real-time overview of all equipment</p>
                </div>
              </TabsContent>
              <TabsContent value="telemetry" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Live Sensors</p>
                  <p className="text-xs text-gray-600">Pressure, temperature, flow rates</p>
                </div>
              </TabsContent>
              <TabsContent value="maintenance" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Predictive Alerts</p>
                  <p className="text-xs text-gray-600">Scheduled and emergency maintenance</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// Tremor Showcase - Fleet Data
const telemetryData = [
  { month: "Jan", "Uptime": 98.5, "Efficiency": 87.2 },
  { month: "Feb", "Uptime": 97.8, "Efficiency": 89.1 },
  { month: "Mar", "Uptime": 99.2, "Efficiency": 91.5 },
  { month: "Apr", "Uptime": 98.9, "Efficiency": 88.7 },
  { month: "May", "Uptime": 99.1, "Efficiency": 92.3 },
  { month: "Jun", "Uptime": 99.6, "Efficiency": 94.1 },
];

const equipmentTypeData = [
  { name: "Hydraulic Pumps", value: 35 },
  { name: "Compressors", value: 25 },
  { name: "Generators", value: 20 },
  { name: "Motors", value: 15 },
  { name: "Other", value: 5 },
];

function TremorShowcase() {
  return (
    <section id="tremor" className="scroll-mt-20">
      <ShowcaseHeader
        logo={<TremorLogo />}
        title="Tremor"
        description="Industrial analytics charts and real-time telemetry dashboards"
        docsUrl="https://tremor.so"
      />
      
      <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
        {/* Fleet Performance Metric */}
        <TremorCard>
          <h4 className="text-tremor-default text-tremor-content">Fleet Efficiency</h4>
          <div className="flex items-baseline justify-between">
            <Metric>94.1%</Metric>
            <span className="flex items-center text-sm font-medium text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              +2.8%
            </span>
          </div>
          <p className="mt-2 text-tremor-default text-tremor-content">
            vs. last month 91.6%
          </p>
        </TremorCard>

        {/* Fleet Performance Chart */}
        <TremorCard className="md:col-span-2">
          <h4 className="text-tremor-default font-medium text-tremor-content">
            Fleet Performance Metrics
          </h4>
          <BarChart
            className="mt-6"
            data={telemetryData}
            index="month"
            categories={["Uptime", "Efficiency"]}
            colors={["blue", "green"]}
            yAxisWidth={48}
          />
        </TremorCard>

        {/* Equipment Distribution */}
        <TremorCard className="lg:col-span-1">
          <h4 className="text-tremor-default font-medium text-tremor-content">
            Equipment Distribution
          </h4>
          <DonutChart
            className="mt-6"
            data={equipmentTypeData}
            category="value"
            index="name"
            colors={["blue", "cyan", "indigo", "violet", "purple"]}
            showLabel={true}
          />
        </TremorCard>

        {/* Uptime Metric */}
        <TremorCard>
          <h4 className="text-tremor-default text-tremor-content">Average Uptime</h4>
          <Metric>99.2%</Metric>
          <p className="mt-2 text-tremor-default text-tremor-content">
            Last 30 days across fleet
          </p>
        </TremorCard>

        {/* Alert Response Time */}
        <TremorCard>
          <h4 className="text-tremor-default text-tremor-content">Alert Response</h4>
          <Metric>4.2min</Metric>
          <p className="mt-2 text-tremor-default text-tremor-content">
            Average critical alert response time
          </p>
        </TremorCard>
      </Grid>
    </section>
  );
}

// Lucide Icons Showcase - Industrial Icons
function LucideShowcase() {
  const iconSets = [
    {
      category: "Industrial Equipment",
      icons: [
        { Icon: Truck, name: "Fleet" },
        { Icon: Cpu, name: "Sensors" },
        { Icon: Gauge, name: "Gauges" },
        { Icon: Zap, name: "Power" },
      ]
    },
    {
      category: "Monitoring & Analytics",
      icons: [
        { Icon: BarChart3, name: "Analytics" },
        { Icon: LineChart, name: "Trends" },
        { Icon: Activity, name: "Telemetry" },
        { Icon: AlertTriangle, name: "Alerts" },
      ]
    }
  ];

  return (
    <section id="lucide" className="scroll-mt-20">
      <ShowcaseHeader
        logo={<LucideLogo />}
        title="Lucide Icons"
        description="Industrial-focused icon library for equipment monitoring interfaces"
        docsUrl="https://lucide.dev"
      />
      
      <div className="space-y-6">
        {iconSets.map(({ category, icons }) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6">
                {icons.map(({ Icon, name }) => (
                  <motion.div
                    key={name}
                    className="flex flex-col items-center gap-2"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                      <Icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <span className="text-xs font-medium">{name}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// Framer Motion Showcase - Industrial Animations
function FramerMotionShowcase() {
  const [isVisible, setIsVisible] = useState(true);

  const statusCards = [
    { id: "1", title: "Operational", color: "bg-green-500" },
    { id: "2", title: "Warning", color: "bg-amber-500" },
    { id: "3", title: "Critical", color: "bg-red-500" },
  ];

  return (
    <section id="framer" className="scroll-mt-20">
      <ShowcaseHeader
        logo={<FramerMotionLogo />}
        title="Framer Motion"
        description="Smooth animations for industrial UI components and status indicators"
        docsUrl="https://www.framer.com/motion"
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
            <CardDescription>Interactive status indicators with hover states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {statusCards.map((card) => (
                <motion.div
                  key={card.id}
                  className={`h-24 w-24 cursor-pointer rounded-lg ${card.color} flex items-center justify-center text-white font-medium text-sm`}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.2}
                >
                  {card.title}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert Animations */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Notifications</CardTitle>
            <CardDescription>Attention-grabbing alert animations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setIsVisible(!isVisible)}
              variant="outline"
              className="w-full"
            >
              Toggle Alert
            </Button>
            <div className="flex h-32 items-center justify-center">
              <AnimatePresence mode="wait">
                {isVisible && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="h-24 w-24 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center"
                  >
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Telemetry Stream Animation */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Telemetry Stream</CardTitle>
            <CardDescription>Real-time data visualization with staggered animations</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div className="grid grid-cols-8 gap-2">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-16 rounded bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {`Sensor ${i + 1}`}
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}