import type { Metadata } from "next";

export const SITE_URL = "https://tabunocnatlhs.com";

export const SITE_NAME = "Tabunoc National High School";
export const SITE_DESCRIPTION =
  "Official website and mobile web app of Tabunoc National High School, Sangi Road, Tabunok, Talisay City, Cebu.";

const siteImage = `${SITE_URL}/images/tabunoc-nhs-logo-512.png`;

type PageMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
  const canonicalUrl = new URL(path, `${SITE_URL}/`).toString();

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_PH",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: siteImage,
          width: 512,
          height: 512,
          alt: "Tabunoc National High School logo",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
      images: [siteImage],
    },
  };
}
