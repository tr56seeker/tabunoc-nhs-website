"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Personnel } from "@/data/organization";

type PersonnelModalProps = {
  person: Personnel | null;
  onClose: () => void;
};

function normalizeMessengerLink(link?: string) {
  if (!link) return "";

  if (link.startsWith("https://")) return link;
  if (link.startsWith("http://")) return link;
  if (link.startsWith("m.me/")) return `https://${link}`;

  return `https://m.me/${link}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

function displayText(value?: string) {
  if (!value || value.trim() === "") return "N/A";
  return value;
}

function displayList(value?: string[]) {
  if (!value || value.length === 0) return "N/A";

  const cleaned = value.filter((item) => item && item.trim() !== "");
  if (cleaned.length === 0) return "N/A";

  return cleaned.join(", ");
}

function getAdvisorySections(person: Personnel) {
  if (!person.advisory || person.advisory.length === 0) return "N/A";

  return person.advisory
    .map((item) => `${item.gradeLevel}-${item.section.replace(/^\d+-/, "")}`)
    .join(", ");
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium leading-snug text-slate-800">
        {value}
      </p>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium leading-7 text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default function PersonnelModal({
  person,
  onClose,
}: PersonnelModalProps) {
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

  const messengerLink = person ? normalizeMessengerLink(person.messenger) : "";

  return (
    <AnimatePresence>
      {person && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-slate-950/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* EXPANDING PROFILE CARD */}
          <motion.div
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              type: "tween",
              duration: 0.18,
              ease: "easeOut",
            }}
            className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white text-slate-950 shadow-xl will-change-transform"
          >
            <div className="max-h-[92vh] overflow-y-auto">
              {/* HEADER BAR */}
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 md:px-8">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0F4C5C]">
                    Faculty / Personnel Profile
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Tabunoc National High School
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#0F4C5C] hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="grid md:grid-cols-[300px_1fr]">
                {/* LEFT PROFILE COLUMN */}
                <aside className="border-b border-slate-200 bg-slate-50 p-6 md:border-b-0 md:border-r md:p-8">
                  <div className="mx-auto max-w-[230px]">
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-200 shadow-sm">
                      {person.photo ? (
                        <img
                          src={person.photo}
                          alt={person.name}
                          className="aspect-[3/4] w-full object-cover object-[50%_20%]"
                        />
                      ) : (
                        <div className="flex aspect-[3/4] w-full items-center justify-center bg-[#0F4C5C] text-5xl font-semibold text-white">
                          {getInitials(person.name)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 text-center md:text-left">
                    <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-950">
                      {person.name}
                    </h2>

                    <p className="mt-2 text-base font-semibold text-[#0F4C5C]">
                      {displayText(person.position)}
                    </p>

                    <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                      {displayList(person.designation)}
                    </p>
                  </div>

                  <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Quick Details
                    </p>

                    <div className="mt-4 space-y-4">
                      <MiniInfo label="Group" value={displayText(person.group)} />
                      <MiniInfo
                        label="Department"
                        value={displayText(person.department)}
                      />
                      <MiniInfo
                        label="Position"
                        value={displayText(person.position)}
                      />
                      <MiniInfo
                        label="Designation"
                        value={displayList(person.designation)}
                      />
                    </div>
                  </div>
                </aside>

                {/* RIGHT DETAILS COLUMN */}
                <section className="p-6 md:p-8">
                  <div className="grid gap-4 md:grid-cols-2">
                    <DetailBlock
                      label="Subject Taught"
                      value={displayList(person.subjectTaught)}
                    />

                    <DetailBlock
                      label="Coordinatorship / Program"
                      value={displayList(person.coordinatorship)}
                    />

                    <DetailBlock
                      label="Grade Level Taught"
                      value={displayList(person.gradeLevelTaught)}
                    />

                    <DetailBlock
                      label="Section Handled / Advisory"
                      value={
                        displayList(person.sectionsHandled) !== "N/A"
                          ? displayList(person.sectionsHandled)
                          : getAdvisorySections(person)
                      }
                    />

                    <DetailBlock
                      label="Consultation Schedule"
                      value={displayText(person.consultationSchedule)}
                    />

                    <DetailBlock label="Email" value={displayText(person.email)} />
                  </div>

                  <div className="mt-4 grid gap-4">
                    <DetailBlock
                      label="Teaching Philosophy"
                      value={displayText(person.philosophy)}
                    />

                    <DetailBlock label="Profile Bio" value={displayText(person.bio)} />

                    <DetailBlock
                      label="Description"
                      value={displayText(person.description)}
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {person.email && (
                      <a
                        href={`mailto:${person.email}`}
                        className="rounded-xl bg-[#0F4C5C] px-5 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-[#0B3B48]"
                      >
                        Send Email
                      </a>
                    )}

                    {messengerLink && (
                      <a
                        href={messengerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-[#0F4C5C]/30 bg-white px-5 py-3 text-center text-sm font-semibold text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-[#ECFDF5]"
                      >
                        Message on Messenger
                      </a>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}