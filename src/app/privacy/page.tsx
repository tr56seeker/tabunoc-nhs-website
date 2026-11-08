import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Website Privacy Notice",
  description:
    "How the official Tabunoc National High School website handles visitor, FAQ submission, and administrator data.",
  path: "/privacy",
});

const sections = [
  {
    title: "Information handled by this website",
    content: (
      <>
        <p>
          You can browse most pages without providing your name or creating an
          account. The website uses privacy-focused web analytics to understand
          aggregate page visits, general device or browser information,
          referring pages, and approximate location. These measurements help us
          improve the website and do not use third-party advertising cookies.
        </p>
        <p>
          If you voluntarily submit an FAQ community question, we handle the
          question, optional name or initials, optional audience type, and the
          submission time. Approved questions and school responses may appear
          publicly. Please do not submit learner names, LRN, grades, addresses,
          phone numbers, or private concerns through that form.
        </p>
        <p>
          Authorized website administrators use account details and a secure,
          eight-hour session cookie to manage website content. The cookie is
          necessary for the admin area and is not used for advertising.
        </p>
      </>
    ),
  },
  {
    title: "Why we use the information",
    content: (
      <p>
        Information is used only to operate and secure the official school
        website, publish accurate public information, review and answer
        voluntarily submitted questions, notify authorized staff of new
        submissions, and improve website reliability and accessibility.
      </p>
    ),
  },
  {
    title: "Service providers",
    content: (
      <p>
        The website uses Vercel for hosting and aggregate analytics, Supabase
        for website authentication, database, and file storage, and Resend to
        deliver FAQ review notifications to authorized staff. These providers
        process website data only as needed to supply their services and under
        their own security and privacy commitments.
      </p>
    ),
  },
  {
    title: "Retention and public posting",
    content: (
      <>
        <p>
          Admin session cookies expire after eight hours. FAQ submissions may
          remain in moderation records, or remain visible after approval, while
          they are relevant to the school community. Authorized staff may
          correct, reject, archive, or remove them. Formal retention and
          disposal follow applicable school and Department of Education records
          requirements.
        </p>
        <p>
          Hosting, security, and analytics records are retained by the relevant
          service provider according to its applicable retention settings and
          policies.
        </p>
      </>
    ),
  },
  {
    title: "External systems and links",
    content: (
      <>
        <p>
          This notice applies only to the official website at
          tabunocnatlhs.com. SMIS NextGen is a separate external system linked
          from this website; Tabunoc National High School&apos;s website team does
          not operate or manage the information submitted within that system.
        </p>
        <p>
          Links to SMIS NextGen, Facebook, Messenger, Google Maps, and other
          external services take you outside this website. Their own privacy
          notices and terms apply after you follow those links.
        </p>
      </>
    ),
  },
  {
    title: "Your privacy choices and rights",
    content: (
      <p>
        You may ask about personal information handled through this website or
        request access, correction, objection, erasure, or blocking where
        applicable. Email the school at{" "}
        <a
          className="font-semibold text-brand-teal underline decoration-brand-teal/30 underline-offset-4 hover:text-brand-cyan"
          href="mailto:303111@deped.gov.ph"
        >
          303111@deped.gov.ph
        </a>
        . For private learner matters, use an official school channel instead
        of the public FAQ form.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        variant="minimal"
        eyebrow="Privacy and Transparency"
        title="Website Privacy Notice"
        description="A plain-language guide to the limited information handled by the official school website."
      />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-brand-slate px-6 py-12 text-brand-navy"
      >
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-brand-teal/15 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-brand-teal">
              Effective November 8, 2026
            </p>
            <p className="mt-3 leading-7 text-slate-600">
              Tabunoc National High School provides this notice so visitors can
              understand what the school website handles before they use its
              optional forms or administrator services.
            </p>

            <div className="mt-8 grid gap-8">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-xl font-bold tracking-tight text-brand-navy">
                    {section.title}
                  </h2>
                  <div className="mt-3 grid gap-3 text-sm leading-7 text-slate-600 sm:text-base">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm leading-6 text-slate-700">
              Want to submit a general school question? Review the notice above,
              then visit the{" "}
              <Link
                href="/faq"
                className="font-semibold text-brand-teal underline decoration-brand-teal/30 underline-offset-4 hover:text-brand-cyan"
              >
                Frequently Asked Questions page
              </Link>
              .
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
