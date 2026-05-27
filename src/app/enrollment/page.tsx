"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
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
  { label: "Grade Levels", value: "Grades 7–12" },
];

const enrollmentSteps = [
  {
    title: "Prepare the documents",
    description:
      "Secure the learner’s report card, birth certificate if available, Learner Reference Number, and parent/guardian contact information.",
  },
  {
    title: "Visit the enrollment area",
    description:
      "Proceed to the designated enrollment area during the official schedule or follow the school-announced enrollment procedure.",
  },
  {
    title: "Fill out the enrollment form",
    description:
      "Accomplish the Basic Education Enrollment Form completely and accurately using the learner’s correct information.",
  },
  {
    title: "Submit for checking",
    description:
      "Submit the enrollment form and available documents to the assigned enrollment personnel for review and validation.",
  },
  {
    title: "Wait for confirmation",
    description:
      "The school will validate the learner’s records and provide confirmation, additional instructions, or follow-up requirements when needed.",
  },
];

const requirements = [
  {
    group: "Incoming Grade 7",
    subtitle: "For Grade 6 completers entering Junior High School.",
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
    subtitle: "For Grade 10 completers entering Senior High School.",
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
    subtitle: "For learners coming from another school.",
    items: [
      "School Form 9 / Report Card",
      "Learner Reference Number (LRN)",
      "Photocopy of PSA Birth Certificate, if available",
      "Accomplished Basic Education Enrollment Form",
      "Previous school contact details, if needed for record validation",
    ],
  },
  {
    group: "Returning Learners / Balik-Aral",
    subtitle: "For learners who stopped schooling and wish to return.",
    items: [
      "Last available School Form 9 / Report Card or equivalent record",
      "PSA Birth Certificate or acceptable proof of identity, if available",
      "Accomplished Basic Education Enrollment Form",
      "Parent/Guardian contact information",
      "Additional validation by the enrollment team, if needed",
    ],
  },
  {
    group: "ALS Learners / ALS Completers",
    subtitle:
      "For Alternative Learning System learners or completers seeking placement in formal basic education.",
    items: [
      "ALS Certificate of Completion, Certificate of Rating, or equivalent ALS record, if available",
      "Learner Reference Number (LRN), if available",
      "Photocopy of PSA Birth Certificate or acceptable proof of identity, if available",
      "Accomplished Basic Education Enrollment Form",
      "Parent/Guardian contact information, if the learner is a minor",
      "Placement, grade-level eligibility, or additional validation by the school enrollment team, if needed",
    ],
  },
];

const parentReminders = [
  "Bring complete and accurate documents.",
  "Use the learner’s correct full name based on official records.",
  "Provide active and reachable contact numbers.",
  "Observe school safety and visitor protocols.",
  "Do not submit false, altered, or misleading documents.",
  "Follow official school announcements only.",
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
      <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071E29] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-slate-700">
        {description}
      </p>
    </motion.div>
  );
}

export default function EnrollmentPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-950">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-white pb-16 pt-32 sm:pt-36 lg:pb-20 lg:pt-40">
          <div
            className={`mx-auto grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] ${enrollmentPagePadding}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
            >
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                Enrollment Guide
              </p>

              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#071E29] sm:text-5xl lg:text-6xl">
                School Year 2026–2027 Enrollment
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-700">
                A clear and parent-friendly guide for learners enrolling at
                Tabunoc National High School for Junior High School and Senior
                High School.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:justify-start">
                <a
                  href="#enrollment-steps"
                  className="rounded-xl bg-[#0F4C5C] px-6 py-3 text-center text-sm font-black text-white shadow-sm transition hover:-translate-y-1 hover:scale-[1.01]"
                >
                  View Steps
                </a>

                <a
                  href="#requirements"
                  className="rounded-xl border border-[#0F4C5C]/25 bg-white px-6 py-3 text-center text-sm font-black text-[#0F4C5C] transition hover:-translate-y-1"
                >
                  Check Requirements
                </a>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-teal-900/10"
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
                  Main details families need before visiting the school.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {quickInfo.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-1 text-lg font-black text-[#0F4C5C]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#0F4C5C]/15 bg-[#ECFDF5] p-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                  School Location
                </p>
                <p className="mt-2 font-bold leading-6 text-[#071E29]">
                  Sangi Rd., Tabunok, Talisay City, Cebu
                </p>
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="bg-slate-50 py-12">
          <div className={`mx-auto w-full ${enrollmentPagePadding}`}>
            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-[#0F4C5C]/15 bg-white p-6 shadow-sm md:p-8"
            >
              <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5]">
                  <NoticeIcon />
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                    Important Notice
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-[#071E29]">
                    Enrollment is open, accessible, and subject to proper
                    validation.
                  </h2>
                  <p className="mt-4 leading-8 text-slate-700">
                    Public school enrollment shall not require unauthorized
                    fees. Enrollment will be processed based on DepEd policies,
                    school capacity, available documents, and validation by
                    assigned school personnel.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="enrollment-steps" className="bg-white py-16">
          <div className={`mx-auto w-full ${enrollmentPagePadding}`}>
            <SectionIntro
              eyebrow="Step-by-Step Process"
              title="How to enroll"
              description="Follow these five steps to help the school process learner records properly and avoid delays."
            />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {enrollmentSteps.map((step, index) => (
                <motion.article
                  key={step.title}
                  {...fadeUp}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F4C5C] text-lg font-black text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-black text-[#071E29]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {step.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="requirements" className="bg-slate-50 py-16">
          <div className={`mx-auto w-full ${enrollmentPagePadding}`}>
            <SectionIntro
              eyebrow="Enrollment Requirements"
              title="Prepare the documents based on learner type"
              description="Bring all available documents. If some documents are not yet available, coordinate with the enrollment team for proper guidance."
            />

            <div className="grid gap-6 lg:grid-cols-2">
              {requirements.map((group) => (
                <motion.article
                  key={group.group}
                  {...fadeUp}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    {group.subtitle}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-[#0F4C5C]">
                    {group.group}
                  </h3>

                  <ul className="mt-5 space-y-4">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-7 text-slate-700"
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
              className="mt-8 rounded-3xl border border-[#FACC15]/50 bg-[#FFFBEB] p-6 shadow-sm"
            >
              <h3 className="text-xl font-black text-[#92400E]">
                Note for parents and guardians
              </h3>
              <p className="mt-3 leading-8 text-[#78350F]">
                If some documents are not yet available, parents, guardians, ALS learners, or returning learners should still coordinate with the enrollment personnel for proper guidance, validation, and possible temporary enrollment subject to DepEd policy, learner eligibility, and school records verification.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div
            className={`mx-auto grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] ${enrollmentPagePadding}`}
          >
            <motion.div
              {...fadeUp}
              className="rounded-3xl bg-[#0F4C5C] p-7 text-white shadow-xl shadow-teal-900/10"
            >
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#ffdf20]">
                For Incoming Grade 11
              </p>
              <h2 className="mt-3 text-3xl font-black">
                Review the SHS offerings before enrollment.
              </h2>
              <p className="mt-5 leading-8 text-teal-50">
                Incoming Grade 11 learners should review the available Senior
                High School offerings before selecting their learning pathway.
                This helps align the learner’s choice with interests, skills,
                and career plans.
              </p>

              <Link
                href="/shs-offerings"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ffdf20] px-6 py-3 text-sm font-black text-[#071E29] transition hover:-translate-y-1 hover:bg-white"
              >
                View SHS Offerings
                <ArrowIcon />
              </Link>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm"
            >
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                Parent and Guardian Reminders
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#071E29]">
                Keep enrollment smooth and orderly.
              </h2>

              <ul className="mt-5 space-y-4">
                {parentReminders.map((reminder) => (
                  <li
                    key={reminder}
                    className="flex gap-3 text-sm font-bold leading-7 text-slate-700"
                  >
                    <CheckIcon />
                    <span>{reminder}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div
            className={`mx-auto grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] ${enrollmentPagePadding}`}
          >
            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                Data Privacy Notice
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#071E29]">
                Learner information is handled with care.
              </h2>
              <p className="mt-5 leading-8 text-slate-700">
                Information collected during enrollment shall be used only for
                school enrollment, learner profiling, LIS encoding,
                communication, and other legitimate education-related purposes
                in accordance with the Data Privacy Act of 2012 and DepEd
                policies.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                Need Help?
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#071E29]">
                Contact the school through official channels.
              </h2>
              <p className="mt-5 leading-8 text-slate-700">
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
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#0F4C5C]/40 hover:shadow-md"
                  >
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      {channel.title}
                    </p>
                    <p className="mt-2 break-words font-black text-[#0F4C5C]">
                      {channel.detail}
                    </p>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}