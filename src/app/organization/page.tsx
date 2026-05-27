"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/components/Footer";

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

const pagePadding = "px-6 md:px-10 xl:px-[120px] 2xl:px-[190px]";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55 },
};

const groupOrder: Record<string, number> = {
  Administration: 1,
  "Administrative Staff": 2,
  "Program Coordinators": 3,
  "Master Teachers": 4,
  "Senior High School Department": 5,
  "Junior High School Department": 6,
  "Subject Teachers": 7,
  "School Support Personnel": 8,
};

const subgroupOrder: Record<string, number> = {
  "School Head": 1,
  "Administrative Officer": 1,
  "Administrative Assistant": 2,
  "Guidance Counselor": 3,
  "Program Coordinators": 1,
  "Master Teachers": 1,
  "Senior High School Class Advisers": 1,
  "Junior High School Class Advisers": 1,
  "Senior High School Teachers": 1,
  "Junior High School Teachers": 2,
  "Cross-Level Teachers": 3,
  "Job Order Personnel": 1,
  "Security Guards": 2,
  "Utility Workers": 3,
};

const groupDescriptions: Record<string, string> = {
  Administration:
    "School leadership and overall administrative supervision of Tabunoc National High School.",
  "Administrative Staff":
    "Personnel supporting school records, finance, learner services, guidance, and daily office operations.",
  "Program Coordinators":
    "School program implementers, focal persons, and designated coordinators handling priority programs and services.",
  "Master Teachers":
    "Instructional leaders providing mentoring, technical assistance, and curriculum support to teachers.",
  "Senior High School Department":
    "Senior High School class advisers and personnel supporting Grade 11 and Grade 12 learners.",
  "Junior High School Department":
    "Junior High School class advisers and personnel supporting Grade 7 to Grade 10 learners.",
  "Subject Teachers":
    "Teaching personnel grouped according to actual Senior High School, Junior High School, or cross-level teaching assignments.",
  "School Support Personnel":
    "Job order personnel, security guards, utility workers, and support staff assisting school operations.",
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

function uniqueList(items: string[]) {
  return Array.from(
    new Set(
      items
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function getAllDesignations(person: Personnel) {
  return uniqueList([
    person.designation1,
    person.designation2,
    person.designation3,
    person.designation4,
    ...person.otherDesignations
      .split("|")
      .map((designation) => designation.trim())
      .filter(Boolean),
  ]);
}

function inferDisplayGroup(record: Record<string, string>) {
  const position = (record.position || "").toLowerCase();
  const category = (record.category || "").toLowerCase();
  const department = (record.department || "").toLowerCase();
  const subjectArea = (record.subjectArea || "").toLowerCase();

  const designations = [
    record.designation1,
    record.designation2,
    record.designation3,
    record.designation4,
    record.otherDesignations,
    record.primaryDesignation,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    position.includes("school principal") ||
    position.includes("principal") ||
    designations.includes("school head")
  ) {
    return "Administration";
  }

  if (
    position.includes("administrative officer") ||
    position.includes("administrative assistant") ||
    position.includes("guidance counselor") ||
    position.includes("guidance") ||
    position.includes("registrar") ||
    position.includes("librarian") ||
    position.includes("nurse") ||
    category.includes("non-teaching") ||
    category.includes("administrative")
  ) {
    return "Administrative Staff";
  }

  if (position.includes("master teacher")) {
    return "Master Teachers";
  }

  if (
    designations.includes("coordinator") ||
    designations.includes("focal") ||
    designations.includes("pio") ||
    designations.includes("manager")
  ) {
    return "Program Coordinators";
  }

  if (
    designations.includes("class adviser") &&
    (department.includes("senior") ||
      department.includes("shs") ||
      subjectArea.includes("senior") ||
      subjectArea.includes("shs"))
  ) {
    return "Senior High School Department";
  }

  if (
    designations.includes("class adviser") &&
    (department.includes("junior") ||
      department.includes("jhs") ||
      subjectArea.includes("junior") ||
      subjectArea.includes("jhs"))
  ) {
    return "Junior High School Department";
  }

  if (
    category.includes("job order") ||
    category.includes("support") ||
    position.includes("security guard") ||
    position.includes("guard") ||
    position.includes("utility") ||
    department.includes("security")
  ) {
    return "School Support Personnel";
  }

  if (category.includes("teaching") || position.includes("teacher")) {
    return "Subject Teachers";
  }

  return "Administrative Staff";
}

function inferSubGroup(person: Personnel) {
  if (person.subGroup) return person.subGroup;

  const position = person.position.toLowerCase();
  const category = person.category.toLowerCase();
  const department = person.department.toLowerCase();
  const subjectArea = person.subjectArea.toLowerCase();
  const designations = getAllDesignations(person).join(" ").toLowerCase();

  if (person.displayGroup === "Administration") {
    return "School Head";
  }

  if (person.displayGroup === "Administrative Staff") {
    if (position.includes("administrative officer")) {
      return "Administrative Officer";
    }

    if (position.includes("administrative assistant")) {
      return "Administrative Assistant";
    }

    if (position.includes("guidance")) {
      return "Guidance Counselor";
    }

    return "Administrative Staff";
  }

  if (person.displayGroup === "Program Coordinators") {
    return "Program Coordinators";
  }

  if (person.displayGroup === "Master Teachers") {
    return "Master Teachers";
  }

  if (person.displayGroup === "Senior High School Department") {
    return "Senior High School Class Advisers";
  }

  if (person.displayGroup === "Junior High School Department") {
    return "Junior High School Class Advisers";
  }

  if (person.displayGroup === "Subject Teachers") {
    const handlesShs =
      department.includes("senior") ||
      department.includes("shs") ||
      subjectArea.includes("senior") ||
      subjectArea.includes("shs");

    const handlesJhs =
      department.includes("junior") ||
      department.includes("jhs") ||
      subjectArea.includes("junior") ||
      subjectArea.includes("jhs");

    if (handlesShs && handlesJhs) return "Cross-Level Teachers";
    if (handlesShs) return "Senior High School Teachers";
    if (handlesJhs) return "Junior High School Teachers";

    return person.subjectArea || person.department || "Subject Teachers";
  }

  if (person.displayGroup === "School Support Personnel") {
    if (position.includes("guard")) return "Security Guards";
    if (position.includes("utility")) return "Utility Workers";
    if (position.includes("job order") || category.includes("job order")) {
      return "Job Order Personnel";
    }

    return "School Support Personnel";
  }

  return designations || "Personnel";
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
      record.displayName?.trim() ||
      record.name?.trim() ||
      buildFallbackDisplayName(record);

    const displayGroup =
      record.displayGroup?.trim() || inferDisplayGroup(record);

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
      groupOrder: toNumber(record.groupOrder, groupOrder[displayGroup] || 99),
      subGroupOrder: toNumber(record.subGroupOrder, 99),
      personOrder: toNumber(record.personOrder, toNumber(record.order, 999)),
      photoUrl: record.photoUrl || "/personnel/placeholder.jpg",
      status: record.status || "Active",
    };

    const finalSubGroup = inferSubGroup(person);

    return {
      ...person,
      subGroup: finalSubGroup,
      subGroupOrder: toNumber(
        record.subGroupOrder,
        subgroupOrder[finalSubGroup] || 99
      ),
    };
  });
}

function getDisplayEntries(personnel: Personnel[]) {
  return personnel.flatMap((person) => {
    const groups = uniqueList([
      person.displayGroup,
      ...person.additionalGroups
        .split("|")
        .map((group) => group.trim())
        .filter(Boolean),
    ]);

    return groups.map((group) => {
      const isPrimaryGroup = group === person.displayGroup;

      return {
        person,
        displayGroup: group,
        subGroup: isPrimaryGroup
          ? person.subGroup
          : person.subjectArea || person.department || "Personnel",
        groupOrder: groupOrder[group] || person.groupOrder || 99,
        subGroupOrder: isPrimaryGroup
          ? person.subGroupOrder
          : subgroupOrder[person.subjectArea] || 99,
        personOrder: person.personOrder || person.order || 999,
      };
    });
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

function getSearchableText(entry: PersonnelEntry) {
  const person = entry.person;

  return [
    person.name,
    person.position,
    person.category,
    person.department,
    person.subjectArea,
    person.displayGroup,
    person.subGroup,
    entry.displayGroup,
    entry.subGroup,
    ...getAllDesignations(person),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
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

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5 text-slate-400"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
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
        <img
          src={person.photoUrl}
          alt={`${person.name} profile photo`}
          className="h-full w-full object-cover"
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

function PersonCard({
  entry,
  onSelect,
}: {
  entry: PersonnelEntry;
  onSelect: (entry: PersonnelEntry) => void;
}) {
  const { person } = entry;
  const designations = getAllDesignations(person);
  const extraRolesCount = Math.max(designations.length - 1, 0);

  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      className="rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-[#0F4C5C]/30 hover:shadow-md"
    >
      <button
        type="button"
        onClick={() => onSelect(entry)}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <ProfileImage person={person} />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-black text-[#071E29] sm:text-lg">
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

        <div className="hidden h-10 w-10 flex-none items-center justify-center rounded-2xl bg-slate-50 text-[#0F4C5C] sm:flex">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
    </motion.article>
  );
}

function ProfilePanel({
  entry,
  onClose,
}: {
  entry: PersonnelEntry | null;
  onClose: () => void;
}) {
  const person = entry?.person;
  const designations = person ? getAllDesignations(person) : [];

  return (
    <AnimatePresence>
      {entry && person && (
        <>
          <motion.button
            type="button"
            aria-label="Close profile panel"
            className="fixed inset-0 z-[1000] bg-slate-950/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed right-0 top-0 z-[1001] flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl"
            aria-label="Personnel profile details"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                Personnel Profile
              </p>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="overflow-hidden rounded-[2rem] bg-[#ECFDF5] p-5">
                <ProfileImage person={person} size="large" />
              </div>

              <h2 className="mt-6 text-3xl font-black leading-tight text-[#071E29]">
                {person.name}
              </h2>

              <p className="mt-2 text-lg font-black text-[#0F4C5C]">
                {person.position || "Position not specified"}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Directory Group
                  </p>
                  <p className="mt-2 font-bold text-slate-800">
                    {entry.displayGroup}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Section
                  </p>
                  <p className="mt-2 font-bold text-slate-800">
                    {entry.subGroup || "Personnel"}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Department
                  </p>
                  <p className="mt-2 font-bold text-slate-800">
                    {person.department || "Not specified"}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Subject / Assignment
                  </p>
                  <p className="mt-2 font-bold text-slate-800">
                    {person.subjectArea || "Not specified"}
                  </p>
                </div>
              </div>

              {designations.length > 0 && (
                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Designation{designations.length > 1 ? "s" : ""}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default function OrganizationPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedEntry, setSelectedEntry] = useState<PersonnelEntry | null>(
    null
  );
  const [openGroups, setOpenGroups] = useState<string[]>([]);

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
            if (a.subGroupOrder !== b.subGroupOrder) {
              return a.subGroupOrder - b.subGroupOrder;
            }
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
        if (a.subGroupOrder !== b.subGroupOrder) {
          return a.subGroupOrder - b.subGroupOrder;
        }
        if (a.personOrder !== b.personOrder) return a.personOrder - b.personOrder;
        return a.person.name.localeCompare(b.person.name);
      }),
    [personnel]
  );

  const availableGroups = useMemo(() => {
    const groups = Array.from(
      new Set(displayEntries.map((entry) => entry.displayGroup))
    );

    return groups.sort((a, b) => {
      const aOrder = groupOrder[a] || 99;
      const bOrder = groupOrder[b] || 99;

      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.localeCompare(b);
    });
  }, [displayEntries]);

  useEffect(() => {
    if (availableGroups.length > 0 && openGroups.length === 0) {
      setOpenGroups(availableGroups.slice(0, 2));
    }
  }, [availableGroups, openGroups.length]);

  const filteredEntries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return displayEntries.filter((entry) => {
      const matchesSearch =
        query === "" || getSearchableText(entry).includes(query);

      const matchesGroup =
        selectedGroup === "All" || entry.displayGroup === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [displayEntries, searchTerm, selectedGroup]);

  const groupedEntries = useMemo(
    () => groupEntriesByDisplayGroup(filteredEntries),
    [filteredEntries]
  );

  const orderedGroups = useMemo(() => {
    return Object.keys(groupedEntries).sort((a, b) => {
      const aOrder = groupOrder[a] || groupedEntries[a][0]?.groupOrder || 99;
      const bOrder = groupOrder[b] || groupedEntries[b][0]?.groupOrder || 99;

      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.localeCompare(b);
    });
  }, [groupedEntries]);

  const allVisibleGroupsOpen =
    orderedGroups.length > 0 &&
    orderedGroups.every((group) => openGroups.includes(group));

  function toggleGroup(group: string) {
    setOpenGroups((current) =>
      current.includes(group)
        ? current.filter((item) => item !== group)
        : [...current, group]
    );
  }

  function toggleAllGroups() {
    setOpenGroups(allVisibleGroupsOpen ? [] : orderedGroups);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-950">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 pb-14 pt-32 sm:pt-36 lg:pt-40">
          <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-200/50 blur-3xl" />

          <div className={`relative mx-auto w-full ${pagePadding}`}>
            <div className="mx-auto max-w-5xl text-center">
              <BrandHeader />

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-8 text-sm font-black uppercase tracking-widest text-[#0F4C5C]"
              >
                School Directory
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="mx-auto mt-4 max-w-5xl text-4xl font-black leading-tight tracking-tight text-[#071E29] sm:text-5xl lg:text-6xl"
              >
                Personnel Roster and School Organization
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700"
              >
                Browse personnel by leadership, coordination, department,
                advisory assignment, subject area, and school support function.
              </motion.p>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-8">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <motion.div
              {...fadeUp}
              className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center"
            >
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                  Directory Notice
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#071E29]">
                  Public-facing personnel information only.
                </h2>
                <p className="mt-3 leading-7 text-slate-700">
                  This page displays name, position, designation, department,
                  and school assignment for official school communication and
                  public reference.
                </p>
              </div>

              <div className="rounded-3xl border border-[#0F4C5C]/15 bg-[#ECFDF5] p-5">
                <p className="text-sm font-bold leading-7 text-[#0F4C5C]">
                  Use the search and filter tools below to quickly locate
                  personnel by name, role, subject area, or school function.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-slate-50 py-10">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <motion.div {...fadeUp} className="mb-8 max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                Personnel Directory
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071E29] sm:text-4xl">
                Organized by school function and assignment
              </h2>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="sticky top-20 z-30 mb-8 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_260px_auto_auto] lg:items-center">
                <label className="relative block">
                  <span className="sr-only">Search personnel</span>
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <SearchIcon />
                  </span>
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by name, position, designation, department, or subject..."
                    className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0F4C5C] focus:ring-4 focus:ring-[#0F4C5C]/10"
                  />
                </label>

                <label className="block">
                  <span className="sr-only">Filter by group</span>
                  <select
                    value={selectedGroup}
                    onChange={(event) => setSelectedGroup(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-black text-[#071E29] outline-none transition focus:border-[#0F4C5C] focus:ring-4 focus:ring-[#0F4C5C]/10"
                  >
                    <option value="All">All Groups</option>
                    {availableGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={toggleAllGroups}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-black text-[#0F4C5C] transition hover:bg-[#ECFDF5]"
                >
                  {allVisibleGroupsOpen ? "Collapse All" : "Expand All"}
                </button>

                <div className="rounded-2xl bg-[#0F4C5C] px-5 py-4 text-center text-sm font-black text-white">
                  {filteredEntries.length} result
                  {filteredEntries.length === 1 ? "" : "s"}
                </div>
              </div>
            </motion.div>

            {loading ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                  Loading Roster
                </p>
                <p className="mt-3 text-slate-700">
                  Please wait while the personnel roster is being loaded.
                </p>
              </section>
            ) : personnel.length === 0 ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                  No Active Personnel Found
                </p>
                <p className="mt-3 text-slate-700">
                  Check <strong>public/data/personnel.csv</strong> and make
                  sure at least one row has <strong>status</strong> set to{" "}
                  <strong>Active</strong>.
                </p>
              </section>
            ) : filteredEntries.length === 0 ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                  No Matching Personnel
                </p>
                <p className="mt-3 text-slate-700">
                  Try another search keyword or select a different group.
                </p>
              </section>
            ) : (
              <section className="space-y-5">
                {orderedGroups.map((group) => {
                  const entries = groupedEntries[group];
                  const subGroupedEntries = groupEntriesBySubGroup(entries);
                  const subGroups = Object.keys(subGroupedEntries).sort(
                    (a, b) => {
                      const aEntry = subGroupedEntries[a][0];
                      const bEntry = subGroupedEntries[b][0];

                      if (aEntry.subGroupOrder !== bEntry.subGroupOrder) {
                        return aEntry.subGroupOrder - bEntry.subGroupOrder;
                      }

                      return a.localeCompare(b);
                    }
                  );

                  const isOpen =
                    searchTerm.trim() !== "" ||
                    selectedGroup !== "All" ||
                    openGroups.includes(group);

                  return (
                    <motion.article
                      key={group}
                      layout
                      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => toggleGroup(group)}
                        className="flex w-full flex-col gap-4 p-6 text-left lg:flex-row lg:items-center lg:justify-between"
                        aria-expanded={isOpen}
                      >
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0F4C5C]">
                            {group}
                          </p>
                          <h3 className="mt-2 text-2xl font-black tracking-tight text-[#071E29]">
                            {group}
                          </h3>
                          <p className="mt-2 max-w-3xl leading-7 text-slate-700">
                            {groupDescriptions[group] ||
                              "Personnel grouped according to school function and assignment."}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-black text-[#0F4C5C]">
                            {entries.length} personnel
                          </span>

                          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-[#0F4C5C]">
                            <svg
                              className={`h-5 w-5 transition-transform ${
                                isOpen ? "rotate-180" : ""
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
                          </span>
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-8 border-t border-slate-100 bg-slate-50 p-5 sm:p-6">
                              {subGroups.map((subGroup) => (
                                <div key={`${group}-${subGroup}`}>
                                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#0F4C5C] ring-1 ring-slate-200">
                                      {subGroup}
                                    </p>

                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                      {subGroupedEntries[subGroup].length} item
                                      {subGroupedEntries[subGroup].length === 1
                                        ? ""
                                        : "s"}
                                    </p>
                                  </div>

                                  <div className="grid gap-4">
                                    {subGroupedEntries[subGroup].map((entry) => (
                                      <PersonCard
                                        key={`${entry.displayGroup}-${entry.subGroup}-${entry.person.order}-${entry.person.name}`}
                                        entry={entry}
                                        onSelect={setSelectedEntry}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.article>
                  );
                })}
              </section>
            )}
          </div>
        </section>
      </main>

      <ProfilePanel entry={selectedEntry} onClose={() => setSelectedEntry(null)} />

      <Footer />
    </>
  );
}