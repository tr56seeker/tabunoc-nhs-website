"use client";

/**
 * FILE_ID: TABUNOC_PERSONNEL_CARD_COMPACT_PREVIEW
 * PATH: src/components/PersonnelCard.tsx
 * PURPOSE: Minimal organization directory list card with fixed responsive size.
 * DISPLAY:
 * - Name
 * - Position
 * - Department
 * - Details action
 */

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import type { Personnel } from "@/data/organization";

type PersonnelCardProps = {
  person: Personnel;
  compact?: boolean;
  displayContext?:
    | "programCoordinator"
    | "gradeLeader"
    | "classAdviser"
    | "subjectTeacher"
    | "guidance"
    | "default";
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
  displayName?: string;
  designation1?: string;
  designation2?: string;
  designation3?: string;
  subjectArea?: string | string[];
  primarySubjectDepartment?: string;
  subjectDepartment?: string;
  teachingLevel?: string;
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

function getFirstMeaningfulText(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => safeText(item)).find(isMeaningfulText) ?? "";
  }

  return safeText(value);
}

function uniqueList(items: Array<string | undefined | null>) {
  return Array.from(
    new Set(items.map((item) => safeText(item)).filter(isMeaningfulText))
  );
}

function getDepartmentPreview(person: Personnel) {
  const extendedPerson = person as ExtendedPersonnel;

  const department =
    safeText(person.department) ||
    getFirstMeaningfulText(extendedPerson.subjectArea) ||
    getFirstMeaningfulText(person.subjectTaught);

  if (isMeaningfulText(department)) {
    return department;
  }

  if (person.roles.includes("Principal")) {
    return "School Administration";
  }

  if (
    person.roles.includes("Administrative") ||
    person.roles.includes("Guidance")
  ) {
    return "Administrative Staff";
  }

  if (person.roles.includes("Support Personnel")) {
    return "Support Staff";
  }

  return safeText(person.group);
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

function getDesignationItems(person: Personnel) {
  const position = safeText(person.position).toLowerCase();

  return uniqueList(person.designation || []).filter(
    (designation) => designation.toLowerCase() !== position
  );
}

function getDesignation1(person: Personnel) {
  const extendedPerson = person as ExtendedPersonnel;

  return safeText(extendedPerson.designation1) || safeText(person.designation?.[0]);
}

function getProgramCoordinatorPreview(person: Personnel) {
  const coordinatorText = uniqueList(person.coordinatorship || []).join(", ");

  if (coordinatorText) {
    return coordinatorText;
  }

  return getDesignationItems(person).join(", ");
}

function getGradeLeaderPreview(person: Personnel) {
  return getDesignation1(person);
}

function getClassAdviserPreview(person: Personnel) {
  return uniqueList([safeText(person.position), getDesignation1(person)]).join(
    " / "
  );
}

function getGuidanceDesignation(person: Personnel) {
  const extendedPerson = person as ExtendedPersonnel;

  return (
    safeText(extendedPerson.designation1) ||
    safeText(extendedPerson.designation2) ||
    safeText(extendedPerson.designation3) ||
    safeText(person.position)
  );
}

function getGuidanceDepartment(person: Personnel) {
  const extendedPerson = person as ExtendedPersonnel;

  return (
    safeText(person.department) ||
    getFirstMeaningfulText(extendedPerson.subjectArea) ||
    "Guidance Office"
  );
}

function getCardSummary(
  person: Personnel,
  displayContext: NonNullable<PersonnelCardProps["displayContext"]>
) {
  const extendedPerson = person as ExtendedPersonnel;
  const name = safeText(extendedPerson.displayName) || safeText(person.name);
  const defaultSummary = {
    name,
    line2: safeText(person.position),
    line3: getDepartmentPreview(person),
    line4: "",
  };

  if (displayContext === "programCoordinator") {
    return {
      name,
      line2: getProgramCoordinatorPreview(person),
      line3: "",
      line4: "",
    };
  }

  if (displayContext === "gradeLeader") {
    return {
      name,
      line2: getGradeLeaderPreview(person),
      line3: getDepartmentPreview(person),
      line4: "",
    };
  }

  if (displayContext === "classAdviser") {
    return {
      name,
      line2: getClassAdviserPreview(person),
      line3: getAdvisoryText(person),
      line4: getDepartmentPreview(person),
    };
  }

  if (displayContext === "subjectTeacher") {
    const extendedPerson = person as ExtendedPersonnel;
    const subjectHandled =
      getFirstMeaningfulText(person.subjectTaught) || safeText(person.position);

    return {
      name,
      line2: subjectHandled,
      line3: safeText(extendedPerson.teachingLevel),
      line4: "",
    };
  }

  if (displayContext === "guidance") {
    return {
      name,
      line2: getGuidanceDesignation(person),
      line3: getGuidanceDepartment(person),
      line4: "",
    };
  }

  return defaultSummary;
}

function PreviewLine({
  value,
  variant = "normal",
  title,
}: {
  value: string;
  variant?: "name" | "normal" | "muted" | "designation" | "subjectTeacher";
  title?: string;
}) {
  if (!isMeaningfulText(value)) return null;

  if (variant === "name") {
    return (
      <p
        title={title || value}
        className="line-clamp-2 break-words text-[15px] font-black leading-snug text-slate-950 transition group-hover:text-slate-900 dark:text-white sm:text-base"
      >
        {value}
      </p>
    );
  }

  if (variant === "designation") {
    return (
      <p
        title={title || value}
        className="line-clamp-1 break-words text-[12px] font-semibold leading-5 text-slate-600 dark:text-stone-300 sm:text-[13px]"
      >
        {value}
      </p>
    );
  }

  if (variant === "muted") {
    return (
      <p
        title={title || value}
        className="line-clamp-1 break-words text-[12px] font-semibold leading-5 text-slate-500 dark:text-stone-400 sm:text-[13px]"
      >
        {value}
      </p>
    );
  }

  if (variant === "subjectTeacher") {
    return (
      <p
        title={title || value}
        className="truncate text-[12px] font-semibold leading-5 text-slate-600 dark:text-stone-300 sm:text-[13px]"
      >
        {value}
      </p>
    );
  }

  return (
    <p
      title={title || value}
      className="line-clamp-1 break-words text-[12px] font-semibold leading-5 text-slate-600 dark:text-stone-300 sm:text-[13px]"
    >
      {value}
    </p>
  );
}

export default function PersonnelCard({
  person,
  compact = false,
  displayContext = "default",
  onClick,
}: PersonnelCardProps) {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);

  const cardSummary = getCardSummary(person, displayContext);
  const photoUrl = getPhotoUrl(person);
  const showPhoto = photoUrl && failedPhoto !== photoUrl;
  const initials = getInitials(cardSummary.name);
  const isSubjectTeacher = displayContext === "subjectTeacher";

  const cardSize = compact
    ? "mx-auto h-[8.5rem] w-full max-w-[24rem] sm:h-[9rem] sm:w-[23.5rem] sm:max-w-none md:h-[9.75rem] md:w-[24rem] lg:h-[10.5rem] lg:w-[22rem]"
    : "mx-auto h-[8.5rem] w-full max-w-[24rem] sm:h-[9rem] sm:w-[23.5rem] sm:max-w-none md:h-[9.75rem] md:w-[24rem] lg:h-[10.5rem] lg:w-[22rem]";

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
      <div className="flex h-full items-center gap-4 p-4">
        <div
          className={`relative ${photoSize} shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-[#292624]`}
        >
          {showPhoto ? (
            <Image
              src={photoUrl}
              alt={cardSummary.name}
              width={102}
              height={136}
              sizes="(max-width: 640px) 78px, (max-width: 768px) 84px, (max-width: 1024px) 93px, 102px"
              onError={() => setFailedPhoto(photoUrl)}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-lg font-black text-slate-600 dark:bg-[#292624] dark:text-stone-300 sm:text-xl">
              {initials}
            </div>
          )}
        </div>

        <div className={`flex min-w-0 flex-1 flex-col justify-end ${contentHeight}`}>
          <div className="grid min-w-0 gap-0.5 overflow-hidden">
            <PreviewLine value={cardSummary.name} variant="name" />

            <PreviewLine
              value={cardSummary.line2}
              variant={isSubjectTeacher ? "subjectTeacher" : "designation"}
              title={cardSummary.line2}
            />

            <PreviewLine
              value={cardSummary.line3}
              variant={isSubjectTeacher ? "subjectTeacher" : "muted"}
              title={cardSummary.line3}
            />

            <PreviewLine
              value={cardSummary.line4}
              variant="muted"
              title={cardSummary.line4}
            />
          </div>

          <span className="mt-2 inline-flex w-fit shrink-0 items-center rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold leading-none text-slate-700 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-[#24313E] group-hover:text-[#ffdf20] group-hover:shadow-md dark:bg-[#292624] dark:text-stone-200 dark:group-hover:bg-[#24313E] dark:group-hover:text-[#ffdf20]">
            View Details
          </span>
        </div>
      </div>
    </motion.article>
  );
}
