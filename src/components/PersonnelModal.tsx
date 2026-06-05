"use client";

/**
 * FILE_ID: TABUNOC_PERSONNEL_MODAL_PUBLIC_PROFILE_ADAPTIVE
 * PATH: src/components/PersonnelModal.tsx
 * PURPOSE: Adaptive public-facing personnel profile modal using CSV/Excel roster data.
 * DESIGN:
 * - Adaptive full-view modal for desktop/tablet/phone
 * - Left identity panel with fixed 3:4 profile picture
 * - Left identity text scrolls if designation is long
 * - Right information panel scrolls independently
 * - No redundant information
 * - Native draggable scrollbar with #eff3f7 track
 * - Contact and social media sections with inline SVG icons
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

  subjectArea?: string;
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
  philosophy?: string;
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

function getDesignationText(person: Personnel) {
  const advisoryText = getAdvisorySections(person);
  const position = getPositionText(person).toLowerCase();

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
  return safeText(extended.teachingPhilosophy) || safeText(extended.philosophy);
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

function DetailFieldCard({ label, value, wide }: DetailField) {
  return (
    <div
      className={`bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-0.5 hover:shadow-md md:px-6 md:py-5 ${
        wide ? "xl:col-span-2" : ""
      }`}
    >
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
        {label}
      </p>
      <p className="mt-3 text-sm font-semibold leading-7 text-slate-800">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950 md:text-2xl">
        {title}
      </h3>
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

  const photoUrl = person ? getPhotoUrl(person) : "";
  const showPhoto = Boolean(person && photoUrl && failedPhoto !== photoUrl);

  const positionText = person ? getPositionText(person) : "";
  const designationText = person ? getDesignationText(person) : "";
  const teachingPhilosophy = person ? getTeachingPhilosophy(person) : "";

  const profileDetails = useMemo<DetailField[]>(() => {
    if (!person) return [];

    const extended = person as ExtendedPersonnel;

    return [
      {
        label: "Subject Area",
        value: safeText(extended.subjectArea),
      },
      {
        label: "Subject Taught",
        value: displayList(person.subjectTaught),
      },
      {
        label: "Subject Department",
        value: getSubjectDepartments(person),
      },
      {
        label: "Teaching Department",
        value: getTeachingDepartment(person),
      },
    ].filter((field) => isMeaningfulText(field.value));
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
          className="fixed inset-0 z-[2000] flex items-center justify-center p-0 md:px-4 md:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <style jsx global>{`
            .personnel-modal-scroll,
            .personnel-profile-scroll {
              scrollbar-width: thin;
              scrollbar-color: #aeb4ba #eff3f7;
              scrollbar-gutter: stable;
            }

            .personnel-modal-scroll::-webkit-scrollbar,
            .personnel-profile-scroll::-webkit-scrollbar {
              width: 14px;
            }

            .personnel-modal-scroll::-webkit-scrollbar-track,
            .personnel-profile-scroll::-webkit-scrollbar-track {
              background: #eff3f7;
            }

            .personnel-modal-scroll::-webkit-scrollbar-thumb,
            .personnel-profile-scroll::-webkit-scrollbar-thumb {
              background: #aeb4ba;
              border: 4px solid #eff3f7;
              border-radius: 999px;
            }

            .personnel-modal-scroll::-webkit-scrollbar-thumb:hover,
            .personnel-profile-scroll::-webkit-scrollbar-thumb:hover {
              background: #858d96;
            }

            .personnel-modal-scroll::-webkit-scrollbar-button,
            .personnel-profile-scroll::-webkit-scrollbar-button {
              display: none;
              width: 0;
              height: 0;
            }

            @media (min-width: 768px) {
              .personnel-modal-scroll::-webkit-scrollbar {
                width: 28px;
              }

              .personnel-modal-scroll::-webkit-scrollbar-thumb {
                border: 8px solid #eff3f7;
              }
            }

            @media (min-width: 1024px) {
              .personnel-modal-scroll::-webkit-scrollbar {
                width: 44px;
              }

              .personnel-modal-scroll::-webkit-scrollbar-thumb {
                border: 14px solid #eff3f7;
              }
            }
          `}</style>

          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
            className="relative h-screen w-screen overflow-hidden bg-white text-slate-950 shadow-2xl md:h-[90vh] md:w-[96vw] md:max-w-[1500px]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close personnel profile"
              className="absolute right-0 top-0 z-40 flex h-12 w-12 items-center justify-center bg-red-600 text-white shadow-md transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 md:h-14 md:w-14"
            >
              <svg
                className="h-7 w-7 md:h-8 md:w-8"
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
              {/* Adaptive Profile Identity Panel */}
              <aside className="relative shrink-0 overflow-hidden bg-white px-5 py-4 md:flex md:h-full md:w-[390px] md:flex-col md:px-8 md:py-8 lg:w-[430px] lg:px-10 lg:py-10">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-[#0F4C5C] md:w-2" />
                <div className="absolute left-1.5 top-0 h-full w-1 bg-[#ffdf20] md:left-2" />

                <div className="relative z-10 flex h-full min-h-0 items-center gap-4 md:flex-col md:items-stretch">
                  <div className="aspect-[3/4] w-[92px] flex-none overflow-hidden bg-[#0F4C5C] shadow-lg ring-1 ring-slate-200 sm:w-[110px] md:mx-auto md:w-[250px] lg:w-[280px]">
                    {showPhoto ? (
                      <img
                        src={photoUrl}
                        alt={person.name}
                        onError={() => setFailedPhoto(photoUrl)}
                        className="h-full w-full object-cover object-[50%_20%]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#0F4C5C] text-3xl font-black text-white md:text-5xl">
                        {getInitials(person.name)}
                      </div>
                    )}
                  </div>

                  <div className="personnel-profile-scroll min-w-0 md:mt-7 md:min-h-0 md:overflow-y-auto md:pr-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F4C5C] md:text-[11px] md:tracking-[0.24em]">
                      Personnel Profile
                    </p>

                    <h2 className="mt-2 text-xl font-black leading-tight tracking-tight text-slate-950 sm:text-2xl md:mt-4 md:text-3xl">
                      {person.name}
                    </h2>

                    {positionText && (
                      <p className="mt-2 text-xs font-black leading-5 text-[#0F4C5C] md:mt-3 md:text-sm md:leading-6">
                        {positionText}
                      </p>
                    )}

                    {designationText && (
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-700 md:text-sm md:leading-6">
                        {designationText}
                      </p>
                    )}
                  </div>
                </div>
              </aside>

              {/* Scrollable Information Panel */}
              <section className="personnel-modal-scroll min-h-0 flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-6 pr-3 sm:px-6 md:px-8 md:py-8 md:pr-4 lg:px-10 lg:py-10 lg:pr-5">
                <div className="mb-6 max-w-3xl md:mb-8">
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                    Profile Information
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:mt-3 md:text-3xl">
                    Official personnel details
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                    Information is based on the official school roster encoded
                    for the Tabunoc National High School website.
                  </p>
                </div>

                {profileDetails.length > 0 && (
                  <section className="mb-8 md:mb-10">
                    <SectionTitle
                      eyebrow="Teaching Profile"
                      title="Teaching and subject assignment"
                    />

                    <div className="grid gap-4 md:gap-5 xl:grid-cols-2">
                      {profileDetails.map((field) => (
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

                {isMeaningfulText(teachingPhilosophy) && (
                  <section className="mb-8 md:mb-10">
                    <SectionTitle
                      eyebrow="Teaching Philosophy"
                      title="Professional belief in teaching"
                    />

                    <div className="border-l-[6px] border-[#ffdf20] bg-yellow-50 px-5 py-5 shadow-sm md:px-6">
                      <p className="text-sm font-semibold italic leading-8 text-slate-800">
                        “{teachingPhilosophy}”
                      </p>
                    </div>
                  </section>
                )}

                {contactFields.length > 0 && (
                  <section className="mb-8 md:mb-10">
                    <SectionTitle
                      eyebrow="Contact Information"
                      title="Official contact details"
                    />

                    <div className="grid gap-4 md:gap-5 xl:grid-cols-2">
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
                    <SectionTitle
                      eyebrow="Social Media"
                      title="Public profile links"
                    />

                    <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
                      {socialLinks.map((link) => (
                        <a
                          key={`${link.label}-${link.href}`}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-3 bg-white px-5 py-3 text-sm font-black text-[#0F4C5C] shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:bg-[#0F4C5C] hover:text-white lg:justify-start"
                        >
                          <SocialIcon icon={link.icon} />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </section>
                )}

                {profileDetails.length === 0 &&
                  !isMeaningfulText(teachingPhilosophy) &&
                  contactFields.length === 0 &&
                  socialLinks.length === 0 && (
                    <div className="bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                      <p className="font-bold text-slate-600">
                        Additional public profile details will be added soon.
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
