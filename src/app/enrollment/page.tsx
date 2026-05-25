"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/components/Footer";

const enrollmentPagePadding = "px-6 md:px-10 xl:px-[120px] 2xl:px-[190px]";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55 },
};

const quickInfo = [
  { label: "School Year", value: "2026–2027" },
  { label: "Enrollment Period", value: "June 1–5, 2026" },
  { label: "Opening of Classes", value: "June 8, 2026" },
  { label: "School ID", value: "303111" },
];

const learnerTypes = [
  {
    title: "Incoming Grade 7",
    description:
      "For learners who completed Grade 6 and will enter Junior High School.",
  },
  {
    title: "Incoming Grade 11",
    description:
      "For Grade 10 completers who will proceed to Senior High School under the Strengthened SHS Curriculum.",
  },
  {
    title: "Transferees",
    description:
      "For learners from another school who wish to continue their studies at Tabunoc National High School.",
  },
  {
    title: "Returning Learners / Balik-Aral",
    description:
      "For learners who stopped schooling and wish to return to formal basic education.",
  },
  {
    title: "Continuing Learners",
    description:
      "For currently enrolled Tabunoc NHS learners moving to the next grade level.",
  },
];

const enrollmentSteps = [
  {
    title: "Prepare the required documents",
    description:
      "Secure the learner’s report card, birth certificate if available, LRN, and other documents applicable to the learner’s enrollment status.",
  },
  {
    title: "Proceed to the designated enrollment area",
    description:
      "Visit the school during the official enrollment schedule or follow the enrollment procedure announced by the school.",
  },
  {
    title: "Accomplish the enrollment form",
    description:
      "Fill out the Basic Education Enrollment Form completely and accurately using the learner’s correct personal information.",
  },
  {
    title: "Submit the documents",
    description:
      "Submit the enrollment form and available documents to the assigned enrollment personnel for checking.",
  },
  {
    title: "Wait for validation",
    description:
      "The school will verify the learner’s LRN, previous school records, grade level, and submitted documents.",
  },
  {
    title: "Confirm SHS pathway, if applicable",
    description:
      "Incoming Grade 11 learners should review the available Senior High School offerings before selecting their learning pathway.",
  },
  {
    title: "Receive enrollment confirmation",
    description:
      "The enrollment team will provide confirmation, additional instructions, or follow-up requirements when necessary.",
  },
  {
    title: "Attend orientation when scheduled",
    description:
      "Parents, guardians, and learners should attend the school orientation once officially announced.",
  },
];

const requirements = [
  {
    group: "Incoming Grade 7",
    items: [
      "School Form 9 / Report Card",
      "Photocopy of PSA Birth Certificate, if available",
      "Learner Reference Number (LRN), if available",
      "Accomplished Basic Education Enrollment Form",
      "Parent/Guardian contact information",
    ],
  },
  {
    group: "Incoming Grade 11",
    items: [
      "School Form 9 / Grade 10 Report Card",
      "Certificate of Completion or proof of Grade 10 completion, if available",
      "Photocopy of PSA Birth Certificate, if available",
      "Learner Reference Number (LRN)",
      "Accomplished Basic Education Enrollment Form",
      "Parent/Guardian contact information",
    ],
  },
  {
    group: "Transferees",
    items: [
      "School Form 9 / Report Card",
      "Learner Reference Number (LRN)",
      "Photocopy of PSA Birth Certificate, if available",
      "Accomplished Basic Education Enrollment Form",
      "Contact details of previous school, if needed for record validation",
    ],
  },
  {
    group: "Returning Learners / Balik-Aral",
    items: [
      "Last available School Form 9 / Report Card or equivalent record",
      "PSA Birth Certificate or acceptable proof of identity, if available",
      "Accomplished Basic Education Enrollment Form",
      "Parent/Guardian contact information",
      "Additional validation by the enrollment team, if needed",
    ],
  },
];

const reminders = [
  "Bring complete and accurate documents.",
  "Use the learner’s correct full name based on official records.",
  "Provide active and reachable contact numbers.",
  "Observe school safety and visitor protocols.",
  "Do not submit false, altered, or misleading documents.",
  "Follow official announcements from the school website and Facebook page.",
];

const contactChannels = [
  {
    title: "School Email",
    detail: "303111@deped.gov.ph",
    href: "mailto:303111@deped.gov.ph",
  },
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
    title: "School MIS",
    detail: "smis.tabunocnatlhs.com",
    href: "https://smis.tabunocnatlhs.com",
  },
];

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 flex-none text-[#0F4C5C]"
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

function NoticeIcon() {
  return (
    <svg
      className="h-6 w-6 text-[#0F4C5C]"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3 20 7v5c0 5-3.4 8.5-8 9-4.6-.5-8-4-8-9V7l8-4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 8v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 16h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div {...fadeUp} className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C] dark:text-stone-200">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071E29] dark:text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-slate-700 dark:text-stone-300">
        {description}
      </p>
    </motion.div>
  );
}

export default function EnrollmentPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-950 dark:bg-[#0a0908] dark:text-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-white pb-16 pt-12 dark:from-[#0a0908] dark:via-[#0a0908] dark:to-[#171614] sm:pt-14 lg:pb-20 lg:pt-16">
          <div
            className={`mx-auto grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start ${enrollmentPagePadding}`}
          >
            <div>
              <BrandHeader />

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
              >
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C] dark:text-stone-100">
                  Enrollment Guide
                </p>

                <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#071E29] dark:text-white sm:text-5xl lg:text-6xl">
                  School Year 2026–2027 Enrollment
                </h1>

                <p className="mt-6 text-lg leading-8 text-slate-700 dark:text-stone-200">
                  A step-by-step guide for learners, parents, and guardians
                  enrolling at Tabunoc National High School for Junior High
                  School and Senior High School.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:justify-start">
                  <a
                    href="#enrollment-steps"
                    className="rounded-xl bg-[#0F4C5C] px-6 py-3 text-center text-sm font-black text-white shadow-sm transition hover:-translate-y-1 hover:scale-[1.01] dark:shadow-black/20"
                  >
                    View Enrollment Steps
                  </a>

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
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-teal-900/10 dark:border-[#292624] dark:bg-[#171614] dark:shadow-black/20"
              aria-label="Enrollment summary"
            >
              <div className="rounded-2xl bg-[#0F4C5C] p-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-100">
                  Quick Information
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Enrollment at a Glance
                </h2>
                <p className="mt-2 text-sm leading-6 text-teal-50">
                  Important details for parents, guardians, and learners before
                  visiting the school.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {quickInfo.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-slate-50 p-4 dark:bg-[#0a0908]"
                  >
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-stone-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-lg font-black text-[#0F4C5C] dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#0F4C5C]/15 bg-[#ECFDF5] p-4 dark:border-[#292624] dark:bg-[#0a0908]">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-stone-400">
                  School Location
                </p>
                <p className="mt-2 font-bold leading-6 text-[#071E29] dark:text-stone-100">
                  Sangi Rd., Tabunok, Talisay City, Cebu
                </p>
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="bg-white py-10 dark:bg-[#0a0908]">
          <div
            className={`mx-auto grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 ${enrollmentPagePadding}`}
          >
            {quickInfo.map((item) => (
              <motion.div
                key={item.label}
                {...fadeUp}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm dark:border-[#292624] dark:bg-[#171614]"
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-stone-400">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-black text-[#0F4C5C] dark:text-white">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-14 dark:bg-[#171614]">
          <div className={`mx-auto w-full ${enrollmentPagePadding}`}>
            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-[#0F4C5C]/15 bg-white p-6 shadow-sm dark:border-[#292624] dark:bg-[#0a0908] md:p-8"
            >
              <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5] dark:bg-[#171614]">
                  <NoticeIcon />
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C] dark:text-stone-200">
                    Important Notice
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-[#071E29] dark:text-white">
                    Enrollment is open, accessible, and subject to proper
                    validation.
                  </h2>
                  <p className="mt-4 leading-8 text-slate-700 dark:text-stone-300">
                    Enrollment shall follow DepEd policies, school capacity,
                    proper documentation, and validation by designated enrollment
                    personnel. Public school enrollment shall not require
                    unauthorized fees. Parents and guardians are advised to bring
                    available documents early to avoid delays.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-[#0a0908]">
          <div className={`mx-auto w-full ${enrollmentPagePadding}`}>
            <SectionIntro
              eyebrow="Who May Enroll"
              title="Learners covered by this guide"
              description="This guide applies to learners who will enroll, transfer, return, or continue their basic education at Tabunoc National High School."
            />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {learnerTypes.map((type) => (
                <motion.article
                  key={type.title}
                  {...fadeUp}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#0F4C5C]/30 hover:shadow-md dark:border-[#292624] dark:bg-[#171614]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF5] dark:bg-[#0a0908]">
                    <CheckIcon />
                  </div>
                  <h3 className="text-xl font-black text-[#071E29] dark:text-white">
                    {type.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-stone-300">
                    {type.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="enrollment-steps"
          className="bg-slate-50 py-16 dark:bg-[#171614]"
        >
          <div className={`mx-auto w-full ${enrollmentPagePadding}`}>
            <SectionIntro
              eyebrow="Step-by-Step Process"
              title="How to enroll"
              description="Follow these steps carefully. Correct information helps the school validate, encode, and organize learner records properly."
            />

            <div className="grid gap-5 md:grid-cols-2">
              {enrollmentSteps.map((step, index) => (
                <motion.article
                  key={step.title}
                  {...fadeUp}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#292624] dark:bg-[#0a0908]"
                >
                  <div className="flex gap-5">
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-[#0F4C5C] text-lg font-black text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#071E29] dark:text-white">
                        {step.title}
                      </h3>
                      <p className="mt-3 leading-7 text-slate-700 dark:text-stone-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-[#0a0908]">
          <div className={`mx-auto w-full ${enrollmentPagePadding}`}>
            <SectionIntro
              eyebrow="Enrollment Requirements"
              title="Documents to prepare"
              description="Requirements vary depending on the learner’s enrollment status. Bring available documents for faster checking and validation."
            />

            <div className="grid gap-6 lg:grid-cols-2">
              {requirements.map((group) => (
                <motion.article
                  key={group.group}
                  {...fadeUp}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-[#292624] dark:bg-[#171614]"
                >
                  <h3 className="text-xl font-black text-[#0F4C5C] dark:text-white">
                    {group.group}
                  </h3>

                  <ul className="mt-5 space-y-4">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-7 text-slate-700 dark:text-stone-300"
                      >
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>

            <motion.div
              {...fadeUp}
              className="mt-8 rounded-3xl border border-[#FACC15]/40 bg-[#FFFBEB] p-6 shadow-sm dark:border-[#292624] dark:bg-[#171614]"
            >
              <h3 className="text-xl font-black text-[#92400E] dark:text-[#FACC15]">
                Note for parents and guardians
              </h3>
              <p className="mt-3 leading-8 text-[#78350F] dark:text-stone-300">
                If some documents are not yet available, parents or guardians
                should still coordinate with the enrollment personnel for proper
                guidance, validation, and possible temporary enrollment subject
                to DepEd policy and school records verification.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#0F4C5C] py-16 text-white">
          <div
            className={`mx-auto grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center ${enrollmentPagePadding}`}
          >
            <motion.div {...fadeUp}>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#ffdf20]">
                Senior High School
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Review the SHS offerings before enrollment.
              </h2>
              <p className="mt-5 max-w-3xl leading-8 text-teal-50">
                Incoming Grade 11 learners and parents are encouraged to review
                the available Senior High School offerings before enrollment.
                This will help learners choose the appropriate learning pathway
                aligned with their interests, skills, and career plans.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="flex lg:justify-end">
              <Link
                href="/shs-offerings"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ffdf20] px-6 py-3 text-sm font-black text-[#071E29] shadow-sm transition hover:-translate-y-1 hover:bg-white"
              >
                View SHS Offerings
                <ArrowIcon />
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-[#0a0908]">
          <div className={`mx-auto w-full ${enrollmentPagePadding}`}>
            <SectionIntro
              eyebrow="Parent and Guardian Reminders"
              title="Help us make enrollment smooth and orderly"
              description="Accurate documents and active communication help the school serve learners and families better."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reminders.map((reminder) => (
                <motion.div
                  key={reminder}
                  {...fadeUp}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-[#292624] dark:bg-[#171614]"
                >
                  <div className="flex gap-3">
                    <CheckIcon />
                    <p className="font-bold leading-7 text-slate-800 dark:text-stone-200">
                      {reminder}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 dark:bg-[#171614]">
          <div
            className={`mx-auto grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] ${enrollmentPagePadding}`}
          >
            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-[#0F4C5C]/15 bg-white p-7 shadow-sm dark:border-[#292624] dark:bg-[#0a0908]"
            >
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C] dark:text-stone-200">
                Data Privacy Notice
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#071E29] dark:text-white">
                Learner information is handled with care.
              </h2>
              <p className="mt-5 leading-8 text-slate-700 dark:text-stone-300">
                Information collected during enrollment shall be used only for
                school enrollment, learner profiling, LIS encoding,
                communication, and other legitimate education-related purposes
                in accordance with the Data Privacy Act of 2012 and DepEd
                policies.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-[#292624] dark:bg-[#0a0908]"
            >
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C] dark:text-stone-200">
                Need Help?
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#071E29] dark:text-white">
                Contact the school through official channels.
              </h2>
              <p className="mt-5 leading-8 text-slate-700 dark:text-stone-300">
                For enrollment concerns, parents and guardians may coordinate
                with the school through the official communication channels.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#0F4C5C]/40 hover:shadow-md dark:border-[#292624] dark:bg-[#171614]"
                  >
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-stone-400">
                      {channel.title}
                    </p>
                    <p className="mt-2 break-words font-black text-[#0F4C5C] dark:text-white">
                      {channel.detail}
                    </p>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-[#0a0908]">
          <div className={`mx-auto w-full ${enrollmentPagePadding}`}>
            <motion.div
              {...fadeUp}
              className="overflow-hidden rounded-3xl bg-[#0F4C5C] p-8 shadow-xl shadow-teal-900/10 dark:shadow-black/20 sm:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-[#ffdf20]">
                    Ready to Enroll?
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Prepare your documents early and follow the official
                    enrollment schedule.
                  </h2>
                  <p className="mt-5 max-w-3xl leading-8 text-teal-50">
                    Tabunoc National High School welcomes learners and families
                    for School Year 2026–2027. Please follow official
                    announcements and coordinate with the enrollment team for
                    proper guidance.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href="/shs-offerings"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ffdf20] px-6 py-3 text-sm font-black text-[#071E29] shadow-sm transition hover:-translate-y-1 hover:bg-white"
                  >
                    View SHS Offerings
                    <ArrowIcon />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#0F4C5C]"
                  >
                    Contact the School
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}