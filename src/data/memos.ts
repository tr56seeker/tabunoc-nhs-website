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

// Publish an entry only when its official public file is available.
export const memos: Memo[] = [];

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
