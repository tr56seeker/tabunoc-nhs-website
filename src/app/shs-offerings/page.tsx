"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const schoolLogo =
  "https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true";

const depedLogo =
  "https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png";

const offerings = [
  {
    category: "Pure Academic Track",
    title: "Arts, Social Sciences, and Humanities Electives",
    description:
      "Designed for learners interested in humanities, communication, social sciences, governance, philosophy, literature, arts, and related college pathways.",
    items: [
      "Arts 1",
      "Contemporary Literature 1",
      "Creative Composition",
      "Filipino I",
      "Introduction to Philosophy",
      "Philippine Governance",
      "Social Sciences (Theory and Practice)",
    ],
  },
  {
    category: "Pure Academic Track",
    title: "Business and Entrepreneurship Electives",
    description:
      "Designed for learners interested in business, entrepreneurship, organization, management, and related career or college pathways.",
    items: ["Business I", "Introduction to Organization and Management"],
  },
  {
    category: "Technical-Vocational Livelihood",
    title: "Electrical Installation and Maintenance",
    description:
      "Designed for learners interested in electrical works, basic installation, technical skills development, and possible preparation for skills certification.",
    items: [
      "Electrical Installation and Maintenance",
      "Workplace Safety and Tools",
      "Basic Electrical Circuits",
      "Electrical Plans and Wiring Installation",
    ],
  },
  {
    category: "Technical-Vocational Livelihood",
    title: "Electronic Products Assembly and Servicing",
    description:
      "Designed for learners interested in electronics, electronic components, assembly, troubleshooting, and technical servicing skills.",
    items: [
      "Electronic Products Assembly and Servicing",
      "Electronic Components",
      "Circuit Assembly",
      "Basic Servicing and Troubleshooting",
    ],
  },
];

const quickGuides = [
  {
    title: "For College-Bound Learners",
    text: "Learners planning to pursue college programs may consider academic electives aligned with their interests and future courses.",
  },
  {
    title: "For Skills-Based Learners",
    text: "Learners interested in hands-on technical skills may consider TVL offerings aligned with employment, entrepreneurship, and skills certification pathways.",
  },
  {
    title: "For Parents and Guardians",
    text: "Parents are encouraged to guide learners based on interest, ability, career goals, and the official offerings available in the school.",
  },
];

export default function SHSOfferingsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(offerings.map((item) => item.category)))];

  const visibleOfferings =
    selectedCategory === "All"
      ? offerings
      : offerings.filter((item) => item.category === selectedCategory);

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
              Senior High School
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mx-auto mt-4 max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl"
            >
              Senior High School Offerings
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mx-auto mt-5 max-w-3xl text-lg leading-7 text-slate-700"
            >
              Explore the available Senior High School tracks, electives, and
              technical-vocational options offered at Tabunoc National High
              School.
            </motion.p>
          </div>
        </section>

        {/* QUICK GUIDE */}
        <section className="bg-white px-6 py-16">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {quickGuides.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm"
              >
                <h2 className="text-2xl font-black text-[#0F4C5C]">
                  {item.title}
                </h2>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* FILTER */}
        <section className="bg-[#F8FAFC] px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                Available Offerings
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                Choose a Track or Area of Interest
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
                Use the filter below to view academic and technical-vocational
                offerings currently listed for the school.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-xl px-5 py-3 text-sm font-black transition ${
                    selectedCategory === category
                      ? "bg-[#0F4C5C] text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-[#0F4C5C] hover:text-[#0F4C5C]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* OFFERINGS LIST */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
            {visibleOfferings.map((offering, index) => (
              <motion.article
                key={offering.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="rounded-lg bg-[#ECFDF5] px-3 py-2 text-xs font-black uppercase tracking-widest text-[#0F4C5C]">
                  {offering.category}
                </span>

                <h3 className="mt-5 text-3xl font-black leading-tight text-slate-950">
                  {offering.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {offering.description}
                </p>

                <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-5">
                  <p className="text-sm font-black uppercase tracking-widest text-slate-500">
                    Included Subjects / Focus Areas
                  </p>

                  <ul className="mt-4 grid gap-3">
                    {offering.items.map((item) => (
                      <li key={item} className="flex gap-3 text-slate-700">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F4C5C] text-xs font-black text-white">
                          ✓
                        </span>
                        <span className="font-semibold">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* NOTE */}
        <section className="bg-[#0F4C5C] px-6 py-20 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-black uppercase tracking-widest text-yellow-300">
                Enrollment Reminder
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                Choose carefully based on learner interest and school
                availability.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-teal-50">
                Senior High School offerings may be subject to school capacity,
                available teachers, learner demand, and official enrollment
                guidance. Learners and parents are encouraged to coordinate with
                authorized school personnel during enrollment.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur"
            >
              <h3 className="text-2xl font-black">Need Help Choosing?</h3>
              <p className="mt-3 leading-7 text-teal-50">
                For questions about tracks, electives, and enrollment, please
                coordinate through the official school communication channels.
              </p>

              <div className="mt-6 grid gap-4">
                <a
                  href="/enrollment"
                  className="rounded-xl bg-white px-5 py-4 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-yellow-300 hover:text-slate-950"
                >
                  Open Enrollment Guide
                </a>

                <a
                  href="/#contact"
                  className="rounded-xl border border-white/30 px-5 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#0F4C5C]"
                >
                  Contact the School
                </a>
              </div>
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
    </>
  );
}