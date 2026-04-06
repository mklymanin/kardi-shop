import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import "./globals.css";
import "./theme.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "shop.kardi",
  description: "Магазин медицинского оборудования.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn("font-sans", inter.variable)}>
      <body
        className={cn(
          manrope.variable,
          "text-ink flex min-h-screen flex-col font-sans antialiased"
        )}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
