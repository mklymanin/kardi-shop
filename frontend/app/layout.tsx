import type { Metadata } from "next";
import localFont from "next/font/local";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import "./globals.css";
import "./theme.css";

const golosText = localFont({
  src: [
    { path: "./fonts/GolosText-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GolosText-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const sfProDisplay = localFont({
  src: [
    {
      path: "./fonts/SF-Pro-Display-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Display-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

const rgSpacious = localFont({
  src: "./fonts/RG-SpaciousBook.woff2",
  variable: "--font-nav",
  display: "swap",
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
    <html
      lang="ru"
      className={cn(
        golosText.variable,
        sfProDisplay.variable,
        rgSpacious.variable
      )}
    >
      <body className="text-ink flex min-h-screen flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
