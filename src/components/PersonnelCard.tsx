"use client";

/**
 * FILE_ID: TABUNOC_PERSONNEL_CARD_COMPACT_PREVIEW
 * PATH: src/components/PersonnelCard.tsx
 * PURPOSE: Minimal organization directory list card with fixed 3:4 portrait photo.
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
        className="line-clamp-2 text-base font-black leading-tight text-slate-950 transition group-hover:text-slate-900 dark:text-white sm:text-[17px]"
      >
        {value}
      </p>
    );
  }

  if (variant === "designation") {
    return (
      <p
        title={title || value}
        className="line-clamp-1 text-xs font-semibold leading-snug text-slate-500 dark:text-stone-400"
      >
        {value}
      </p>
    );
  }

  if (variant === "muted") {
    return (
      <p
        title={title || value}
        className="line-clamp-2 text-xs font-medium leading-snug text-slate-500 dark:text-stone-400"
      >
        {value}
      </p>
    );
  }

  return (
    <p
      title={title || value}
      className="line-clamp-1 text-xs font-semibold leading-snug text-slate-500 dark:text-stone-400"
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

  const photoSize =
    "h-[112px] w-[84px] md:h-[128px] md:w-[96px] lg:h-[144px] lg:w-[108px]";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.22 }}
      onClick={() => onClick?.(person)}
      className="group cursor-pointer overflow-hidden rounded-xl bg-white transition duration-200 hover:bg-slate-50 dark:bg-[#171614] dark:hover:bg-[#1f1d1a]"
    >
      <div className="flex min-h-[128px] gap-3 p-2.5 sm:gap-4 sm:p-3 md:min-h-[144px] lg:min-h-[160px]">
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
            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xl font-black text-slate-600 dark:bg-[#292624] dark:text-stone-300">
              {initials}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-1">
          <div className="grid min-w-0 gap-1.5">
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

          <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold leading-none text-slate-700 transition group-hover:bg-slate-200 dark:bg-[#292624] dark:text-stone-200 dark:group-hover:bg-[#34302b]">
            View Details
          </span>
        </div>
      </div>
    </motion.article>
  );
}
