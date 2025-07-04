import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";
import { YearProvider } from "@/context/year-context";

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
                {children}
                <Toaster />
              </TooltipProvider>
            </YearProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
