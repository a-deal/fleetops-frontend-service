"use client";

import { BarChart, Card as TremorCard, DonutChart, Grid,Metric } from "@tremor/react";
import { AnimatePresence,motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Component,
  Dumbbell,
  LineChart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

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
export default function UIShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white/75 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
              <NextLogo />
            </div>
            <div>
              <h1 className="text-xl font-bold">Gym Analytics UI Showcase</h1>
              <p className="text-xs text-gray-600">Next.js 15 + TypeScript + Tailwind CSS v4</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium">Day 1 Complete</span>
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
              Enterprise Gym Analytics Platform
            </h2>
            <p className="text-lg text-gray-600">
              Showcasing our integrated UI component libraries for building beautiful, functional dashboards
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
          <p>Built with Next.js, TypeScript, and modern UI libraries</p>
          <p className="mt-1">Performance: Cold start &lt;2s | HMR &lt;300ms | Build ~8s</p>
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
        description="Beautifully designed components built with Radix UI and Tailwind CSS"
        docsUrl="https://ui.shadcn.com"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Interactive Card */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle>Member Analytics</CardTitle>
            <CardDescription>Track member engagement and retention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-xs text-gray-600">Active members</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button size="sm" variant="outline">View Details</Button>
            <Button size="sm">Export</Button>
          </CardFooter>
        </Card>

        {/* Dialog Example */}
        <Card className="flex flex-col justify-center p-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Target className="mr-2 h-4 w-4" />
                Set Fitness Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Your Fitness Goal</DialogTitle>
                <DialogDescription>
                  Define your target metrics for the next quarter
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="target">Monthly Target</Label>
                  <Input id="target" placeholder="e.g., 50 new members" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="revenue">Revenue Goal</Label>
                  <Input id="revenue" placeholder="e.g., $10,000" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => setOpen(false)}>Save Goal</Button>
              </div>
            </DialogContent>
          </Dialog>
          <p className="mt-3 text-center text-sm text-gray-600">
            Click to open modal dialog
          </p>
        </Card>

        {/* Tabs Example */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Views</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Quick Stats</p>
                  <p className="text-xs text-gray-600">View your gym&apos;s performance at a glance</p>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Deep Dive</p>
                  <p className="text-xs text-gray-600">Detailed analytics and insights</p>
                </div>
              </TabsContent>
              <TabsContent value="reports" className="mt-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Export Ready</p>
                  <p className="text-xs text-gray-600">Generate custom reports</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// Tremor Showcase
const chartdata = [
  { month: "Jan", "Check-ins": 2488, "New Members": 145 },
  { month: "Feb", "Check-ins": 3245, "New Members": 189 },
  { month: "Mar", "Check-ins": 4123, "New Members": 243 },
  { month: "Apr", "Check-ins": 3987, "New Members": 198 },
  { month: "May", "Check-ins": 4523, "New Members": 251 },
  { month: "Jun", "Check-ins": 5234, "New Members": 298 },
];

const donutdata = [
  { name: "Weights Area", value: 35 },
  { name: "Cardio Zone", value: 25 },
  { name: "Group Classes", value: 20 },
  { name: "Swimming Pool", value: 12 },
  { name: "Other", value: 8 },
];

function TremorShowcase() {
  return (
    <section id="tremor" className="scroll-mt-20">
      <ShowcaseHeader
        logo={<TremorLogo />}
        title="Tremor"
        description="React components to build charts and dashboards"
        docsUrl="https://tremor.so"
      />
      
      <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
        {/* Metric Card */}
        <TremorCard>
          <h4 className="text-tremor-default text-tremor-content">Revenue</h4>
          <div className="flex items-baseline justify-between">
            <Metric>$54,329</Metric>
            <span className="flex items-center text-sm font-medium text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              +12.5%
            </span>
          </div>
          <p className="mt-2 text-tremor-default text-tremor-content">
            vs. last month $48,294
          </p>
        </TremorCard>

        {/* Bar Chart */}
        <TremorCard className="md:col-span-2">
          <h4 className="text-tremor-default font-medium text-tremor-content">
            Monthly Performance
          </h4>
          <BarChart
            className="mt-6"
            data={chartdata}
            index="month"
            categories={["Check-ins", "New Members"]}
            colors={["blue", "green"]}
            yAxisWidth={48}
          />
        </TremorCard>

        {/* Donut Chart */}
        <TremorCard className="lg:col-span-1">
          <h4 className="text-tremor-default font-medium text-tremor-content">
            Facility Usage
          </h4>
          <DonutChart
            className="mt-6"
            data={donutdata}
            category="value"
            index="name"
            colors={["blue", "cyan", "indigo", "violet", "purple"]}
            showLabel={true}
          />
        </TremorCard>

        {/* Additional Metrics */}
        <TremorCard>
          <h4 className="text-tremor-default text-tremor-content">Check-in Rate</h4>
          <Metric>89.3%</Metric>
          <p className="mt-2 text-tremor-default text-tremor-content">
            Daily average this week
          </p>
        </TremorCard>

        <TremorCard>
          <h4 className="text-tremor-default text-tremor-content">Member Retention</h4>
          <Metric>94.2%</Metric>
          <p className="mt-2 text-tremor-default text-tremor-content">
            3-month rolling average
          </p>
        </TremorCard>
      </Grid>
    </section>
  );
}

// Lucide Icons Showcase
function LucideShowcase() {
  const iconSets = [
    {
      category: "Gym & Fitness",
      icons: [
        { Icon: Dumbbell, name: "Dumbbell" },
        { Icon: Activity, name: "Activity" },
        { Icon: Target, name: "Target" },
        { Icon: Users, name: "Users" },
      ]
    },
    {
      category: "Analytics",
      icons: [
        { Icon: BarChart3, name: "BarChart" },
        { Icon: LineChart, name: "LineChart" },
        { Icon: TrendingUp, name: "TrendingUp" },
        { Icon: Sparkles, name: "Sparkles" },
      ]
    }
  ];

  return (
    <section id="lucide" className="scroll-mt-20">
      <ShowcaseHeader
        logo={<LucideLogo />}
        title="Lucide Icons"
        description="Beautiful & consistent open-source icon library"
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

// Framer Motion Showcase
function FramerMotionShowcase() {
  const [isVisible, setIsVisible] = useState(true);

  const cards = [
    { id: "1", title: "Hover Me", color: "bg-blue-500" },
    { id: "2", title: "Click Me", color: "bg-green-500" },
    { id: "3", title: "Drag Me", color: "bg-purple-500" },
  ];

  return (
    <section id="framer" className="scroll-mt-20">
      <ShowcaseHeader
        logo={<FramerMotionLogo />}
        title="Framer Motion"
        description="Production-ready motion library for React"
        docsUrl="https://www.framer.com/motion"
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Interactive Animations */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Elements</CardTitle>
            <CardDescription>Hover, click, and drag interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  className={`h-24 w-24 cursor-pointer rounded-lg ${card.color} flex items-center justify-center text-white font-medium`}
                  whileHover={{ scale: 1.05, rotate: 5 }}
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

        {/* Presence Animations */}
        <Card>
          <CardHeader>
            <CardTitle>Presence Animations</CardTitle>
            <CardDescription>Smooth enter/exit transitions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setIsVisible(!isVisible)}
              variant="outline"
              className="w-full"
            >
              Toggle Animation
            </Button>
            <div className="flex h-32 items-center justify-center">
              <AnimatePresence mode="wait">
                {isVisible && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="h-24 w-24 rounded-lg bg-gradient-to-br from-orange-400 to-pink-600"
                  />
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Stagger Animation */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Stagger Animation</CardTitle>
            <CardDescription>Sequential animations for list items</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div className="grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-16 rounded bg-gradient-to-br from-blue-400 to-indigo-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}