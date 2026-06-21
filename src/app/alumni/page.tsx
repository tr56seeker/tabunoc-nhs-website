"use client";

/**
 * FILE_ID: TABUNOC_ALUMNI_PAGE
 * PATH: src/app/alumni/page.tsx
 * PURPOSE: Clean alumni and community engagement page for Tabunoc National High School.
 */

import Link from "next/link";
import { motion } from "motion/react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

const pagePadding = "px-6 md:px-10 xl:px-[120px] 2xl:px-[190px]";

const facebookGroupUrl =
  "https://web.facebook.com/groups/TabunokNatlHSAlumniAndStudentsCommunity";

const alumniPageUrl = "https://web.facebook.com/tabunocnatlhsAlumni/";
const schoolFacebookUrl = "https://web.facebook.com/tabunocnatlhs";

const engagementCards = [
  {
    title: "Reconnect",
    description:
      "Reconnect with fellow graduates, former classmates, teachers, and the wider Tabunoc NHS community.",
  },
  {
    title: "Celebrate",
    description:
      "Share milestones, achievements, memories, and stories that promote school pride and positive community identity.",
  },
  {
    title: "Support",
    description:
      "Coordinate alumni support for school programs, learner assistance, Brigada Eskwela, mentoring, and stakeholder initiatives.",
  },
];

const officialLinks = [
  {
    label: "Join the Community",
    title: "Students and Alumni Facebook Group",
    description:
      "A community space for graduates, former learners, and current learners of Tabunoc NHS.",
    href: facebookGroupUrl,
    primary: true,
  },
  {
    label: "Follow Alumni Updates",
    title: "Alumni Facebook Page",
    description:
      "A page for alumni highlights, recognition posts, and community-related updates.",
    href: alumniPageUrl,
    primary: false,
  },
  {
    label: "Follow Official School News",
    title: "Tabunoc NHS Facebook Page",
    description:
      "The official school page for announcements, advisories, activities, and public information.",
    href: schoolFacebookUrl,
    primary: false,
  },
];

const supportPathways = [
  {
    title: "Career Talks and Mentoring",
    description:
      "Alumni may share career experiences, workplace insights, or learning pathway guidance for learners.",
  },
  {
    title: "Brigada Eskwela and School Support",
    description:
      "Alumni may coordinate volunteer support, donations, or services through official school channels.",
  },
  {
    title: "Learner Assistance",
    description:
      "Support may include school-approved initiatives for learner welfare, recognition, or learning resources.",
  },
  {
    title: "Community Partnership",
    description:
      "Alumni groups may coordinate partnerships that align with school priorities and DepEd guidelines.",
  },
];

const reminders = [
  "Alumni participation is voluntary and should remain respectful, inclusive, and non-political.",
  "Photos, stories, achievements, and personal information should only be shared with proper consent.",
  "Donations, partnerships, and school support must be coordinated through official school channels.",
  "Avoid posting sensitive learner, personnel, or private school records in public comment sections.",
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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto mb-10 max-w-3xl text-center"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0F4C5C]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#071E29] sm:text-4xl md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
          {description}
        </p>
      )}
    </motion.div>
  );
}

export default function AlumniPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-950">
        <PageHeader
          eyebrow="Alumni Community"
          title="Tabunoc NHS Alumni and Community"
          description="A space for graduates, former learners, and partners to reconnect, celebrate milestones, and support meaningful school-community initiatives."
        >
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={facebookGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C5C] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#146577]"
              >
                Join the Community
                <ArrowIcon />
              </a>

              <a
                href="#support"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ffdf20] px-5 py-3 text-sm font-semibold text-[#071E29] transition duration-300 hover:-translate-y-1 hover:bg-yellow-300"
              >
                Ways to Support
                <ArrowIcon />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F4C5C]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0F4C5C] transition duration-300 hover:-translate-y-1 hover:bg-slate-50"
              >
                Contact the School
              </Link>
            </div>
        </PageHeader>

        {/* PURPOSE */}
        <section className="bg-white py-20">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <SectionHeading
              eyebrow="Purpose"
              title="A respectful and organized alumni connection"
              description="The Alumni page helps keep school-community engagement clear, official, and aligned with the values of a public school."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {engagementCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                >
                  <h3 className="text-xl font-semibold text-[#071E29]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* OFFICIAL LINKS */}
        <section className="bg-[#F8FAFC] py-20">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <SectionHeading
              eyebrow="Official Links"
              title="Connect through verified channels"
              description="Use these official links for community engagement, alumni updates, and school announcements."
            />

            <div className="grid gap-5 md:grid-cols-3">
              {officialLinks.map((link, index) => (
                <motion.a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className={`group rounded-2xl border p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    link.primary
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F4C5C]">
                    {link.label}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-[#071E29]">
                    {link.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {link.description}
                  </p>

                  <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0F4C5C]">
                    Open Link
                    <ArrowIcon />
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* SUPPORT PATHWAYS */}
        <section id="support" className="bg-white py-20">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <SectionHeading
              eyebrow="Ways to Support"
              title="Alumni support should be coordinated and purposeful"
              description="Support initiatives are best implemented when aligned with school priorities and coordinated through authorized school channels."
            />

            <div className="grid gap-5 md:grid-cols-2">
              {supportPathways.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#0F4C5C] text-sm font-semibold text-white">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-[#071E29]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* REMINDERS */}
        <section className="bg-[#0F4C5C] py-20 text-white">
          <div
            className={`mx-auto grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] ${pagePadding}`}
          >
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-300">
                Community Reminders
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                Protect privacy. Coordinate properly. Keep engagement positive.
              </h2>
              <p className="mt-5 leading-7 text-teal-50">
                Alumni participation is welcome, but school-related support,
                posts, and partnerships must follow proper coordination, data
                privacy, and child-protection standards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-sm md:p-8"
            >
              <div className="grid gap-4">
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

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 py-20">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
              className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-10"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0F4C5C]">
                Alumni and Stakeholder Support
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#071E29] md:text-5xl">
                Be part of a positive school-community legacy.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
                Whether you are a graduate, former learner, partner, or
                supporter, your involvement can help strengthen learner support
                and school-community engagement.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={facebookGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C5C] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#146577]"
                >
                  Join the Facebook Group
                  <ArrowIcon />
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F4C5C]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0F4C5C] transition duration-300 hover:-translate-y-1 hover:bg-slate-50"
                >
                  Coordinate with the School
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
