import { VersionWatcher } from "@/components/global/version-watcher";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import { YearProvider } from "@/context/year-context";
import { TourProvider } from "@/context/tour-context";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import 'shepherd.js/dist/css/shepherd.css';
import "leaflet/dist/leaflet.css"
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
};

export const metadata: Metadata = {
  title: {
    template: "%s | Grupo Diaz Alvarez Hermanos",
    default: "Grupo Diaz Alvarez Hermanos"
  },
  description: "Sistema web para las empresas de Grupo Diaz Alvarez Hermanos",
  keywords: ["sistema empresarial", "logística", "transporte", "gestión empresarial", "Grupo Diaz Alvarez Hermanos"],
  authors: [{ name: "Grupo Diaz Alvarez Hermanos" }],
  creator: "Grupo Diaz Alvarez Hermanos",
  publisher: "Grupo Diaz Alvarez Hermanos",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    title: "Grupo Diaz Alvarez Hermanos",
    description: "Sistema web para las empresas de Grupo Diaz Alvarez Hermanos",
    siteName: "Grupo Diaz Alvarez Hermanos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grupo Diaz Alvarez Hermanos",
    description: "Sistema web para las empresas de Grupo Diaz Alvarez Hermanos",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
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
