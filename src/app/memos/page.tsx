"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import { memoCategories, memos, type MemoCategory } from "@/data/memos";

const schoolLogo =
  "https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true";

const depedLogo =
  "https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export default function MemosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<"All" | MemoCategory>("All");

  const visibleMemos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return memos
      .filter((memo) => memo.isPublic)
      .filter((memo) => {
        const matchesCategory =
          selectedCategory === "All" || memo.category === selectedCategory;

        const searchableText = [
          memo.memoNumber,
          memo.title,
          memo.dateIssued,
          memo.category,
          memo.issuingOffice,
          memo.description,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          query === "" || searchableText.includes(query);

        return matchesCategory && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
      );
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white">
        {/* HERO */}
        <section className="relative overflow-hidden px-6 pb-24 pt-36">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-yellow-900" />
          <div className="absolute left-10 top-28 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-400/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-8 flex items-center justify-center gap-5"
            >
              <img
                src={depedLogo}
                alt="Department of Education Logo"
                className="h-14 w-auto rounded-xl bg-white/90 p-2 shadow-lg md:h-16"
              />

              <img
                src={schoolLogo}
                alt="Tabunoc National High School Logo"
                className="h-16 w-16 rounded-full bg-white p-2 shadow-lg md:h-20 md:w-20"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-sm font-bold uppercase tracking-widest text-yellow-300"
            >
              Official School Repository
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mt-4 text-4xl font-black tracking-tight md:text-6xl"
            >
              School Memos and Issuances
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-200"
            >
              Search, view, and download public school memoranda, advisories,
              and issuances of Tabunoc National High School.
            </motion.p>
          </div>
        </section>

        {/* SEARCH */}
        <section className="bg-slate-100 px-6 py-16 text-slate-950">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                Search Repository
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Find a Memo
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
                Search by memo number, memo title, category, issuing office, or
                keyword.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search memo number or title..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                />

                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(event.target.value as "All" | MemoCategory)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                >
                  {memoCategories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <p className="text-sm font-bold text-slate-600">
                  {visibleMemos.length} memo
                  {visibleMemos.length !== 1 ? "s" : ""} found
                </p>

                {(searchTerm.trim() !== "" || selectedCategory !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                    }}
                    className="w-fit rounded-lg bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-950 hover:text-white"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* MEMO LIST */}
        <section className="bg-white px-6 py-20 text-slate-950">
          <div className="mx-auto max-w-7xl">
            {visibleMemos.length > 0 ? (
              <div className="grid gap-6">
                {visibleMemos.map((memo, index) => (
                  <motion.article
                    key={memo.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:p-8"
                  >
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-lg bg-blue-950 px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
                            {memo.memoNumber}
                          </span>
                          <span className="rounded-lg bg-yellow-300 px-3 py-1 text-xs font-black uppercase tracking-widest text-slate-950">
                            {memo.category}
                          </span>
                        </div>

                        <h3 className="mt-4 text-2xl font-black md:text-3xl">
                          {memo.title}
                        </h3>

                        <p className="mt-3 text-sm font-bold text-slate-500">
                          Date Issued: {formatDate(memo.dateIssued)} ·{" "}
                          {memo.issuingOffice}
                        </p>

                        <p className="mt-4 max-w-4xl leading-7 text-slate-600">
                          {memo.description}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                        <a
                          href={memo.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-blue-950 px-5 py-3 text-center text-sm font-black text-white transition hover:-translate-y-1 hover:bg-blue-800"
                        >
                          View Memo
                        </a>

                        <a
                          href={memo.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="rounded-lg bg-yellow-400 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-300"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-100 p-10 text-center">
                <h3 className="text-2xl font-black">No memo found</h3>
                <p className="mt-3 text-slate-600">
                  Try searching by memo number, title, category, or keyword.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* PUBLIC NOTICE */}
        <section className="bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur">
            <h2 className="text-2xl font-black">Public Access Notice</h2>
            <p className="mt-4 leading-8 text-slate-300">
              This repository is intended for public school memoranda,
              advisories, and issuances cleared for public access. Documents
              containing sensitive learner, personnel, or confidential
              information should not be posted here unless properly authorized
              and redacted.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-900 px-6 py-12 text-slate-300">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-4">
              <img
                src={depedLogo}
                alt="Department of Education Logo"
                className="h-12 w-auto rounded-lg bg-white p-2"
              />

              <img
                src={schoolLogo}
                alt="Tabunoc National High School Logo"
                className="h-14 w-14 rounded-full bg-white p-1"
              />
            </div>

            <div>
              <p className="font-bold text-white">
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