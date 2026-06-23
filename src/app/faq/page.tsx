/**
 * FILE_ID: TABUNOC_FAQ_PAGE
 * PATH: src/app/faq/page.tsx
 * PURPOSE: Frequently Asked Questions page for Tabunoc National High School.
 */

import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import FaqCommunityQuestions from "@/components/FaqCommunityQuestions";

const faqGroups = [
  {
    id: "enrollment",
    navLabel: "Enrollment",
    category: "Enrollment",
    description:
      "Common questions from incoming learners, parents, guardians, transferees, and returning learners.",
    items: [
      {
        id: "enrollment-period",
        question: "When is the enrollment period?",
        answer:
          "Enrollment schedules are announced through the official Tabunoc National High School website, Facebook page, and school advisories. Parents and learners are encouraged to check the Enrollment Guide page for the latest schedule, reminders, and procedures.",
      },
      {
        id: "enrollment-requirements",
        question: "What are the requirements for enrollment?",
        answer:
          "Enrollment requirements depend on the learner type, such as incoming Grade 7, incoming Grade 11, transferee, returning learner, or ALS passer. The complete and updated list of requirements is posted on the Enrollment Guide page.",
      },
      {
        id: "transferee-admission",
        question: "Does the school accept transferees?",
        answer:
          "Yes. Tabunoc National High School accepts transferees subject to DepEd enrollment guidelines, availability of slots, and submission of required documents for verification.",
      },
      {
        id: "transferee-documents",
        question: "What should transferees bring?",
        answer:
          "Transferees are usually advised to bring their report card, PSA birth certificate, certificate of good moral character when applicable, and other documents required by the school for verification and enrollment processing.",
      },
      {
        id: "enrollment-assistance",
        question: "Where can I ask enrollment-related questions?",
        answer:
          "Enrollment concerns may be raised through the official school Facebook page, Messenger, email, or by visiting the school during office hours. Please use only official school communication channels for proper documentation.",
      },
    ],
  },
  {
    id: "school-programs",
    navLabel: "School Programs",
    category: "School Programs",
    description:
      "Basic information about Junior High School and Senior High School offerings.",
    items: [
      {
        id: "grade-levels-offered",
        question: "What grade levels are offered by the school?",
        answer:
          "Tabunoc National High School offers Junior High School from Grade 7 to Grade 10 and Senior High School from Grade 11 to Grade 12.",
      },
      {
        id: "shs-offerings",
        question: "What Senior High School programs are available?",
        answer:
          "Available Senior High School offerings are posted on the SHS Offerings page. Incoming Grade 11 learners should check the page for the latest tracks, strands, and specializations offered by the school.",
      },
      {
        id: "school-organization",
        question: "Where can I view the school personnel and organization?",
        answer:
          "The School Organization page contains the school administration, faculty, class advisers, program coordinators, and support personnel directory.",
      },
    ],
  },
  {
    id: "records-assistance",
    navLabel: "Records and Assistance",
    category: "Records and Public Assistance",
    description:
      "Questions about school documents, public transactions, and frontline services.",
    items: [
      {
        id: "school-document-requests",
        question: "How can I request school documents?",
        answer:
          "Requests for school records, certifications, or related documents should be coordinated with the school office or concerned personnel. Processing requirements and steps may be guided by the school’s Citizen’s Charter.",
      },
      {
        id: "citizens-charter",
        question: "Where can I find the Citizen’s Charter?",
        answer:
          "The Citizen’s Charter page provides information on frontline services, service standards, requirements, and public assistance processes of the school.",
      },
      {
        id: "office-hours",
        question: "What are the school office hours?",
        answer:
          "The school generally accommodates transactions during regular office hours, Monday to Friday, except holidays, class suspensions, and official work suspensions. For urgent concerns, check the latest school advisory before visiting.",
      },
    ],
  },
  {
    id: "official-channels",
    navLabel: "Official Channels",
    category: "Communication and Announcements",
    description:
      "Official channels for verified information, advisories, and school updates.",
    items: [
      {
        id: "official-announcements",
        question: "Where can I view official school announcements?",
        answer:
          "Official announcements are posted on the School Memos page, the official Facebook page, and other authorized school communication channels.",
      },
      {
        id: "official-contact-information",
        question: "What is the official contact information of the school?",
        answer:
          "Official contact channels are listed on the Contact section of the website and in the footer. For safety and proper documentation, use only the official channels of Tabunoc National High School.",
      },
      {
        id: "school-location",
        question: "Where is Tabunoc National High School located?",
        answer:
          "Tabunoc National High School is located at Sangi Road, Tabunok, Talisay City, Cebu. A directions link is available on the website for visitors who need map guidance.",
      },
      {
        id: "school-mis",
        question: "Where can I access the School MIS?",
        answer:
          "Authorized users may access the School MIS through the official MIS link provided on the website. Access may be limited depending on the purpose and authorization level.",
      },
    ],
  },
  {
    id: "safety-drrm",
    navLabel: "Safety and DRRM",
    category: "Safety, DRRM, and Class Suspensions",
    description:
      "Reminders on school safety, disaster preparedness, and emergency advisories.",
    items: [
      {
        id: "class-suspensions-emergencies",
        question: "What should parents do during class suspensions or emergencies?",
        answer:
          "Parents and learners should monitor official advisories from DepEd, the LGU, and the school’s official communication channels. During emergencies, the school follows its safety, DRRM, and learner accounting protocols.",
      },
      {
        id: "emergency-advisories",
        question: "How does the school communicate emergency advisories?",
        answer:
          "Emergency advisories may be posted through the official school Facebook page, website, and other authorized communication channels. Learners and parents should avoid relying on unverified posts or unofficial sources.",
      },
    ],
  },
  {
    id: "stakeholder-support",
    navLabel: "Stakeholder Support",
    category: "Stakeholder Support",
    description:
      "Ways parents, alumni, partners, and community members can support school programs.",
    items: [
      {
        id: "stakeholder-support",
        question: "How can stakeholders support school programs?",
        answer:
          "Stakeholders may coordinate with the school administration for partnerships, Brigada Eskwela support, learner assistance, DRRM support, donations, or other school-approved initiatives.",
      },
      {
        id: "alumni-connections",
        question: "Can alumni connect with the school?",
        answer:
          "Yes. Alumni may connect with the school through official communication channels and the Alumni page, especially for school partnerships, recognition activities, and community engagement.",
      },
    ],
  },
];

const quickLinks = [
  {
    label: "Enrollment Guide",
    href: "/enrollment",
  },
  {
    label: "SHS Offerings",
    href: "/shs-offerings",
  },
  {
    label: "School Memos",
    href: "/memos",
  },
  {
    label: "Citizen’s Charter",
    href: "/citizen-charter",
  },
  {
    label: "School Organization",
    href: "/organization",
  },
  {
    label: "Contact the School",
    href: "/contact",
  },
];

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FAQPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5f5f7] text-slate-950">
        <PageHeader
          eyebrow="Help and Information"
          title="Frequently Asked Questions"
          description="Find answers to common questions about school services, enrollment, schedules, and official channels of Tabunoc National High School."
        >
            <div className="mx-auto flex w-full max-w-md flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/enrollment"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C5C] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#146577]"
              >
                Enrollment Guide
                <ArrowIcon />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F4C5C]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0F4C5C] transition duration-300 hover:-translate-y-1 hover:bg-slate-50"
              >
                Contact the School
              </Link>
            </div>
        </PageHeader>

        <nav
          aria-label="FAQ categories"
          className="border-b border-slate-200 bg-white/95 px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
        >
          <div className="no-scrollbar mx-auto flex max-w-5xl gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-x-visible sm:pb-0">
            {faqGroups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#0F4C5C]/30 hover:bg-[#0F4C5C] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C]"
              >
                {group.navLabel}
              </a>
            ))}
          </div>
        </nav>

        <section className="bg-[#f5f5f7] px-6 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0F4C5C]">
                Quick Links
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Common pages for school transactions
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#0F4C5C]/30 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-slate-950">{link.label}</p>
                    <span className="rounded-full bg-[#0F4C5C]/10 p-2 text-[#0F4C5C] transition group-hover:bg-[#0F4C5C] group-hover:text-white">
                      <ArrowIcon />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#eef2f5] px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0F4C5C]">
                FAQ Directory
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                Questions and answers
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
                Select a question below to view the answer. For concerns not
                listed here, please contact the school through official
                channels.
              </p>
            </div>

            <div className="grid gap-8">
              {faqGroups.map((group) => (
                <section
                  id={group.id}
                  key={group.id}
                  className="scroll-mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] md:p-7"
                >
                  <div className="mb-5">
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#0F4C5C]">
                      {group.category}
                    </p>
                    <p className="mt-2 leading-7 text-slate-600">
                      {group.description}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {group.items.map((item) => (
                      <details
                        key={item.id}
                        className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition open:bg-white open:shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-5"
                      >
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-slate-950">
                          <span>{item.question}</span>
                          <span className="mt-1 rounded-full bg-[#0F4C5C]/10 p-1 text-[#0F4C5C] transition group-open:rotate-90">
                            <ArrowIcon />
                          </span>
                        </summary>

                        <p className="mt-4 leading-7 text-slate-600">
                          {item.answer}
                        </p>

                        <FaqCommunityQuestions
                          faqTopicId={item.id}
                          topicTitle={item.question}
                        />
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <aside className="mt-10 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 text-center text-sm leading-6 text-slate-600 shadow-sm">
              FAQ responses and community answers are provided for public
              information and may be updated based on official DepEd and school
              issuances.
            </aside>
          </div>
        </section>

        <section className="bg-[#0F4C5C] px-6 py-16 text-white">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-yellow-300">
              Need further assistance?
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Use official school communication channels.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-teal-50">
              For specific concerns, please contact Tabunoc National High School
              through the official website, Facebook page, Messenger, email, or
              by visiting the school during office hours.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0F4C5C] transition duration-300 hover:-translate-y-1 hover:bg-yellow-50"
              >
                Contact the School
                <ArrowIcon />
              </Link>

              <a
                href="https://facebook.com/tabunocnatlhs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                Visit Facebook Page
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
