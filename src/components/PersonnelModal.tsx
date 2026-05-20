"use client";

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

export default function PersonnelModal({
  person,
  onClose,
}: PersonnelModalProps) {
  if (!person) return null;

  const messengerLink = normalizeMessengerLink(person.messenger);

  return (
    <AnimatePresence>
      {person && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white text-slate-950 shadow-2xl"
          >
            {/* HEADER BAR */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 md:px-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0F4C5C]">
                  Faculty / Personnel Profile
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Tabunoc National High School
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-[#0F4C5C] hover:text-white"
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
                        className="aspect-[3/4] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[3/4] w-full items-center justify-center bg-gradient-to-br from-blue-950 to-yellow-500 text-5xl font-black text-white">
                        {getInitials(person.name)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 text-center md:text-left">
                  <h2 className="text-2xl font-black leading-tight text-slate-950">
                    {person.name}
                  </h2>

                  <p className="mt-2 font-bold text-[#0F4C5C]">
                    {displayText(person.position)}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {displayList(person.designation)}
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Quick Details
                  </p>

                  <div className="mt-4 space-y-3 text-sm">
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

              {/* RIGHT CONTENT COLUMN */}
              <section className="p-6 md:p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBox label="Name" value={displayText(person.name)} />
                  <InfoBox
                    label="Position"
                    value={displayText(person.position)}
                  />
                  <InfoBox
                    label="Designation"
                    value={displayList(person.designation)}
                  />
                  <InfoBox label="Role" value={displayList(person.roles)} />
                  <InfoBox label="Group" value={displayText(person.group)} />
                  <InfoBox
                    label="Department"
                    value={displayText(person.department)}
                  />
                  <InfoBox
                    label="Grade Level Taught"
                    value={displayList(person.gradeLevelTaught)}
                  />
                  <InfoBox
                    label="Section Handled"
                    value={
                      person.sectionsHandled && person.sectionsHandled.length > 0
                        ? displayList(person.sectionsHandled)
                        : getAdvisorySections(person)
                    }
                  />
                </div>

                <ProfileSection title="Subject Taught">
                  <TagList
                    items={person.subjectTaught}
                    colorClass="bg-[#0F4C5C] text-white"
                  />
                </ProfileSection>

                <ProfileSection title="Coordinatorship">
                  <TagList
                    items={person.coordinatorship}
                    colorClass="bg-yellow-300 text-slate-950"
                  />
                </ProfileSection>

                <ProfileSection title="Teaching Philosophy">
                  <p className="leading-7 text-slate-700">
                    {displayText(person.philosophy)}
                  </p>
                </ProfileSection>

                <ProfileSection title="Bio">
                  <p className="leading-7 text-slate-700">
                    {displayText(person.bio || person.description)}
                  </p>
                </ProfileSection>

                <ProfileSection title="Contact Information">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoBox
                      label="Email Address"
                      value={displayText(person.email)}
                    />
                    <InfoBox
                      label="Messenger"
                      value={displayText(person.messenger)}
                    />
                    <InfoBox
                      label="Consultation Schedule"
                      value={displayText(person.consultationSchedule)}
                    />
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    {person.email && (
                      <a
                        href={`mailto:${person.email}`}
                        className="rounded-lg bg-[#0F4C5C] px-5 py-3 text-center text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#0B3B48]"
                      >
                        Send Email
                      </a>
                    )}

                    {messengerLink && (
                      <a
                        href={messengerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-yellow-400 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-300"
                      >
                        Open Messenger
                      </a>
                    )}

                    {!person.email && !messengerLink && (
                      <p className="rounded-xl bg-slate-100 px-5 py-4 text-sm font-semibold text-slate-600">
                        Contact details may be requested through official school
                        channels.
                      </p>
                    )}
                  </div>
                </ProfileSection>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-950">{value}</p>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 border-t border-slate-200 pt-6">
      <h4 className="text-xl font-black text-slate-950">{title}</h4>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function TagList({
  items,
  colorClass,
}: {
  items?: string[];
  colorClass: string;
}) {
  if (!items || items.length === 0) {
    return <p className="text-slate-600">N/A</p>;
  }

  const cleaned = items.filter((item) => item && item.trim() !== "");

  if (cleaned.length === 0) {
    return <p className="text-slate-600">N/A</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {cleaned.map((item) => (
        <span
          key={item}
          className={`rounded-lg px-4 py-2 text-sm font-bold ${colorClass}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}