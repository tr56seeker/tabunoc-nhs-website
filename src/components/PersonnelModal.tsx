"use client";

/**
 * FILE_ID: TABUNOC_PERSONNEL_MODAL_SPLIT_CARD_FIXED_SIZE
 * PATH: src/components/PersonnelModal.tsx
 * PURPOSE: Fixed-size split-card personnel modal using CSV/Excel roster data.
 * DESIGN:
 * - Fixed modal size across personnel profiles
 * - Left photo keeps 3:4 ratio and stays steady
 * - Right white information panel uses real draggable scrollbar
 * - Scrollbar rail uses #eff3f7
 * - Sharp 90-degree modal edges
 * - Red edge close button
 * - Hides N/A/blank fields
 * - Retains teachingPhilosophy from Excel/CSV source
 */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Personnel } from "@/data/organization";

type PersonnelModalProps = {
  person: Personnel | null;
  onClose: () => void;
};

type ExtendedPersonnel = Personnel & {
  photoUrl?: string;
  image?: string;
  avatar?: string;
  photo?: string;
  imageUrl?: string;
  profileImage?: string;
  profilePhoto?: string;
  email?: string;
  messenger?: string;
  consultationSchedule?: string;
  teachingPhilosophy?: string;
  philosophy?: string;
};

type DetailField = {
  label: string;
  value: string;
  wide?: boolean;
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

function displayList(value?: string[]) {
  if (!value || value.length === 0) return "";
  return uniqueList(value).join(", ");
}

function normalizeMessengerLink(link?: string) {
  const cleanLink = safeText(link);
  if (!cleanLink) return "";

  if (cleanLink.startsWith("https://")) return cleanLink;
  if (cleanLink.startsWith("http://")) return cleanLink;
  if (cleanLink.startsWith("m.me/")) return `https://${cleanLink}`;

  return `https://m.me/${cleanLink}`;
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

function getAdvisorySections(person: Personnel) {
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

function getFormattedPositionDesignation(person: Personnel) {
  const advisoryText = getAdvisorySections(person);
  const designations = uniqueList(person.designation || []);

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

  return uniqueList([
    person.position,
    ...cleanedDesignations,
    classAdviserText,
  ]).join(" / ");
}

function getProfileNote(person: Personnel) {
  const possibleNotes = [person.bio, person.description]
    .map((item) => safeText(item))
    .filter(isMeaningfulText);

  if (possibleNotes.length === 0) return "";

  const positionDesignation =
    getFormattedPositionDesignation(person).toLowerCase();
  const department = safeText(person.department).toLowerCase();
  const group = safeText(person.group).toLowerCase();
  const subjects = displayList(person.subjectTaught).toLowerCase();

  const cleanNotes = possibleNotes.filter((note) => {
    const normalizedNote = note.toLowerCase();

    return (
      normalizedNote !== positionDesignation &&
      normalizedNote !== department &&
      normalizedNote !== group &&
      normalizedNote !== subjects
    );
  });

  return cleanNotes[0] || "";
}

function DetailFieldCard({ label, value, wide }: DetailField) {
  return (
    <div
      className={`bg-slate-200/70 px-5 py-4 ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default function PersonnelModal({
  person,
  onClose,
}: PersonnelModalProps) {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);

  useEffect(() => {
    setFailedPhoto(null);
  }, [person?.id]);

  useEffect(() => {
    if (!person) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [person, onClose]);

  const extendedPerson = person as ExtendedPersonnel | null;

  const photoUrl = person ? getPhotoUrl(person) : "";
  const showPhoto = Boolean(person && photoUrl && failedPhoto !== photoUrl);

  const messengerLink = extendedPerson
    ? normalizeMessengerLink(extendedPerson.messenger)
    : "";

  const positionDesignation = person
    ? getFormattedPositionDesignation(person)
    : "";

  const detailFields = useMemo<DetailField[]>(() => {
    if (!person) return [];

    const extended = person as ExtendedPersonnel;

    const subjectTaught = displayList(person.subjectTaught);
    const coordinatorship = displayList(person.coordinatorship);
    const advisoryText = getAdvisorySections(person);
    const gradeLevelTaught = displayList(person.gradeLevelTaught);
    const sectionsHandled = displayList(person.sectionsHandled);
    const profileNote = getProfileNote(person);

    const teachingPhilosophy =
      safeText(extended.teachingPhilosophy) || safeText(extended.philosophy);

    const group =
      safeText(person.group).toLowerCase() !==
      safeText(person.department).toLowerCase()
        ? safeText(person.group)
        : "";

    return [
      {
        label: "Full Name",
        value: person.name,
      },
      {
        label: "Department",
        value: safeText(person.department),
      },
      {
        label: "Position / Designation",
        value: positionDesignation,
        wide: true,
      },
      {
        label: "Personnel Group",
        value: group,
      },
      {
        label: "Subject Taught",
        value: subjectTaught,
      },
      {
        label: "Program / Coordinatorship",
        value: coordinatorship,
        wide: true,
      },
      {
        label: "Class Advisory",
        value: advisoryText,
      },
      {
        label: "Grade Level Taught",
        value: advisoryText ? "" : gradeLevelTaught,
      },
      {
        label: "Sections Handled",
        value: advisoryText ? "" : sectionsHandled,
      },
      {
        label: "Teaching Philosophy",
        value: teachingPhilosophy,
        wide: true,
      },
      {
        label: "Consultation Schedule",
        value: safeText(extended.consultationSchedule),
      },
      {
        label: "Email",
        value: safeText(extended.email),
      },
      {
        label: "Profile Note",
        value: profileNote,
        wide: true,
      },
    ].filter((field) => isMeaningfulText(field.value));
  }, [person, positionDesignation]);

  return (
    <AnimatePresence>
      {person && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <style jsx global>{`
            .personnel-modal-scroll {
              scrollbar-width: auto;
              scrollbar-color: #9aa6b2 #eff3f7;
              scrollbar-gutter: stable;
            }

            .personnel-modal-scroll::-webkit-scrollbar {
              width: 48px;
            }

            .personnel-modal-scroll::-webkit-scrollbar-track {
              background: #eff3f7;
            }

            .personnel-modal-scroll::-webkit-scrollbar-thumb {
              background: #9aa6b2;
              border: 16px solid #eff3f7;
              border-radius: 999px;
            }

            .personnel-modal-scroll::-webkit-scrollbar-thumb:hover {
              background: #74808d;
            }

            .personnel-modal-scroll::-webkit-scrollbar-button {
              display: none;
              width: 0;
              height: 0;
            }
          `}</style>

          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
            className="relative h-[400px] max-h-[82vh] w-full max-w-[980px] overflow-hidden bg-white text-slate-950 shadow-2xl"
          >
            {/* Edge Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close personnel profile"
              className="absolute right-0 top-0 z-40 flex h-12 w-12 items-center justify-center bg-red-600 text-white shadow-md transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
            >
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="flex h-full w-full flex-col md:flex-row">
              {/* Fixed 3:4 Photo Panel */}
              <aside className="shrink-0 bg-[#0F4C5C] md:h-full md:w-[300px]">
                <div className="aspect-[3/4] h-full w-full overflow-hidden bg-[#0F4C5C]">
                  {showPhoto ? (
                    <img
                      src={photoUrl}
                      alt={person.name}
                      onError={() => setFailedPhoto(photoUrl)}
                      className="h-full w-full object-cover object-[50%_20%]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#0F4C5C] text-5xl font-black text-white">
                      {getInitials(person.name)}
                    </div>
                  )}
                </div>
              </aside>

              {/* Scrollable White Information Panel */}
              <section className="personnel-modal-scroll min-h-0 flex-1 overflow-y-auto px-5 py-6 pr-2 md:px-8 md:py-8 md:pr-4">
                <div className="mb-6">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0F4C5C]">
                    Personnel Profile
                  </p>

                  <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-slate-950 md:text-3xl">
                    {person.name}
                  </h2>

                  {positionDesignation && (
                    <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-[#0F4C5C]">
                      {positionDesignation}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {detailFields.map((field) => (
                    <DetailFieldCard
                      key={`${field.label}-${field.value}`}
                      label={field.label}
                      value={field.value}
                      wide={field.wide}
                    />
                  ))}
                </div>

                {(extendedPerson?.email || messengerLink) && (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    {extendedPerson?.email && (
                      <a
                        href={`mailto:${extendedPerson.email}`}
                        className="bg-[#0F4C5C] px-5 py-3 text-center text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#146577]"
                      >
                        Send Email
                      </a>
                    )}

                    {messengerLink && (
                      <a
                        href={messengerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-200 px-5 py-3 text-center text-sm font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-slate-300"
                      >
                        Message on Messenger
                      </a>
                    )}
                  </div>
                )}
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}