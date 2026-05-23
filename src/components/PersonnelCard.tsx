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
      className="group relative h-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-[#0F4C5C]/40 hover:bg-[#FAFCFC] hover:shadow-md"
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
            className={`leading-tight tracking-tight text-slate-950 ${
              compact
                ? "text-base font-bold"
                : "text-lg font-extrabold"
            }`}
          >
            {person.name}
          </h3>

          {positionDesignation && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Position/Designation
              </p>
              <p className="mt-1 text-sm font-medium leading-snug text-[#123C9C]">
                {positionDesignation}
              </p>
            </div>
          )}

          {subjectText && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Subject Taught
              </p>
              <p className="mt-1 text-sm font-medium leading-snug text-[#0F4C5C]">
                {subjectText}
              </p>
            </div>
          )}

          {person.department && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Department
              </p>
              <p className="mt-1 text-sm font-medium leading-snug text-slate-700">
                {person.department}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SOFT HOVER TINT */}
      <div className="pointer-events-none absolute inset-0 bg-[#0F4C5C]/[0.025] opacity-0 transition duration-300 group-hover:opacity-100" />
    </motion.article>
  );
}
