"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const schoolLogo =
  "https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true";

const depedLogo =
  "https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png";

const enrollmentSteps = [
  {
    title: "Check Official Enrollment Advisory",
    description:
      "Read the latest school announcement on enrollment schedule, grade-level instructions, required documents, and designated enrollment areas.",
  },
  {
    title: "Prepare Basic Enrollment Documents",
    description:
      "Prepare the learner’s available school records and identification documents. Incomplete documents may be noted for follow-up, subject to school validation.",
  },
  {
    title: "Accomplish the Enrollment Form",
    description:
      "Fill out the Basic Education Enrollment Form completely and accurately. Parents or guardians should ensure that learner information and contact details are correct.",
  },
  {
    title: "Submit for Checking and Validation",
    description:
      "Submit the enrollment form and available documents to the assigned enrollment personnel for checking, validation, and appropriate learner tagging.",
  },
  {
    title: "Encoding and Confirmation",
    description:
      "The school validates and encodes enrollment information in official school records and systems, including the Learner Information System when applicable.",
  },
];

const requirementGroups = [
  {
    group: "New Students, Transferees, and Balik-Aral",
    description:
      "For learners who are new to the school, transferring from another school, or returning to basic education.",
    items: [
      "Original Report Card / SF9",
      "Certificate of Good Moral Character, if available",
      "Photocopy of PSA Birth Certificate",
      "2 pcs. 2x2 ID picture with white background",
      "NCAE Result for SHS, if available",
    ],
  },
  {
    group: "Incoming Grade 7",
    description:
      "For learners entering Junior High School as Grade 7 learners.",
    items: [
      "Original Report Card / SF9 from Grade 6",
      "Photocopy of PSA Birth Certificate",
      "2 pcs. 2x2 ID picture with white background",
    ],
  },
  {
    group: "Old Students / Returning Learners",
    description:
      "For learners previously enrolled in Tabunoc National High School and continuing their studies.",
    items: ["Original Report Card / SF9"],
  },
  {
    group: "Senior High School / Grade 11",
    description:
      "For incoming Grade 11 learners enrolling under the available Senior High School offerings.",
    items: [
      "Original Report Card / SF9 from Grade 10",
      "Certificate of Good Moral Character",
      "Photocopy of PSA Birth Certificate",
      "2 pcs. 2x2 ID picture with white background",
      "NCAE Result for SHS, if available",
    ],
  },
  {
    group: "ALS Learners / Passers",
    description:
      "For learners who completed the Alternative Learning System and are proceeding to formal basic education.",
    items: [
      "AF-5 / Certificate of ALS Program Completion",
      "ALS Assessment Score Sheet",
      "Photocopy of PSA Birth Certificate",
    ],
  },
];

const reminders = [
  "Use only official school announcements and communication channels for enrollment instructions.",
  "Parents or guardians should provide accurate contact information for school communication and learner support.",
  "Wear proper attire when visiting the school.",
  "Wearing sando, shorts, and slippers is strictly prohibited during school transactions.",
  "Bringing weapons, harmful objects, or prohibited items inside the school premises is not allowed.",
  "Observe courtesy, orderliness, and safety protocols while inside the campus.",
  "For sensitive learner records or confidential concerns, coordinate directly with authorized school personnel.",
];

const faqs = [
  {
    question: "Naay bayad sa pag-enroll?",
    answer:
      "Wala. Enrollment in public school is free. Parents and learners only need to comply with the required enrollment information and available supporting documents for proper school records processing.",
  },
  {
    question: "Pwede ba mo-enroll bisan kulang pa ang documents?",
    answer:
      "Coordinate with the enrollment personnel. Available documents will be checked and missing requirements may be noted for follow-up, subject to school validation and existing DepEd enrollment guidelines.",
  },
  {
    question: "Kinsa ang kinahanglan mo-adto sa school during enrollment?",
    answer:
      "The learner may be accompanied by a parent or guardian, especially for incoming learners, transferees, and those needing assistance in accomplishing enrollment forms.",
  },
  {
    question: "Unsaon pag-enroll sa incoming Grade 11?",
    answer:
      "Incoming Grade 11 learners should prepare their Junior High School completion documents and review the available SHS offerings or electives before finalizing enrollment information.",
  },
  {
    question: "Asa pwede mangutana about enrollment?",
    answer:
      "Use the official Facebook Page, Messenger channel, or visit the school office during official working hours. Avoid sending confidential learner information through public comments.",
  },
];

export default function EnrollmentPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-950">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 px-6 pb-20 pt-36">
          <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-200/60 blur-3xl" />

          <div className="relative mx-auto max-w-7xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <img
                src={depedLogo}
                alt="Department of Education Logo"
                className="h-12 w-auto -translate-y-1 object-contain md:h-14"
              />

              <div className="hidden h-12 w-px bg-slate-300 sm:block" />

              <img
                src={schoolLogo}
                alt="Tabunoc National High School Logo"
                className="h-16 w-16 object-contain md:h-20 md:w-20"
              />

              <div className="text-center sm:text-left">
                <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                  Department of Education
                </p>
                <p className="mt-1 font-bold text-slate-700">
                  Tabunoc National High School · School ID: 303111
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]"
            >
              Enrollment Guide
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mx-auto mt-4 max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl"
            >
              Basic Education Enrollment Guide
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mx-auto mt-5 max-w-3xl text-lg leading-7 text-slate-700"
            >
              Find enrollment procedures, basic requirements, school reminders,
              and official support channels for learners, parents, guardians,
              and transferees.
            </motion.p>
          </div>
        </section>

        {/* QUICK INFO */}
        <section className="bg-white px-6 py-16">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm"
            >
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                Who May Enroll
              </p>
              <h2 className="mt-3 text-2xl font-black">Eligible Learners</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Incoming Grade 7, continuing learners, transferees, returning
                learners, incoming Grade 11 learners, and other eligible
                school-age learners may coordinate with the school for
                enrollment assistance and validation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-[#ECFDF5] p-6 shadow-sm"
            >
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                School Visit
              </p>
              <h2 className="mt-3 text-2xl font-black">Follow School Flow</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Learners, parents, and guardians should proceed to the assigned
                enrollment area, accomplish required forms, and follow
                instructions from authorized school personnel.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-slate-200 bg-yellow-50 p-6 shadow-sm"
            >
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                Need Help?
              </p>
              <h2 className="mt-3 text-2xl font-black">Use Official Channels</h2>
              <p className="mt-3 leading-7 text-slate-600">
                For enrollment questions, records concerns, transferee guidance,
                or SHS offering inquiries, use the school’s official
                communication channels.
              </p>
            </motion.div>
          </div>
        </section>

        {/* STEPS */}
        <section className="bg-[#F8FAFC] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                Enrollment Process
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                Step-by-Step Enrollment Guide
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
                Follow these general steps for a smoother enrollment experience.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {enrollmentSteps.map((step, index) => (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F4C5C] text-lg font-black text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-black">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {step.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* REQUIREMENTS */}
<section className="bg-white px-6 py-20">
  <div className="mx-auto max-w-7xl">
    <div className="mb-12 text-center">
      <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
        Enrollment Requirements
      </p>
      <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
        Documents to Prepare by Learner Type
      </h2>
      <p className="mx-auto mt-4 max-w-3xl leading-7 text-slate-600">
        Prepare the available documents based on the learner’s enrollment
        situation. If some documents are incomplete, coordinate with the
        enrollment personnel for checking, validation, and follow-up
        instructions.
      </p>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      {requirementGroups.map((group, index) => (
        <motion.article
          key={group.group}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.06 }}
          className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm"
        >
          <div className="rounded-xl bg-yellow-300 px-5 py-3">
            <h3 className="text-xl font-black uppercase tracking-wide text-slate-950">
              {group.group}
            </h3>
          </div>

          <p className="mt-4 leading-7 text-slate-600">
            {group.description}
          </p>

          <ul className="mt-6 space-y-4">
            {group.items.map((item) => (
              <li key={item} className="flex gap-3 leading-7 text-slate-700">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F4C5C] text-sm font-black text-white">
                  ✓
                </span>
                <span className="font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </motion.article>
      ))}
    </div>
  </div>
</section>

        {/* ENROLLMENT POLICY NOTE */}
        <section className="bg-[#F8FAFC] px-6 py-12">
          <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#0F4C5C]">
              Enrollment Policy Reminder
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Tabunoc National High School follows applicable DepEd enrollment
              policies and school-level procedures to ensure that learners are
              properly guided, validated, and recorded. Parents and guardians are
              encouraged to provide accurate information and coordinate with
              authorized school personnel for records-related concerns.
            </p>
          </div>
        </section>

        {/* SHS */}
        <section className="bg-[#0F4C5C] px-6 py-20 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-black uppercase tracking-widest text-yellow-300">
                Senior High School
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                Explore available SHS offerings before enrollment.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-teal-50">
                Incoming Grade 11 learners and parents are encouraged to review
                available Senior High School offerings and choose options aligned
                with learner interests, goals, and school availability.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur"
            >
              <h3 className="text-2xl font-black">Helpful Links</h3>
              <div className="mt-6 grid gap-4">
                <Link
                  href="/shs-offerings"
                  className="rounded-xl bg-white px-5 py-4 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-yellow-300 hover:text-slate-950"
                >
                  View SHS Offerings
                </Link>
                <Link
                  href="/#contact"
                  className="rounded-xl border border-white/30 px-5 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#0F4C5C]"
                >
                  Contact Enrollment Help Desk
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                Frequently Asked Questions
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                Common Enrollment Questions
              </h2>
            </div>

            <div className="grid gap-5">
              {faqs.map((item, index) => (
                <motion.article
                  key={item.question}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm"
                >
                  <h3 className="text-xl font-black text-slate-950">
                    {item.question}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {item.answer}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 px-6 py-20">
          <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
              Need Assistance?
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              Contact the school through official channels.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              For enrollment concerns and records-related inquiries, please use
              the school’s verified communication channels.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="https://m.me/tabunocnatlhs"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-yellow-300 px-6 py-3 font-black text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-200"
              >
                Chat on Messenger
              </a>
              <Link
                href="/#contact"
                className="rounded-xl border border-[#0F4C5C]/30 bg-white px-6 py-3 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-[#0F4C5C] hover:text-white"
              >
                View Contact Channels
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#0B1F2A] px-6 py-12 text-teal-50">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-4">
              <img
                src={depedLogo}
                alt="Department of Education Logo"
                className="h-10 w-auto object-contain"
              />

              <img
                src={schoolLogo}
                alt="Tabunoc National High School Logo"
                className="h-12 w-12 object-contain"
              />
            </div>

            <div>
              <p className="font-black text-white">
                Tabunoc National High School
              </p>
              <p className="mt-1 text-sm">
                Sangi Road, Tabunok, Talisay City, Cebu
              </p>
              <p className="mt-1 text-sm">School ID: 303111</p>
            </div>

            <div className="text-sm">
              <p>© 2026 Tabunoc National High School.</p>
              <p>All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}