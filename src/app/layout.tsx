import type { Metadata } from "next";
import { Agbalumo as FontBrand, Roboto as Font } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme";
import Navbar from "@/components/layouts/navbar";
import { Toaster } from "@/components/ui/sonner";

const font = Font({
  weight: ["100" , "300" , "400" , "500" , "700" , "900"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const brand = FontBrand({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "Breddit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background/5 text-foreground antialiased',
        font.variable, brand.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="container h-full pt-20 font-sans ">
            {children}
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
