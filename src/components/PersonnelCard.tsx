"use client";

import { motion } from "framer-motion";
import type { Personnel } from "@/data/organization";

type PersonnelCardProps = {
  person: Personnel;
  compact?: boolean;
  onClick?: (person: Personnel) => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

function getAdvisoryText(person: Personnel) {
  if (!person.advisory || person.advisory.length === 0) return "";

  return person.advisory
    .map((item) => `${item.gradeLevel}-${item.section.replace(/^\d+-/, "")}`)
    .join(", ");
}

function getPositionDesignation(person: Personnel) {
  const parts: string[] = [];

  if (person.position) {
    parts.push(person.position);
  }

  if (person.designation && person.designation.length > 0) {
    parts.push(...person.designation);
  }

  const advisoryText = getAdvisoryText(person);

  if (advisoryText) {
    parts.push(advisoryText);
  }

  return Array.from(new Set(parts)).join(" / ");
}

function getSubjectText(person: Personnel) {
  if (!person.subjectTaught || person.subjectTaught.length === 0) return "";
  return person.subjectTaught.join(", ");
}

export default function PersonnelCard({
  person,
  compact = false,
  onClick,
}: PersonnelCardProps) {
  const initials = getInitials(person.name);
  const positionDesignation = getPositionDesignation(person);
  const subjectText = getSubjectText(person);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      onClick={() => onClick?.(person)}
      className="group relative h-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-[#0F4C5C]/60 hover:bg-[#F8FAFC] hover:shadow-md"
    >
      <div className="flex h-full">
        {/* LEFT FULL PHOTO BLOCK */}
        <div className="w-[132px] shrink-0 bg-[#0F4C5C]">
          {person.photo ? (
            <img
              src={person.photo}
              alt={person.name}
              className="h-full w-full object-cover object-[50%_20%]"
            />
          ) : (
            <div className="flex h-full min-h-[132px] w-full items-center justify-center bg-[#0F4C5C] text-2xl font-black text-white">
              {initials}
            </div>
          )}
        </div>

        {/* RIGHT CONTENT */}
        <div className="relative flex flex-1 flex-col justify-center px-5 py-4 pr-20">
          <span className="absolute right-4 top-4 rounded-full border border-[#0F4C5C]/15 bg-[#ECFDF5] px-3 py-1 text-xs font-black text-[#0F4C5C] opacity-0 shadow-sm transition duration-300 group-hover:opacity-100">
            View →
          </span>

          <h3
            className={`font-black leading-tight text-slate-950 ${
              compact ? "text-base" : "text-lg"
            }`}
          >
            {person.name}
          </h3>

          <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-500">
            Position/Designation
          </p>
          <p className="mt-0.5 text-sm font-bold leading-snug text-blue-800">
            {positionDesignation}
          </p>

          {subjectText && (
            <>
              <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-500">
                Subject Taught
              </p>
              <p className="mt-0.5 text-sm font-bold leading-snug text-[#0F4C5C]">
                {subjectText}
              </p>
            </>
          )}

          {person.department && (
            <>
              <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-500">
                Department
              </p>
              <p className="mt-0.5 text-sm font-bold leading-snug text-slate-700">
                {person.department}
              </p>
            </>
          )}
        </div>
      </div>

      {/* VERY SOFT HOVER TINT */}
      <div className="pointer-events-none absolute inset-0 bg-[#0F4C5C]/[0.03] opacity-0 transition duration-300 group-hover:opacity-100" />
    </motion.article>
  );
}