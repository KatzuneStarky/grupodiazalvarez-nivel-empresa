import { ThemeProvider } from "@/providers/theme-provider";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: "%s | Grupo Diaz Alvarez Hermanos",
    default: "Grupo Diaz Alvarez Hermanos"
  },
  description: "Sistema web para las empresas de Grupo Diaz Alvarez Hermanos",
  keywords: "sistema, empresas, Grupo Diaz Alvarez Hermanos",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 2,
    minimumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
