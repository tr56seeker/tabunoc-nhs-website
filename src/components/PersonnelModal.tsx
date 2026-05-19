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

function getGradeLevels(person: Personnel) {
  if (!person.advisory || person.advisory.length === 0) return "";

  return Array.from(
    new Set(person.advisory.map((item) => item.gradeLevel))
  ).join(", ");
}

function getSections(person: Personnel) {
  if (!person.advisory || person.advisory.length === 0) return "";

  return person.advisory.map((item) => item.section).join(", ");
}

export default function PersonnelModal({
  person,
  onClose,
}: PersonnelModalProps) {
  const messengerLink = normalizeMessengerLink(person?.messenger);

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
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 md:px-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-800">
                  Faculty / Personnel Profile
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Tabunoc National High School
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-950 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid md:grid-cols-[300px_1fr]">
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

                  <p className="mt-2 font-bold text-blue-800">
                    {person.position}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {person.roles.join(", ")}
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Quick Details
                  </p>

                  <div className="mt-4 space-y-3 text-sm">
                    <MiniInfo label="Department" value={person.department} />
                    <MiniInfo
                      label="Grade Level"
                      value={getGradeLevels(person)}
                    />
                    <MiniInfo label="Section" value={getSections(person)} />
                    <MiniInfo
                      label="Consultation"
                      value={person.consultationSchedule}
                    />
                  </div>
                </div>
              </aside>

              <section className="p-6 md:p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBox label="Name" value={person.name} />
                  <InfoBox label="Position" value={person.position} />
                  <InfoBox label="Role" value={person.roles.join(", ")} />
                  <InfoBox label="Group" value={person.group} />
                </div>

                <ProfileSection title="Subject Taught">
                  {person.subjectTaught && person.subjectTaught.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {person.subjectTaught.map((subject) => (
                        <span
                          key={subject}
                          className="rounded-lg bg-blue-950 px-4 py-2 text-sm font-bold text-white"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <EmptyText />
                  )}
                </ProfileSection>

                <ProfileSection title="Coordinatorship">
                  {person.coordinatorship &&
                  person.coordinatorship.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {person.coordinatorship.map((item) => (
                        <span
                          key={item}
                          className="rounded-lg bg-yellow-300 px-4 py-2 text-sm font-bold text-slate-950"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <EmptyText />
                  )}
                </ProfileSection>

                <ProfileSection title="Teaching Philosophy">
                  <p className="leading-8 text-slate-700">
                    {person.philosophy ||
                      "Teaching philosophy will be added soon."}
                  </p>
                </ProfileSection>

                <ProfileSection title="Bio">
                  <p className="leading-8 text-slate-700">
                    {person.bio ||
                      person.description ||
                      "Bio will be added soon."}
                  </p>
                </ProfileSection>

                <ProfileSection title="Contact Information">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {person.email && (
                      <a
                        href={`mailto:${person.email}`}
                        className="rounded-lg bg-blue-950 px-5 py-3 text-center text-sm font-black text-white transition hover:-translate-y-1 hover:bg-blue-800"
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

function InfoBox({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-950">
        {value || "To be updated"}
      </p>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-800">
        {value || "To be updated"}
      </p>
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

function EmptyText() {
  return <p className="text-slate-600">To be updated.</p>;
}