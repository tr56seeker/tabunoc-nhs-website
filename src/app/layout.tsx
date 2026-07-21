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

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://tabunocnatlhs.com"
).replace(/\/+$/, "");

const siteTitle = "Tabunoc National High School";
const siteDescription =
  "Official website and mobile web app of Tabunoc National High School, Sangi Road, Tabunok, Talisay City, Cebu.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
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
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: siteUrl,
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/images/tabunoc-nhs-logo-512.png",
        width: 512,
        height: 512,
        alt: "Tabunoc National High School logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/tabunoc-nhs-logo-512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffdf20",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteTitle,
  alternateName: "Tabunoc NHS",
  description: siteDescription,
  url: siteUrl,
  logo: `${siteUrl}/images/tabunoc-nhs-logo-512.png`,
  image: `${siteUrl}/images/tabunoc-nhs-logo-512.png`,
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
