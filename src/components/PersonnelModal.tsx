"use client";

/**
 * FILE_ID: TABUNOC_PERSONNEL_MODAL_RESPONSIVE_PROFILE
 * PATH: src/components/PersonnelModal.tsx
 * PURPOSE: Responsive public-facing personnel profile modal using CSV/Excel roster data.
 * DESIGN:
 * - Desktop/tablet: fixed left profile panel + scrollable right details
 * - Mobile: horizontal profile header: Photo | Name, Position, Teaching Department, Designation
 * - 3:4 profile photo ratio
 * - No redundant information
 * - Hides N/A/blank fields
 * - Shows non-teaching personnel details properly
 * - Retains teachingPhilosophy from Excel/CSV source
 */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { Personnel } from "@/data/organization";

type PersonnelModalProps = {
  person: Personnel | null;
  onClose: () => void;
};

type ExtendedPersonnel = Personnel & {
  displayName?: string;
  photoUrl?: string;
  image?: string;
  avatar?: string;
  photo?: string;
  imageUrl?: string;
  profileImage?: string;
  profilePhoto?: string;

  subjectArea?: string;
  track?: string;
  subjectTaught?: string | string[];
  primarySubjectDepartment?: string;
  subjectDepartment?: string;
  subjectDepartment1?: string;
  subjectDepartment2?: string;
  subjectDepartment3?: string;
  subjectDepartment4?: string;
  subjectDepartment5?: string;

  email?: string;
  consultationSchedule?: string;
  contactNote?: string;

  facebook?: string;
  facebookUrl?: string;
  messenger?: string;
  linkedin?: string;
  linkedinUrl?: string;
  website?: string;
  portfolioUrl?: string;

  teachingPhilosophy?: string;
  professionalBelief?: string;
  philosophy?: string;
  bio?: string;
  description?: string;
  designation1?: string;
  designation2?: string;
  designation3?: string;
};

type DetailField = {
  label: string;
  value: string;
  wide?: boolean;
};

type SocialLink = {
  label: string;
  href: string;
  icon: "facebook" | "messenger" | "linkedin" | "website";
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

function displayFlexibleList(value: unknown) {
  if (Array.isArray(value)) {
    return uniqueList(value.map((item) => safeText(item))).join(", ");
  }

  return safeText(value);
}

function normalizeMessengerLink(link?: string) {
  const cleanLink = safeText(link);
  if (!cleanLink) return "";

  if (cleanLink.startsWith("https://")) return cleanLink;
  if (cleanLink.startsWith("http://")) return cleanLink;
  if (cleanLink.startsWith("m.me/")) return `https://${cleanLink}`;

  return `https://m.me/${cleanLink}`;
}

function normalizeWebsiteLink(link?: string) {
  const cleanLink = safeText(link);
  if (!cleanLink) return "";

  if (cleanLink.startsWith("https://")) return cleanLink;
  if (cleanLink.startsWith("http://")) return cleanLink;

  return `https://${cleanLink}`;
}

function normalizeFacebookLink(link?: string) {
  const cleanLink = safeText(link);
  if (!cleanLink) return "";

  if (cleanLink.startsWith("https://")) return cleanLink;
  if (cleanLink.startsWith("http://")) return cleanLink;
  if (cleanLink.startsWith("facebook.com/")) return `https://${cleanLink}`;
  if (cleanLink.startsWith("web.facebook.com/")) return `https://${cleanLink}`;

  return `https://facebook.com/${cleanLink}`;
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

function getDisplayName(person: Personnel) {
  return safeText((person as ExtendedPersonnel).displayName) || person.name;
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

function getPositionText(person: Personnel) {
  return safeText(person.position);
}

function getDesignationItems(person: Personnel) {
  const extended = person as ExtendedPersonnel;

  return uniqueList([
    ...(person.designation || []),
    extended.designation1,
    extended.designation2,
    extended.designation3,
  ]);
}

function getSummaryDesignationText(person: Personnel) {
  const position = getPositionText(person).toLowerCase();
  const advisory = getAdvisorySections(person);

  const designations = getDesignationItems(person)
    .filter((designation) => designation.toLowerCase() !== position)
    .filter((designation) => designation.toLowerCase() !== "class adviser");

  const advisoryText = advisory ? `Class Adviser, ${advisory}` : "";

  return uniqueList([...designations, advisoryText]).join(" / ");
}

function getTeachingDepartment(person: Personnel) {
  const department = safeText(person.department);
  const normalized = department.toLowerCase();

  if (
    normalized.includes("junior high school") ||
    normalized.includes("senior high school")
  ) {
    return department;
  }

  return "";
}

function getSubjectDepartments(person: Personnel) {
  const extended = person as ExtendedPersonnel;

  return uniqueList([
    extended.primarySubjectDepartment,
    extended.subjectDepartment,
    extended.subjectDepartment1,
    extended.subjectDepartment2,
    extended.subjectDepartment3,
    extended.subjectDepartment4,
    extended.subjectDepartment5,
  ]).join(", ");
}

function getTeachingPhilosophy(person: Personnel) {
  const extended = person as ExtendedPersonnel;
  return (
    safeText(extended.professionalBelief) ||
    safeText(extended.teachingPhilosophy) ||
    safeText(extended.philosophy)
  );
}

function getTeachingProfileFields(person: Personnel): DetailField[] {
  const extended = person as ExtendedPersonnel;
  const subjectTaught =
    displayList(person.subjectTaught) ||
    displayFlexibleList(extended.subjectTaught) ||
    safeText(extended.subjectArea);

  const trackOrDepartment =
    safeText(extended.track) ||
    getSubjectDepartments(person) ||
    safeText(person.department) ||
    getTeachingDepartment(person);

  return [
    {
      label: "Subject/s Taught",
      value: subjectTaught,
    },
    {
      label: "Track or Department",
      value: trackOrDepartment,
    },
    {
      label: "Advisory",
      value: getAdvisorySections(person),
    },
  ].filter((field) => isMeaningfulText(field.value));
}

function getAdditionalTaskFields(person: Personnel): DetailField[] {
  const position = getPositionText(person).toLowerCase();
  const advisory = getAdvisorySections(person);
  const designations = getDesignationItems(person)
    .filter((designation) => designation.toLowerCase() !== position)
    .filter((designation) => designation.toLowerCase() !== "class adviser");

  return [
    {
      label: "Coordinatorship / Designations",
      value: uniqueList(designations).join(", "),
      wide: true,
    },
    {
      label: "Advisory Assignment",
      value: advisory ? `Class Adviser, ${advisory}` : "",
      wide: true,
    },
  ].filter((field) => isMeaningfulText(field.value));
}

function getContactFields(person: Personnel): DetailField[] {
  const extended = person as ExtendedPersonnel;

  return [
    {
      label: "Email",
      value: safeText(extended.email),
    },
    {
      label: "Consultation Schedule",
      value: safeText(extended.consultationSchedule),
    },
    {
      label: "Contact Note",
      value: safeText(extended.contactNote),
      wide: true,
    },
    {
      label: "Messenger",
      value: safeText(extended.messenger),
    },
  ].filter((field) => isMeaningfulText(field.value));
}

function getSocialLinks(person: Personnel): SocialLink[] {
  const extended = person as ExtendedPersonnel;

  const facebook = normalizeFacebookLink(
    safeText(extended.facebookUrl) || safeText(extended.facebook)
  );

  const messenger = normalizeMessengerLink(extended.messenger);

  const linkedin = normalizeWebsiteLink(
    safeText(extended.linkedinUrl) || safeText(extended.linkedin)
  );

  const website = normalizeWebsiteLink(
    safeText(extended.website) || safeText(extended.portfolioUrl)
  );

  return [
    {
      label: "Facebook",
      href: facebook,
      icon: "facebook" as const,
    },
    {
      label: "Messenger",
      href: messenger,
      icon: "messenger" as const,
    },
    {
      label: "LinkedIn",
      href: linkedin,
      icon: "linkedin" as const,
    },
    {
      label: "Website",
      href: website,
      icon: "website" as const,
    },
  ].filter((link) => isMeaningfulText(link.href));
}

function SocialIcon({ icon }: { icon: SocialLink["icon"] }) {
  if (icon === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3V14h2.8v8h3.4Z" />
      </svg>
    );
  }

  if (icon === "messenger") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2C6.5 2 2.2 6 2.2 11.4c0 3.1 1.5 5.8 3.8 7.5V22l3.5-1.9c.8.2 1.6.3 2.5.3 5.5 0 9.8-4 9.8-9.4S17.5 2 12 2Zm1 12.6-2.5-2.7-4.9 2.7 5.4-5.8 2.5 2.7 4.9-2.7-5.4 5.8Z" />
      </svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M6.8 8.8H3.6V21h3.2V8.8ZM5.2 3C4.1 3 3.4 3.7 3.4 4.7c0 1 .8 1.7 1.8 1.7s1.8-.7 1.8-1.7C7 3.7 6.2 3 5.2 3ZM21 14c0-3.3-1.8-5.4-4.5-5.4-1.7 0-2.7.9-3.2 1.8V8.8h-3.2V21h3.2v-6.8c0-1.8.9-2.8 2.3-2.8 1.3 0 2.1.9 2.1 2.8V21H21v-7Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.4 3.4 5.4 3.4 9S14.2 18.6 12 21M12 3C9.8 5.4 8.6 8.4 8.6 12s1.2 6.6 3.4 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DetailFieldCard({ label, value }: DetailField) {
  return (
    <div className="grid gap-1 py-0.5 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-5 md:py-1">
      <p className="text-sm font-bold leading-6 text-slate-950">{label}</p>

      <p className="min-w-0 whitespace-pre-line break-words text-sm font-medium leading-6 text-slate-800 md:text-[16px]">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-3 md:mb-4">
      <h3 className="text-2xl font-bold tracking-[-0.02em] text-slate-950 md:text-[30px] md:leading-tight">
        {title}
      </h3>
    </div>
  );
}

export default function PersonnelModal({
  person,
  onClose,
}: PersonnelModalProps) {
  const [failedPhoto, setFailedPhoto] = useState<{
    personId: string;
    photoUrl: string;
  } | null>(null);

  function requestClose() {
    if (window.history.state?.personnelModal) {
      window.history.back();
      return;
    }

    onClose();
  }

  useEffect(() => {
    if (!person) return;

    const previousOverflow = document.body.style.overflow;
    const modalStateKey = `personnel-modal-${person.id}-${Date.now()}`;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        requestClose();
      }
    }

    function handlePopState(event: PopStateEvent) {
      if (event.state?.personnelModal === modalStateKey) return;
      onClose();
    }

    window.history.pushState(
      { ...(window.history.state || {}), personnelModal: modalStateKey },
      "",
      window.location.href
    );

    document.addEventListener("keydown", handleEscape);
    window.addEventListener("popstate", handlePopState);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("popstate", handlePopState);
      document.body.style.overflow = previousOverflow;
    };
  }, [person, onClose]);

  const photoUrl = person ? getPhotoUrl(person) : "";
  const showPhoto = Boolean(
    person &&
      photoUrl &&
      (failedPhoto?.personId !== person.id || failedPhoto.photoUrl !== photoUrl)
  );
  const displayName = person ? getDisplayName(person) : "";

  const positionText = person ? getPositionText(person) : "";
  const departmentText = person ? safeText(person.department) : "";
  const teachingDepartmentText = person
    ? getTeachingDepartment(person) || departmentText
    : "";
  const designationText = person ? getSummaryDesignationText(person) : "";
  const teachingPhilosophy = person ? getTeachingPhilosophy(person) : "";

  const teachingProfile = useMemo<DetailField[]>(() => {
    if (!person) return [];
    return getTeachingProfileFields(person);
  }, [person]);

  const additionalTasks = useMemo<DetailField[]>(() => {
    if (!person) return [];
    return getAdditionalTaskFields(person);
  }, [person]);

  const contactFields = useMemo<DetailField[]>(() => {
    if (!person) return [];
    return getContactFields(person);
  }, [person]);

  const socialLinks = useMemo<SocialLink[]>(() => {
    if (!person) return [];
    return getSocialLinks(person);
  }, [person]);

  return (
    <AnimatePresence>
      {person && (
        <motion.div
          onClick={requestClose}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-0 backdrop-blur-[2px] sm:p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <style jsx global>{`
            .personnel-modal-scroll {
              scrollbar-width: thin;
              scrollbar-color: #aeb4ba transparent;
            }

            .personnel-modal-scroll::-webkit-scrollbar {
              width: 10px;
            }

            .personnel-modal-scroll::-webkit-scrollbar-track {
              background: transparent;
            }

            .personnel-modal-scroll::-webkit-scrollbar-thumb {
              background: #aeb4ba;
              border: 2px solid transparent;
              border-radius: 999px;
              background-clip: content-box;
            }

            .personnel-modal-scroll::-webkit-scrollbar-thumb:hover {
              background: #858d96;
              background-clip: content-box;
            }
          `}</style>

          <motion.div
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
            className="relative flex max-h-[100dvh] w-full max-w-[1120px] overflow-hidden bg-white text-slate-950 shadow-2xl sm:max-h-[calc(100dvh-2rem)] md:max-h-[88vh]"
          >
            <button
              type="button"
              onClick={requestClose}
              aria-label="Close personnel profile"
              className="absolute right-0 top-0 z-40 flex h-12 w-12 items-center justify-center bg-red-600 text-white shadow-lg transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 active:scale-95 md:h-14 md:w-14"
            >
              <svg
                className="h-6 w-6 md:h-7 md:w-7"
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

            <div className="flex w-full flex-col md:flex-row">
              <aside className="shrink-0 bg-white px-5 pb-5 pt-16 sm:px-6 sm:pb-6 md:flex md:w-[38%] md:flex-col md:items-center md:justify-center md:px-10 md:py-12">
                <div className="mx-auto flex max-w-[460px] items-end gap-4 text-left md:block md:max-w-none md:text-center">
                  <div className="aspect-[3/4] w-[150px] max-w-[42vw] shrink-0 overflow-hidden rounded-[10px] bg-[#f3b02f] shadow-md ring-1 ring-black/10 sm:w-[170px] md:mx-auto md:w-full md:max-w-[234px]">
                    {showPhoto ? (
                      <Image
                        src={photoUrl}
                        alt={displayName}
                        width={360}
                        height={480}
                        sizes="(max-width: 768px) 70vw, 360px"
                        onError={() =>
                          setFailedPhoto({
                            personId: person.id,
                            photoUrl,
                          })
                        }
                        className="h-full w-full object-cover object-[50%_20%]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ffdf20] via-[#f59e0b] to-[#b45309] text-4xl font-black text-white md:text-6xl">
                        {getInitials(displayName)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-1 md:pt-0">
                    <h2
                          title={displayName}
                          className="line-clamp-2 text-2xl font-bold leading-tight tracking-[-0.02em] text-slate-950 sm:text-[26px] md:mt-10 md:text-[30px] md:leading-tight"
                        >
                          {displayName}
                        </h2>

                        {positionText && (
                          <p className="mt-2 text-base font-semibold leading-5 text-[#024253] sm:text-[17px] md:mt-6 md:text-lg md:leading-6">
                            {positionText}
                          </p>
                        )}

                        {teachingDepartmentText && (
                          <p className="mt-1 text-sm font-bold uppercase leading-5 tracking-[0.12em] text-slate-500 sm:text-[15px] md:text-base">
                            {teachingDepartmentText}
                          </p>
                        )}

                        {designationText && (
                          <p className="mt-2 line-clamp-3 text-sm font-semibold leading-5 text-slate-700 sm:text-[15px] md:mx-auto md:max-w-[280px] md:text-base md:leading-6">
                            {designationText}
                          </p>
                        )}

                  </div>
                </div>
              </aside>

              <section className="personnel-modal-scroll min-h-0 flex-1 overflow-y-auto bg-[#e9e9e9] px-5 py-7 sm:max-h-[calc(100dvh-2rem)] sm:px-8 md:max-h-[88vh] md:px-12 md:py-16 lg:px-16">
                {isMeaningfulText(teachingPhilosophy) && (
                  <section className="mb-8 md:mb-10">
                    <SectionTitle title="Professional Belief in Teaching" />

                    <p className="max-w-[660px] text-sm font-medium leading-7 tracking-[-0.01em] text-slate-800 md:text-[16px]">
                      &ldquo;{teachingPhilosophy}&rdquo;
                    </p>
                  </section>
                )}

                {teachingProfile.length > 0 && (
                  <section className="mb-8 md:mb-10">
                    <SectionTitle title="Teaching Profile" />

                    <div className="space-y-0.5 md:space-y-1">
                      {teachingProfile.map((field) => (
                        <DetailFieldCard
                          key={`${field.label}-${field.value}`}
                          label={field.label}
                          value={field.value}
                          wide={field.wide}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {additionalTasks.length > 0 && (
                  <section className="mb-8 md:mb-10">
                    <SectionTitle title="Task" />

                    <div className="space-y-0.5 md:space-y-1">
                      {additionalTasks.map((field) => (
                        <DetailFieldCard
                          key={`${field.label}-${field.value}`}
                          label={field.label}
                          value={field.value}
                          wide={field.wide}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {contactFields.length > 0 && (
                  <section className="mb-8 md:mb-10">
                    <SectionTitle title="Consultation and Contact" />

                    <div className="space-y-0.5 md:space-y-1">
                      {contactFields.map((field) => (
                        <DetailFieldCard
                          key={`${field.label}-${field.value}`}
                          label={field.label}
                          value={field.value}
                          wide={field.wide}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {socialLinks.length > 0 && (
                  <section>
                    <SectionTitle title="Public Links" />

                    <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
                      {socialLinks.map((link) => (
                        <a
                          key={`${link.label}-${link.href}`}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-12 items-center justify-center gap-3 bg-white px-5 py-3 text-sm font-black text-[#0F4C5C] shadow-sm ring-1 ring-slate-200 transition hover:bg-[#0F4C5C] hover:text-white"
                        >
                          <SocialIcon icon={link.icon} />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </section>
                )}

                {teachingProfile.length === 0 &&
                  additionalTasks.length === 0 &&
                  !isMeaningfulText(teachingPhilosophy) &&
                  contactFields.length === 0 &&
                  socialLinks.length === 0 && (
                    <div className="bg-white/70 p-6 text-center ring-1 ring-black/10 md:p-8">
                      <p className="font-bold text-slate-600">
                        Public profile details will be added soon.
                      </p>
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
