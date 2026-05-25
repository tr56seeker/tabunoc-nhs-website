"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/components/Footer";
import GradientFeatureCard from "@/components/GradientFeatureCard";
import PersonnelModal from "@/components/PersonnelModal";

import type { Personnel } from "@/data/organization";
import { allPersonnel } from "@/data/organization";

const mapsHref =
  "https://www.google.com/maps/search/?api=1&query=Tabunoc%20National%20High%20School%20Sangi%20Road%20Tabunok%20Talisay%20City%20Cebu";

const quickLinks = [
  { label: "Enrollment", href: "/enrollment" },
  { label: "SHS Offerings", href: "/shs-offerings" },
  { label: "School Memos", href: "/memos" },
  { label: "Citizen's Charter", href: "/citizen-charter" },
];

const stats = [
  { label: "School ID", value: "303111" },
  { label: "JHS Learners", value: "1000+" },
  { label: "SHS Learners", value: "180+" },
  { label: "Teaching Personnel", value: "59" },
];

const services = [
  {
    title: "Enrollment Guide",
    description: "Requirements, reminders, and enrollment assistance for learners and parents.",
    href: "/enrollment",
    accent: "teal" as const,
  },
  {
    title: "SHS Offerings",
    description: "Senior High School tracks and program information for incoming Grade 11 learners.",
    href: "/shs-offerings",
    accent: "mint" as const,
  },
  {
    title: "Citizen's Charter",
    description: "Frontline service standards, processing time, and public assistance information.",
    href: "/citizen-charter",
    accent: "mint" as const,
  },
  {
    title: "School Memos",
    description: "Public memoranda, advisories, and official school issuances.",
    href: "/memos",
    accent: "mint" as const,
  },
  {
    title: "School Directory",
    description: "School organization, personnel profiles, offices, and key assignments.",
    href: "/organization",
    accent: "mint" as const,
  },
  {
    title: "Alumni Community",
    description: "Alumni information, community updates, and school support opportunities.",
    href: "/alumni",
    accent: "mint" as const,
  },
  {
    title: "School DRRM",
    description: "Preparedness, safety reminders, and school risk reduction information.",
    href: "/#drrm",
    accent: "teal" as const,
  },
  {
    title: "School MIS",
    description: "Authorized access to the school management information system.",
    href: "https://smis.tabunocnatlhs.com",
    external: true,
    accent: "mint" as const,
  },
];

const featuredUpdates = [
  {
    title: "Enrollment and School Forms",
    description: "Review learner requirements, enrollment reminders, and available school forms.",
    href: "/enrollment",
  },
  {
    title: "Memos and Issuances",
    description: "Access public school memoranda, advisories, and official issuances.",
    href: "/memos",
  },
  {
    title: "Citizen's Charter and Public Assistance",
    description: "Check service standards, processing time, and assistance channels.",
    href: "/citizen-charter",
  },
];

const benefits = [
  {
    title: "Quality Public Secondary Education",
    description: "Instruction and programs aligned with DepEd standards for JHS and SHS learners.",
  },
  {
    title: "Learner Support and Guidance",
    description: "Support for academic concerns, records, guidance needs, and parent coordination.",
  },
  {
    title: "School Safety and DRRM",
    description: "Preparedness, risk awareness, emergency coordination, and learning continuity.",
  },
  {
    title: "Stakeholder Partnership",
    description: "Coordination with parents, alumni, community partners, and public offices.",
  },
  {
    title: "Future-ready SHS Pathways",
    description: "SHS programs help learners prepare for further study, work, and skills development.",
  },
  {
    title: "Accessible Public Assistance",
    description: "Clear service information helps families reach the right school office faster.",
  },
];

const drrmItems = [
  {
    title: "Preparedness",
    text: "Risk awareness reminders, preparedness activities, and school drills support readiness.",
  },
  {
    title: "Response",
    text: "Emergency coordination, incident reporting, and communication protocols guide response.",
  },
  {
    title: "Recovery",
    text: "Documentation, learner support, and continuity planning help restore normal operations.",
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
    title: "School MIS",
    detail: "smis.tabunocnatlhs.com",
    href: "https://smis.tabunocnatlhs.com",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55 },
};

const homeSectionPadding = "px-6 md:px-10 xl:px-[120px] 2xl:px-[190px]";

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);

  const schoolHead = allPersonnel.find(
    (person) => person.id === "guillermo-villavelez"
  );

  return (
    <>
      <Navbar brandMode="afterScroll" />

      <main className="min-h-screen bg-white dark:bg-[#0a0908] text-slate-950 dark:text-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-white pt-12 pb-16 dark:from-[#0a0908] dark:via-[#0a0908] dark:to-[#171614] sm:pt-14 lg:pt-16 lg:pb-20">
          <div className={`mx-auto grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start ${homeSectionPadding}`}>
            <div>
              <BrandHeader />

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
              >
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C] dark:text-stone-100">
                  DepEd Public Secondary School
                </p>
                <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#071E29] dark:text-white sm:text-5xl lg:text-6xl">
                  Tabunoc National High School
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-700 dark:text-stone-200">
                  A learner-centered public secondary school committed to
                  quality, inclusive, resilient, and future-ready basic
                  education.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:justify-start">
                  <Link
                    href="/enrollment"
                    className="rounded-xl bg-[#0F4C5C] px-6 py-3 text-center text-sm font-black text-white shadow-sm transition hover:-translate-y-1 hover:scale-[1.01] dark:shadow-black/20"
                  >
                    Enrollment Guide
                  </Link>
                  <Link
                    href="/shs-offerings"
                    className="rounded-xl border border-[#0F4C5C]/25 bg-white px-6 py-3 text-center text-sm font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:text-[#0F4C5C] dark:border-[#292624] dark:bg-[#171614] dark:text-stone-100 dark:hover:text-white"
                  >
                    View SHS Offerings
                  </Link>
                </div>
              </motion.div>
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="rounded-3xl border border-slate-200 dark:border-[#292624] bg-white dark:bg-[#171614] p-6 shadow-xl dark:shadow-black/20 shadow-teal-900/10"
              aria-label="Quick access panel"
            >
              <div className="rounded-2xl bg-[#0F4C5C] p-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-100">
                  Quick Access
                </p>
                <h2 className="mt-2 text-2xl font-black">School Information</h2>
                <p className="mt-2 text-sm leading-6 text-teal-50">
                  Essential details for learners, parents, guardians, personnel,
                  and stakeholders.
                </p>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-slate-50 dark:bg-[#171614] p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-stone-400">
                    School ID
                  </p>
                  <p className="mt-1 text-2xl font-black text-[#0F4C5C] dark:text-white">
                    303111
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-[#171614] p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-stone-400">
                    School Head
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (schoolHead) setSelectedPerson(schoolHead);
                    }}
                    className="mt-1 text-left text-lg font-black text-[#071E29] transition hover:text-[#0F4C5C] dark:text-white dark:hover:text-stone-200"
                  >
                    Guillermo B. Villavelez
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 dark:bg-[#171614] p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-stone-400">
                      Office Hours
                    </p>
                    <p className="mt-1 font-bold text-slate-800 dark:text-stone-100">
                      Monday to Friday, 8:00 AM - 5:00 PM
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-[#171614] p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-stone-400">
                      Location
                    </p>
                    <a
                      href={mapsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block font-bold leading-6 text-slate-800 dark:text-stone-100 transition hover:text-[#0F4C5C]"
                    >
                      Sangi Road, Tabunok, Talisay City, Cebu
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:border-[#0F4C5C]/40 hover:scale-[1.01] hover:text-[#0F4C5C] dark:border-[#292624] dark:text-stone-100 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="bg-white py-10 dark:bg-[#0a0908]">
          <div className={`mx-auto grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 ${homeSectionPadding}`}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeUp}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="rounded-2xl border border-slate-200 dark:border-[#292624] bg-white dark:bg-[#171614] p-5 shadow-sm dark:shadow-black/20"
              >
                <p className="text-3xl font-black text-[#0F4C5C] dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-bold leading-5 text-slate-600 dark:text-stone-300">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="services" className="bg-slate-50 py-20 dark:bg-[#0a0908]">
          <div className={`mx-auto w-full ${homeSectionPadding}`}>
            <motion.div {...fadeUp} className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0F4C5C] dark:text-stone-100">
                Access School Services
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#071E29] dark:text-white md:text-5xl">
                Helpful school services in one organized place.
              </h2>
              <p className="mt-4 leading-7 text-slate-600 dark:text-stone-300">
                Browse official pages for enrollment, SHS pathways, public
                assistance, school issuances, DRRM information, and online
                systems.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <GradientFeatureCard
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  href={service.href}
                  external={service.external}
                  accent={service.accent}
                  eyebrow="Service"
                />
              ))}
            </div>
          </div>
        </section>

        <section id="announcements" className="bg-white py-20 dark:bg-[#0a0908]">
          <div className={`mx-auto w-full ${homeSectionPadding}`}>
            <motion.div {...fadeUp} className="max-w-3xl">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0F4C5C] dark:text-stone-100">
                  Priority Information
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#071E29] dark:text-white md:text-5xl">
                  Frequently accessed school information.
                </h2>
                <p className="mt-4 leading-7 text-slate-600 dark:text-stone-300">
                  Quick access to common public information requested by
                  learners, parents, and stakeholders.
                </p>
              </div>
            </motion.div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {featuredUpdates.map((item, index) => (
                <motion.div
                  key={item.title}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="block h-full rounded-2xl border border-slate-200 dark:border-[#292624] bg-white dark:bg-[#171614] p-6 shadow-sm dark:shadow-black/20 transition hover:-translate-y-1 hover:scale-[1.01]"
                  >
                    <h3 className="text-xl font-black text-[#071E29] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-stone-300">
                      {item.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0F4C5C] py-20 text-white">
          <div className={`mx-auto grid w-full gap-10 lg:grid-cols-[0.8fr_1.2fr] ${homeSectionPadding}`}>
            <motion.div {...fadeUp}>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-stone-100">
                Why Tabunoc NHS
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                Public education with clear services and community care.
              </h2>
              <p className="mt-5 leading-7 text-teal-50">
                The school supports learners and families through organized
                instruction, safety programs, public assistance, and stakeholder
                coordination.
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="rounded-2xl border border-[#292624] bg-[#171614] p-5"
                >
                  <h3 className="font-black text-white">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="drrm" className="bg-white py-20 dark:bg-[#0a0908]">
          <div className={`mx-auto w-full ${homeSectionPadding}`}>
            <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0F4C5C] dark:text-stone-100">
                School DRRM
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#071E29] dark:text-white md:text-5xl">
                Prepared, responsive, and resilient.
              </h2>
              <p className="mt-5 leading-7 text-slate-600 dark:text-stone-300">
                The School Disaster Risk Reduction and Management Program
                supports preparedness, emergency response, risk awareness, and
                continuity of learning.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {drrmItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="rounded-2xl border border-slate-200 dark:border-[#292624] bg-[#ECFDF5] dark:bg-[#171614] p-6 shadow-sm dark:shadow-black/20"
                >
                  <h3 className="text-2xl font-black text-[#0F4C5C] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600 dark:text-stone-300">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-slate-50 py-20 dark:bg-[#0a0908]">
          <div className={`mx-auto grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] ${homeSectionPadding}`}>
            <motion.div {...fadeUp}>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0F4C5C] dark:text-stone-100">
                Contact
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#071E29] dark:text-white md:text-5xl">
                Reach the school through official channels.
              </h2>
              <p className="mt-5 leading-7 text-slate-600 dark:text-stone-300">
                For learner records, school services, partnerships, and official
                coordination, use the verified school channels.
              </p>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-xl bg-[#0F4C5C] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:scale-[1.01]"
              >
                Get directions
              </a>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-slate-200 dark:border-[#292624] bg-white dark:bg-[#171614] p-6 shadow-sm dark:shadow-black/20"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {contactChannels.map((channel) => (
                  <a
                    key={channel.title}
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      channel.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:scale-[1.01] hover:border-[#0F4C5C]/40 dark:border-[#292624] dark:bg-[#171614] dark:hover:text-white"
                  >
                    <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-stone-100">
                      {channel.title}
                    </p>
                    <p className="mt-2 break-words font-bold text-slate-800 dark:text-stone-100">
                      {channel.detail}
                    </p>
                  </a>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-[#ECFDF5] dark:bg-[#171614] p-5">
                <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-stone-100">
                  School Address
                </p>
                <p className="mt-2 font-bold text-slate-800 dark:text-stone-100">
                  Sangi Road, Tabunok, Talisay City, Cebu
                </p>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-stone-300">
                  Office Hours: Monday to Friday, 8:00 AM - 5:00 PM
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>

      <PersonnelModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
    </>
  );
}
