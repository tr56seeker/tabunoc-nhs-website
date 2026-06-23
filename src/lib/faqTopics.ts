export const faqTopics = [
  { id: "enrollment-period", title: "Enrollment Period" },
  { id: "enrollment-requirements", title: "Enrollment Requirements" },
  { id: "transferee-admission", title: "Transferee Admission" },
  { id: "transferee-documents", title: "Transferee Documents" },
  { id: "enrollment-assistance", title: "Enrollment Assistance" },
  { id: "grade-levels-offered", title: "Grade Levels Offered" },
  { id: "shs-offerings", title: "Senior High School Offerings" },
  { id: "school-organization", title: "School Organization" },
  { id: "school-document-requests", title: "School Document Requests" },
  { id: "citizens-charter", title: "Citizen’s Charter" },
  { id: "office-hours", title: "School Office Hours" },
  { id: "official-announcements", title: "Official Announcements" },
  { id: "official-contact-information", title: "Official Contact Information" },
  { id: "school-location", title: "School Location" },
  { id: "school-mis", title: "School MIS" },
  {
    id: "class-suspensions-emergencies",
    title: "Class Suspensions and Emergencies",
  },
  { id: "emergency-advisories", title: "Emergency Advisories" },
  { id: "stakeholder-support", title: "Stakeholder Support" },
  { id: "alumni-connections", title: "Alumni Connections" },
] as const;

const faqTopicTitles = new Map<string, string>(
  faqTopics.map((topic) => [topic.id, topic.title]),
);

export function getFaqTopicTitle(id: string) {
  return faqTopicTitles.get(id) ?? id;
}
