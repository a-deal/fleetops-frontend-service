import "./globals.css";

import type { Metadata } from "next";
import { Providers } from "@/providers";
import { cn } from "@/lib/utils";
import { gtAmerica, gtPressura, gtPressuraMono } from "@/styles/fonts";

export const metadata: Metadata = {
  title: "Gym Analytics Platform",
  description: "Modern analytics platform for gym management",
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
