"use client";

/**
 * FILE_ID: TABUNOC_HOMEPAGE_PUBLIC_COMMAND_CENTER
 * PATH: src/app/page.tsx
 * PURPOSE: Clean DepEd public school homepage with non-repeating information.
 */

import Link from "next/link";
import { motion } from "motion/react";

import Navbar from "@/components/Navbar";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/components/Footer";

const mapsHref =
  "https://www.google.com/maps/search/?api=1&query=Tabunoc%20National%20High%20School%20Sangi%20Road%20Tabunok%20Talisay%20City%20Cebu";

const quickAccessLinks = [
  {
    title: "Enrollment Guide",
    description: "Requirements, reminders, and enrollment process for learners and parents.",
    href: "/enrollment",
  },
  {
    title: "SHS Offerings",
    description: "Senior High School tracks, strands, and program information.",
    href: "/shs-offerings",
  },
  {
    title: "School Memos",
    description: "Official memoranda, advisories, and public school announcements.",
    href: "/memos",
  },
  {
    title: "Citizen’s Charter",
    description: "Frontline service standards and public assistance information.",
    href: "/citizen-charter",
  },
  {
    title: "School MIS",
    description: "Authorized access to the school management information system.",
    href: "https://smis.tabunocnatlhs.com",
    external: true,
  },
  {
    title: "Contact Us",
    description: "Reach the school through official communication channels.",
    href: "/contact",
  },
];

const schoolServices = [
  {
    title: "Enrollment Assistance",
    description:
      "Guides parents, guardians, transferees, and learners on enrollment procedures and school requirements.",
    href: "/enrollment",
  },
  {
    title: "Senior High School Programs",
    description:
      "Provides information on available SHS learning pathways and program options for incoming Grade 11 learners.",
    href: "/shs-offerings",
  },
  {
    title: "Public Assistance and Records",
    description:
      "Supports school-related inquiries, document requests, and frontline service information.",
    href: "/citizen-charter",
  },
  {
    title: "Official Issuances",
    description:
      "Publishes school memoranda, advisories, public announcements, and important reminders.",
    href: "/memos",
  },
];

const programPriorities = [
  {
    title: "Junior High School",
    description:
      "Provides foundational secondary education for Grades 7 to 10 learners.",
  },
  {
    title: "Senior High School",
    description:
      "Supports career pathway preparation for Grades 11 to 12 learners.",
  },
  {
    title: "Learner Support",
    description:
      "Promotes guidance, learner welfare, parent coordination, and school-based support services.",
  },
  {
    title: "School DRRM",
    description:
      "Strengthens preparedness, safety awareness, emergency response, and learning continuity.",
  },
];

const contactChannels = [
  {
    title: "Facebook Page",
    detail: "facebook.com/tabunocnatlhs",
    href: "https://facebook.com/tabunocnatlhs",
  },
  {
    title: "Messenger",
    detail: "m.me/tabunocnatlhs",
    href: "https://m.me/tabunocnatlhs",
  },
  {
    title: "Email",
    detail: "303111@deped.gov.ph",
    href: "mailto:303111@deped.gov.ph",
  },
  {
    title: "Get Directions",
    detail: "Open school location in Google Maps",
    href: mapsHref,
  },
];

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActionLink({
  href,
  external,
  children,
  className = "",
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const baseClassName = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition duration-300 hover:-translate-y-1 ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClassName}>
      {children}
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar brandMode="afterScroll" />

      <main className="min-h-screen bg-white text-slate-950">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 px-6 pb-20 pt-32">
          <div className="absolute left-10 top-24 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-200/60 blur-3xl" />

          <div className="relative mx-auto max-w-7xl text-center">
            <BrandHeader />

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]"
            >
              Official School Website
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="mx-auto mt-4 max-w-5xl text-4xl font-black leading-tight tracking-tight md:text-6xl"
            >
              Tabunoc National High School
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-700"
            >
              A learner-centered public secondary school serving Junior High
              School and Senior High School learners in Tabunok, Talisay City,
              Cebu.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.3 }}
              className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
            >
              <ActionLink
                href="/enrollment"
                className="bg-[#0F4C5C] text-white hover:bg-[#146577]"
              >
                Enrollment Guide
                <ArrowIcon />
              </ActionLink>

              <ActionLink
                href="/shs-offerings"
                className="bg-[#ffdf20] text-[#071E29] hover:bg-yellow-300"
              >
                View SHS Offerings
                <ArrowIcon />
              </ActionLink>

              <ActionLink
                href="/contact"
                className="border border-[#0F4C5C]/20 bg-white text-[#0F4C5C] hover:bg-slate-50"
              >
                Contact the School
              </ActionLink>
            </motion.div>
          </div>
        </section>

        {/* QUICK ACCESS */}
        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Quick Access"
              title="Find the service you need faster"
              description="Use these official links for common school transactions, announcements, and public information."
            />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {quickAccessLinks.map((item) => {
                const cardContent = (
                  <div className="group h-full rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0F4C5C]/30 hover:bg-white hover:shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-950">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      </div>

                      <span className="mt-1 rounded-full bg-[#0F4C5C]/10 p-2 text-[#0F4C5C] transition group-hover:bg-[#0F4C5C] group-hover:text-white">
                        <ArrowIcon />
                      </span>
                    </div>
                  </div>
                );

                if (item.external) {
                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cardContent}
                    </a>
                  );
                }

                return (
                  <Link key={item.title} href={item.href}>
                    {cardContent}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURED ADVISORY */}
        <section className="bg-[#F8FAFC] px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                    Latest Advisory
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                    Official announcements are posted through school channels.
                  </h2>
                  <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                    Stay updated with enrollment notices, school memoranda,
                    class opening reminders, DRRM advisories, and public
                    announcements issued through the official website and school
                    communication channels.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <ActionLink
                    href="/memos"
                    className="bg-[#0F4C5C] text-white hover:bg-[#146577]"
                  >
                    View School Memos
                    <ArrowIcon />
                  </ActionLink>

                  <ActionLink
                    href="https://facebook.com/tabunocnatlhs"
                    external
                    className="border border-slate-200 bg-white text-[#0F4C5C] hover:bg-slate-50"
                  >
                    Visit Facebook Page
                  </ActionLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                About the School
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                Public education rooted in service, safety, and learner growth.
              </h2>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm md:p-8">
              <p className="text-lg leading-8 text-slate-700">
                Tabunoc National High School is a public secondary school under
                the Department of Education, committed to accessible, inclusive,
                safe, and quality basic education for learners in the community.
              </p>

              <div className="mt-6">
                <ActionLink
                  href="/organization"
                  className="bg-[#0F4C5C] text-white hover:bg-[#146577]"
                >
                  View School Profile
                  <ArrowIcon />
                </ActionLink>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="bg-[#F8FAFC] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="School Services"
              title="Public assistance and learner support"
              description="These services help learners, parents, and stakeholders find the correct school information without crowding the homepage."
            />

            <div className="grid gap-5 md:grid-cols-2">
              {schoolServices.map((service) => (
                <Link key={service.title} href={service.href}>
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0F4C5C]/30 hover:shadow-lg">
                    <h3 className="text-xl font-black text-slate-950">
                      {service.title}
                    </h3>
                    <p className="mt-3 leading-7 text-slate-600">
                      {service.description}
                    </p>
                    <p className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0F4C5C]">
                      Open Service <ArrowIcon />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* PROGRAMS */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Programs and Priorities"
              title="What the school supports"
              description="A short overview of major school-level programs. Full details are placed on their dedicated pages."
            />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {programPriorities.map((program) => (
                <div
                  key={program.title}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm"
                >
                  <h3 className="text-xl font-black text-slate-950">
                    {program.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {program.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-[#0F4C5C] px-6 py-20 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-yellow-300">
                  Contact and Location
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                  Reach the school through official channels.
                </h2>
                <p className="mt-4 leading-7 text-teal-50">
                  For official school inquiries, visit or contact Tabunoc
                  National High School during office hours through authorized
                  communication channels.
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-5">
                  <p className="text-sm font-black uppercase tracking-widest text-yellow-300">
                    School Address
                  </p>
                  <p className="mt-2 leading-7 text-white">
                    Sangi Road, Tabunok, Talisay City, Cebu
                  </p>
                  <p className="mt-3 text-sm leading-6 text-teal-50">
                    Office Hours: Monday to Friday, 8:00 AM – 5:00 PM, except
                    holidays and declared class/work suspensions.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {contactChannels.map((channel) => (
                  <a
                    key={channel.title}
                    href={channel.href}
                    target={
                      channel.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      channel.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="rounded-2xl border border-white/10 bg-white p-5 text-slate-950 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-yellow-50"
                  >
                    <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                      {channel.title}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                      {channel.detail}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}