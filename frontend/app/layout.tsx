import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { cn } from "@/lib/cn";
import "./globals.css";
import "./theme.css";

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
    <html lang="ru">
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
