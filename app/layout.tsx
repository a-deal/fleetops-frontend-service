import "./globals.css";

import type { Metadata, Viewport } from "next";

import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import { gtAmerica, gtPressura, gtPressuraMono } from "@/styles/fonts";

export const metadata: Metadata = {
  title: "FleetOps Management Platform",
  description: "Industrial fleet management platform with real-time telemetry and predictive maintenance",
  // PWA Configuration
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FleetOps",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
  other: {
    // Microsoft/Edge specific
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#09090B",
    "msapplication-tap-highlight": "no",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          gtAmerica.variable,
          gtPressura.variable,
          gtPressuraMono.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
