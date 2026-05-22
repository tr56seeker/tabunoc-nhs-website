"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import BrandHeader from "@/components/BrandHeader";
import { memoCategories, memos, type MemoCategory } from "@/data/memos";

const schoolLogo =
  "https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true";

const depedLogo =
  "https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png";

type MemoItem = (typeof memos)[number];

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getMemoFileLink(memo: MemoItem) {
  const record = memo as unknown as Record<string, unknown>;

  const possibleLinks = [
    record.fileUrl,
    record.downloadUrl,
    record.viewUrl,
    record.url,
    record.href,
    record.file,
  ];

  return possibleLinks.find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0
  );
}

export default function MemosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<"All" | MemoCategory>("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const publicMemos = useMemo(() => {
    return memos
      .filter((memo) => memo.isPublic)
      .sort(
        (a, b) =>
          new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
      );
  }, []);

  const availableYears = useMemo(() => {
  const years = publicMemos
    .map((memo) => new Date(memo.dateIssued).getFullYear())
    .filter((year) => !Number.isNaN(year));

  return Array.from(new Set(years)).sort((a, b) => b - a);
}, [publicMemos]);

  const visibleMemos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return publicMemos.filter((memo) => {
      const matchesCategory =
        selectedCategory === "All" || memo.category === selectedCategory;

        const memoYear = new Date(memo.dateIssued).getFullYear().toString();
        const matchesYear = selectedYear === "All" || memoYear === selectedYear;

      const searchableText = [
        memo.memoNumber,
        memo.title,
        memo.dateIssued,
        memo.category,
        memo.issuingOffice,
        memo.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = query === "" || searchableText.includes(query);

      return matchesCategory && matchesYear && matchesSearch;
    });
  }, [publicMemos, searchTerm, selectedCategory, selectedYear]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-950">
        {/* HERO */}
          <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 px-6 pb-20 pt-36 text-slate-950">
            <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-200/60 blur-3xl" />

            <div className="relative mx-auto max-w-7xl text-center">
              <BrandHeader />

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]"
              >
                Official School Repository
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="mx-auto mt-4 max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl"
              >
                School Memos and Issuances
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="mx-auto mt-5 max-w-3xl text-lg leading-7 text-slate-700"
              >
                Search, view, and access public school memoranda, advisories, and
                issuances of Tabunoc National High School.
              </motion.p>

              {/* SEARCH AND FILTER */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="mx-auto mt-12 max-w-7xl rounded-2xl border border-slate-200 bg-white/95 p-5 text-left shadow-xl backdrop-blur md:p-6"
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_220px_180px]">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by memo number, title, category, or issuing office..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F4C5C] focus:ring-4 focus:ring-teal-100"
                  />

                  <select
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value as "All" | MemoCategory)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-sm font-bold text-slate-900 outline-none transition focus:border-[#0F4C5C] focus:ring-4 focus:ring-teal-100"
                  >
                    <option value="All">All Categories</option>
                    {memoCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={(event) => setSelectedYear(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-sm font-bold text-slate-900 outline-none transition focus:border-[#0F4C5C] focus:ring-4 focus:ring-teal-100"
                  >
                    <option value="All">All Years</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <p className="pl-5 text-sm font-bold text-slate-600">
                    Showing {visibleMemos.length} of {publicMemos.length} public memo
                    {publicMemos.length !== 1 ? "s" : ""}
                  </p>

                  {(searchTerm.trim() !== "" ||
                    selectedCategory !== "All" ||
                    selectedYear !== "All") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All");
                        setSelectedYear("All");
                      }}
                      className="w-fit rounded-lg bg-slate-100 py-2 pl-5 pr-4 text-sm font-black text-slate-700 transition hover:bg-[#0F4C5C] hover:text-white md:px-4"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </section>


        {/* MEMO LIST */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-7xl">
            {visibleMemos.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-[#F8FAFC] px-5 py-4">
                  <h3 className="text-xl font-black text-slate-950">
                    Public Memo List
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    Click “View” or “Download” to access the available memo file.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[980px] w-full border-collapse text-left">
                    <thead className="bg-[#0F4C5C] text-white">
                      <tr>
                        <th className="px-5 py-4 text-xs font-black uppercase tracking-widest">
                          Memo No.
                        </th>
                        <th className="px-5 py-4 text-xs font-black uppercase tracking-widest">
                          Title
                        </th>
                        <th className="px-5 py-4 text-xs font-black uppercase tracking-widest">
                          Category
                        </th>
                        <th className="px-5 py-4 text-xs font-black uppercase tracking-widest">
                          Date Issued
                        </th>
                        <th className="px-5 py-4 text-xs font-black uppercase tracking-widest">
                          Issuing Office
                        </th>
                        <th className="px-5 py-4 text-center text-xs font-black uppercase tracking-widest">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {visibleMemos.map((memo, index) => {
                        const memoLink = getMemoFileLink(memo);

                        return (
                          <motion.tr
                            key={`${memo.memoNumber}-${memo.title}`}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                            className="bg-white transition hover:bg-[#F8FAFC]"
                          >
                            <td className="whitespace-nowrap px-5 py-4 align-top">
                              <p className="font-black text-[#0F4C5C]">
                                {memo.memoNumber}
                              </p>
                            </td>

                            <td className="px-5 py-4 align-top">
                              <p className="font-black leading-snug text-slate-950">
                                {memo.title}
                              </p>
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                                {memo.description}
                              </p>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 align-top">
                              <span className="inline-flex rounded-lg bg-[#ECFDF5] px-3 py-2 text-xs font-black uppercase tracking-widest text-[#0F4C5C]">
                                {memo.category}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 align-top">
                              <p className="font-bold text-slate-700">
                                {formatDate(memo.dateIssued)}
                              </p>
                            </td>

                            <td className="px-5 py-4 align-top">
                              <p className="font-bold text-slate-700">
                                {memo.issuingOffice}
                              </p>
                            </td>

                            <td className="px-5 py-4 align-top">
                              <div className="flex justify-center gap-2">
                                {memoLink ? (
                                  <>
                                    <a
                                      href={memoLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="rounded-lg bg-[#0F4C5C] px-4 py-2 text-sm font-black text-white transition hover:bg-[#0B3B48]"
                                    >
                                      View
                                    </a>

                                    <a
                                      href={memoLink}
                                      download
                                      className="rounded-lg border border-[#0F4C5C]/30 bg-white px-4 py-2 text-sm font-black text-[#0F4C5C] transition hover:bg-[#ECFDF5]"
                                    >
                                      Download
                                    </a>
                                  </>
                                ) : (
                                  <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500">
                                    No file
                                  </span>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-10 text-center shadow-sm">
                <h3 className="text-2xl font-black text-slate-950">
                  No public memo found.
                </h3>
                <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
                  Try searching by memo number, title, category, date, or issuing
                  office. You may also clear the filter to view all public memos.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="mt-6 rounded-xl bg-yellow-300 px-6 py-3 font-black text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-200"
                >
                  Show All Memos
                </button>
              </div>
            )}
          </div>
        </section>

        {/* PUBLIC ACCESS NOTE */}
        <section className="bg-[#0F4C5C] px-6 py-20 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-black uppercase tracking-widest text-yellow-300">
                Document Access Reminder
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                Public documents are shared for information and guidance.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-teal-50">
                This repository is intended to improve access to public school
                issuances. For certified copies, official records, or
                confidential documents, please coordinate directly with
                authorized school personnel.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur"
            >
              <h3 className="text-2xl font-black">Need Assistance?</h3>
              <p className="mt-3 leading-7 text-teal-50">
                For memo verification, records concerns, or school-related
                inquiries, use the official school communication channels.
              </p>

              <div className="mt-6 grid gap-4">
                <a
                  href="/#contact"
                  className="rounded-xl bg-white px-5 py-4 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-yellow-300 hover:text-slate-950"
                >
                  Contact the School
                </a>

                <a
                  href="https://m.me/tabunocnatlhs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/30 px-5 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#0F4C5C]"
                >
                  Chat on Messenger
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