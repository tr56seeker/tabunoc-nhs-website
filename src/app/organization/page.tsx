"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const topDirectoryTabs = [
  { label: "Administration", targetId: "school-head" },
  { label: "Program Coordinators", targetId: "program-implementers" },
  { label: "Teaching Personnel", targetId: "master-teachers" },
  { label: "Support Staff", targetId: "support-staff" },
];

const mainSectionTopTabMap = [
  { sectionId: "school-head", tabLabel: "Administration" },
  { sectionId: "administrative-staff", tabLabel: "Administration" },
  { sectionId: "guidance-personnel", tabLabel: "Administration" },

  { sectionId: "program-implementers", tabLabel: "Program Coordinators" },

  { sectionId: "master-teachers", tabLabel: "Teaching Personnel" },
  { sectionId: "grade-leaders", tabLabel: "Teaching Personnel" },
  { sectionId: "class-advisory", tabLabel: "Teaching Personnel" },
  { sectionId: "subject-teachers", tabLabel: "Teaching Personnel" },

  { sectionId: "support-staff", tabLabel: "Support Staff" },
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

function getAdvisoryGradeSectionId(grade: string) {
  return `class-advisory-${slugify(grade)}`;
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
  const [activeMainTab, setActiveMainTab] = useState("");
  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const directoryTabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>(
    {}
  );

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

    if (!matchedPerson) return;

    const openProfileTimer = window.setTimeout(() => {
      setSelectedPerson(matchedPerson);
    }, 0);

    return () => window.clearTimeout(openProfileTimer);
  }, [allPersonnel]);

  const leadership = useMemo(() => {
    return allPersonnel.filter((person) => person.roles.includes("Principal"));
  }, [allPersonnel]);

  const administrativePersonnel = useMemo(() => {
    return allPersonnel.filter(
      (person) =>
        !person.roles.includes("Principal") &&
        !person.roles.includes("Guidance") &&
        !isSchoolSupportPersonnel(person) &&
        person.roles.includes("Administrative")
    );
  }, [allPersonnel]);

  const guidancePersonnel = useMemo(() => {
    return allPersonnel.filter(
      (person) =>
        !person.roles.includes("Principal") &&
        !isSchoolSupportPersonnel(person) &&
        person.roles.includes("Guidance")
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
    return gradeLevels;
  }, [gradeLevels]);

  useEffect(() => {
    const gradeSections = gradeLevels
      .map((grade) => document.getElementById(getAdvisoryGradeSectionId(grade)))
      .filter((section): section is HTMLElement => Boolean(section));

    if (gradeSections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const activeGrade = (visibleEntries[0]?.target as HTMLElement | undefined)
          ?.dataset.grade;

        if (activeGrade) {
          setSelectedGrade(activeGrade);
        }
      },
      {
        rootMargin: "-220px 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    gradeSections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [gradeLevels]);

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

  const isDirectorySearchActive =
    searchTerm.trim() !== "" || selectedRole !== "All";

  useEffect(() => {
    if (isDirectorySearchActive) {
      setActiveMainTab("");
      return;
    }

    let animationFrameId = 0;

    function getActiveMainTabFromScroll() {
      const stickyOffset = 196;

      const sections = mainSectionTopTabMap
        .map((section) => {
          const element = document.getElementById(section.sectionId);

          if (!element) return null;

          const sectionTop = element.getBoundingClientRect().top + window.scrollY;

          return {
            sectionId: section.sectionId,
            tabLabel: section.tabLabel,
            top: sectionTop,
          };
        })
        .filter(
          (
            section
          ): section is {
            sectionId: string;
            tabLabel: string;
            top: number;
          } => Boolean(section)
        )
        .sort((a, b) => a.top - b.top);

      if (sections.length === 0) return "";

      const currentScrollPosition = window.scrollY + stickyOffset;
      const firstSectionTop = sections[0].top;

      if (currentScrollPosition < firstSectionTop) {
        return "";
      }

      const currentSection = [...sections]
        .reverse()
        .find((section) => currentScrollPosition >= section.top);

      return currentSection?.tabLabel || "";
    }

    function updateActiveMainTab() {
      const nextActiveMainTab = getActiveMainTabFromScroll();

      setActiveMainTab((currentActiveMainTab) =>
        currentActiveMainTab === nextActiveMainTab
          ? currentActiveMainTab
          : nextActiveMainTab
      );
    }

    function requestActiveMainTabUpdate() {
      if (animationFrameId) return;

      animationFrameId = window.requestAnimationFrame(() => {
        updateActiveMainTab();
        animationFrameId = 0;
      });
    }

    const initialChecks = [
      window.setTimeout(updateActiveMainTab, 0),
      window.setTimeout(updateActiveMainTab, 150),
      window.setTimeout(updateActiveMainTab, 500),
    ];

    window.addEventListener("scroll", requestActiveMainTabUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestActiveMainTabUpdate);

    return () => {
      initialChecks.forEach((timer) => window.clearTimeout(timer));

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener("scroll", requestActiveMainTabUpdate);
      window.removeEventListener("resize", requestActiveMainTabUpdate);
    };
  }, [isDirectorySearchActive, isLoading]);

  useEffect(() => {
    if (!activeMainTab) return;

    const activeButton = directoryTabButtonRefs.current[activeMainTab];

    activeButton?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeMainTab]);

  const sectionIntroClass = "mb-6 px-1 text-center sm:mb-8 sm:px-0";

  const centeredPersonnelGridClass =
    "grid grid-cols-[repeat(auto-fit,minmax(16rem,28rem))] justify-center gap-3";

  const stickyGroupHeaderClass =
    "sticky top-[calc(9.75rem_+_env(safe-area-inset-top))] z-20 -mx-4 mb-3 flex min-h-11 items-center justify-center border-b border-slate-200 bg-white/90 px-4 py-2 text-center backdrop-blur-md dark:border-[#292624] dark:bg-[#171614]/90 md:-mx-5 md:px-5";

  const advisorySubmenuClass =
    "no-scrollbar sticky top-[calc(8.95rem_+_env(safe-area-inset-top))] z-40 mb-2 overflow-x-auto border-b border-slate-200/70 bg-[#F8FAFC]/95 px-4 py-2 backdrop-blur-md dark:border-[#292624] dark:bg-[#0a0908]/95 sm:px-6 lg:px-0";

  const stickyAdvisoryGradeHeaderClass =
    "sticky top-[calc(12.15rem_+_env(safe-area-inset-top))] z-30 -mx-4 mb-1 flex min-h-8 items-center justify-center border-b border-slate-100 bg-[#F8FAFC]/95 px-4 py-1 text-center backdrop-blur-md dark:border-[#292624] dark:bg-[#171614]/95 md:-mx-5 md:px-5";

  function SectionHeading({
    eyebrow,
    title,
    description,
  }: {
    eyebrow: string;
    title: string;
    description?: string;
  }) {
    return (
      <div className={sectionIntroClass}>
        <p className="text-xs font-black uppercase tracking-widest text-[#0F4C5C] dark:text-[#ffdf20] sm:text-sm">
          {eyebrow}
        </p>

        <h2 className="mx-auto mt-1.5 max-w-4xl text-2xl font-black leading-tight text-slate-950 dark:text-white md:text-4xl">
          {title}
        </h2>

        {description ? (
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-stone-300 md:text-base md:leading-7">
            {description}
          </p>
        ) : null}
      </div>
    );
  }

  function scrollToDirectorySection(label: string, targetId: string) {
    setActiveMainTab(label);

    const target = document.getElementById(targetId);
    if (!target) return;

    const topOffset = 196;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - topOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  }

  function scrollToAdvisoryGrade(grade: string) {
    setSelectedGrade(grade);

    const targetId =
      grade === "All" ? "class-advisory" : getAdvisoryGradeSectionId(grade);
    const target = document.getElementById(targetId);

    if (!target) return;

    const topOffset = grade === "All" ? 196 : 268;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - topOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  }

return (
  <>
    <Navbar />

    <main className="min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] text-slate-950 dark:bg-[#0a0908] dark:text-white">
        <section className="border-b border-slate-200 bg-white px-5 pb-12 pt-32 text-slate-950 dark:border-[#292624] dark:bg-[#0a0908] dark:text-white sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl text-center">
            <BrandHeader />

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-sm font-black uppercase tracking-widest text-[#0F4C5C] dark:text-[#ffdf20]"
            >
              School Directory
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mx-auto mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-6xl"
            >
              School Administration, Faculty, and Staff
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-700 dark:text-stone-200 md:text-lg"
            >
              Meet the school administration, faculty members, advisers,
              program coordinators, and support personnel of Tabunoc National
              High School.
            </motion.p>
          </div>
        </section>

        <nav
          aria-label="Organization categories"
          className="sticky top-[calc(5.75rem_+_env(safe-area-inset-top))] z-50 border-b border-slate-200/70 bg-[#F8FAFC]/95 py-2 backdrop-blur-md dark:border-[#292624] dark:bg-[#0a0908]/95"
        >
          <div className="relative mx-auto max-w-6xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-white/95 to-transparent dark:from-[#0a0908]/95 sm:w-6" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-white/95 to-transparent dark:from-[#0a0908]/95 sm:w-6" />

            <div className="no-scrollbar overflow-x-auto px-4 sm:px-6 lg:px-0">
              <div className="flex min-w-max gap-2 pr-5 sm:gap-2.5 lg:mx-auto lg:w-max lg:justify-center lg:pr-0">
              {topDirectoryTabs.map((tab) => {
                const isActive = activeMainTab === tab.label;

                return (
                  <button
                    key={tab.label}
                    ref={(button) => {
                      directoryTabButtonRefs.current[tab.label] = button;
                    }}
                    type="button"
                    onClick={() =>
                      scrollToDirectorySection(tab.label, tab.targetId)
                    }
                    className={`rounded-full px-3.5 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm dark:bg-stone-100 dark:text-[#171614]"
                        : "bg-slate-50 text-slate-600 ring-1 ring-slate-200/80 hover:bg-slate-100 hover:text-slate-900 dark:bg-[#171614] dark:text-stone-300 dark:ring-[#292624] dark:hover:bg-[#211f1c] dark:hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
              </div>
            </div>
          </div>
        </nav>

        <section
          id="directory-search"
          className="bg-[#F8FAFC] px-5 py-10 text-slate-950 dark:bg-[#0a0908] dark:text-white sm:px-6 lg:px-10"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Faculty and Personnel Directory"
              title="Search the School Directory"
              description="Search by name, section, role, subject taught, position, designation, or program handled."
            />

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#292624] dark:bg-[#171614] dark:shadow-black/20 md:p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, section, subject, designation, or program..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F4C5C] focus:ring-4 focus:ring-[#ffdf20]/30 dark:border-[#292624] dark:bg-[#171614] dark:text-white dark:placeholder:text-slate-500"
                />

                <select
                  value={selectedRole}
                  onChange={(event) =>
                    setSelectedRole(event.target.value as "All" | PersonnelRole)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-sm font-bold text-slate-900 outline-none transition focus:border-[#0F4C5C] focus:ring-4 focus:ring-[#ffdf20]/30 dark:border-[#292624] dark:bg-[#171614] dark:text-white"
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
                <div className="mt-6 rounded-xl bg-slate-100 p-8 text-center dark:bg-[#292624]">
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
                        className="w-fit rounded-full bg-[#ffdf20] px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-[#0F4C5C] hover:text-white"
                      >
                        Clear Search
                      </button>
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
                      <div className="rounded-xl bg-slate-100 p-8 text-center dark:bg-[#292624]">
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

        {/* SCHOOL HEAD */}
        <section
          id="school-head"
          className="bg-[#F8FAFC] px-5 py-10 text-slate-950 dark:bg-[#0a0908] dark:text-white sm:px-6 lg:px-10"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="School Leadership" title="School Head" />

            <div className={centeredPersonnelGridClass}>
              {leadership.map((person) => (
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

        {/* ADMINISTRATIVE STAFF */}
        <section
          id="administrative-staff"
          className="bg-[#F8FAFC] px-5 py-10 text-slate-950 dark:bg-[#0a0908] dark:text-white sm:px-6 lg:px-10"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Administrative Support"
              title="Administrative Staff"
            />

            <div className={centeredPersonnelGridClass}>
              {administrativePersonnel.map((person) => (
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

        {/* GUIDANCE PERSONNEL */}
        <section
          id="guidance-personnel"
          className="bg-[#F8FAFC] px-5 py-10 text-slate-950 dark:bg-[#0a0908] dark:text-white sm:px-6 lg:px-10"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Learner Support Services"
              title="Guidance Personnel"
              description="Guidance personnel support learner welfare, counseling services, career guidance, and student development programs."
            />

            <div className={centeredPersonnelGridClass}>
              {guidancePersonnel.map((person) => (
                <div key={person.id}>
                  <PersonnelCard
                    person={person}
                    compact
                    onClick={setSelectedPerson}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="program-implementers"
          className="bg-[#F8FAFC] px-5 py-10 text-slate-950 dark:bg-[#0a0908] dark:text-white sm:px-6 lg:px-10"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Program Coordination"
              title="Program Coordinators"
              description="Program coordinators support school programs, committees, initiatives, and special assignments aligned with school operations, learner support, and DepEd priority programs."
            />

            {sortedProgramImplementers.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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

        <section
          id="master-teachers"
          className="bg-white px-5 py-10 text-slate-950 dark:bg-[#0a0908] dark:text-white sm:px-6 lg:px-10"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Instructional Leadership"
              title="Master Teachers"
              description="Master Teachers provide instructional support, mentoring, and technical assistance for curriculum implementation and teaching practice."
            />

            <div className={centeredPersonnelGridClass}>
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

        <section
          id="grade-leaders"
          className="bg-[#F8FAFC] px-5 py-10 text-slate-950 dark:bg-[#0a0908] dark:text-white sm:px-6 lg:px-10"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Grade Level Leadership"
              title="Grade Leaders"
            />

            <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">
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

        <section
          id="class-advisory"
          className="bg-[#F8FAFC] px-5 py-10 text-slate-950 dark:bg-[#0a0908] dark:text-white sm:px-6 lg:px-10"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Class Advisers"
              title="Class Adviser Directory"
              description="Select a grade level to jump to assigned class adviser profiles."
            />

            <div className={advisorySubmenuClass}>
              <div className="flex min-w-max gap-2 pr-4 sm:gap-2.5 lg:mx-auto lg:w-max lg:justify-center lg:pr-0">
              {["All", ...defaultGradeLevels].map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => scrollToAdvisoryGrade(grade)}
                  className={`rounded-full px-4 py-2 text-sm font-black transition ${
                    selectedGrade === grade
                      ? "bg-[#ffdf20] text-slate-950 shadow-sm"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:text-[#0F4C5C] dark:bg-[#171614] dark:text-stone-200 dark:ring-[#292624] dark:hover:text-[#ffdf20]"
                  }`}
                >
                  {grade}
                </button>
              ))}
              </div>
            </div>

            <div className="grid gap-6">
              {visibleGradeLevels.map((grade) => {
                const advisers = classAdvisers.filter((person) =>
                  person.advisory?.some((item) => item.gradeLevel === grade)
                );

                return (
                  <motion.div
                    id={getAdvisoryGradeSectionId(grade)}
                    key={grade}
                    data-grade={grade}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#292624] dark:bg-[#171614] dark:shadow-black/20 md:p-5"
                  >
                    <div className={stickyAdvisoryGradeHeaderClass}>
                      <h3 className="sr-only">
                        {grade}
                      </h3>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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

        <section
          id="subject-teachers"
          className="bg-white px-5 py-10 text-slate-950 dark:bg-[#0a0908] dark:text-white sm:px-6 lg:px-10"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Teaching Personnel"
              title="Subject Teachers Directory"
              description="Select a subject department to view assigned subject teacher profiles."
            />

            {subjectTeachers.length > 0 ? (
              <>
                <div className="mb-8 flex flex-wrap justify-center gap-2">
                  {["All", ...subjectDepartments].map((department) => (
                    <button
                      key={department}
                      onClick={() => setSelectedSubjectDepartment(department)}
                      className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                        selectedSubjectDepartment === department
                          ? "bg-[#ffdf20] text-slate-950 shadow-sm"
                          : "bg-[#F8FAFC] text-slate-700 shadow-sm ring-1 ring-slate-200 hover:text-[#0F4C5C] dark:bg-[#171614] dark:text-stone-200 dark:ring-[#292624] dark:hover:text-[#ffdf20]"
                      }`}
                    >
                      {department}
                    </button>
                  ))}
                </div>

                <div className="grid gap-6">
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
                        className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 shadow-sm dark:border-[#292624] dark:bg-[#171614] dark:shadow-black/20 md:p-5"
                      >
                        <div className={stickyGroupHeaderClass}>
                          <h3 className="line-clamp-1 text-base font-black text-slate-950 dark:text-white md:text-lg">
                            {department}
                          </h3>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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


        <section
          id="support-staff"
          className="bg-[#F8FAFC] px-5 py-10 text-slate-950 dark:bg-[#0a0908] dark:text-white sm:px-6 lg:px-10"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="School Operations Support"
              title="School Support Personnel"
              description="Personnel who support daily school operations, utility errands, campus safety, and service needs."
            />

            {schoolSupportPersonnel.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
