"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const announcements = [
  {
    title: "Enrollment Information",
    description:
      "Access enrollment reminders, documentary requirements, schedules, and official school announcements.",
  },
  {
    title: "Senior High School Offerings",
    description:
      "Explore the available tracks, strands, and elective options for incoming Grade 11 learners.",
  },
  {
    title: "School Safety and DRRM",
    description:
      "Stay informed on disaster preparedness, emergency advisories, and school safety initiatives.",
  },
];

const programs = [
  "Junior High School",
  "Senior High School",
  "Technical-Vocational Livelihood",
  "Electrical Installation and Maintenance",
  "School DRRM Program",
  "Student Support Services",
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white">
        {/* HERO SECTION */}
        <section className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-yellow-900" />
          <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-400/20 blur-3xl" />

          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
            <motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  className="mb-8 flex items-center justify-center gap-5"
>
  <img
    src="https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png"
    alt="Department of Education Logo"
    className="h-14 w-auto rounded-xl bg-white/90 p-2 shadow-lg md:h-16"
  />

  <img
    src="https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true"
    alt="Tabunoc National High School Logo"
    className="h-16 w-16 rounded-full bg-white p-2 shadow-lg md:h-20 md:w-20"
  />
</motion.div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-5 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-blue-100 backdrop-blur"
            >
              Sangi Road, Tabunok, Talisay City, Cebu
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1 }}
              className="max-w-5xl text-5xl font-black tracking-tight md:text-7xl"
            >
              Tabunoc National High School
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2 }}
              className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl"
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
                href="#enrollment"
                className="rounded-full bg-yellow-400 px-8 py-3 font-bold text-slate-950 shadow-lg shadow-yellow-400/20 transition hover:scale-105 hover:bg-yellow-300"
              >
                Enrollment Guide
              </a>

              <a
                href="#announcements"
                className="rounded-full border border-white/30 px-8 py-3 font-bold text-white transition hover:scale-105 hover:bg-white hover:text-slate-950"
              >
                View Announcements
              </a>
            </motion.div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-white px-6 py-24 text-slate-950">
          <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                About the School
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Serving learners through accessible and quality public education.
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
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
              className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl"
            >
              <h3 className="text-2xl font-black">School Profile</h3>

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm text-slate-300">School ID</p>
                  <p className="text-2xl font-black text-yellow-300">303111</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm text-slate-300">Location</p>
                  <p className="text-lg font-bold">
                    Sangi Road, Tabunok, Talisay City, Cebu
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm text-slate-300">School Head</p>
                  <p className="text-lg font-bold">Guillermo B. Villavelez</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ANNOUNCEMENTS */}
        <section
          id="announcements"
          className="bg-slate-100 px-6 py-24 text-slate-950"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-12"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                School Updates
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Latest Announcements
              </h2>
              <p className="mt-4 max-w-2xl text-slate-600">
                Official updates, advisories, enrollment information, and school
                program highlights will be made accessible through this website.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {announcements.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-4 leading-7 text-slate-600">
                    {item.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ENROLLMENT */}
        <section
          id="enrollment"
          className="bg-white px-6 py-24 text-slate-950"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                Enrollment and Access
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Clear, simple, and parent-friendly school information.
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                This website will help learners, parents, guardians, alumni, and
                stakeholders access school information, requirements, official
                announcements, and program offerings in one organized digital
                space.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl bg-slate-100 p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold">Website Priorities</h3>
              <ul className="mt-6 space-y-4 text-slate-700">
                <li>✓ Mobile-friendly school announcements</li>
                <li>✓ Enrollment guides and downloadable forms</li>
                <li>✓ SHS tracks, strands, and elective information</li>
                <li>✓ DRRM advisories and safety reminders</li>
                <li>✓ Official links to school platforms</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* PROGRAMS */}
        <section id="programs" className="bg-slate-950 px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-12 text-center"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
                Programs and Services
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Built for learners, parents, and the community.
              </h2>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program, index) => (
                <motion.div
                  key={program}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur transition hover:-translate-y-2 hover:bg-white/20"
                >
                  <h3 className="text-xl font-bold">{program}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DRRM */}
        <section id="drrm" className="bg-white px-6 py-24 text-slate-950">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                School DRRM
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Prepared, responsive, and safety-conscious.
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                The school promotes disaster preparedness, emergency response
                readiness, hazard awareness, and a culture of safety among
                learners, personnel, parents, and stakeholders.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
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
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-3xl bg-slate-100 p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <h3 className="text-2xl font-black">{item.title}</h3>
                  <p className="mt-4 leading-7 text-slate-600">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="bg-gradient-to-br from-blue-950 via-slate-950 to-yellow-900 px-6 py-24"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
                Contact and Official Channels
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">
                Connect with Tabunoc National High School.
              </h2>
              <p className="mt-5 leading-8 text-slate-200">
                For official concerns, announcements, enrollment information,
                and school updates, please use the official communication
                channels of the school.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl"
            >
              <h3 className="text-2xl font-black">Official Links</h3>

              <div className="mt-6 space-y-4">
                <a
                  href="https://facebook.com/tabunocnatlhs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-white px-5 py-4 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-300"
                >
                  Facebook Page
                </a>

                <a
                  href="https://www.tabunocnatlhs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-white px-5 py-4 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-300"
                >
                  Official Website
                </a>

                <a
                  href="https://smis.tabunocnatlhs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-white px-5 py-4 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-300"
                >
                  School MIS
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-900 px-6 py-12 text-slate-300">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-4">
            <img
              src="https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png"
              alt="Department of Education Logo"
              className="h-12 w-auto rounded-lg bg-white p-2"
            />

            <img
              src="https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true"
              alt="Tabunoc National High School Logo"
              className="h-14 w-14 rounded-full bg-white p-1"
            />
          </div>

          <div>
            <p className="font-bold text-white">Tabunoc National High School</p>
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