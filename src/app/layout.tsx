import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientParallaxBackground from "@/components/ClientParallaxBackground";
import InstallAppPrompt from "@/components/InstallAppPrompt";
import MotionProvider from "@/components/MotionProvider";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import {
  createPageMetadata,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/siteMetadata";
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
  metadataBase: new URL(SITE_URL),
  ...createPageMetadata({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    path: "/",
  }),
  applicationName: "Tabunoc NHS",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  alternateName: "Tabunoc NHS",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/images/tabunoc-nhs-logo-512.png`,
  image: `${SITE_URL}/images/tabunoc-nhs-logo-512.png`,
  email: "303111@deped.gov.ph",
  sameAs: [
    "https://facebook.com/tabunocnatlhs",
    "https://m.me/tabunocnatlhs",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sangi Road, Tabunok",
    addressLocality: "Talisay City",
    addressRegion: "Cebu",
    addressCountry: "PH",
  },
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
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[2000] -translate-y-24 rounded-lg bg-brand-yellow px-4 py-3 font-semibold text-brand-navy shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-navy"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
