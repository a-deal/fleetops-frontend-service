import "./globals.css";

import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import { gtAmerica, gtPressura, gtPressuraMono } from "@/styles/fonts";

export const metadata: Metadata = {
  title: "FleetOps Management Platform",
  description: "Industrial fleet management platform with real-time telemetry and predictive maintenance",
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
