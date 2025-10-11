import { VersionWatcher } from "@/components/global/version-watcher";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import { YearProvider } from "@/context/year-context";
import { TourProvider } from "@/context/tour-context";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

import 'shepherd.js/dist/css/shepherd.css';
import "leaflet/dist/leaflet.css"
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Grupo Diaz Alvarez Hermanos",
    default: "Grupo Diaz Alvarez Hermanos"
  },
  description: "Sistema web para las empresas de Grupo Diaz Alvarez Hermanos",
  keywords: "sistema, empresas, Grupo Diaz Alvarez Hermanos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <YearProvider>
              <TooltipProvider>
                <TourProvider>
                  <VersionWatcher />
                  {children}
                  <Toaster />
                </TourProvider>
              </TooltipProvider>
            </YearProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
