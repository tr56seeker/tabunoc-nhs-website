"use client";

import { useState } from "react";
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

  const designations = person.designation || [];
  const advisoryText = getAdvisoryText(person);

  const hasClassAdviser =
    designations.some(
      (designation) => designation.trim().toLowerCase() === "class adviser"
    ) || advisoryText !== "";

  const cleanedDesignations = designations.filter(
    (designation) => designation.trim().toLowerCase() !== "class adviser"
  );

  if (cleanedDesignations.length > 0) {
    parts.push(...cleanedDesignations);
  }

  if (hasClassAdviser) {
    parts.push(
      advisoryText ? `Class Adviser, ${advisoryText}` : "Class Adviser"
    );
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
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  const showPhoto = person.photo && failedPhoto !== person.photo;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{}}
      transition={{ duration: 0.25 }}
      onClick={() => onClick?.(person)}
      className="group relative h-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.01] dark:border-[#292624] dark:bg-[#171614] dark:shadow-black/20"
    >
      <div className="flex h-full">
        {/* LEFT PHOTO BLOCK */}
        <div className="w-[132px] shrink-0 bg-[#0F4C5C]">
          {showPhoto ? (
            <img
              src={person.photo}
              alt={person.name}
              onError={() => setFailedPhoto(person.photo ?? null)}
              className="h-full w-full object-cover object-[50%_20%]"
            />
          ) : (
            <div className="flex h-full min-h-[132px] w-full items-center justify-center bg-[#0F4C5C] text-2xl font-semibold text-white">
              {initials}
            </div>
          )}
        </div>

        {/* RIGHT CONTENT */}
        <div className="relative flex flex-1 flex-col justify-center px-5 py-4">
          <h3
            className={`leading-tight tracking-tight text-slate-950 transition group-hover:text-[#0F4C5C] dark:text-white dark:group-hover:text-yellow-300 ${
              compact ? "text-base font-bold" : "text-lg font-extrabold"
            }`}
          >
            {person.name}
          </h3>

          {positionDesignation && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Position/Designation
              </p>
              <p className="mt-1 text-sm font-medium leading-snug text-[#123C9C] dark:text-yellow-300">
                {positionDesignation}
              </p>
            </div>
          )}

          {subjectText && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Subject Taught
              </p>
              <p className="mt-1 text-sm font-medium leading-snug text-[#0F4C5C] dark:text-stone-200">
                {subjectText}
              </p>
            </div>
          )}

          {person.department && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Department
              </p>
              <p className="mt-1 text-sm font-medium leading-snug text-slate-700 dark:text-stone-300">
                {person.department}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}