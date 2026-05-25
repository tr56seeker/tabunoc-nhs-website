import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientParallaxBackground from "@/components/ClientParallaxBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tabunoc National High School",
  description:
    "Official website of Tabunoc National High School, Sangi Road, Tabunok, Talisay City, Cebu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} light h-full bg-white text-slate-950 antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-white text-slate-950">
        <ClientParallaxBackground />
        {children}
      </body>
    </html>
  );
}