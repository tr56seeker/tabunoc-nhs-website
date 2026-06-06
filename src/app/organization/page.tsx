"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/components/Footer";
import PersonnelCard from "@/components/PersonnelCard";
import PersonnelModal from "@/components/PersonnelModal";

import type { Personnel, PersonnelRole } from "@/data/organization";

type SubjectDepartmentEntry = {
  person: Personnel;
  department: string;
  isPrimaryDepartment: boolean;
};

const roleFilters: Array<"All" | PersonnelRole> = [
  "All",
  "Principal",
  "Administrative",
  "Guidance",
  "Master Teacher",
  "Grade Leader",
  "SHS Coordinator",
  "Class Adviser",
  "Subject Teacher",
  "Program Implementer",
];

const defaultGradeLevels = [
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

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
  return String(header ?? "")
    .replace(/^\uFEFF/, "")
    .trim();
}

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

function splitList(value?: string | null) {
  return safeText(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueList(items: Array<string | undefined | null>) {
  return Array.from(
    new Set(items.map((item) => safeText(item)).filter(Boolean))
  );
}

function slugify(value: string) {
  return safeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildFallbackDisplayName(record: Record<string, string>) {
  return [
    record.firstName,
    record.middleInitial,
    record.lastName,
    record.suffix,
  ]
    .map((item) => safeText(item))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function getAllDesignationsFromRecord(record: Record<string, string>) {
  return uniqueList([
    record.designation1,
    record.designation2,
    record.designation3,
    record.designation4,
    record.primaryDesignation,
    ...splitList(record.otherDesignations),
  ]);
}

function getGradeRank(grade: string) {
  const match = safeText(grade).match(/\d+/);
  return match ? Number(match[0]) : 99;
}

function extractGradeLevel(record: Record<string, string>) {
  const sourceText = [
    record.advisoryGradeLevel,
    record.gradeLevel,
    record.grade,
    record.advisory,
    record.advisoryClass,
    record.section,
    record.sectionsHandled,
    record.department,
    record.subjectArea,
    record.subGroup,
    record.displayGroup,
    record.designation1,
    record.designation2,
    record.designation3,
    record.designation4,
    record.otherDesignations,
  ]
    .map((item) => safeText(item))
    .filter(Boolean)
    .join(" ");

  const gradeFirst = sourceText.match(/grade\s*(7|8|9|10|11|12)/i);
  if (gradeFirst) return `Grade ${gradeFirst[1]}`;

  const numberFirst = sourceText.match(
    /\b(7|8|9|10|11|12)(st|nd|rd|th)?\s*grade\b/i
  );
  if (numberFirst) return `Grade ${numberFirst[1]}`;

  return "";
}

function extractSection(record: Record<string, string>) {
  return (
    safeText(record.advisorySection) ||
    safeText(record.section) ||
    safeText(record.sectionsHandled) ||
    safeText(record.advisoryClass)
  );
}

function normalizeLeadershipText(value: string) {
  return safeText(value)
    .toLowerCase()
    .replace(/[–—-]/g, " ")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isExactShsCoordinatorDesignation(value: string) {
  const text = safeText(value)
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  return text === "shs coordinator" || text === "senior high school coordinator";
}

function isGradeLeaderDesignationText(value: string) {
  const text = safeText(value)
    .toLowerCase()
    .replace(/[–—-]/g, " ")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return false;

  // Do not treat coordinatorship as grade leadership.
  // SHS Coordinator is handled separately by exact matching only.
  if (text.includes("coordinator")) return false;

  // Class Adviser alone is not a Grade Leader.
  const isOnlyClassAdviser =
    text.includes("class adviser") &&
    !text.includes("grade leader") &&
    !text.includes("chairperson") &&
    !text.includes("chairman") &&
    !text.includes("chair");

  if (isOnlyClassAdviser) return false;

  const hasGrade =
    /\bgrade\s*(7|8|9|10|11|12)\b/i.test(text) ||
    /\b(7|8|9|10|11|12)(?:st|nd|rd|th)?\s*grade\b/i.test(text) ||
    /\bgrade\s*11\s*(and|&)\s*12\b/i.test(text);

  const hasLeaderKeyword =
    /\bgrade\s*leader\b/i.test(text) ||
    /\bleader\b/i.test(text) ||
    /\bgrade\s*level\s*(chairperson|chairman|chair)\b/i.test(text) ||
    /\b(chairperson|chairman|chair)\b/i.test(text);

  return hasGrade && hasLeaderKeyword;
}

function isGradeLeaderOrShsCoordinatorDesignation(value: string) {
  return (
    isExactShsCoordinatorDesignation(value) ||
    isGradeLeaderDesignationText(value)
  );
}

function inferRoles(record: Record<string, string>): PersonnelRole[] {
  const position = safeText(record.position).toLowerCase();
  const category = safeText(record.category).toLowerCase();
  const department = safeText(record.department).toLowerCase();
  const displayGroup = safeText(record.displayGroup).toLowerCase();
  const subGroup = safeText(record.subGroup).toLowerCase();
  const designation1Text = safeText(record.designation1).toLowerCase();

  const designationText = getAllDesignationsFromRecord(record)
    .join(" ")
    .toLowerCase();

  const roles: PersonnelRole[] = [];

  if (
    position.includes("principal") ||
    designationText.includes("school head") ||
    subGroup.includes("school head")
  ) {
    roles.push("Principal");
  }

  if (
    position.includes("administrative officer") ||
    position.includes("administrative assistant") ||
    position.includes("administrative aide") ||
    position.includes("registrar") ||
    position.includes("nurse") ||
    position.includes("librarian") ||
    position.includes("security guard") ||
    position.includes("utility") ||
    position.includes("job order") ||
    category.includes("non-teaching") ||
    category.includes("administrative") ||
    category.includes("job order") ||
    category.includes("security") ||
    department.includes("administration") ||
    department.includes("support") ||
    department.includes("security") ||
    displayGroup.includes("administrative staff") ||
    displayGroup.includes("school support") ||
    subGroup.includes("administrative officer") ||
    subGroup.includes("administrative assistant") ||
    subGroup.includes("job order") ||
    subGroup.includes("security")
  ) {
    roles.push("Administrative");
  }

  if (
    position.includes("guidance") ||
    designationText.includes("guidance") ||
    subGroup.includes("guidance")
  ) {
    roles.push("Guidance");
  }

  if (
    position.includes("master teacher") ||
    displayGroup.includes("master teacher") ||
    subGroup.includes("master teacher")
  ) {
    roles.push("Master Teacher");
  }

  const designationItems = getAllDesignationsFromRecord(record);

  const hasActualGradeLeaderDesignation = designationItems.some((item) =>
    isGradeLeaderDesignationText(item)
  );

  const hasExactShsCoordinatorDesignation = designationItems.some((item) =>
    isExactShsCoordinatorDesignation(item)
  );

  if (hasActualGradeLeaderDesignation || hasExactShsCoordinatorDesignation) {
    roles.push("Grade Leader");
  }

  if (hasExactShsCoordinatorDesignation) {
    roles.push("SHS Coordinator");
  }

  const isClassAdviser =
    designationText.includes("class adviser") ||
    displayGroup.includes("senior high school department") ||
    displayGroup.includes("junior high school department") ||
    subGroup.includes("class adviser");

  if (isClassAdviser) {
    roles.push("Class Adviser");
  }

  const hasHandledSubject =
    isMeaningfulText(record.subjectArea) ||
    isMeaningfulText(record.primarySubjectDepartment) ||
    isMeaningfulText(record.subjectDepartment) ||
    isMeaningfulText(record.subjectDepartment1) ||
    isMeaningfulText(record.subjectDepartment2) ||
    isMeaningfulText(record.subjectDepartment3) ||
    isMeaningfulText(record.subjectDepartment4) ||
    isMeaningfulText(record.subjectDepartment5) ||
    isMeaningfulText(record.subject1) ||
    isMeaningfulText(record.subject2) ||
    isMeaningfulText(record.subject3) ||
    isMeaningfulText(record.subject4) ||
    isMeaningfulText(record.subject5) ||
    isMeaningfulText(record.subjectTaught) ||
    isMeaningfulText(record.subjectsTaught);

  const isAcademicTeachingPersonnel =
    position.includes("teacher") ||
    position.includes("master teacher") ||
    (category.includes("teaching") && !category.includes("non-teaching")) ||
    displayGroup.includes("subject teacher") ||
    subGroup.includes("subject teacher") ||
    designationText.includes("class adviser") ||
    displayGroup.includes("senior high school department") ||
    displayGroup.includes("junior high school department");

  const isNonTeachingSupport =
    position.includes("administrative officer") ||
    position.includes("administrative assistant") ||
    position.includes("administrative aide") ||
    position.includes("guidance") ||
    position.includes("job order") ||
    position.includes("utility") ||
    position.includes("security guard") ||
    category.includes("non-teaching") ||
    category.includes("job order") ||
    category.includes("security") ||
    displayGroup.includes("school support") ||
    displayGroup.includes("administrative staff") ||
    subGroup.includes("job order") ||
    subGroup.includes("security");

  if (isAcademicTeachingPersonnel && !isNonTeachingSupport && hasHandledSubject) {
    roles.push("Subject Teacher");
  }

  const hasCoordinatorDesignation =
    designation1Text.includes("coordinator") ||
    designationText.includes("coordinator");

  const isProgramImplementer =
    hasCoordinatorDesignation ||
    designationText.includes("focal") ||
    designationText.includes("pio") ||
    designationText.includes("manager") ||
    designationText.includes("property custodian") ||
    designationText.includes("school paper adviser") ||
    designationText.includes("sslg adviser") ||
    designationText.includes("yes-o adviser") ||
    designationText.includes("bkd adviser") ||
    displayGroup.includes("program coordinator") ||
    displayGroup.includes("program implementer") ||
    subGroup.includes("program coordinator");

  if (isProgramImplementer) {
    roles.push("Program Implementer");
  }

  return uniqueList(roles) as PersonnelRole[];
}

function buildAdvisory(record: Record<string, string>) {
  const gradeLevel = extractGradeLevel(record);
  const section = extractSection(record);

  const displayGroup = safeText(record.displayGroup).toLowerCase();
  const subGroup = safeText(record.subGroup).toLowerCase();

  const designationText = getAllDesignationsFromRecord(record)
    .join(" ")
    .toLowerCase();

  const isClassAdviser =
    designationText.includes("class adviser") ||
    displayGroup.includes("senior high school department") ||
    displayGroup.includes("junior high school department") ||
    subGroup.includes("class adviser");

  if (!isClassAdviser || !gradeLevel) {
    return [];
  }

  return [
    {
      gradeLevel,
      section: section || "Advisory Class",
    },
  ];
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

    const name =
      safeText(record.displayName) ||
      safeText(record.name) ||
      buildFallbackDisplayName(record) ||
      "Unnamed Personnel";

    const designation = getAllDesignationsFromRecord(record);
    const roles = inferRoles(record);
    const advisory = buildAdvisory(record);

    const rawPrimarySubjectDepartment =
      safeText(record.primarySubjectDepartment) ||
      safeText(record.subjectDepartment) ||
      safeText(record.subjectDepartment1) ||
      safeText(record.subjectArea) ||
      safeText(record.subject1) ||
      safeText(record.subjectTaught) ||
      safeText(record.subjectsTaught) ||
      "";

    const primarySubjectDepartment = normalizeSubjectDepartment(
      rawPrimarySubjectDepartment
    );

    const subjectDepartment = safeText(record.subjectDepartment)
      ? normalizeSubjectDepartment(record.subjectDepartment)
      : primarySubjectDepartment;

    const subjectDepartment1 = safeText(record.subjectDepartment1)
      ? normalizeSubjectDepartment(record.subjectDepartment1)
      : subjectDepartment;

    const subjectDepartment2 = safeText(record.subjectDepartment2)
      ? normalizeSubjectDepartment(record.subjectDepartment2)
      : "";

    const subjectDepartment3 = safeText(record.subjectDepartment3)
      ? normalizeSubjectDepartment(record.subjectDepartment3)
      : "";

    const subjectDepartment4 = safeText(record.subjectDepartment4)
      ? normalizeSubjectDepartment(record.subjectDepartment4)
      : "";

    const subjectDepartment5 = safeText(record.subjectDepartment5)
      ? normalizeSubjectDepartment(record.subjectDepartment5)
      : "";

    const explicitSubjects = uniqueList([
      ...splitList(record.subject1),
      ...splitList(record.subject2),
      ...splitList(record.subject3),
      ...splitList(record.subject4),
      ...splitList(record.subject5),
      ...splitList(record.subjectTaught),
      ...splitList(record.subjectsTaught),
    ]);

    const subjectTaught =
      explicitSubjects.length > 0
        ? explicitSubjects
        : uniqueList([...splitList(record.subjectArea)]);

    const coordinatorship = designation.filter((item) => {
      const text = item.toLowerCase();

      return (
        text.includes("coordinator") ||
        text.includes("focal") ||
        text.includes("pio") ||
        text.includes("manager") ||
        text.includes("property custodian")
      );
    });

    const gradeLevelTaught = uniqueList([
      ...splitList(record.gradeLevelTaught),
      ...splitList(record.teachingLevel),
      ...advisory.map((item) => item.gradeLevel),
    ]);

    const sectionsHandled = uniqueList([
      ...splitList(record.sectionsHandled),
      ...splitList(record.section),
      ...advisory.map((item) => item.section),
    ]);

    const profileId = safeText(record.id) || slugify(name);
    const photoUrl = safeText(record.photoUrl) || "/personnel/placeholder.jpg";

    const personnel = {
      id: profileId,
      name,
      position: safeText(record.position),
      group: safeText(record.displayGroup) || safeText(record.category),
      department: safeText(record.department),
      bio: safeText(record.bio),
      description:
        safeText(record.description) ||
        safeText(record.designation1) ||
        safeText(record.subjectArea) ||
        safeText(record.department),
      roles,
      designation,
      subjectArea: safeText(record.subjectArea),
      primarySubjectDepartment, 
      subjectTaught,
      coordinatorship,
      gradeLevelTaught,
      sectionsHandled,
      advisory,

      subjectDepartment,
      teachingPhilosophy:
        safeText(record.teachingPhilosophy) || safeText(record.philosophy),
      philosophy:
        safeText(record.teachingPhilosophy) || safeText(record.philosophy),
      email: safeText(record.email),
      consultationSchedule: safeText(record.consultationSchedule),
      contactNote: safeText(record.contactNote),
      facebook: safeText(record.facebook),
      facebookUrl: safeText(record.facebookUrl),
      messenger: safeText(record.messenger),
      linkedin: safeText(record.linkedin),
      linkedinUrl: safeText(record.linkedinUrl),
      website: safeText(record.website),
      portfolioUrl: safeText(record.portfolioUrl),

      photoUrl,
      image: photoUrl,
      avatar: photoUrl,
      photo: photoUrl,
      imageUrl: photoUrl,
      profileImage: photoUrl,
      profilePhoto: photoUrl,

      status: safeText(record.status) || "Active",
      order: Number(record.order || 999),
      personOrder: Number(record.personOrder || record.order || 999),
    };

    return personnel as unknown as Personnel;
  });
}

function getSearchableText(person: Personnel) {
  return [
    person.name,
    person.position,
    person.group,
    person.department,
    person.bio,
    person.description,
    ...(person.roles || []),
    ...(person.designation || []),
    ...(person.subjectTaught || []),
    ...(person.coordinatorship || []),
    ...(person.gradeLevelTaught || []),
    ...(person.sectionsHandled || []),
    ...(person.advisory || []).map((item) => item?.gradeLevel || ""),
    ...(person.advisory || []).map((item) => item?.section || ""),
  ]
    .map((item) => safeText(item))
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getGradeLeaderRank(person: Personnel) {
  const designationItems = uniqueList([...(person.designation || [])]);

  if (designationItems.some((item) => isExactShsCoordinatorDesignation(item))) {
    return 0;
  }

  const leadershipText = designationItems
    .map((item) =>
      safeText(item)
        .toLowerCase()
        .replace(/[–—-]/g, " ")
        .replace(/[()]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .join(" ");

  if (
    /\bgrade\s*11\s*(and|&)\s*12\b/i.test(leadershipText) ||
    /\bgrade\s*(11|12)\b/i.test(leadershipText) ||
    /\b(11|12)(?:st|nd|rd|th)?\s*grade\b/i.test(leadershipText)
  ) {
    return 1;
  }

  const gradeOrder: Record<string, number> = {
    "10": 2,
    "9": 3,
    "8": 4,
    "7": 5,
  };

  const gradeFirst = leadershipText.match(/grade\s*(7|8|9|10)/i);
  if (gradeFirst) {
    return gradeOrder[gradeFirst[1]] ?? 99;
  }

  const numberFirst = leadershipText.match(
    /\b(7|8|9|10)(?:st|nd|rd|th)?\s*grade/i
  );
  if (numberFirst) {
    return gradeOrder[numberFirst[1]] ?? 99;
  }

  return 99;
}

function getTeacherPositionRank(position: string) {
  const normalizedPosition = safeText(position)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  const rankOrder = [
    "master teacher v",
    "master teacher iv",
    "master teacher iii",
    "master teacher ii",
    "master teacher i",
    "teacher vii",
    "teacher vi",
    "teacher v",
    "teacher iv",
    "teacher iii",
    "teacher ii",
    "teacher i",
  ];

  const rankIndex = rankOrder.findIndex((rank) =>
    normalizedPosition.includes(rank)
  );

  return rankIndex === -1 ? 999 : rankIndex + 1;
}

function normalizeSubjectDepartment(value: string) {
  const normalized = safeText(value)
    .replace(/\bgrade\s*(7|8|9|10|11|12)\b/gi, "")
    .replace(/\bg(7|8|9|10|11|12)\b/gi, "")
    .replace(/\b(7|8|9|10|11|12)\b/g, "")
    .replace(/\s*(&|and|to|-|\/)\s*$/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return normalized || "Unassigned";
}

function isSchoolSupportPersonnel(person: Personnel) {
  const text = [
    person.name,
    person.position,
    person.group,
    person.department,
    person.description,
    ...(person.designation || []),
  ]
    .join(" ")
    .toLowerCase();

  return (
    text.includes("job order") ||
    text.includes("utility") ||
    text.includes("utility support") ||
    text.includes("security guard") ||
    text.includes("security personnel") ||
    text.includes("school support personnel") ||
    text.includes("support staff")
  );
}

function isAdministrativeOnlyPersonnel(person: Personnel) {
  const text = [
    person.name,
    person.position,
    person.group,
    person.department,
    person.description,
    ...(person.designation || []),
  ]
    .join(" ")
    .toLowerCase();

  return (
    text.includes("administrative officer") ||
    text.includes("administrative assistant") ||
    text.includes("administrative aide") ||
    text.includes("guidance counselor") ||
    text.includes("guidance personnel") ||
    text.includes("guidance") ||
    text.includes("registrar")
  );
}

function isAcademicTeacherPersonnel(person: Personnel) {
  const text = [
    person.name,
    person.position,
    person.group,
    person.department,
    person.description,
    ...(person.designation || []),
  ]
    .join(" ")
    .toLowerCase();

  const extendedPerson = person as Personnel & {
    primarySubjectDepartment?: string;
    subjectArea?: string;
    subjectDepartment?: string;
    subjectDepartment1?: string;
    subjectDepartment2?: string;
    subjectDepartment3?: string;
    subjectDepartment4?: string;
    subjectDepartment5?: string;
  };

  const hasHandledSubject =
    (person.subjectTaught || []).some((subject) => isMeaningfulText(subject)) ||
    isMeaningfulText(extendedPerson.subjectArea) ||
    isMeaningfulText(extendedPerson.primarySubjectDepartment) ||
    isMeaningfulText(extendedPerson.subjectDepartment) ||
    isMeaningfulText(extendedPerson.subjectDepartment1) ||
    isMeaningfulText(extendedPerson.subjectDepartment2) ||
    isMeaningfulText(extendedPerson.subjectDepartment3) ||
    isMeaningfulText(extendedPerson.subjectDepartment4) ||
    isMeaningfulText(extendedPerson.subjectDepartment5);

  const isTeacher =
    text.includes("teacher") ||
    text.includes("master teacher") ||
    text.includes("class adviser") ||
    text.includes("subject teacher");

  return (
    isTeacher &&
    hasHandledSubject &&
    !person.roles.includes("Principal") &&
    !isAdministrativeOnlyPersonnel(person) &&
    !isSchoolSupportPersonnel(person)
  );
}

function getSchoolSupportRank(person: Personnel) {
  const text = [
    person.position,
    person.group,
    person.department,
    person.description,
    ...(person.designation || []),
  ]
    .join(" ")
    .toLowerCase();

  if (
    text.includes("job order") ||
    text.includes("utility") ||
    text.includes("utility support")
  ) {
    return 1;
  }

  if (
    text.includes("security guard") ||
    text.includes("security personnel") ||
    text.includes("security")
  ) {
    return 2;
  }

  return 99;
}

function getSubjectDepartmentsForPerson(person: Personnel) {
  const extendedPerson = person as Personnel & {
    primarySubjectDepartment?: string;
    subjectArea?: string;
    subjectDepartment?: string;
    subjectDepartment1?: string;
    subjectDepartment2?: string;
    subjectDepartment3?: string;
    subjectDepartment4?: string;
    subjectDepartment5?: string;
  };

  const rawPrimaryDepartment =
    safeText(extendedPerson.primarySubjectDepartment) ||
    safeText(extendedPerson.subjectDepartment) ||
    safeText(extendedPerson.subjectDepartment1) ||
    safeText(extendedPerson.subjectArea) ||
    safeText((person.subjectTaught || [])[0]) ||
    "Unassigned";

  const primaryDepartment = normalizeSubjectDepartment(rawPrimaryDepartment);

  const additionalDepartments = uniqueList([
    extendedPerson.subjectDepartment,
    extendedPerson.subjectDepartment1,
    extendedPerson.subjectDepartment2,
    extendedPerson.subjectDepartment3,
    extendedPerson.subjectDepartment4,
    extendedPerson.subjectDepartment5,
  ])
    .map((department) => normalizeSubjectDepartment(department))
    .filter(
      (department) =>
        department !== "Unassigned" && department !== primaryDepartment
    );

  return uniqueList([primaryDepartment, ...additionalDepartments]);
}

function getSubjectDepartmentEntriesForPerson(
  person: Personnel
): SubjectDepartmentEntry[] {
  const departments = getSubjectDepartmentsForPerson(person);
  const primaryDepartment = departments[0] || "Unassigned";

  return departments.map((department) => ({
    person,
    department,
    isPrimaryDepartment: department === primaryDepartment,
  }));
}

function getSubjectDepartmentRank(department: string) {
  const normalizedDepartment = safeText(department).toLowerCase();

  const departmentOrder = [
    "english",
    "filipino",
    "values education",
    "mathematics",
    "math",
    "science",
    "araling panlipunan",
    "ap",
    "mapeh",
    "tle",
    "tvl",
    "electrical installation and maintenance",
    "eim",
    "computer systems servicing",
    "css",
    "electronic products assembly and servicing",
    "epas",
    "unassigned",
  ];

  const rankIndex = departmentOrder.findIndex((departmentName) =>
    normalizedDepartment.includes(departmentName)
  );

  return rankIndex === -1 ? 999 : rankIndex + 1;
}

export default function OrganizationPage() {
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedSubjectDepartment, setSelectedSubjectDepartment] = useState("All");
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<"All" | PersonnelRole>("All");
  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
            const status = safeText(
              (person as Personnel & { status?: string }).status
            ).toLowerCase();

            const hasRealName =
              person.name &&
              person.name !== "Unnamed Personnel" &&
              !person.name.toLowerCase().includes("firstname") &&
              !person.name.toLowerCase().includes("lastname");

            const isVisible =
              status === "" ||
              status === "active" ||
              status === "published" ||
              status === "show";

            return hasRealName && isVisible;
          })
          .sort((a, b) => {
            const aOrder = Number(
              (a as Personnel & { personOrder?: number }).personOrder || 999
            );
            const bOrder = Number(
              (b as Personnel & { personOrder?: number }).personOrder || 999
            );

            if (aOrder !== bOrder) return aOrder - bOrder;

            return a.name.localeCompare(b.name);
          });

        setAllPersonnel(activePersonnel);
      } catch (error) {
        console.error(error);
        setAllPersonnel([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadPersonnel();
  }, []);

  useEffect(() => {
    if (allPersonnel.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const profileId = params.get("profile");

    if (!profileId) return;

    const matchedPerson = allPersonnel.find((person) => person.id === profileId);

    if (matchedPerson) {
      setSelectedPerson(matchedPerson);
    }
  }, [allPersonnel]);

  const leadership = useMemo(() => {
    return allPersonnel.filter((person) => person.roles.includes("Principal"));
  }, [allPersonnel]);

  const administrativePersonnel = useMemo(() => {
    return allPersonnel.filter(
      (person) =>
        !person.roles.includes("Principal") &&
        !isSchoolSupportPersonnel(person) &&
        (person.roles.includes("Administrative") ||
          person.roles.includes("Guidance"))
    );
  }, [allPersonnel]);

  const schoolSupportPersonnel = useMemo(() => {
    return allPersonnel
      .filter((person) => isSchoolSupportPersonnel(person))
      .sort((a, b) => {
        const rankA = getSchoolSupportRank(a);
        const rankB = getSchoolSupportRank(b);

        if (rankA !== rankB) return rankA - rankB;

        return a.name.localeCompare(b.name);
      });
  }, [allPersonnel]);

  const masterTeachers = useMemo(() => {
    return allPersonnel.filter((person) =>
      person.roles.includes("Master Teacher")
    );
  }, [allPersonnel]);

  function isActualGradeLeader(person: Personnel) {
    const designationItems = uniqueList([...(person.designation || [])]);

    return designationItems.some(
      (item) =>
        isExactShsCoordinatorDesignation(item) ||
        isGradeLeaderDesignationText(item)
    );
  }

  const gradeLeaders = useMemo(() => {
    return allPersonnel.filter((person) => isActualGradeLeader(person));
  }, [allPersonnel]);

  const classAdvisers = useMemo(() => {
    return allPersonnel.filter(
      (person) =>
        person.roles.includes("Class Adviser") &&
        (person.advisory || []).length > 0
    );
  }, [allPersonnel]);

  const subjectTeachers = useMemo(() => {
    return allPersonnel.filter((person) => isAcademicTeacherPersonnel(person));
  }, [allPersonnel]);

  const subjectDepartmentEntries = useMemo(() => {
    return subjectTeachers.flatMap((person) =>
      getSubjectDepartmentEntriesForPerson(person)
    );
  }, [subjectTeachers]);

  const subjectDepartments = useMemo(() => {
    return uniqueList(
      subjectDepartmentEntries.map((entry) => entry.department)
    ).sort((a, b) => {
      const rankA = getSubjectDepartmentRank(a);
      const rankB = getSubjectDepartmentRank(b);

      if (rankA !== rankB) return rankA - rankB;

      return a.localeCompare(b);
    });
  }, [subjectDepartmentEntries]);

const visibleSubjectDepartments = useMemo(() => {
  if (selectedSubjectDepartment === "All") return subjectDepartments;

  return subjectDepartments.filter(
    (department) => department === selectedSubjectDepartment
  );
}, [selectedSubjectDepartment, subjectDepartments]);

  const programImplementers = useMemo(() => {
    return allPersonnel.filter((person) =>
      person.roles.includes("Program Implementer")
    );
  }, [allPersonnel]);

  const gradeLevels = useMemo(() => {
    const levels = uniqueList(
      classAdvisers.flatMap((person) =>
        (person.advisory || []).map((item) => item.gradeLevel)
      )
    ).sort((a, b) => getGradeRank(a) - getGradeRank(b));

    return levels.length > 0 ? levels : defaultGradeLevels;
  }, [classAdvisers]);

  const visibleGradeLevels = useMemo(() => {
    if (selectedGrade === "All") return gradeLevels;
    return gradeLevels.filter((grade) => grade === selectedGrade);
  }, [selectedGrade, gradeLevels]);

  const sortedGradeLeaders = useMemo(() => {
    return [...gradeLeaders].sort(
      (a, b) => getGradeLeaderRank(a) - getGradeLeaderRank(b)
    );
  }, [gradeLeaders]);

  const sortedProgramImplementers = useMemo(() => {
    return [...programImplementers].sort((a, b) => {
      const positionRankA = getTeacherPositionRank(a.position);
      const positionRankB = getTeacherPositionRank(b.position);

      if (positionRankA !== positionRankB) {
        return positionRankA - positionRankB;
      }

      return a.name.localeCompare(b.name);
    });
  }, [programImplementers]);

  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return allPersonnel.filter((person) => {
      const matchesRole =
        selectedRole === "All" || person.roles.includes(selectedRole);

      const matchesSearch =
        query === "" || getSearchableText(person).includes(query);

      return matchesRole && matchesSearch;
    });
  }, [allPersonnel, searchTerm, selectedRole]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white dark:bg-[#0a0908] text-slate-950 dark:text-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 dark:from-[#071E29] dark:via-slate-950 dark:to-[#0B2A36] px-5 pb-20 pt-36 text-slate-950 dark:text-white sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-200/60 blur-3xl" />

          <div className="relative mx-auto max-w-7xl text-center">
            <BrandHeader />

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300"
            >
              School Directory
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mx-auto mt-4 max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-950 dark:text-white md:text-6xl"
            >
              School Administration, Faculty, and Staff
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mx-auto mt-5 max-w-3xl text-lg leading-7 text-slate-700 dark:text-stone-200"
            >
              Meet the school administration, faculty members, advisers,
              program coordinators, and support personnel of Tabunoc National
              High School.
            </motion.p>
          </div>
        </section>

        <section className="bg-[#F8FAFC] dark:bg-[#0a0908] px-5 py-16 text-slate-950 dark:text-white sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300">
                Faculty and Personnel Directory
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                Search the School Directory
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-stone-300">
                Search by name, section, role, subject taught, position,
                designation, or program handled.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-[#292624] bg-white dark:bg-[#171614] p-5 shadow-sm dark:shadow-black/20 md:p-6">
              <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, section, subject, designation, or program..."
                  className="w-full rounded-xl border border-slate-300 dark:border-[#292624] bg-white dark:bg-[#171614] px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0F4C5C] focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50"
                />

                <select
                  value={selectedRole}
                  onChange={(event) =>
                    setSelectedRole(event.target.value as "All" | PersonnelRole)
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-[#292624] bg-white dark:bg-[#171614] px-5 py-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition focus:border-[#0F4C5C] focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/50"
                >
                  {roleFilters.map((role) => (
                    <option key={role} value={role}>
                      {role === "All"
                        ? "All Roles"
                        : role === "Program Implementer"
                          ? "Program Coordinator"
                          : role}
                    </option>
                  ))}
                </select>
              </div>

              {isLoading && (
                <div className="mt-6 rounded-xl bg-slate-100 dark:bg-[#292624] p-8 text-center">
                  <p className="font-bold text-slate-700 dark:text-stone-200">
                    Loading personnel roster...
                  </p>
                </div>
              )}

              {!isLoading &&
                (searchTerm.trim() !== "" || selectedRole !== "All") && (
                  <div className="mt-6">
                    <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                      <p className="text-sm font-bold text-slate-600 dark:text-stone-300">
                        {searchResults.length} result
                        {searchResults.length !== 1 ? "s" : ""} found
                      </p>

                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedRole("All");
                        }}
                        className="w-fit rounded-lg bg-slate-100 dark:bg-[#292624] px-4 py-2 text-sm font-black text-slate-700 dark:text-stone-200 transition hover:text-[#0F4C5C] dark:hover:text-yellow-300"
                      >
                        Clear Search
                      </button>
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {searchResults.map((person) => (
                          <PersonnelCard
                            key={person.id}
                            person={person}
                            compact
                            onClick={setSelectedPerson}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-slate-100 dark:bg-[#292624] p-8 text-center">
                        <p className="font-bold text-slate-700 dark:text-stone-200">
                          No matching personnel found.
                        </p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-stone-400">
                          Try searching by surname, grade level, section,
                          subject, designation, or role.
                        </p>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-[#0a0908] px-5 py-20 text-slate-950 dark:text-white sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300">
                School Leadership
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">
                School Leadership and Administrative Staff
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[...leadership, ...administrativePersonnel].map((person) => (
                <PersonnelCard
                  key={person.id}
                  person={person}
                  compact
                  onClick={setSelectedPerson}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] dark:bg-[#0a0908] px-5 py-20 text-slate-950 dark:text-white sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300">
                Program Coordination
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">
                Program Coordinators
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-stone-300">
                Program coordinators support school programs, committees,
                initiatives, and special assignments aligned with school
                operations, learner support, and DepEd priority programs.
              </p>
            </div>

            {sortedProgramImplementers.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sortedProgramImplementers.map((person) => (
                  <PersonnelCard
                    key={person.id}
                    person={person}
                    compact
                    onClick={setSelectedPerson}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 dark:border-[#292624] bg-white dark:bg-[#171614] p-8 text-center">
                <p className="font-bold text-slate-600 dark:text-stone-300">
                  Program coordinator profiles will be added soon.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white dark:bg-[#0a0908] px-5 py-20 text-slate-950 dark:text-white sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300">
                Instructional Leadership
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">
                Master Teachers
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-stone-300">
                Master Teachers provide instructional support, mentoring, and
                technical assistance for curriculum implementation and teaching
                practice.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {masterTeachers.map((person) => (
                <PersonnelCard
                  key={person.id}
                  person={person}
                  compact
                  onClick={setSelectedPerson}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] dark:bg-[#0a0908] px-5 py-20 text-slate-950 dark:text-white sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300">
                Grade Level Leadership
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">
                Grade Leaders
              </h2>
            </div>

            <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sortedGradeLeaders.map((person) => (
                <PersonnelCard
                  key={person.id}
                  person={person}
                  compact
                  onClick={setSelectedPerson}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] dark:bg-[#0a0908] px-5 py-20 text-slate-950 dark:text-white sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300">
                Class Advisers
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">
                Class Adviser Directory
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-stone-300">
                Select a grade level to view assigned class adviser profiles.
              </p>
            </div>

            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {["All", ...gradeLevels].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                    selectedGrade === grade
                      ? "bg-[#0F4C5C] text-white"
                      : "bg-white dark:bg-[#171614] text-slate-700 dark:text-stone-200 hover:scale-[1.01] hover:text-[#0F4C5C] dark:hover:text-yellow-300"
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>

            <div className="grid gap-8">
              {visibleGradeLevels.map((grade) => {
                const advisers = classAdvisers.filter((person) =>
                  person.advisory?.some((item) => item.gradeLevel === grade)
                );

                return (
                  <motion.div
                    key={grade}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="rounded-2xl border border-slate-200 dark:border-[#292624] bg-white dark:bg-[#171614] p-4 shadow-sm dark:shadow-black/20 md:p-6"
                  >
                    <div className="mb-6">
                      <h3 className="text-3xl font-black text-slate-950 dark:text-white">
                        {grade}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-stone-400">
                        {advisers.length} adviser profile
                        {advisers.length > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {advisers.map((person) => (
                        <PersonnelCard
                          key={`${grade}-${person.id}`}
                          person={person}
                          compact
                          onClick={setSelectedPerson}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-[#0a0908] px-5 py-20 text-slate-950 dark:text-white sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300">
                Teaching Personnel
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">
                Subject Teachers Directory
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-stone-300">
                Select a subject department to view assigned subject teacher profiles.
              </p>
            </div>

            {subjectTeachers.length > 0 ? (
              <>
                <div className="mb-10 flex flex-wrap justify-center gap-3">
                  {["All", ...subjectDepartments].map((department) => (
                    <button
                      key={department}
                      onClick={() => setSelectedSubjectDepartment(department)}
                      className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                        selectedSubjectDepartment === department
                          ? "bg-[#0F4C5C] text-white"
                          : "bg-[#F8FAFC] dark:bg-[#171614] text-slate-700 dark:text-stone-200 hover:scale-[1.01] hover:text-[#0F4C5C] dark:hover:text-yellow-300"
                      }`}
                    >
                      {department}
                    </button>
                  ))}
                </div>

                <div className="grid gap-8">
                  {visibleSubjectDepartments.map((department) => {
                    const teacherEntries = subjectDepartmentEntries
                      .filter((entry) => entry.department === department)
                      .sort((a, b) => {
                        if (a.isPrimaryDepartment !== b.isPrimaryDepartment) {
                          return a.isPrimaryDepartment ? -1 : 1;
                        }

                        const positionRankA = getTeacherPositionRank(
                          a.person.position
                        );
                        const positionRankB = getTeacherPositionRank(
                          b.person.position
                        );

                        if (positionRankA !== positionRankB) {
                          return positionRankA - positionRankB;
                        }

                        return a.person.name.localeCompare(b.person.name);
                      });

                    return (
                      <motion.div
                        key={department}
                        layout
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                        className="rounded-2xl border border-slate-200 dark:border-[#292624] bg-[#F8FAFC] dark:bg-[#171614] p-4 shadow-sm dark:shadow-black/20 md:p-6"
                      >
                        <div className="mb-6">
                          <h3 className="text-3xl font-black text-slate-950 dark:text-white">
                            {department}
                          </h3>

                          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-stone-400">
                            {teacherEntries.length} teacher profile
                            {teacherEntries.length > 1 ? "s" : ""}
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {teacherEntries.map((entry) => (
                            <PersonnelCard
                              key={`${department}-${entry.person.id}-${
                                entry.isPrimaryDepartment
                                  ? "primary"
                                  : "additional"
                              }`}
                              person={entry.person}
                              compact
                              onClick={setSelectedPerson}
                            />
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-slate-200 dark:border-[#292624] bg-[#F8FAFC] dark:bg-[#171614] p-8 text-center">
                <p className="font-bold text-slate-600 dark:text-stone-300">
                  Subject teacher profiles will be added soon.
                </p>
              </div>
            )}
          </div>
        </section>


        <section className="bg-[#F8FAFC] dark:bg-[#0a0908] px-5 py-20 text-slate-950 dark:text-white sm:px-6 lg:px-10 xl:px-16 2xl:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-yellow-300">
                School Operations Support
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-4xl">
                School Support Personnel
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-stone-300">
                Personnel who support daily school operations, utility errands,
                campus safety, and service needs.
              </p>
            </div>

            {schoolSupportPersonnel.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {schoolSupportPersonnel.map((person) => (
                  <PersonnelCard
                    key={person.id}
                    person={person}
                    compact
                    onClick={setSelectedPerson}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 dark:border-[#292624] bg-white dark:bg-[#171614] p-8 text-center">
                <p className="font-bold text-slate-600 dark:text-stone-300">
                  School support personnel profiles will be added soon.
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>

      <PersonnelModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
    </>
  );
}
