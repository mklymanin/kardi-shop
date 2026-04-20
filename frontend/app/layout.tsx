import type { Metadata } from "next";
import localFont from "next/font/local";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Container } from "@/components/ui/container";

const golosText = localFont({
  src: [
    { path: "./fonts/GolosText-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GolosText-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-golos",
  display: "swap",
});

const sfProExpanded = localFont({
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
  variable: "--font-sf-pro",
  display: "swap",
});

const rgSpacious = localFont({
  src: "./fonts/RG-SpaciousBook.woff2",
  variable: "--font-rg-spacious",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kardi.Ru - Контроль Вашего Сердца",
  description: "Магазин медицинского оборудования.",
  icons: {
    icon: "/kardiru.png",
  },
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
        sfProExpanded.variable,
        rgSpacious.variable
      )}
    >
      <body className="text-ink flex min-h-screen flex-col font-sans antialiased">
        <Header />
        <Container>
          <main className="flex-1">{children}</main>
          <Footer />
        </Container>
      </body>
    </html>
  );
}
