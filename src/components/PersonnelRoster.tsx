"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

type Personnel = {
  order: number;
  lastName: string;
  firstName: string;
  middleName: string;
  middleInitial: string;
  suffix: string;
  name: string;
  position: string;
  designation1: string;
  designation2: string;
  designation3: string;
  designation4: string;
  otherDesignations: string;
  category: string;
  department: string;
  subjectArea: string;
  displayGroup: string;
  additionalGroups: string;
  subGroup: string;
  groupOrder: number;
  subGroupOrder: number;
  personOrder: number;
  photoUrl: string;
  status: string;
};

type PersonnelEntry = {
  person: Personnel;
  displayGroup: string;
  subGroup: string;
  groupOrder: number;
  subGroupOrder: number;
  personOrder: number;
};

const defaultGroupOrder: Record<string, number> = {
  "School Head": 1,
  "Administrative Staff": 2,
  Coordinators: 3,
  "Master Teachers": 4,
  "Grade Level Chairpersons": 5,
  "Class Advisers": 6,
  "Subject Teachers": 7,
  "School Support Personnel": 8,
};

const groupDescriptions: Record<string, string> = {
  "School Head": "Overall school leadership and administrative supervision.",
  "Administrative Staff":
    "Personnel supporting records, finance, learner services, and school operations.",
  Coordinators:
    "School program implementers, focal persons, and designated coordinators.",
  "Master Teachers":
    "Instructional leaders providing mentoring, technical assistance, and curriculum support.",
  "Grade Level Chairpersons":
    "Grade-level leaders coordinating learner concerns and class operations.",
  "Class Advisers":
    "Teachers assigned to guide, monitor, and support specific advisory classes.",
  "Subject Teachers":
    "Teaching personnel grouped according to subject area or learning department.",
  "School Support Personnel":
    "Job order personnel, utility workers, guards, and other school support staff.",
};

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function normalizeHeader(header: string) {
  return header.replace(/^\uFEFF/, "").trim();
}

function toNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return fallback;
}

function buildFallbackDisplayName(record: Record<string, string>) {
  return [
    record.firstName,
    record.middleInitial,
    record.lastName,
    record.suffix,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function getAllDesignations(person: Personnel) {
  return [
    person.designation1,
    person.designation2,
    person.designation3,
    person.designation4,
    ...person.otherDesignations
      .split("|")
      .map((designation) => designation.trim())
      .filter(Boolean),
  ].filter(Boolean);
}

function inferDisplayGroup(record: Record<string, string>) {
  const position = (record.position || "").toLowerCase();
  const category = (record.category || "").toLowerCase();
  const designations = [
    record.designation1,
    record.designation2,
    record.designation3,
    record.designation4,
    record.otherDesignations,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    position.includes("school principal") ||
    designations.includes("school head")
  ) {
    return "School Head";
  }

  if (
    category.includes("job order") ||
    category.includes("support") ||
    position.includes("security guard") ||
    position.includes("utility")
  ) {
    return "School Support Personnel";
  }

  if (
    category.includes("non-teaching") ||
    category.includes("administration") ||
    position.includes("administrative") ||
    position.includes("guidance") ||
    position.includes("librarian") ||
    position.includes("registrar") ||
    position.includes("nurse")
  ) {
    return "Administrative Staff";
  }

  if (position.includes("master teacher")) {
    return "Master Teachers";
  }

  if (
    designations.includes("grade level chairperson") ||
    designations.includes("grade leader") ||
    designations.includes("grade level coordinator")
  ) {
    return "Grade Level Chairpersons";
  }

  if (
    designations.includes("class adviser") ||
    designations.includes("adviser")
  ) {
    return "Class Advisers";
  }

  if (
    designations.includes("coordinator") ||
    designations.includes("focal") ||
    designations.includes("pio") ||
    designations.includes("manager")
  ) {
    return "Coordinators";
  }

  if (category.includes("teaching") || position.includes("teacher")) {
    return "Subject Teachers";
  }

  return "Administrative Staff";
}

function inferSubGroup(person: Personnel) {
  if (person.subGroup) return person.subGroup;

  if (person.displayGroup === "Subject Teachers") {
    return person.subjectArea || person.department || "General";
  }

  if (person.displayGroup === "Class Advisers") {
    return person.department || "Advisory Classes";
  }

  if (person.displayGroup === "Coordinators") {
    return person.department || "School Programs";
  }

  if (person.displayGroup === "Master Teachers") {
    return person.subjectArea || person.department || "Instructional Leadership";
  }

  if (person.displayGroup === "Administrative Staff") {
    return person.department || "Administrative Services";
  }

  if (person.displayGroup === "School Support Personnel") {
    return person.department || "School Operations";
  }

  return "";
}

function parsePersonnelCsv(csvText: string): Personnel[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const record = Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? ""])
    ) as Record<string, string>;

    const displayName =
      record.displayName?.trim() || record.name?.trim() || buildFallbackDisplayName(record);

    const displayGroup =
      record.displayGroup?.trim() || inferDisplayGroup(record);

    const groupOrder =
      toNumber(record.groupOrder, defaultGroupOrder[displayGroup] || 99);

    const person: Personnel = {
      order: toNumber(record.order, 999),
      lastName: record.lastName || "",
      firstName: record.firstName || "",
      middleName: record.middleName || "",
      middleInitial: record.middleInitial || "",
      suffix: record.suffix || "",
      name: displayName || "Unnamed Personnel",
      position: record.position || "",
      designation1: record.designation1 || record.primaryDesignation || "",
      designation2: record.designation2 || "",
      designation3: record.designation3 || "",
      designation4: record.designation4 || "",
      otherDesignations: record.otherDesignations || "",
      category: record.category || "Teaching Personnel",
      department: record.department || "",
      subjectArea: record.subjectArea || "",
      displayGroup,
      additionalGroups: record.additionalGroups || "",
      subGroup: record.subGroup || "",
      groupOrder,
      subGroupOrder: toNumber(record.subGroupOrder, 99),
      personOrder: toNumber(record.personOrder, toNumber(record.order, 999)),
      photoUrl: record.photoUrl || "/personnel/placeholder.jpg",
      status: record.status || "Active",
    };

    return {
      ...person,
      subGroup: inferSubGroup(person),
    };
  });
}

function getDisplayEntries(personnel: Personnel[]) {
  return personnel.flatMap((person) => {
    const groups = [
      person.displayGroup,
      ...person.additionalGroups
        .split("|")
        .map((group) => group.trim())
        .filter(Boolean),
    ].filter(Boolean);

    return groups.map((group) => ({
      person,
      displayGroup: group,
      subGroup:
        group === person.displayGroup
          ? person.subGroup
          : person.subjectArea || person.department || "",
      groupOrder: defaultGroupOrder[group] || person.groupOrder || 99,
      subGroupOrder: person.subGroupOrder || 99,
      personOrder: person.personOrder || person.order || 999,
    }));
  });
}

function groupEntriesByDisplayGroup(entries: PersonnelEntry[]) {
  return entries.reduce<Record<string, PersonnelEntry[]>>((groups, entry) => {
    if (!groups[entry.displayGroup]) {
      groups[entry.displayGroup] = [];
    }

    groups[entry.displayGroup].push(entry);
    return groups;
  }, {});
}

function groupEntriesBySubGroup(entries: PersonnelEntry[]) {
  return entries.reduce<Record<string, PersonnelEntry[]>>((groups, entry) => {
    const subGroup = entry.subGroup || "Personnel";

    if (!groups[subGroup]) {
      groups[subGroup] = [];
    }

    groups[subGroup].push(entry);
    return groups;
  }, {});
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function ProfileImage({
  person,
  size = "small",
}: {
  person: Personnel;
  size?: "small" | "large";
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const sizeClass =
    size === "large"
      ? "aspect-square w-full rounded-3xl"
      : "h-14 w-14 rounded-2xl";

  return (
    <div
      className={`relative flex flex-none items-center justify-center overflow-hidden bg-[#ECFDF5] text-[#0F4C5C] ring-1 ring-[#0F4C5C]/10 ${sizeClass}`}
    >
      {!imageFailed && person.photoUrl ? (
        <Image
          src={person.photoUrl}
          alt={`${person.name} profile photo`}
          fill
          sizes={size === "large" ? "(max-width: 768px) 100vw, 280px" : "56px"}
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span
          className={`font-black ${
            size === "large" ? "text-4xl" : "text-sm"
          }`}
        >
          {getInitials(person.name)}
        </span>
      )}
    </div>
  );
}

function PersonCard({ entry }: { entry: PersonnelEntry }) {
  const { person } = entry;
  const [isSelected, setIsSelected] = useState(false);

  const designations = getAllDesignations(person);
  const extraRolesCount = Math.max(designations.length - 1, 0);

  return (
    <motion.article
      layout
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-[#0F4C5C]/30 hover:shadow-md"
    >
      <button
        type="button"
        onClick={() => setIsSelected((current) => !current)}
        className="flex w-full items-center gap-4 p-4 text-left"
        aria-expanded={isSelected}
      >
        <ProfileImage person={person} />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black text-[#071E29]">
            {person.name}
          </h3>

          <p className="mt-1 truncate text-sm font-bold text-[#0F4C5C]">
            {person.position || "Position not specified"}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="truncate text-sm text-slate-600">
              {person.designation1 ||
                [person.department, person.subjectArea]
                  .filter(Boolean)
                  .join(" • ") ||
                "Assignment not specified"}
            </span>

            {extraRolesCount > 0 && (
              <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-xs font-black text-[#0F4C5C]">
                +{extraRolesCount} role{extraRolesCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-slate-50 text-[#0F4C5C]">
          <svg
            className={`h-5 w-5 transition-transform ${
              isSelected ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isSelected && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 border-t border-slate-100 bg-slate-50 p-6 md:grid-cols-[170px_1fr]">
              <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                <ProfileImage person={person} size="large" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                  Personnel Profile
                </p>

                <h3 className="mt-2 text-3xl font-black text-[#071E29]">
                  {person.name}
                </h3>

                <p className="mt-2 text-lg font-black text-[#0F4C5C]">
                  {person.position || "Position not specified"}
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Department
                    </p>
                    <p className="mt-2 font-bold text-slate-800">
                      {person.department || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Subject Area / Assignment
                    </p>
                    <p className="mt-2 font-bold text-slate-800">
                      {person.subjectArea || entry.subGroup || "Not specified"}
                    </p>
                  </div>
                </div>

                {designations.length > 0 && (
                  <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Designation{designations.length > 1 ? "s" : ""}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {designations.map((designation) => (
                        <span
                          key={`${person.name}-${designation}`}
                          className="rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-black text-[#0F4C5C]"
                        >
                          {designation}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function PersonnelRoster() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPersonnel() {
      try {
        const response = await fetch("/data/personnel.csv", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load public/data/personnel.csv");
        }

        const csvText = await response.text();

        const activePersonnel = parsePersonnelCsv(csvText)
          .filter((person) => {
            const isActive = person.status.toLowerCase() === "active";
            const hasRealName =
              person.name &&
              person.name !== "Unnamed Personnel" &&
              !person.name.toLowerCase().includes("firstname") &&
              !person.name.toLowerCase().includes("lastname");

            return isActive && hasRealName;
          })
          .sort((a, b) => {
            if (a.groupOrder !== b.groupOrder) return a.groupOrder - b.groupOrder;
            if (a.subGroupOrder !== b.subGroupOrder)
              return a.subGroupOrder - b.subGroupOrder;
            if (a.personOrder !== b.personOrder) return a.personOrder - b.personOrder;
            return a.name.localeCompare(b.name);
          });

        setPersonnel(activePersonnel);
      } catch (error) {
        console.error(error);
        setPersonnel([]);
      } finally {
        setLoading(false);
      }
    }

    loadPersonnel();
  }, []);

  const displayEntries = useMemo(
    () =>
      getDisplayEntries(personnel).sort((a, b) => {
        if (a.groupOrder !== b.groupOrder) return a.groupOrder - b.groupOrder;
        if (a.subGroupOrder !== b.subGroupOrder)
          return a.subGroupOrder - b.subGroupOrder;
        if (a.personOrder !== b.personOrder) return a.personOrder - b.personOrder;
        return a.person.name.localeCompare(b.person.name);
      }),
    [personnel]
  );

  const groupedEntries = useMemo(
    () => groupEntriesByDisplayGroup(displayEntries),
    [displayEntries]
  );

  const orderedGroups = useMemo(() => {
    return Object.keys(groupedEntries).sort((a, b) => {
      const aOrder = defaultGroupOrder[a] || groupedEntries[a][0]?.groupOrder || 99;
      const bOrder = defaultGroupOrder[b] || groupedEntries[b][0]?.groupOrder || 99;

      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.localeCompare(b);
    });
  }, [groupedEntries]);

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
          Loading Roster
        </p>
        <p className="mt-3 text-slate-700">
          Please wait while the personnel roster is being loaded.
        </p>
      </section>
    );
  }

  if (personnel.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
          No Active Personnel Found
        </p>
        <p className="mt-3 text-slate-700">
          Check <strong>public/data/personnel.csv</strong> and make sure at
          least one row has <strong>status</strong> set to{" "}
          <strong>Active</strong>.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-14">
      {orderedGroups.map((group) => {
        const entries = groupedEntries[group];
        const subGroupedEntries = groupEntriesBySubGroup(entries);
        const subGroups = Object.keys(subGroupedEntries).sort((a, b) => {
          const aEntry = subGroupedEntries[a][0];
          const bEntry = subGroupedEntries[b][0];

          if (aEntry.subGroupOrder !== bEntry.subGroupOrder) {
            return aEntry.subGroupOrder - bEntry.subGroupOrder;
          }

          return a.localeCompare(b);
        });

        return (
          <div key={group}>
            <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                {group}
              </p>
              <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-[#071E29]">
                    {group}
                  </h2>
                  <p className="mt-3 max-w-3xl leading-7 text-slate-700">
                    {groupDescriptions[group] ||
                      "Personnel grouped according to school assignment and organizational function."}
                  </p>
                </div>

                <p className="text-sm font-bold text-slate-500">
                  {entries.length} personnel
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {subGroups.map((subGroup) => (
                <div key={`${group}-${subGroup}`}>
                  {subGroup !== "Personnel" && (
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200" />
                      <p className="rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-black text-[#0F4C5C]">
                        {subGroup}
                      </p>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
                  )}

                  <div className="grid gap-4">
                    {subGroupedEntries[subGroup].map((entry) => (
                      <PersonCard
                        key={`${entry.displayGroup}-${entry.subGroup}-${entry.person.order}-${entry.person.name}`}
                        entry={entry}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
