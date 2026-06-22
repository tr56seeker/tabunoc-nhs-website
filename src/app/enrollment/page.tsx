"use client";

/**
 * FILE_ID: TABUNOC_ENROLLMENT_PAGE_FUSED_CATEGORY_REQUIREMENTS
 * PATH: src/app/enrollment/page.tsx
 * PURPOSE: Clean Enrollment Guide page with learner category-based requirements and late enrollee procedure.
 */

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

const pagePadding = "px-6 md:px-10 xl:px-[120px] 2xl:px-[190px]";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

type LearnerCategory = {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  procedure?: string[];
  reminders?: string[];
};

const learnerCategories: LearnerCategory[] = [
  {
    id: "incoming-grade-7",
    title: "Incoming Grade 7",
    description: "For Grade 6 completers entering Junior High School.",
    requirements: [
      "School Form 9 / Report Card",
      "Photocopy of PSA Birth Certificate, if available",
      "Learner Reference Number (LRN), if available",
      "Accomplished Basic Education Enrollment Form",
      "Parent/guardian contact information",
    ],
    reminders: [
      "Bring original documents for verification when requested.",
      "Use the learner’s correct full name based on official records.",
      "Proceed to the assigned enrollment area for Junior High School, if announced.",
    ],
  },
  {
    id: "incoming-grade-11",
    title: "Incoming Grade 11",
    description: "For Grade 10 completers entering Senior High School.",
    requirements: [
      "School Form 9 / Grade 10 Report Card",
      "Photocopy of PSA Birth Certificate, if available",
      "Learner Reference Number (LRN)",
      "Accomplished Basic Education Enrollment Form",
      "Preferred SHS track/strand/specialization information",
    ],
    procedure: [
      "Review the available Senior High School offerings before enrollment.",
      "Prepare the required documents.",
      "Submit documents for checking and validation.",
      "Coordinate with the enrollment team for track, strand, or specialization guidance.",
      "Wait for sectioning, confirmation, or further instruction.",
    ],
    reminders: [
      "Track, strand, or specialization placement may depend on available programs, learner interest, and school capacity.",
      "Learners and parents/guardians are encouraged to review the SHS offerings page before enrollment.",
    ],
  },
  {
    id: "transferees",
    title: "Transferees",
    description: "For learners coming from another school.",
    requirements: [
      "School Form 9 / Report Card",
      "Learner Reference Number (LRN)",
      "Photocopy of PSA Birth Certificate, if available",
      "Certificate of Good Moral Character, if required",
      "Other documents for record verification, if needed",
    ],
    procedure: [
      "Proceed to the school office or assigned enrollment area.",
      "Present available school records for checking.",
      "Allow the enrollment team to verify grade level, LRN, and previous school information.",
      "Complete the enrollment form once documents are validated.",
      "Wait for sectioning, confirmation, or additional instructions.",
    ],
    reminders: [
      "Enrollment of transferees is subject to verification, available slots, and school capacity.",
      "Incomplete documents may still be received for initial checking, but follow-up requirements may be requested.",
    ],
  },
  {
    id: "returning-learners",
    title: "Returning Learners / Balik-Aral",
    description: "For learners who stopped schooling and wish to return.",
    requirements: [
      "Latest available school record",
      "PSA Birth Certificate or acceptable proof of identity, if available",
      "Accomplished Basic Education Enrollment Form",
      "Parent/guardian contact information",
      "Additional validation by the enrollment team, if needed",
    ],
    procedure: [
      "Visit the school office or assigned enrollment area.",
      "Present available records or proof of previous schooling.",
      "Coordinate with the enrollment team for validation and appropriate grade level placement.",
      "Complete the enrollment form.",
      "Wait for confirmation, placement, or further instructions.",
    ],
    reminders: [
      "Placement may require verification of previous records and learner history.",
      "Parents/guardians should provide active contact information for follow-up concerns.",
    ],
  },
  {
    id: "als-completers",
    title: "ALS Completers / Passers",
    description:
      "For ALS learners or completers seeking placement in formal basic education.",
    requirements: [
      "ALS Certificate of Completion or Certificate of Rating, if available",
      "Learner Reference Number (LRN), if available",
      "Photocopy of PSA Birth Certificate or acceptable proof of identity",
      "Accomplished Basic Education Enrollment Form",
      "Placement or eligibility validation by the school, if needed",
    ],
    procedure: [
      "Submit ALS-related documents for checking.",
      "Coordinate with the enrollment team for eligibility and placement validation.",
      "Complete the enrollment form once the learner category and placement are confirmed.",
      "Wait for further instructions from the school.",
    ],
    reminders: [
      "ALS completers/passers may need additional validation depending on available records and placement requirements.",
      "Bring all available ALS-related documents to make the process faster.",
    ],
  },
  {
    id: "continuing-learners",
    title: "Continuing Learners",
    description: "For current learners continuing their studies in the school.",
    requirements: [
      "Updated learner information, if requested",
      "Parent/guardian contact information",
      "School Form 9 / Report Card, if requested by the adviser or enrollment team",
      "Other school-required update forms, if applicable",
    ],
    procedure: [
      "Follow the procedure announced by the class adviser or school enrollment team.",
      "Confirm or update learner information.",
      "Submit required forms or documents, if requested.",
      "Wait for sectioning or class confirmation.",
    ],
    reminders: [
      "Continuing learners should still follow official school announcements.",
      "Parents/guardians should ensure that contact numbers are active and updated.",
    ],
  },
];

const enrollmentSteps = [
  "Identify the correct learner category.",
  "Prepare the documents listed for that category.",
  "Proceed to the designated enrollment area or follow the announced procedure.",
  "Submit documents for checking and verification.",
  "Wait for sectioning, confirmation, or further instructions.",
];

const lateEnrollmentProcedure = [
  "Visit the school office during office hours.",
  "Inform the receiving personnel that the learner was not able to enroll during the announced enrollment schedule.",
  "Bring the available documents based on the learner’s correct category, such as incoming Grade 7, incoming Grade 11, transferee, returning learner, ALS completer/passer, or continuing learner.",
  "Allow the enrollment team to verify learner records, LRN, grade level, available slots, and class sectioning.",
  "Wait for the school’s advice or confirmation before assuming that enrollment is finalized.",
];

const reminders = [
  "Bring original documents for verification when requested.",
  "Submit clear photocopies of required documents.",
  "Use the learner’s correct full name based on official records.",
  "Provide active and reachable parent/guardian contact numbers.",
  "Follow official school announcements only.",
  "Observe proper conduct and school safety protocols while inside the campus.",
];

const enrollmentFaqs = [
  {
    question: "When is the enrollment period?",
    answer:
      "Enrollment schedules are announced through the official school website, Facebook page, and school advisories. Please monitor official channels for updates.",
  },
  {
    question: "Can transferees enroll?",
    answer:
      "Yes. Transferees may inquire for enrollment subject to DepEd guidelines, availability of slots, school capacity, and submission of required documents for verification.",
  },
  {
    question: "What if late ko magpa-enroll unya nagklase na?",
    answer:
      "Please visit the school office during office hours. The learner will be assisted based on the correct enrollment category, and enrollment will be subject to learner verification, available slots, classroom capacity, class sectioning, and school enrollment processing.",
  },
  {
    question: "What if the PSA Birth Certificate is not yet available?",
    answer:
      "Submit available documents first and coordinate with the enrollment team for guidance on follow-up requirements.",
  },
  {
    question: "Where can I ask enrollment concerns?",
    answer:
      "You may contact the school through its official Facebook page, Messenger, email, or visit the school during office hours.",
  },
];

const contactLinks = [
  {
    label: "Facebook Page",
    href: "https://facebook.com/tabunocnatlhs",
    icon: "facebook",
  },
  {
    label: "Messenger",
    href: "https://m.me/tabunocnatlhs",
    icon: "messenger",
  },
  {
    label: "Email",
    href: "mailto:303111@deped.gov.ph",
    icon: "email",
  },
] as const;

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 flex-none text-[#0F4C5C]"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactIcon({ icon }: { icon: "facebook" | "messenger" | "email" }) {
  if (icon === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V14h2.8v8h3.4Z" />
      </svg>
    );
  }

  if (icon === "messenger") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M12 2C6.5 2 2.2 6 2.2 11.4c0 3.1 1.5 5.8 3.8 7.5V22l3.5-1.9c.8.2 1.6.3 2.5.3 5.5 0 9.8-4 9.8-9.4S17.5 2 12 2Zm1 12.6-2.5-2.7-4.9 2.7 5.4-5.8 2.5 2.7 4.9-2.7-5.4 5.8Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6.5h16v11H4v-11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m4.5 7 7.5 6 7.5-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActionLink({
  href,
  children,
  external,
  className = "",
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const baseClassName = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-1 ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClassName}>
      {children}
    </Link>
  );
}

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
    <motion.div {...fadeUp} className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0F4C5C]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#071E29] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 leading-7 text-slate-600">{description}</p>
      )}
    </motion.div>
  );
}

function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
          <CheckIcon />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CategoryDetails({
  category,
  showHeader = false,
}: {
  category: LearnerCategory;
  showHeader?: boolean;
}) {
  return (
    <div>
      {showHeader && (
        <>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F4C5C]">
            Selected Category
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[#071E29]">
            {category.title}
          </h3>
          <p className="mt-3 leading-7 text-slate-600">
            {category.description}
          </p>
        </>
      )}

      <div className={showHeader ? "mt-8 grid gap-8" : "grid gap-6"}>
        <div>
          <h4 className="text-lg font-semibold text-[#071E29]">Requirements</h4>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Prepare what is available and applicable. Original documents may be
            requested for verification.
          </p>

          <div className="mt-4">
            <InfoList items={category.requirements} />
          </div>
        </div>

        {category.procedure && category.procedure.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-[#071E29]">Procedure</h4>

            <div className="mt-4 grid gap-3">
              {category.procedure.map((step, index) => (
                <div
                  key={step}
                  className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl bg-[#F8FAFC] p-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4C5C] text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm font-semibold leading-6 text-slate-700">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {category.reminders && category.reminders.length > 0 && (
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
            <h4 className="text-lg font-semibold text-[#071E29]">
              Important Notes
            </h4>

            <div className="mt-4">
              <InfoList items={category.reminders} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryButton({
  category,
  active,
  onClick,
}: {
  category: LearnerCategory;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-sm transition duration-300 ${
        active
          ? "border-[#0F4C5C] bg-white shadow-md"
          : "border-slate-200 bg-white hover:border-[#0F4C5C]/40"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`group w-full p-5 text-left transition duration-300 hover:-translate-y-0.5 ${
          active ? "bg-[#0F4C5C] text-white" : "bg-white text-slate-950"
        }`}
      >
        <h3
          className={`text-lg font-semibold ${
            active ? "text-white" : "text-[#071E29]"
          }`}
        >
          {category.title}
        </h3>

        <p
          className={`mt-2 text-sm leading-6 ${
            active ? "text-teal-50" : "text-slate-600"
          }`}
        >
          {category.description}
        </p>

        <div
          className={`mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${
            active ? "text-yellow-300" : "text-[#0F4C5C]"
          }`}
        >
          {active ? "Guide opened" : "View guide"}
          <ArrowIcon />
        </div>
      </button>

      {active && (
        <div className="border-t border-slate-200 bg-white p-5 xl:hidden">
          <CategoryDetails category={category} />
        </div>
      )}
    </div>
  );
}

export default function EnrollmentPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null;

    return (
      learnerCategories.find((category) => category.id === selectedCategoryId) ||
      null
    );
  }, [selectedCategoryId]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-950">
        <PageHeader
          eyebrow="Enrollment Guide"
          title="Enrollment Information"
          description="View enrollment reminders, requirements, and important guidance for incoming and returning learners of Tabunoc National High School."
        >
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <ActionLink
                  href="#learner-category"
                  className="bg-[#0F4C5C] text-white hover:bg-[#146577]"
                >
                  Choose Learner Category
                  <ArrowIcon />
                </ActionLink>

                <ActionLink
                  href="#steps"
                  className="bg-[#ffdf20] text-[#071E29] hover:bg-yellow-300"
                >
                  Enrollment Steps
                  <ArrowIcon />
                </ActionLink>

                <ActionLink
                  href="#help"
                  className="border border-[#0F4C5C]/20 bg-white text-[#0F4C5C] hover:bg-slate-50"
                >
                  Contact the School
                </ActionLink>
              </div>
        </PageHeader>

        {/* ADVISORY */}
        <section className="bg-white py-10">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm md:p-8"
            >
              <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F4C5C]/10 text-[#0F4C5C]">
                  <CheckIcon />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F4C5C]">
                    Important Reminder
                  </p>
                  <p className="mt-2 leading-7 text-slate-700">
                    Enrollment schedules and procedures may change depending on
                    official DepEd, Division, or school advisories. Please
                    monitor the official school website and Facebook page for
                    updates.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* LEARNER CATEGORY + REQUIREMENTS */}
        <section id="learner-category" className="bg-[#F8FAFC] py-20">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <SectionHeading
              eyebrow="Who May Enroll"
              title="Choose your learner category"
              description="Tap a learner category to view the description, requirements, procedure, and reminders that apply."
            />

            <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <motion.div {...fadeUp}>
                {/* Mobile: normal single-column order */}
                <div className="grid gap-4 md:hidden">
                  {learnerCategories.map((category) => (
                    <CategoryButton
                      key={category.id}
                      category={category}
                      active={selectedCategoryId === category.id}
                      onClick={() =>
                        setSelectedCategoryId((current) =>
                          current === category.id ? null : category.id
                        )
                      }
                    />
                  ))}
                </div>

                {/* Tablet/Desktop: independent left and right columns */}
                <div className="hidden gap-4 md:grid md:grid-cols-2">
                  {[0, 1].map((columnIndex) => (
                    <div key={columnIndex} className="grid content-start gap-4">
                      {learnerCategories
                        .filter((_, index) => index % 2 === columnIndex)
                        .map((category) => (
                          <CategoryButton
                            key={category.id}
                            category={category}
                            active={selectedCategoryId === category.id}
                            onClick={() =>
                              setSelectedCategoryId((current) =>
                                current === category.id ? null : category.id
                              )
                            }
                          />
                        ))}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                {...fadeUp}
                className="hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 xl:block"
              >
                {selectedCategory ? (
                  <CategoryDetails category={selectedCategory} showHeader />
                ) : (
                  <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F4C5C]">
                      Enrollment Guide
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[#071E29]">
                      Select a learner category
                    </h3>
                    <p className="mt-3 max-w-md leading-7 text-slate-600">
                      Choose from the learner categories on the left to view the applicable
                      requirements, procedure, and reminders.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

{/* LATE ENROLLMENT PROCEDURE */}
<section className="bg-white py-20">
  <div className={`mx-auto w-full ${pagePadding}`}>
    <motion.div
      {...fadeUp}
      className="mx-auto grid max-w-6xl gap-6 rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm md:p-8 lg:grid-cols-[0.85fr_1.15fr]"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F4C5C]">
          Late Enrollment Concern
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#071E29]">
          What if late ko magpa-enroll unya nagklase na?
        </h2>

        <p className="mt-4 leading-7 text-slate-700">
          Late enrollees learner must still follow the
          requirements based on the correct category such as incoming Grade 7,
          incoming Grade 11, transferee, returning learner, ALS completer/passer,
          or continuing learner.
        </p>

        <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
          <p className="text-sm font-bold leading-6 text-slate-700">
            Important: Late enrollment is subject to learner verification,
            available slots, classroom capacity, class sectioning, and school
            enrollment processing.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {lateEnrollmentProcedure.map((step, index) => (
          <div
            key={step}
            className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F4C5C] text-xs font-semibold text-white">
              {index + 1}
            </div>

            <p className="text-sm font-semibold leading-6 text-slate-700">
              {step}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
</section>

        {/* STEPS */}
        <section id="steps" className="bg-white py-20">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <SectionHeading
              eyebrow="Enrollment Process"
              title="Five simple steps"
              description="Follow the announced enrollment flow and coordinate only with authorized school personnel."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {enrollmentSteps.map((step, index) => (
                <motion.div
                  key={step}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F4C5C] text-xs font-semibold text-white">
                      {index + 1}
                    </div>

                    <p className="text-sm font-bold leading-6 text-slate-700">
                      {step}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SHS NOTE + REMINDERS */}
        <section className="bg-[#F8FAFC] py-20">
          <div
            className={`mx-auto grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr] ${pagePadding}`}
          >
            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-slate-200 bg-[#ECFDF5] p-6 shadow-sm md:p-8"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F4C5C]">
                Incoming Grade 11
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#071E29]">
                Review SHS offerings before enrollment.
              </h2>
              <p className="mt-4 leading-7 text-slate-700">
                Track, strand, or specialization placement may depend on
                available programs, learner interest, and school capacity.
              </p>

              <div className="mt-6">
                <ActionLink
                  href="/shs-offerings"
                  className="bg-[#0F4C5C] text-white hover:bg-[#146577]"
                >
                  View SHS Offerings
                  <ArrowIcon />
                </ActionLink>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F4C5C]">
                Parent and Learner Reminders
              </p>

              <div className="mt-5 grid gap-3">
                {reminders.map((reminder) => (
                  <div key={reminder} className="flex gap-3">
                    <CheckIcon />
                    <p className="text-sm leading-6 text-slate-700">
                      {reminder}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-20">
          <div className={`mx-auto w-full ${pagePadding}`}>
            <SectionHeading
              eyebrow="Enrollment FAQs"
              title="Common questions"
              description="Quick answers to common enrollment concerns."
            />

            <div className="mx-auto grid max-w-5xl gap-4">
              {enrollmentFaqs.map((faq) => (
                <motion.details
                  key={faq.question}
                  {...fadeUp}
                  className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <span className="font-semibold text-[#071E29]">
                      {faq.question}
                    </span>
                    <span className="rounded-full bg-[#0F4C5C]/10 p-2 text-[#0F4C5C] transition group-open:rotate-90">
                      <ArrowIcon />
                    </span>
                  </summary>
                  <p className="mt-4 leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </motion.details>
              ))}
            </div>

            <div className="mt-8 text-center">
              <ActionLink
                href="/faq"
                className="border border-[#0F4C5C]/20 bg-white text-[#0F4C5C] hover:bg-slate-50"
              >
                View Full FAQ
                <ArrowIcon />
              </ActionLink>
            </div>
          </div>
        </section>

        {/* HELP */}
        <section id="help" className="bg-[#0F4C5C] py-20 text-white">
          <div
            className={`mx-auto grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center ${pagePadding}`}
          >
            <motion.div {...fadeUp}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-300">
                Need Help?
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                Contact the school through official channels.
              </h2>
              <p className="mt-5 leading-7 text-teal-50">
                For enrollment-related concerns, parents and learners may
                contact Tabunoc National High School through official channels
                or visit the school during office hours.
              </p>
              <p className="mt-4 text-sm leading-6 text-teal-50">
                Office Hours: Monday to Friday, 8:00 AM – 5:00 PM, except
                holidays and declared class/work suspensions.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="flex flex-wrap items-center justify-center gap-5 lg:justify-end"
            >
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={link.label}
                  title={link.label}
                  className="group flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#ffdf20] hover:bg-[#ffdf20] hover:text-[#071E29]"
                >
                  <ContactIcon icon={link.icon} />
                </a>
              ))}
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
