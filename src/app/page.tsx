"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import PersonnelModal from "@/components/PersonnelModal";
import type { Personnel } from "@/data/organization";
import { allPersonnel } from "@/data/organization";

const schoolLogo =
  "https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true";

const depedLogo =
  "https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png";

const announcements = [
  {
    title: "Enrollment Information",
    description:
      "Access enrollment reminders, documentary requirements, schedules, and official school announcements.",
    href: "/enrollment",
  },
  {
    title: "Senior High School Offerings",
    description:
      "Explore the available Pure Academic Track and Tech Pro Track offerings for incoming Grade 11 learners.",
    href: "/shs-offerings",
  },
  {
    title: "School Safety and DRRM",
    description:
      "Stay informed on disaster preparedness, emergency advisories, and school safety initiatives.",
    href: "#drrm",
  },
];

const programs = [
  {
    title: "Junior High School",
    href: "#about",
  },
  {
    title: "Senior High School",
    href: "/shs-offerings",
  },
  {
    title: "Pure Academic Track",
    href: "/shs-offerings",
  },
  {
    title: "Tech Pro Track",
    href: "/shs-offerings",
  },
  {
    title: "School DRRM Program",
    href: "#drrm",
  },
  {
    title: "Student Support Services",
    href: "#contact",
  },
];

const drrmItems = [
  {
    title: "Preparedness",
    text: "Conducts safety reminders, drills, orientations, and preparedness campaigns.",
  },
  {
    title: "Response",
    text: "Strengthens coordination for emergency response, evacuation, and incident reporting.",
  },
  {
    title: "Recovery",
    text: "Supports continuity of learning, documentation, and post-incident improvement.",
  },
];

const commonConcerns = [
  "Enrollment",
  "Learner Records",
  "SHS Programs",
  "Memos",
  "SDRRM",
  "Partnerships",
  "Stakeholder Support",
  "General Concerns",
];

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);

  const schoolHead = allPersonnel.find(
    (person) => person.id === "guillermo-villavelez"
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-950">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 px-6 pb-20 pt-36">
          <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-200/60 blur-3xl" />

          <div className="relative mx-auto flex min-h-[68vh] max-w-7xl flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <img
                src={depedLogo}
                alt="Department of Education Logo"
                className="h-12 w-auto -translate-y-1 object-contain md:h-16"
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

            <motion.h1
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1 }}
              className="max-w-5xl text-5xl font-black leading-[1.05] tracking-tight text-slate-950 md:text-7xl"
            >
              Tabunoc National High School
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2 }}
              className="mt-6 max-w-3xl text-lg leading-7 text-slate-700 md:text-xl"
            >
              A learner-centered public secondary school committed to quality,
              inclusive, resilient, and future-ready basic education.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.3 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <a
                href="/enrollment"
                className="rounded-xl bg-yellow-300 px-8 py-3 font-black text-slate-950 shadow-lg shadow-yellow-300/30 transition hover:-translate-y-1 hover:bg-yellow-200"
              >
                Enrollment Guide
              </a>

              <a
                href="#announcements"
                className="rounded-xl border border-[#0F4C5C]/30 bg-white px-8 py-3 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-[#0F4C5C] hover:text-white"
              >
                View Announcements
              </a>
            </motion.div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-white px-6 py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                About the School
              </p>

              <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
                Serving learners through accessible and quality public
                education.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                Tabunoc National High School is a public secondary school in
                Talisay City, Cebu, serving Junior High School and Senior High
                School learners. The school continues to strengthen instruction,
                learner support, safety, stakeholder engagement, and future-ready
                education programs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-lg md:p-8"
            >
              <h3 className="text-2xl font-black text-[#0F4C5C]">
                School Profile
              </h3>

              <div className="mt-6 grid gap-4">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-500">School ID</p>
                <p className="text-2xl font-black text-[#0F4C5C]">303111</p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-500">School Head</p>

                <button
                  type="button"
                  onClick={() => {
                    if (schoolHead) {
                      setSelectedPerson(schoolHead);
                    }
                  }}
                  className="mt-1 text-left text-lg font-black text-slate-950 transition hover:text-[#0F4C5C]"
                >
                  Guillermo B. Villavelez
                </button>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-500">Office Hours</p>
                <p className="text-lg font-black text-slate-950">
                  Monday to Friday, 8:00 AM – 5:00 PM
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Except holidays, class suspensions, and official non-working days.
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-500">Location</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Tabunoc%20National%20High%20School%20Sangi%20Road%20Tabunok%20Talisay%20City%20Cebu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex text-left text-lg font-black text-slate-950 transition hover:text-[#0F4C5C]"
                >
                  Sangi Road, Tabunok, Talisay City, Cebu
                </a>
              </div>
            </div>
            </motion.div>
          </div>
        </section>

        {/* ANNOUNCEMENTS */}
        <section
          id="announcements"
          className="bg-[#F1F5F9] px-6 py-20 text-slate-950"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                School Updates
              </p>

              <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Latest Announcements
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Official updates, advisories, enrollment information, and school
                program highlights will be made accessible through this website.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {announcements.map((item, index) => (
                <motion.a
                  key={item.title}
                  href={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <h3 className="text-xl font-black text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-7 text-slate-600">
                    {item.description}
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ENROLLMENT */}
        <section id="enrollment" className="bg-white px-6 py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                Enrollment and Access
              </p>

              <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Clear, simple, and parent-friendly school information.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                View enrollment procedures, learner-type requirements, proper
                attire reminders, school visit instructions, and official
                support channels in one dedicated guide.
              </p>

              <a
                href="/enrollment"
                className="mt-8 inline-flex rounded-xl bg-yellow-300 px-6 py-3 font-black text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-200"
              >
                Open Enrollment Guide
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl border border-slate-200 bg-[#ECFDF5] p-6 shadow-lg md:p-8"
            >
              <h3 className="text-2xl font-black text-[#0F4C5C]">
                Website Priorities
              </h3>

              <ul className="mt-6 space-y-4 text-slate-700">
                <li>✓ Mobile-friendly school announcements</li>
                <li>✓ Enrollment guides and downloadable forms</li>
                <li>✓ SHS tracks and Tech Pro information</li>
                <li>✓ School DRRM advisories and safety reminders</li>
                <li>✓ Official links to school platforms</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* PROGRAMS */}
        <section id="programs" className="bg-[#0F4C5C] px-6 py-20 text-white">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-10 text-center"
            >
              <p className="text-sm font-black uppercase tracking-widest text-yellow-300">
                Programs and Services
              </p>

              <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Built for learners, parents, and the community.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-teal-50">
                Explore key school programs, services, and learner support
                pathways.
              </p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program, index) => (
                <motion.a
                  key={program.title}
                  href={program.href}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur transition hover:-translate-y-2 hover:bg-white hover:text-[#0F4C5C]"
                >
                  <h3 className="text-xl font-black">{program.title}</h3>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* DRRM */}
        <section id="drrm" className="bg-white px-6 py-20 text-slate-950">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                School DRRM
              </p>

              <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Prepared, responsive, and safety-conscious.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                The School Disaster Risk Reduction and Management program
                promotes disaster preparedness, emergency response readiness,
                hazard awareness, and a culture of safety among learners,
                personnel, parents, and stakeholders.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {drrmItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <h3 className="text-2xl font-black text-[#0F4C5C]">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-7 text-slate-600">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="bg-gradient-to-br from-[#0F4C5C] via-[#0B3B48] to-[#102A43] px-6 py-20 text-white"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="text-sm font-black uppercase tracking-widest text-yellow-300">
                Contact and Official Channels
              </p>

              <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Reach the school through official channels.
              </h2>

              <p className="mt-4 leading-7 text-teal-50">
                For announcements, enrollment information, records-related
                inquiries, school issuances, and official concerns, please use
                the verified communication channels of Tabunoc National High
                School.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl"
              >
                <h3 className="text-2xl font-black">How may we assist you?</h3>

                <p className="mt-3 leading-7 text-teal-50">
                  Choose the proper official channel depending on your concern.
                  This helps the school route inquiries faster and more
                  appropriately.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {commonConcerns.map((item) => (
                    <div
                      key={item}
                      className="rounded-xl bg-white px-4 py-3 font-black text-[#0F4C5C]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl"
              >
                <h3 className="text-2xl font-black">Official Channels</h3>

                <p className="mt-3 leading-7 text-teal-50">
                  Use these verified links for school updates, inquiries,
                  document access, and online services.
                </p>

                <div className="mt-6 grid gap-4">
                  <a
                    href="https://facebook.com/tabunocnatlhs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white px-5 py-4 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-yellow-300 hover:text-slate-950"
                  >
                    Visit Facebook Page
                  </a>

                  <a
                    href="https://m.me/tabunocnatlhs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white px-5 py-4 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-yellow-300 hover:text-slate-950"
                  >
                    Chat with Us on Messenger
                  </a>

                  <a
                    href="/memos"
                    className="rounded-xl bg-white px-5 py-4 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-yellow-300 hover:text-slate-950"
                  >
                    View Memo Repository
                  </a>

                  <a
                    href="https://smis.tabunocnatlhs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white px-5 py-4 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-yellow-300 hover:text-slate-950"
                  >
                    Access School MIS
                  </a>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Tabunoc%20National%20High%20School%20Sangi%20Road%20Tabunok%20Talisay%20City%20Cebu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-white/30 px-5 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#0F4C5C]"
                  >
                    Get Directions
                  </a>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mt-8 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-6"
            >
              <h3 className="text-xl font-black text-yellow-300">
                Data Privacy Reminder
              </h3>

              <p className="mt-3 leading-7 text-teal-50">
                Please avoid posting or sending sensitive learner information
                through public comment sections. For records, enrollment, and
                confidential concerns, coordinate directly with the school
                office through official channels.
              </p>
            </motion.div>
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

            <PersonnelModal
              person={selectedPerson}
              onClose={() => setSelectedPerson(null)}
            />
          </>
        );
      }