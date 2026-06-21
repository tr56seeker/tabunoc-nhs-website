/**
 * FILE_ID: TABUNOC_FAQ_PAGE
 * PATH: src/app/faq/page.tsx
 * PURPOSE: Frequently Asked Questions page for Tabunoc National High School.
 */

import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TypewriterText from "@/components/TypewriterText";

const faqGroups = [
  {
    category: "Enrollment",
    description:
      "Common questions from incoming learners, parents, guardians, transferees, and returning learners.",
    items: [
      {
        question: "When is the enrollment period?",
        answer:
          "Enrollment schedules are announced through the official Tabunoc National High School website, Facebook page, and school advisories. Parents and learners are encouraged to check the Enrollment Guide page for the latest schedule, reminders, and procedures.",
      },
      {
        question: "What are the requirements for enrollment?",
        answer:
          "Enrollment requirements depend on the learner type, such as incoming Grade 7, incoming Grade 11, transferee, returning learner, or ALS passer. The complete and updated list of requirements is posted on the Enrollment Guide page.",
      },
      {
        question: "Does the school accept transferees?",
        answer:
          "Yes. Tabunoc National High School accepts transferees subject to DepEd enrollment guidelines, availability of slots, and submission of required documents for verification.",
      },
      {
        question: "What should transferees bring?",
        answer:
          "Transferees are usually advised to bring their report card, PSA birth certificate, certificate of good moral character when applicable, and other documents required by the school for verification and enrollment processing.",
      },
      {
        question: "Where can I ask enrollment-related questions?",
        answer:
          "Enrollment concerns may be raised through the official school Facebook page, Messenger, email, or by visiting the school during office hours. Please use only official school communication channels for proper documentation.",
      },
    ],
  },
  {
    category: "School Programs",
    description:
      "Basic information about Junior High School and Senior High School offerings.",
    items: [
      {
        question: "What grade levels are offered by the school?",
        answer:
          "Tabunoc National High School offers Junior High School from Grade 7 to Grade 10 and Senior High School from Grade 11 to Grade 12.",
      },
      {
        question: "What Senior High School programs are available?",
        answer:
          "Available Senior High School offerings are posted on the SHS Offerings page. Incoming Grade 11 learners should check the page for the latest tracks, strands, and specializations offered by the school.",
      },
      {
        question: "Where can I view the school personnel and organization?",
        answer:
          "The School Organization page contains the school administration, faculty, class advisers, program coordinators, and support personnel directory.",
      },
    ],
  },
  {
    category: "Records and Public Assistance",
    description:
      "Questions about school documents, public transactions, and frontline services.",
    items: [
      {
        question: "How can I request school documents?",
        answer:
          "Requests for school records, certifications, or related documents should be coordinated with the school office or concerned personnel. Processing requirements and steps may be guided by the schoolâ€™s Citizenâ€™s Charter.",
      },
      {
        question: "Where can I find the Citizenâ€™s Charter?",
        answer:
          "The Citizenâ€™s Charter page provides information on frontline services, service standards, requirements, and public assistance processes of the school.",
      },
      {
        question: "What are the school office hours?",
        answer:
          "The school generally accommodates transactions during regular office hours, Monday to Friday, except holidays, class suspensions, and official work suspensions. For urgent concerns, check the latest school advisory before visiting.",
      },
    ],
  },
  {
    category: "Communication and Announcements",
    description:
      "Official channels for verified information, advisories, and school updates.",
    items: [
      {
        question: "Where can I view official school announcements?",
        answer:
          "Official announcements are posted on the School Memos page, the official Facebook page, and other authorized school communication channels.",
      },
      {
        question: "What is the official contact information of the school?",
        answer:
          "Official contact channels are listed on the Contact section of the website and in the footer. For safety and proper documentation, use only the official channels of Tabunoc National High School.",
      },
      {
        question: "Where is Tabunoc National High School located?",
        answer:
          "Tabunoc National High School is located at Sangi Road, Tabunok, Talisay City, Cebu. A directions link is available on the website for visitors who need map guidance.",
      },
      {
        question: "Where can I access the School MIS?",
        answer:
          "Authorized users may access the School MIS through the official MIS link provided on the website. Access may be limited depending on the purpose and authorization level.",
      },
    ],
  },
  {
    category: "Safety, DRRM, and Class Suspensions",
    description:
      "Reminders on school safety, disaster preparedness, and emergency advisories.",
    items: [
      {
        question: "What should parents do during class suspensions or emergencies?",
        answer:
          "Parents and learners should monitor official advisories from DepEd, the LGU, and the schoolâ€™s official communication channels. During emergencies, the school follows its safety, DRRM, and learner accounting protocols.",
      },
      {
        question: "How does the school communicate emergency advisories?",
        answer:
          "Emergency advisories may be posted through the official school Facebook page, website, and other authorized communication channels. Learners and parents should avoid relying on unverified posts or unofficial sources.",
      },
    ],
  },
  {
    category: "Stakeholder Support",
    description:
      "Ways parents, alumni, partners, and community members can support school programs.",
    items: [
      {
        question: "How can stakeholders support school programs?",
        answer:
          "Stakeholders may coordinate with the school administration for partnerships, Brigada Eskwela support, learner assistance, DRRM support, donations, or other school-approved initiatives.",
      },
      {
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
    label: "Citizenâ€™s Charter",
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

      <main className="min-h-screen bg-white text-slate-950">
        <PageHeader
          eyebrow="Help and Information"
          title="Frequently Asked Questions"
          description="Find answers to common questions about school services, enrollment, schedules, and official channels of Tabunoc National High School."
        >
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
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

        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0F4C5C]">
                Quick Links
              </p>
              <TypewriterText
                as="h2"
                text="Common pages for school transactions"
                className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl"
                speed={58}
                startDelay={120}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0F4C5C]/30 hover:bg-white hover:shadow-lg"
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

        <section className="bg-[#F8FAFC] px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0F4C5C]">
                FAQ Directory
              </p>
              <TypewriterText
                as="h2"
                text="Questions and answers"
                className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl"
                speed={58}
                startDelay={120}
              />
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
                Select a question below to view the answer. For concerns not
                listed here, please contact the school through official
                channels.
              </p>
            </div>

            <div className="grid gap-8">
              {faqGroups.map((group) => (
                <section
                  key={group.category}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7"
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
                        key={item.question}
                        className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 transition open:bg-white open:shadow-sm"
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
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
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
