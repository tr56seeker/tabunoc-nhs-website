"use client";

/**
 * FILE_ID: TABUNOC_PERSONNEL_CARD_COMPACT_PREVIEW
 * PATH: src/components/PersonnelCard.tsx
 * PURPOSE: Compact organization preview card with fixed 3:4 photo ratio.
 * DISPLAY:
 * - Name
 * - Position
 * - Department
 * - Designation, one line only with ellipsis when long
 */

import { useEffect, useState } from "react";
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
        className="line-clamp-2 text-base font-black leading-tight tracking-tight text-slate-950 transition group-hover:text-[#0F4C5C] dark:text-white dark:group-hover:text-yellow-300"
      >
        {value}
      </p>
    );
  }

  if (variant === "designation") {
    return (
      <p
        title={title || value}
        className="truncate text-xs font-semibold leading-snug text-slate-500 dark:text-stone-400"
      >
        {value}
      </p>
    );
  }

  if (variant === "muted") {
    return (
      <p
        title={title || value}
        className="truncate text-sm font-semibold leading-snug text-slate-600 dark:text-stone-300"
      >
        {value}
      </p>
    );
  }

  return (
    <p
      title={title || value}
      className="truncate text-sm font-bold leading-snug text-[#0F4C5C] dark:text-yellow-300"
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
  const designationPreview = getDesignationPreview(person);

  useEffect(() => {
    setFailedPhoto(null);
  }, [person.id, photoUrl]);

  const cardHeight = compact ? "h-[128px]" : "h-[136px]";
  const photoWidth = compact ? "w-[96px]" : "w-[102px]";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.22 }}
      onClick={() => onClick?.(person)}
      className={`group ${cardHeight} cursor-pointer overflow-hidden border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-[#292624] dark:bg-[#171614] dark:shadow-black/20`}
    >
      <div className="flex h-full">
        {/* Fixed 3:4 Photo */}
        <div className={`${photoWidth} h-full shrink-0 bg-[#0F4C5C]`}>
          {showPhoto ? (
            <img
              src={photoUrl}
              alt={person.name}
              onError={() => setFailedPhoto(photoUrl)}
              className="h-full w-full object-cover object-[50%_20%]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0F4C5C] text-2xl font-black text-white">
              {initials}
            </div>
          )}
        </div>

        {/* Short Preview Information */}
        <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
          <div className="grid min-w-0 gap-1.5">
            <PreviewLine value={person.name} variant="name" />
            <PreviewLine value={safeText(person.position)} />
            <PreviewLine value={safeText(person.department)} variant="muted" />
            <PreviewLine
              value={designationPreview}
              variant="designation"
              title={designationPreview}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}