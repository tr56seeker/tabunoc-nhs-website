"use client";

/**
 * FILE_ID: TABUNOC_ENROLLMENT_PAGE_SIMPLIFIED
 * PATH: src/app/enrollment/page.tsx
 * PURPOSE: Clean, easy-to-scan Enrollment Guide page for Tabunoc National High School.
 */

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/components/Footer";

const pagePadding = "px-6 md:px-10 xl:px-[120px] 2xl:px-[190px]";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const learnerTypes = [
  {
    title: "Incoming Grade 7",
    description: "For Grade 6 completers entering Junior High School.",
  },
  {
    title: "Incoming Grade 11",
    description: "For Grade 10 completers entering Senior High School.",
  },
  {
    title: "Transferees",
    description: "For learners coming from another school.",
  },
  {
    title: "Returning Learners / Balik-Aral",
    description: "For learners who stopped schooling and wish to return.",
  },
  {
    title: "ALS Completers / Passers",
    description:
      "For ALS learners or completers seeking placement in formal basic education.",
  },
  {
    title: "Continuing Learners",
    description: "For current learners continuing their studies in the school.",
  },
];

const requirements = [
  {
    group: "Incoming Grade 7",
    items: [
      "School Form 9 / Report Card",
      "Photocopy of PSA Birth Certificate, if available",
      "Learner Reference Number (LRN), if available",
      "Accomplished enrollment form",
      "Parent/guardian contact information",
    ],
  },
  {
    group: "Incoming Grade 11",
    items: [
      "School Form 9 / Grade 10 Report Card",
      "Photocopy of PSA Birth Certificate, if available",
      "Learner Reference Number (LRN)",
      "Accomplished enrollment form",
      "Preferred SHS track/strand/specialization information",
    ],
  },
  {
    group: "Transferees",
    items: [
      "School Form 9 / Report Card",
      "Learner Reference Number (LRN)",
      "Photocopy of PSA Birth Certificate, if available",
      "Certificate of Good Moral Character, if required",
      "Other documents for record verification, if needed",
    ],
  },
  {
    group: "Returning Learners / Balik-Aral",
    items: [
      "Latest available school record",
      "PSA Birth Certificate or acceptable proof of identity, if available",
      "Accomplished enrollment form",
      "Parent/guardian contact information",
      "Additional validation by the enrollment team, if needed",
    ],
  },
  {
    group: "ALS Completers / Passers",
    items: [
      "ALS Certificate of Completion or Certificate of Rating, if available",
      "Learner Reference Number (LRN), if available",
      "Photocopy of PSA Birth Certificate or acceptable proof of identity",
      "Accomplished enrollment form",
      "Placement or eligibility validation by the school, if needed",
    ],
  },
];

const enrollmentSteps = [
  "Prepare the required documents.",
  "Proceed to the designated enrollment area or follow the announced procedure.",
  "Submit documents for checking and verification.",
  "Fill out or confirm the learner enrollment information.",
  "Wait for sectioning, confirmation, or further instructions.",
];

const reminders = [
  "Bring original documents for verification when requested.",
  "Submit clear photocopies of required documents.",
  "Use the learner’s correct full name based on official records.",
  "Provide active and reachable parent/guardian contact numbers.",
  "Follow official school announcements only.",
  "Observe proper conduct and school safety protocols while inside the campus.",
];

const enrollmentFaqs = [
  {
    question: "When is the enrollment period?",
    answer:
      "Enrollment schedules are announced through the official school website, Facebook page, and school advisories. Please monitor official channels for updates.",
  },
  {
    question: "Can transferees enroll?",
    answer:
      "Yes. Transferees may enroll subject to DepEd guidelines, availability of slots, and submission of required documents for verification.",
  },
  {
    question: "What if the PSA Birth Certificate is not yet available?",
    answer:
      "Submit available documents first and coordinate with the enrollment team for guidance on follow-up requirements.",
  },
  {
    question: "Where can I ask enrollment concerns?",
    answer:
      "You may contact the school through its official Facebook page, Messenger, email, or visit the school during office hours.",
  },
];

const contactLinks = [
  {
    label: "Facebook Page",
    detail: "facebook.com/tabunocnatlhs",
    href: "https://facebook.com/tabunocnatlhs",
  },
  {
    label: "Messenger",
    detail: "m.me/tabunocnatlhs",
    href: "https://m.me/tabunocnatlhs",
  },
  {
    label: "Email",
    detail: "303111@deped.gov.ph",
    href: "mailto:303111@deped.gov.ph",
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
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 flex-none text-[#0F4C5C]"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActionLink({
  href,
  children,
  external,
  className = "",
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
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
    <motion.div {...fadeUp} className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071E29] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 leading-7 text-slate-600">{description}</p>
      )}
    </motion.div>
  );
}

export default function EnrollmentPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-950">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 pb-16 pt-32">
          <div className="absolute left-10 top-24 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-200/60 blur-3xl" />

          <div className={`relative mx-auto w-full ${pagePadding}`}>
            <div className="mx-auto max-w-5xl text-center">
              <BrandHeader />

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]"
              >
                Enrollment Guide
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#071E29] sm:text-5xl lg:text-6xl"
              >
                Enrollment Made Simple
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-700"
              >
                Basic enrollment information for incoming learners,
                transferees, returning learners, ALS passers, parents, and
                guardians of Tabunoc National High School.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
              >
                <ActionLink
                  href="#requirements"
                  className="bg-[#0F4C5C] text-white hover:bg-[#146577]"
                >
                  View Requirements
                  <ArrowIcon />
                </ActionLink>

                <ActionLink
                  href="#steps"
                  className="bg-[#ffdf20] text-[#071E29] hover:bg-yellow-300"
                >
                  Enrollment Steps
                  <ArrowIcon />
                </ActionLink>

                <ActionLink
                  href="#help"
                  className="border border-[#0F4C5C]/20 bg-white text-[#0F4C5C] hover:bg-slate-50"
                >
                  Contact the School
                </ActionLink>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ADVISORY */}
        <section className="bg-white py-10">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm md:p-8"
            >
              <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F4C5C]/10 text-[#0F4C5C]">
                  <CheckIcon />
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0F4C5C]">
                    Important Reminder
                  </p>
                  <p className="mt-2 leading-7 text-slate-700">
                    Enrollment schedules and procedures may change depending on
                    official DepEd, Division, or school advisories. Please
                    monitor the official school website and Facebook page for
                    updates.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* WHO MAY ENROLL */}
        <section className="bg-[#F8FAFC] py-16">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <SectionHeading
              eyebrow="Who May Enroll"
              title="Choose your learner category"
              description="Find the category that best describes the learner before preparing documents."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {learnerTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-xl font-black text-[#071E29]">
                    {type.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {type.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* REQUIREMENTS */}
        <section id="requirements" className="bg-white py-20">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <SectionHeading
              eyebrow="Requirements"
              title="Prepare only what applies to you"
              description="Use the list below as guide. Original documents may be requested for verification."
            />

            <div className="mx-auto grid max-w-5xl gap-4">
              {requirements.map((group) => (
                <motion.details
                  key={group.group}
                  {...fadeUp}
                  className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 shadow-sm open:bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="text-lg font-black text-[#071E29]">
                      {group.group}
                    </span>
                    <span className="rounded-full bg-[#0F4C5C]/10 p-2 text-[#0F4C5C] transition group-open:rotate-90">
                      <ArrowIcon />
                    </span>
                  </summary>

                  <ul className="mt-5 grid gap-3">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-6 text-slate-700"
                      >
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section id="steps" className="bg-[#F8FAFC] py-20">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <SectionHeading
              eyebrow="Enrollment Process"
              title="Five simple steps"
              description="Follow the announced enrollment flow and coordinate only with authorized school personnel."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {enrollmentSteps.map((step, index) => (
                <motion.div
                  key={step}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F4C5C] text-sm font-black text-white">
                    {index + 1}
                  </div>
                  <p className="mt-4 text-sm font-bold leading-6 text-slate-700">
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SHS NOTE + REMINDERS */}
        <section className="bg-white py-20">
          <div
            className={`mx-auto grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr] ${pagePadding}`}
          >
            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-slate-200 bg-[#ECFDF5] p-6 shadow-sm md:p-8"
            >
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0F4C5C]">
                Incoming Grade 11
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071E29]">
                Review SHS offerings before enrollment.
              </h2>
              <p className="mt-4 leading-7 text-slate-700">
                Track, strand, or specialization placement may depend on
                available programs, learner interest, and school capacity.
              </p>

              <div className="mt-6">
                <ActionLink
                  href="/shs-offerings"
                  className="bg-[#0F4C5C] text-white hover:bg-[#146577]"
                >
                  View SHS Offerings
                  <ArrowIcon />
                </ActionLink>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm md:p-8"
            >
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0F4C5C]">
                Parent and Learner Reminders
              </p>

              <div className="mt-5 grid gap-3">
                {reminders.map((reminder) => (
                  <div key={reminder} className="flex gap-3">
                    <CheckIcon />
                    <p className="text-sm leading-6 text-slate-700">
                      {reminder}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[#F8FAFC] py-20">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <SectionHeading
              eyebrow="Enrollment FAQs"
              title="Common questions"
              description="Quick answers to common enrollment concerns."
            />

            <div className="mx-auto grid max-w-5xl gap-4">
              {enrollmentFaqs.map((faq) => (
                <motion.details
                  key={faq.question}
                  {...fadeUp}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <span className="font-black text-[#071E29]">
                      {faq.question}
                    </span>
                    <span className="rounded-full bg-[#0F4C5C]/10 p-2 text-[#0F4C5C] transition group-open:rotate-90">
                      <ArrowIcon />
                    </span>
                  </summary>
                  <p className="mt-4 leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </motion.details>
              ))}
            </div>

            <div className="mt-8 text-center">
              <ActionLink
                href="/faq"
                className="border border-[#0F4C5C]/20 bg-white text-[#0F4C5C] hover:bg-slate-50"
              >
                View Full FAQ
                <ArrowIcon />
              </ActionLink>
            </div>
          </div>
        </section>

        {/* HELP */}
        <section id="help" className="bg-[#0F4C5C] py-20 text-white">
          <div
            className={`mx-auto grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] ${pagePadding}`}
          >
            <motion.div {...fadeUp}>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
                Need Help?
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
                Contact the school through official channels.
              </h2>
              <p className="mt-5 leading-7 text-teal-50">
                For enrollment-related concerns, parents and learners may
                contact Tabunoc National High School through official channels
                or visit the school during office hours.
              </p>
              <p className="mt-4 text-sm leading-6 text-teal-50">
                Office Hours: Monday to Friday, 8:00 AM – 5:00 PM, except
                holidays and declared class/work suspensions.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
            >
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="rounded-2xl border border-white/10 bg-white p-5 text-slate-950 shadow-sm transition hover:-translate-y-1 hover:bg-yellow-50"
                >
                  <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                    {link.label}
                  </p>
                  <p className="mt-2 break-words text-sm font-bold leading-6 text-slate-700">
                    {link.detail}
                  </p>
                </a>
              ))}
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}