import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientParallaxBackground from "@/components/ClientParallaxBackground";
import InstallAppPrompt from "@/components/InstallAppPrompt";
import MotionProvider from "@/components/MotionProvider";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { Analytics } from "@vercel/analytics/next";

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
    "Official website and mobile web app of Tabunoc National High School, Sangi Road, Tabunok, Talisay City, Cebu.",
  applicationName: "Tabunoc NHS",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Tabunoc NHS",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffdf20",
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
        <MotionProvider>
          <SmoothScrollProvider />
          <ClientParallaxBackground />
          {children}
          <Analytics />
          <InstallAppPrompt />
        </MotionProvider>
      </body>
    </html>
  );
}
