export type MemoCategory =
  | "School Memorandum"
  | "Office Memorandum"
  | "Advisory"
  | "Enrollment"
  | "DRRM"
  | "Academic"
  | "Administrative"
  | "Student Activities"
  | "Personnel";

export type Memo = {
  id: string;
  memoNumber: string;
  title: string;
  dateIssued: string;
  category: MemoCategory;
  issuingOffice: string;
  description: string;
  fileUrl: string;
  isPublic: boolean;
};

export const memos: Memo[] = [
  {
    id: "memo-001-2026",
    memoNumber: "Memo No. 001, s. 2026",
    title: "Sample School Memorandum for Website Testing",
    dateIssued: "2026-05-20",
    category: "School Memorandum",
    issuingOffice: "Office of the School Principal",
    description:
      "This is a sample memo entry for testing the searchable memo repository page.",
    fileUrl: "https://tabunocnatlhs.com",
    isPublic: true,
  },
  {
    id: "memo-002-2026",
    memoNumber: "Memo No. 002, s. 2026",
    title: "Enrollment Reminders and Documentary Requirements",
    dateIssued: "2026-06-01",
    category: "Enrollment",
    issuingOffice: "Enrollment Committee",
    description:
      "Provides general reminders on enrollment procedures, documentary requirements, and school visit guidelines.",
    fileUrl: "https://tabunocnatlhs.com",
    isPublic: true,
  },
  {
    id: "memo-003-2026",
    memoNumber: "Memo No. 003, s. 2026",
    title: "School DRRM Preparedness and Safety Reminders",
    dateIssued: "2026-06-03",
    category: "DRRM",
    issuingOffice: "School DRRM Team",
    description:
      "Contains safety reminders, preparedness measures, and school-level DRRM coordination instructions.",
    fileUrl: "https://tabunocnatlhs.com",
    isPublic: true,
  },
];

export const memoCategories: Array<"All" | MemoCategory> = [
  "All",
  "School Memorandum",
  "Office Memorandum",
  "Advisory",
  "Enrollment",
  "DRRM",
  "Academic",
  "Administrative",
  "Student Activities",
  "Personnel",
];