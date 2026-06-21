"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { memoCategories, memos, type MemoCategory } from "@/data/memos";

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

      <main className="min-h-screen bg-white dark:bg-[#0a0908] text-slate-950 dark:text-white">
        {/* HERO */}
          <PageHeader
            eyebrow="Official School Repository"
            title="School Memos and Issuances"
            description="Search, view, and access public school memoranda, advisories, and issuances of Tabunoc National High School."
          >
              <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white/95 p-5 text-left shadow-[0_18px_45px_rgba(15,23,42,0.08)] md:p-6">
                <div className="grid gap-4 lg:grid-cols-[1fr_220px_180px]">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by memo number, title, category, or issuing office..."
                    className="w-full rounded-xl border border-slate-300 dark:border-[#292624] bg-white dark:bg-[#171614] px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0F4C5C] focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50"
                  />

                  <select
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value as "All" | MemoCategory)
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-[#292624] bg-white dark:bg-[#171614] px-5 py-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition focus:border-[#0F4C5C] focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50"
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
                    className="w-full rounded-xl border border-slate-300 dark:border-[#292624] bg-white dark:bg-[#171614] px-5 py-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition focus:border-[#0F4C5C] focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50"
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
                  <p className="pl-5 text-sm font-bold text-slate-600 dark:text-stone-300">
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
                      className="w-fit rounded-lg bg-slate-100 dark:bg-[#292624] py-2 pl-5 pr-4 text-sm font-semibold text-slate-700 dark:text-stone-200 transition hover:text-[#0F4C5C] dark:hover:text-yellow-300 md:px-4"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
          </PageHeader>


        {/* MEMO LIST */}
        <section className="bg-white dark:bg-[#0a0908] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            {visibleMemos.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#292624] bg-white dark:bg-[#171614] shadow-sm dark:shadow-black/20">
                <div className="border-b border-slate-200 dark:border-[#292624] bg-[#F8FAFC] dark:bg-[#171614] px-5 py-4">
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                    Public Memo List
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-stone-300">
                    Click â€œViewâ€ or â€œDownloadâ€ to access the available memo file.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[980px] w-full border-collapse text-left">
                    <thead className="bg-[#0F4C5C] text-white">
                      <tr>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-widest">
                          Memo No.
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-widest">
                          Title
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-widest">
                          Category
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-widest">
                          Date Issued
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-widest">
                          Issuing Office
                        </th>
                        <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-widest">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 dark:divide-[#292624]">
                      {visibleMemos.map((memo, index) => {
                        const memoLink = getMemoFileLink(memo);

                        return (
                          <motion.tr
                            key={`${memo.memoNumber}-${memo.title}`}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                            className="bg-white transition hover:text-[#0F4C5C] dark:bg-[#171614] dark:hover:text-yellow-300"
                          >
                            <td className="whitespace-nowrap px-5 py-4 align-top">
                              <p className="font-semibold text-[#0F4C5C] dark:text-yellow-300">
                                {memo.memoNumber}
                              </p>
                            </td>

                            <td className="px-5 py-4 align-top">
                              <p className="font-semibold leading-snug text-slate-950 dark:text-white">
                                {memo.title}
                              </p>
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-stone-300">
                                {memo.description}
                              </p>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 align-top">
                              <span className="inline-flex rounded-lg bg-[#ECFDF5] dark:bg-[#171614] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300">
                                {memo.category}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 align-top">
                              <p className="font-bold text-slate-700 dark:text-stone-200">
                                {formatDate(memo.dateIssued)}
                              </p>
                            </td>

                            <td className="px-5 py-4 align-top">
                              <p className="font-bold text-slate-700 dark:text-stone-200">
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
                                      className="rounded-lg bg-[#0F4C5C] px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:scale-[1.01]"
                                    >
                                      View
                                    </a>

                                    <a
                                      href={memoLink}
                                      download
                                      className="rounded-lg border border-[#0F4C5C]/30 bg-white dark:bg-[#171614] px-4 py-2 text-sm font-semibold text-[#0F4C5C] dark:text-stone-100 transition hover:text-[#0F4C5C] dark:hover:text-yellow-300"
                                    >
                                      Download
                                    </a>
                                  </>
                                ) : (
                                  <span className="rounded-lg bg-slate-100 dark:bg-[#292624] px-4 py-2 text-sm font-bold text-slate-500 dark:text-stone-400">
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
              <div className="rounded-2xl border border-slate-200 dark:border-[#292624] bg-[#F8FAFC] dark:bg-[#171614] p-10 text-center shadow-sm dark:shadow-black/20">
                <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
                  No public memo found.
                </h3>
                <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600 dark:text-stone-300">
                  Try searching by memo number, title, category, date, or issuing
                  office. You may also clear the filter to view all public memos.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="mt-6 rounded-xl bg-yellow-300 px-6 py-3 font-semibold text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-200"
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
              <p className="text-sm font-semibold uppercase tracking-widest text-yellow-300">
                Document Access Reminder
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">
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
              className="rounded-2xl border border-[#292624] bg-[#171614] p-8"
            >
              <h3 className="text-2xl font-semibold">Need Assistance?</h3>
              <p className="mt-3 leading-7 text-teal-50">
                For memo verification, records concerns, or school-related
                inquiries, use the official school communication channels.
              </p>

              <div className="mt-6 grid gap-4">
                <Link
                  href="/#contact"
                  className="rounded-xl bg-white dark:bg-[#171614] px-5 py-4 font-semibold text-[#0F4C5C] dark:text-yellow-300 transition hover:-translate-y-1 hover:scale-[1.01] hover:text-[#0F4C5C] dark:hover:text-yellow-300"
                >
                  Contact the School
                </Link>

                <a
                  href="https://m.me/tabunocnatlhs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/30 px-5 py-4 font-semibold text-white transition hover:-translate-y-1 hover:text-yellow-300"
                >
                  Chat on Messenger
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}




