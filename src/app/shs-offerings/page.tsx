"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

import Navbar from "@/components/Navbar";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/components/Footer";

const offerings = [
  {
    category: "Pure Academic Track",
    title: "Arts, Social Sciences, and Humanities",
    description:
      "Designed for learners interested in arts, literature, communication, philosophy, governance, humanities, and social sciences-related college pathways.",
    items: [
      "Arts 1",
      "Contemporary Literature 1",
      "Creative Composition",
      "Filipino 1",
      "Introduction to Philosophy",
      "Philippine Governance",
      "Social Sciences (Theory and Practice)",
    ],
  },
  {
    category: "Pure Academic Track",
    title: "Science, Technology, Engineering, and Mathematics",
    description:
      "Designed for learners interested in science, technology, engineering, mathematics, research, health sciences, and other STEM-related pathways.",
    items: [
      "Biology 1",
      "Earth and Space Science 1",
      "Empowerment Technologies",
      "Finite Mathematics 1",
      "Chemistry 1",
      "Physics 1",
    ],
  },
  {
    category: "Pure Academic Track",
    title: "Business and Entrepreneurship",
    description:
      "Designed for learners interested in business, entrepreneurship, management, organization, enterprise development, and related college or career pathways.",
    items: ["Business 1", "Introduction to Organization and Management"],
  },
  {
    category: "Pure Academic Track",
    title: "Sports, Health, and Wellness",
    description:
      "Designed for learners interested in sports, physical fitness, human movement, health, wellness, recreation, and related fields.",
    items: [
      "Human Movement 1 (Basic Anatomy in Sports and Exercise)",
      "Physical Education 1 (Fitness and Recreation)",
    ],
  },
  {
    category: "Tech Pro Track",
    title: "Aesthetic, Wellness, and Human Care",
    description:
      "Designed for learners interested in beauty care, grooming, hairdressing, wellness services, and human care-related skills.",
    items: [
      "Aesthetic Services (Beauty Care)",
      "Barbering Services",
      "Hairdressing Services",
      "Wellness Services (Hilot/Massage)",
    ],
  },
  {
    category: "Tech Pro Track",
    title: "ICT Support and Computer Programming Technologies",
    description:
      "Designed for learners interested in ICT support, computer systems, programming, broadband installation, and technology-related skills.",
    items: [
      "Computer Programming (Java)",
      "Computer Systems Servicing",
      "Broadband Installation",
    ],
  },
  {
    category: "Tech Pro Track",
    title: "Industrial Technologies",
    description:
      "Designed for learners interested in hands-on technical skills, electrical works, electronics, installation, servicing, and industrial technology pathways.",
    items: [
      "Electrical Installation and Maintenance",
      "Electronic Products Assembly and Servicing",
    ],
  },
];

const quickGuides = [
  {
    title: "For College-Bound Learners",
    text: "Learners planning to pursue college programs may consider Pure Academic Track offerings aligned with their interests and future courses.",
  },
  {
    title: "For Skills-Based Learners",
    text: "Learners interested in hands-on skills may consider Tech Pro Track offerings aligned with employment, entrepreneurship, and skills development pathways.",
  },
  {
    title: "For Parents and Guardians",
    text: "Parents and guardians are encouraged to guide learners based on interest, ability, career goals, and the official offerings available in the school.",
  },
];

export default function SHSOfferingsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(offerings.map((item) => item.category))),
  ];

  const visibleOfferings =
    selectedCategory === "All"
      ? offerings
      : offerings.filter((item) => item.category === selectedCategory);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white dark:bg-[#0a0908] text-slate-950 dark:text-white">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 dark:from-[#071E29] dark:via-slate-950 dark:to-[#0B2A36] px-6 pb-20 pt-36">
          <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-200/60 blur-3xl" />

          <div className="relative mx-auto max-w-7xl text-center">
            <BrandHeader />

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300"
            >
              Senior High School
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mx-auto mt-4 max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-950 dark:text-white md:text-6xl"
            >
              Senior High School Offerings
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mx-auto mt-5 max-w-3xl text-lg leading-7 text-slate-700 dark:text-stone-200"
            >
              Explore the Pure Academic Track and Tech Pro Track offerings
              available for Senior High School learners of Tabunoc National High
              School.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/enrollment"
                className="rounded-xl bg-yellow-300 px-8 py-3 font-black text-slate-950 shadow-lg shadow-yellow-300/30 dark:shadow-black/20 transition hover:-translate-y-1 hover:bg-yellow-200"
              >
                Open Enrollment Guide
              </Link>

              <Link
                href="/#contact"
                className="rounded-xl border border-[#0F4C5C]/30 bg-white dark:bg-[#171614] px-8 py-3 font-black text-[#0F4C5C] dark:text-yellow-300 transition hover:-translate-y-1 hover:text-[#0F4C5C] dark:hover:text-yellow-300"
              >
                Ask for Assistance
              </Link>
            </motion.div>
          </div>
        </section>

        {/* QUICK GUIDE */}
        <section className="bg-white dark:bg-[#0a0908] px-6 py-16">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {quickGuides.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-2xl border border-slate-200 dark:border-[#292624] bg-[#F8FAFC] dark:bg-[#171614] p-6 shadow-sm dark:shadow-black/20"
              >
                <h2 className="text-2xl font-black text-[#0F4C5C] dark:text-yellow-300">
                  {item.title}
                </h2>
                <p className="mt-3 leading-7 text-slate-600 dark:text-stone-300">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* FILTER */}
        <section className="bg-[#F8FAFC] dark:bg-[#0a0908] px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300">
                Available Offerings
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                Choose a Senior High School Track
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-stone-300">
                Use the filter below to view the Pure Academic Track and Tech
                Pro Track offerings currently listed for the school.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-xl px-5 py-3 text-sm font-black transition ${
                    selectedCategory === category
                      ? "bg-[#0F4C5C] text-white"
                      : "border border-slate-200 dark:border-[#292624] bg-white dark:bg-[#171614] text-slate-700 dark:text-stone-200 hover:border-[#0F4C5C] hover:text-[#0F4C5C]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* OFFERINGS LIST */}
        <section className="bg-white dark:bg-[#0a0908] px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
            {visibleOfferings.map((offering, index) => (
              <motion.article
                key={offering.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="rounded-2xl border border-slate-200 dark:border-[#292624] bg-white dark:bg-[#171614] p-8 shadow-sm dark:shadow-black/20 transition hover:-translate-y-1 hover:scale-[1.01]"
              >
                <span className="rounded-lg bg-[#ECFDF5] dark:bg-[#171614] px-3 py-2 text-xs font-black uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300">
                  {offering.category}
                </span>

                <h3 className="mt-5 text-3xl font-black leading-tight text-slate-950 dark:text-white">
                  {offering.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600 dark:text-stone-300">
                  {offering.description}
                </p>

                <div className="mt-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#171614] p-5">
                  <p className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-stone-400">
                    Subjects / Specializations
                  </p>

                  <ul className="mt-4 grid gap-3">
                    {offering.items.map((item) => (
                      <li key={item} className="flex gap-3 text-slate-700 dark:text-stone-200">
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
              className="rounded-2xl border border-[#292624] bg-[#171614] p-8"
            >
              <h3 className="text-2xl font-black">Need Help Choosing?</h3>
              <p className="mt-3 leading-7 text-teal-50">
                For questions about tracks, specializations, and enrollment,
                please coordinate through the official school communication
                channels.
              </p>

              <div className="mt-6 grid gap-4">
                <Link
                  href="/enrollment"
                  className="rounded-xl bg-white dark:bg-[#171614] px-5 py-4 font-black text-[#0F4C5C] dark:text-yellow-300 transition hover:-translate-y-1 hover:scale-[1.01] hover:text-[#0F4C5C] dark:hover:text-yellow-300"
                >
                  Open Enrollment Guide
                </Link>

                <Link
                  href="/#contact"
                  className="rounded-xl border border-white/30 px-5 py-4 font-black text-white transition hover:-translate-y-1 hover:text-yellow-300"
                >
                  Contact the School
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



