"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/components/Footer";
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
      "View enrollment schedules, requirements, reminders, and official guidance for incoming and continuing learners.",
    href: "/enrollment",
  },
  {
    title: "Senior High School Offerings",
    description:
      "Explore the Pure Academic Track and Tech Pro Track offerings for incoming Grade 11 learners.",
    href: "/shs-offerings",
  },
  {
    title: "School Safety and DRRM",
    description:
      "Stay informed on school safety reminders, disaster preparedness activities, emergency advisories, and DRRM initiatives.",
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
    title: "Technical-Professional Track",
    href: "/shs-offerings",
  },
  {
  title: "Citizen’s Charter",
  href: "/citizen-charter",
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
    text: "Conducts safety reminders, preparedness campaigns, orientations, drills, and risk awareness activities.",
  },
  {
    title: "Response",
    text: "Supports emergency coordination, evacuation procedures, incident reporting, and communication during school emergencies.",
  },
  {
    title: "Recovery",
    text: "Assists in documentation, post-incident review, learner support, and continuity of school operations.",
  },
];

const commonConcerns = [
  {
    title: "Enrollment",
    description:
      "For enrollment schedules, requirements, and learner registration concerns.",
  },
  {
    title: "Learner Records",
    description:
      "For SF10/Form 137, certifications, and school records inquiries.",
  },
  {
    title: "Senior High School",
    description: "For SHS tracks, offerings, and Grade 11–12 concerns.",
  },
  {
    title: "School Memos",
    description:
      "For official issuances, advisories, and school announcements.",
  },
  {
    title: "SDRRM",
    description:
      "For school safety, emergency preparedness, and DRRM coordination.",
  },
  {
    title: "Partnerships",
    description:
      "For stakeholder support, donations, Brigada Eskwela, and external coordination.",
  },
  {
    title: "General Concerns",
    description: "For other school-related inquiries and assistance.",
  },
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
        <section className="relative -mt-20 overflow-hidden pt-40 sm:-mt-24 sm:pt-44 lg:-mt-28 lg:pt-48">
          <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-200/60 blur-3xl" />

          <div className="relative mx-auto flex min-h-[68vh] max-w-7xl flex-col items-center justify-center text-center">
            <BrandHeader />

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
             
              A public secondary school in Talisay City, Cebu committed to accessible, inclusive, resilient, and future-ready education for Junior High School and Senior High School learners.
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
                Tabunoc National High School is a public secondary school located along Sangi Road, Tabunok, Talisay City, Cebu. The school serves Junior High School and Senior High School learners through academic instruction, technical-vocational learning opportunities, learner support services, school safety initiatives, and active stakeholder partnership. Guided by the mandate of the Department of Education, the school continues to strengthen basic education services that are responsive to learners, parents, personnel, and the wider Tabunoc community.
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
                  <p className="text-sm font-bold text-slate-500">
                    School Head
                  </p>

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
                  <p className="text-sm font-bold text-slate-500">
                    Office Hours
                  </p>
                  <p className="text-lg font-black text-slate-950">
                    Monday to Friday, 8:00 AM – 5:00 PM
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Except holidays, class suspensions, and official non-working
                    days.
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
                Access official school advisories, enrollment reminders, program updates, learner services information, and important announcements from Tabunoc National High School.
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
                Clear and parent-friendly access to school information.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                This website provides learners, parents, guardians, and stakeholders with easy access to enrollment procedures, school announcements, official forms, program information, and communication channels.
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
                This website aims to:
              </h3>

              <ul className="mt-6 space-y-4 text-slate-700">
                <li>✓ Publish timely and official school announcements</li>
                <li>✓ Provide clear enrollment and school service information</li>
                <li>✓ Support access to Junior High School and Senior High School information</li>
                <li>✓ Share DRRM, safety, and preparedness updates</li>
                <li>✓ Connect learners, parents, guardians, and stakeholders to official channels</li>
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
                Supporting learners, parents, and the community.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-teal-50">
                Explore the school's key programs, services, and learner support initiatives, and official access points.
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
                Prepared, responsive, and resilient.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                The School Disaster Risk Reduction and Management Program strengthens preparedness, emergency response, risk awareness, and continuity of learning through school-based safety initiatives, drills, coordination, and stakeholder participation.
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
                CONTACT AND OFFICIAL CHANNELS
              </p>

              <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Connect with Tabunoc National High School through official channels.
              </h2>

              <p className="mt-4 leading-7 text-teal-50">
                For enrollment concerns, learner records inquiries, school services,
                partnerships, and official coordination, please use the verified
                communication channels of Tabunoc National High School.
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
                  Select the concern that best matches your inquiry so it can be
                  directed to the proper school office, personnel, or program
                  implementer.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {commonConcerns.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-white/10 bg-white/[0.08] p-4"
                    >
                      <p className="text-sm font-black text-yellow-300">
                        {item.title}
                      </p>
                      <p className="mt-2 text-xs font-medium leading-5 text-teal-50">
                        {item.description}
                      </p>
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
                  Use these verified links for school updates, online services, inquiries, and official school platforms.
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
                    href="mailto:303111@deped.gov.ph"
                    className="rounded-xl bg-white px-5 py-4 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-yellow-300 hover:text-slate-950"
                  >
                    <span className="block">Email the School</span>
                    <span className="mt-1 block text-sm font-semibold text-slate-600">
                      303111@deped.gov.ph
                    </span>
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

          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </main>

      <PersonnelModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
    </>
  );
}
