"use client";

/**
 * FILE_ID: TABUNOC_PERSONNEL_CARD_COMPACT_PREVIEW
 * PATH: src/components/PersonnelCard.tsx
 * PURPOSE: Minimal organization directory list card with fixed responsive size.
 * DISPLAY:
 * - Name
 * - Position/designation
 * - Advisory/subject/details
 * - Details action
 */

import { useState } from "react";
import { motion } from "framer-motion";
import type { Personnel } from "@/data/organization";

type PersonnelCardProps = {
  person: Personnel;
  compact?: boolean;
  onClick?: (person: Personnel) => void;
};

type ExtendedPersonnel = Personnel & {
  photo?: string;
  photoUrl?: string;
  image?: string;
  avatar?: string;
  imageUrl?: string;
  profileImage?: string;
  profilePhoto?: string;
};

function safeText(value: unknown) {
  return String(value ?? "").trim();
}

function isMeaningfulText(value: unknown) {
  const text = safeText(value).toLowerCase();

  return (
    text !== "" &&
    text !== "n/a" &&
    text !== "na" &&
    text !== "none" &&
    text !== "null" &&
    text !== "-"
  );
}

function uniqueList(items: Array<string | undefined | null>) {
  return Array.from(
    new Set(items.map((item) => safeText(item)).filter(isMeaningfulText))
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getPhotoUrl(person: Personnel) {
  const extendedPerson = person as ExtendedPersonnel;

  return (
    safeText(extendedPerson.photo) ||
    safeText(extendedPerson.photoUrl) ||
    safeText(extendedPerson.image) ||
    safeText(extendedPerson.avatar) ||
    safeText(extendedPerson.imageUrl) ||
    safeText(extendedPerson.profileImage) ||
    safeText(extendedPerson.profilePhoto)
  );
}

function getAdvisoryText(person: Personnel) {
  if (!person.advisory || person.advisory.length === 0) return "";

  return person.advisory
    .map((item) => {
      const gradeLevel = safeText(item.gradeLevel);
      const section = safeText(item.section).replace(/^\d+-/, "");

      if (!gradeLevel && !section) return "";
      if (!section) return gradeLevel;
      if (!gradeLevel) return section;

      return `${gradeLevel}-${section}`;
    })
    .filter(isMeaningfulText)
    .join(", ");
}

function getDesignationPreview(person: Personnel) {
  const position = safeText(person.position).toLowerCase();
  const advisoryText = getAdvisoryText(person);

  const designations = uniqueList(person.designation || []).filter(
    (designation) => designation.toLowerCase() !== position
  );

  const hasClassAdviser =
    advisoryText !== "" ||
    designations.some(
      (designation) => designation.toLowerCase() === "class adviser"
    );

  const cleanedDesignations = designations.filter(
    (designation) => designation.toLowerCase() !== "class adviser"
  );

  const classAdviserText =
    hasClassAdviser && advisoryText
      ? `Class Adviser, ${advisoryText}`
      : hasClassAdviser
        ? "Class Adviser"
        : "";

  return uniqueList([...cleanedDesignations, classAdviserText]).join(" / ");
}

function getDetailsPreview(person: Personnel) {
  const advisoryText = getAdvisoryText(person);

  if (advisoryText) {
    return advisoryText;
  }

  const subjectText = uniqueList(person.subjectTaught || []).join(", ");

  if (subjectText) {
    return subjectText;
  }

  const gradeText = uniqueList(person.gradeLevelTaught || []).join(", ");

  if (gradeText) {
    return gradeText;
  }

  const coordinatorText = uniqueList(person.coordinatorship || []).join(", ");

  if (coordinatorText) {
    return coordinatorText;
  }

  return safeText(person.department);
}

function getRolePreview(person: Personnel) {
  return uniqueList([safeText(person.position), getDesignationPreview(person)]).join(
    " / "
  );
}

function PreviewLine({
  value,
  variant = "normal",
  title,
}: {
  value: string;
  variant?: "name" | "normal" | "muted" | "designation";
  title?: string;
}) {
  if (!isMeaningfulText(value)) return null;

  if (variant === "name") {
    return (
      <p
        title={title || value}
        className="line-clamp-2 text-[15px] font-black leading-tight text-slate-950 transition group-hover:text-slate-900 dark:text-white sm:text-base lg:text-[17px]"
      >
        {value}
      </p>
    );
  }

  if (variant === "designation") {
    return (
      <p
        title={title || value}
        className="line-clamp-1 text-[11px] font-semibold leading-snug text-slate-500 dark:text-stone-400 sm:text-xs"
      >
        {value}
      </p>
    );
  }

  if (variant === "muted") {
    return (
      <p
        title={title || value}
        className="line-clamp-1 text-[11px] font-medium leading-snug text-slate-500 dark:text-stone-400 sm:text-xs"
      >
        {value}
      </p>
    );
  }

  return (
    <p
      title={title || value}
      className="line-clamp-1 text-[11px] font-semibold leading-snug text-slate-500 dark:text-stone-400 sm:text-xs"
    >
      {value}
    </p>
  );
}

export default function PersonnelCard({
  person,
  compact = false,
  onClick,
}: PersonnelCardProps) {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);

  const photoUrl = getPhotoUrl(person);
  const showPhoto = photoUrl && failedPhoto !== photoUrl;
  const initials = getInitials(person.name);
  const rolePreview = getRolePreview(person);
  const detailsPreview = getDetailsPreview(person);

  const cardSize = compact
    ? "mx-auto h-[9rem] w-full max-w-[20rem] sm:h-[9.75rem] sm:w-[20.5rem] sm:max-w-none md:h-[10.25rem] md:w-[21rem] lg:h-[10.75rem] lg:w-[22rem]"
    : "mx-auto h-[9rem] w-full max-w-[20rem] sm:h-[9.75rem] sm:w-[20.5rem] sm:max-w-none md:h-[10.25rem] md:w-[21rem] lg:h-[10.75rem] lg:w-[22rem]";

const photoSize =
  "h-[104px] w-[78px] sm:h-[112px] sm:w-[84px] md:h-[124px] md:w-[93px] lg:h-[136px] lg:w-[102px]";

const contentHeight =
  "h-[104px] sm:h-[112px] md:h-[124px] lg:h-[136px]";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.22 }}
      onClick={() => onClick?.(person)}
      className={`group cursor-pointer overflow-hidden rounded-xl bg-white transition duration-200 hover:bg-slate-50 dark:bg-[#171614] dark:hover:bg-[#1f1d1a] ${cardSize}`}
    >
      <div className="flex h-full gap-3 p-2.5 sm:gap-3.5 sm:p-3">
        <div
          className={`relative ${photoSize} shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-[#292624]`}
        >
          {showPhoto ? (
            <img
              src={photoUrl}
              alt={person.name}
              onError={() => setFailedPhoto(photoUrl)}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-lg font-black text-slate-600 dark:bg-[#292624] dark:text-stone-300 sm:text-xl">
              {initials}
            </div>
          )}
        </div>

        <div className={`flex min-w-0 flex-1 flex-col justify-between gap-2 overflow-hidden ${contentHeight}`}>
          <div className="grid min-w-0 gap-1.5 overflow-hidden">
            <PreviewLine value={person.name} variant="name" />

            <PreviewLine
              value={rolePreview}
              variant="designation"
              title={rolePreview}
            />

            <PreviewLine
              value={detailsPreview}
              variant="muted"
              title={detailsPreview}
            />
          </div>

          <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold leading-none text-slate-700 transition group-hover:bg-slate-200 dark:bg-[#292624] dark:text-stone-200 dark:group-hover:bg-[#34302b]">
            View Details
          </span>
        </div>
      </div>
    </motion.article>
  );
}