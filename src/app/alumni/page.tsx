"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import BrandHeader from "@/components/BrandHeader";

const schoolLogo =
  "https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true";

const depedLogo =
  "https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png";

const facebookGroupMembers = 1250;

const purposeCards = [
  {
    title: "Reconnect",
    description:
      "Provide a welcoming space for graduates, former learners, and current students to reconnect with the Tabunoc NHS community.",
  },
  {
    title: "Recognize",
    description:
      "Celebrate alumni achievements, milestones, stories, and contributions that inspire learners and stakeholders.",
  },
  {
    title: "Support",
    description:
      "Encourage alumni participation in school programs, mentoring, career talks, Brigada Eskwela, and stakeholder initiatives.",
  },
];

const communityLinks = [
  {
    label: "Join the Network",
    title: "Students and Alumni Facebook Group",
    description:
      "Request to join the official community space for students and alumni.",
    href: "https://web.facebook.com/groups/TabunokNatlHSAlumniAndStudentsCommunity",
    isPrimary: true,
  },
  {
    label: "Like and Support",
    title: "Alumni Facebook Page",
    description:
      "Follow alumni highlights, community updates, and recognition posts.",
    href: "https://web.facebook.com/tabunocnatlhsAlumni/",
    isPrimary: false,
  },
  {
    label: "Follow School News",
    title: "Tabunoc NHS Facebook Page",
    description:
      "Stay updated on official school announcements, events, and programs.",
    href: "https://web.facebook.com/tabunocnatlhs",
    isPrimary: false,
  },
];

const involvementSteps = [
  {
    step: "01",
    title: "Reconnect",
    description:
      "Join the official community, update your batch information, and reconnect with fellow graduates and learners.",
  },
  {
    step: "02",
    title: "Collaborate",
    description:
      "Participate in school activities, career talks, learning support, and stakeholder engagement initiatives.",
  },
  {
    step: "03",
    title: "Contribute",
    description:
      "Support learners through mentoring, resource sharing, volunteerism, and school improvement efforts.",
  },
  {
    step: "04",
    title: "Celebrate",
    description:
      "Share alumni stories, achievements, memories, and milestones that strengthen school pride.",
  },
];

const reminders = [
  "Alumni participation is voluntary and should remain respectful, inclusive, and non-political.",
  "Personal information, photos, and alumni stories should only be posted with proper consent.",
  "For donations, partnerships, or school support, coordinate through official school channels.",
  "Avoid posting sensitive learner, personnel, or private school records in public comment sections.",
];

export default function AlumniPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-950">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 px-6 pb-20 pt-36">
          <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-200/60 blur-3xl" />

          <div className="relative mx-auto max-w-7xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]"
            >
              Tabunoc NHS Community
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mx-auto mt-4 max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl"
            >
              Students and Alumni Community
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mt-5 max-w-3xl text-lg leading-7 text-slate-700"
            >
              A community space for Tabunoc National High School learners,
              graduates, and alumni to reconnect, celebrate achievements,
              support school programs, and strengthen lifelong school pride.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a
                href="https://web.facebook.com/groups/TabunokNatlHSAlumniAndStudentsCommunity"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-yellow-300 px-8 py-3 font-black text-slate-950 shadow-lg shadow-yellow-300/30 transition hover:-translate-y-1 hover:bg-yellow-200"
              >
                Join the Alumni Community
              </a>

              <a
                href="#overview"
                className="rounded-xl border border-[#0F4C5C]/30 bg-white px-8 py-3 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-[#0F4C5C] hover:text-white"
              >
                Learn More
              </a>
            </motion.div>
          </div>
        </section>

        {/* OVERVIEW */}
        <section id="overview" className="bg-white px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                  Alumni and Student Engagement
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                  Building connection, legacy, and support for the Tabunoc NHS
                  community.
                </h2>
                <p className="mt-5 max-w-3xl leading-7 text-slate-600">
                  The Alumni page serves as an organized space for community
                  engagement. It connects learners, graduates, and stakeholders
                  through recognition, school support, mentoring, and meaningful
                  participation.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-8 shadow-sm"
              >
                <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                  Community Snapshot
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm font-bold text-slate-500">
                      Facebook Group Members
                    </p>
                    <p className="mt-2 text-3xl font-black text-[#0F4C5C]">
                      {facebookGroupMembers.toLocaleString()}+
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Updated when join requests are approved
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm font-bold text-slate-500">
                      Community Focus
                    </p>
                    <p className="mt-2 text-3xl font-black text-[#0F4C5C]">
                      4
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Reconnect, Recognize, Support, Celebrate
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {purposeCards.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                    {item.title}
                  </p>
                  <p className="mt-4 leading-7 text-slate-600">
                    {item.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* COMMUNITY LINKS */}
        <section className="bg-[#F8FAFC] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                Official Community Links
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                Connect through verified channels.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
                Use these official links to join the community, follow alumni
                highlights, and stay updated with school announcements.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {communityLinks.map((link, index) => (
                <motion.a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className={`rounded-2xl border p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                    link.isPrimary
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-widest text-[#0F4C5C]">
                    {link.label}
                  </p>
                  <h3 className="mt-3 text-xl font-black text-slate-950">
                    {link.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {link.description}
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* GET INVOLVED */}
        <section id="connect" className="bg-white px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                Get Involved
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                A clear alumni journey.
              </h2>
              <p className="mx-auto mt-4 max-w-3xl leading-7 text-slate-600">
                Alumni engagement is best when it is organized, respectful, and
                aligned with the school&apos;s mission. These steps make it
                easier to participate in community, support, and learning
                initiatives.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {involvementSteps.map((item, index) => (
                <motion.article
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-8 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F4C5C] text-lg font-black text-white">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-5 leading-7 text-slate-600">
                    {item.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* REMINDERS */}
        <section className="bg-[#0F4C5C] px-6 py-20 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-sm font-black uppercase tracking-widest text-yellow-300">
                  Responsible Community Engagement
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                  Support the school with care, respect, and proper
                  coordination.
                </h2>
                <p className="mt-5 max-w-3xl leading-7 text-teal-50">
                  The alumni community is encouraged to promote positive
                  engagement, protect privacy, and coordinate school-related
                  support through official channels.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur"
              >
                <h3 className="text-2xl font-black">Community Reminders</h3>

                <ul className="mt-6 space-y-4">
                  {reminders.map((item) => (
                    <li key={item} className="flex gap-3 leading-7 text-teal-50">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-300 text-sm font-black text-slate-950">
                        !
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 px-6 py-20">
          <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
              Alumni Support
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              Start your legacy pathway with Tabunoc NHS.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Whether you are a graduate, teacher, learner, or partner, the
              community provides a structured way to stay involved, share
              knowledge, and support the school&apos;s future.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="https://web.facebook.com/groups/TabunokNatlHSAlumniAndStudentsCommunity"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-yellow-300 px-6 py-3 font-black text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-200"
              >
                Join the Facebook Group
              </a>

              <a
                href="/#contact"
                className="rounded-xl border border-[#0F4C5C]/30 bg-white px-6 py-3 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-[#0F4C5C] hover:text-white"
              >
                Contact the School
              </a>
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