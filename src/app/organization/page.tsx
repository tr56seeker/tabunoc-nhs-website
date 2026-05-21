"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import PersonnelCard from "@/components/PersonnelCard";
import PersonnelModal from "@/components/PersonnelModal";

import type { Personnel, PersonnelRole } from "@/data/organization";

import {
  administrativePersonnel,
  allPersonnel,
  classAdvisers,
  gradeLeaders,
  gradeLevels,
  leadership,
  masterTeachers,
  programImplementers,
  subjectTeachers,
} from "@/data/organization";

const schoolLogo =
  "https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true";

const depedLogo =
  "https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png";

const roleFilters: Array<"All" | PersonnelRole> = [
  "All",
  "Principal",
  "Administrative",
  "Guidance",
  "Master Teacher",
  "Grade Leader",
  "SHS Coordinator",
  "Class Adviser",
  "Subject Teacher",
  "Program Implementer",
];

function getSearchableText(person: Personnel) {
  return [
    person.name,
    person.position,
    person.group,
    person.department,
    ...(person.roles || []),
    ...(person.subjectTaught || []),
    ...(person.coordinatorship || []),
    ...(person.advisory || []).map((item) => item.gradeLevel),
    ...(person.advisory || []).map((item) => item.section),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function OrganizationPage() {
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<"All" | PersonnelRole>("All");

  const visibleGradeLevels = useMemo(() => {
    if (selectedGrade === "All") return gradeLevels;
    return gradeLevels.filter((grade) => grade === selectedGrade);
  }, [selectedGrade]);

  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return allPersonnel.filter((person) => {
      const matchesRole =
        selectedRole === "All" || person.roles.includes(selectedRole);

      const matchesSearch =
        query === "" || getSearchableText(person).includes(query);

      return matchesRole && matchesSearch;
    });
  }, [searchTerm, selectedRole]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white">
        
        {/* HERO */}
          <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 px-6 pb-20 pt-36 text-slate-950">
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
                School Directory
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="mx-auto mt-4 max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl"
              >
                School Administration, Faculty, and Staff
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="mx-auto mt-5 max-w-3xl text-lg leading-7 text-slate-700"
              >
                Meet the school administration, faculty members, advisers, coordinators,
                and support personnel of Tabunoc National High School.
              </motion.p>
            </div>
          </section>

        {/* SEARCH AND FILTER */}
        <section className="bg-[#F8FAFC] px-6 py-16 text-slate-950">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                Faculty and Personnel Directory
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Search the School Directory
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
                Search by name, section, role, subject taught, position, or
                coordinatorship.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, section, subject, or coordinatorship..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                />

                <select
                  value={selectedRole}
                  onChange={(event) =>
                    setSelectedRole(event.target.value as "All" | PersonnelRole)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                >
                  {roleFilters.map((role) => (
                    <option key={role} value={role}>
                      {role === "All" ? "All Roles" : role}
                    </option>
                  ))}
                </select>
              </div>

              {(searchTerm.trim() !== "" || selectedRole !== "All") && (
                <div className="mt-6">
                  <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <p className="text-sm font-bold text-slate-600">
                      {searchResults.length} result
                      {searchResults.length !== 1 ? "s" : ""} found
                    </p>

                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedRole("All");
                      }}
                      className="w-fit rounded-lg bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-950 hover:text-white"
                    >
                      Clear Search
                    </button>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="grid gap-5 lg:grid-cols-2">
                      {searchResults.map((person) => (
                        <PersonnelCard
                          key={person.id}
                          person={person}
                          compact
                          onClick={setSelectedPerson}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-slate-100 p-8 text-center">
                      <p className="font-bold text-slate-700">
                        No matching personnel found.
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        Try searching by surname, grade level, section, subject,
                        or role.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TOP LEADERSHIP */}
        <section className="bg-white px-6 py-20 text-slate-950">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                School Leadership
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                School Leadership and Support Personnel
              </h2>
            </div>

            <div className="mx-auto max-w-3xl">
              {leadership.map((person) => (
                <PersonnelCard
                  key={person.id}
                  person={person}
                  onClick={setSelectedPerson}
                />
              ))}
            </div>

            <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-2">
              {administrativePersonnel.map((person) => (
                <PersonnelCard
                  key={person.id}
                  person={person}
                  compact
                  onClick={setSelectedPerson}
                />
              ))}
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {masterTeachers.map((person) => (
                <PersonnelCard
                  key={person.id}
                  person={person}
                  onClick={setSelectedPerson}
                />
              ))}
            </div>
          </div>
        </section>

        {/* GRADE LEADERS */}
        <section className="bg-slate-100 px-6 py-20 text-slate-950">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                Grade Level Leadership
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Grade Leaders
              </h2>
            </div>

            <div className="mx-auto grid max-w-5xl items-stretch gap-5 md:grid-cols-2">
              {gradeLeaders.map((person) => (
                <PersonnelCard
                  key={person.id}
                  person={person}
                  compact
                  onClick={setSelectedPerson}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CLASS ADVISERS */}
        <section className="bg-white px-6 py-20 text-slate-950">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                Class Advisers
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Class Advisers
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
                Select a grade level to view assigned class advisers.
              </p>
            </div>

            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {["All", ...gradeLevels].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                    selectedGrade === grade
                      ? "bg-blue-950 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-yellow-300 hover:text-slate-950"
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>

            <div className="grid gap-8">
              {visibleGradeLevels.map((grade) => {
                const advisers = classAdvisers.filter((person) =>
                  person.advisory?.some((item) => item.gradeLevel === grade)
                );

                return (
                  <motion.div
                    key={grade}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-6"
                  >
                    <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                      <div>
                        <h3 className="text-3xl font-black text-slate-950">
                          {grade}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {advisers.length} adviser profile
                          {advisers.length > 1 ? "s" : ""}
                        </p>
                      </div>

                      <span className="w-fit rounded-lg bg-blue-950 px-4 py-2 text-sm font-bold text-white">
                        {grade}
                      </span>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                      {advisers.map((person) => (
                        <PersonnelCard
                          key={`${grade}-${person.id}`}
                          person={person}
                          compact
                          onClick={setSelectedPerson}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FUTURE EXPANSION */}
        <section className="bg-[#0F4C5C] px-6 py-20 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
                Expandable Directory
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Subject Teachers, Coordinators, and Support Roles
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
                This section is prepared for additional personnel, subject
                teachers, Program Implementers, committee chairpersons, and
                support units.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur">
                <h3 className="text-2xl font-black">Subject Teachers</h3>
                <p className="mt-3 text-slate-300">
                  Current entries: {subjectTeachers.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur">
                <h3 className="text-2xl font-black">Program Implementers</h3>
                <p className="mt-3 text-slate-300">
                  Current entries: {programImplementers.length}
                </p>
              </div>
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

      <PersonnelModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
    </>
  );
}