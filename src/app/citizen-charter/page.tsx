"use client";

import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import BrandHeader from "@/components/BrandHeader";
import Footer from "@/components/Footer";


const schoolLogo =
  "https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true";

const depedLogo =
  "https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png";

const frontlineServices = [
  {
    category: "Enrollment Services",
    title: "Enrollment of Learners",
    description:
      "Facilitates the enrollment of incoming, returning, transferring, and balik-aral learners in accordance with DepEd enrollment guidelines and school procedures.",
    whoMayAvail:
      "Incoming learners, old learners, transferees, balik-aral learners, ALS passers, parents, guardians, or authorized representatives.",
    requirements: [
      "Original Report Card / SF9, if applicable",
      "Photocopy of PSA Birth Certificate, if available",
      "Certificate of Good Moral Character, if applicable",
      "Recent 2x2 ID picture, if required by the school",
      "Other documents required based on learner type and grade level",
    ],
    process: [
      "Proceed to the designated enrollment area or official enrollment channel.",
      "Submit available enrollment documents for checking and validation.",
      "Fill out or confirm the learner’s enrollment information.",
      "Wait for verification, encoding, and confirmation of enrollment status.",
    ],
    office: "Enrollment Committee / Registrar-designated Personnel / Class Adviser",
    fees: "None",
    processingTime:
      "Within the enrollment period; processing time may vary depending on completeness of documents and learner volume.",
  },
  {
    category: "School Records",
    title: "Issuance of School Forms, Certifications, and Permanent Records",
    description:
      "Covers requests for learner-related school records, certifications, and permanent records kept in the custody of the school.",
    whoMayAvail:
      "Learners, parents, guardians, alumni, receiving schools, or authorized representatives.",
    requirements: [
      "Valid ID of requesting party",
      "Authorization letter, if the requester is not the record owner or parent/guardian",
      "Valid ID of authorized representative, if applicable",
      "School clearance or other school-required validation, if applicable",
    ],
    process: [
      "Submit the request to the school records personnel or designated office.",
      "Present required identification and authorization documents, if applicable.",
      "School personnel verifies the record and prepares the requested document.",
      "Claim the document on the advised release date.",
    ],
    office: "Records Section / Registrar-designated Personnel / School Office",
    fees: "None, unless otherwise covered by official policy",
    processingTime:
      "Subject to record availability, verification needs, and school processing schedule.",
  },
  {
    category: "School Records",
    title: "Request for Certificate of Enrollment",
    description:
      "Provides certification that a learner is officially enrolled in Tabunoc National High School for a specific school year.",
    whoMayAvail: "Currently enrolled learners, parents, or guardians.",
    requirements: [
      "Learner’s complete name",
      "Grade level and section",
      "Purpose of request",
      "Valid ID of requester, if required",
    ],
    process: [
      "Submit request to the school office or designated records personnel.",
      "School personnel verifies enrollment status.",
      "Certificate is prepared, reviewed, and released to the requester.",
    ],
    office: "School Office / Records Personnel",
    fees: "None",
    processingTime: "Usually within the school’s regular processing schedule.",
  },
  {
    category: "School Records",
    title: "Request for Certificate of Good Moral Character",
    description:
      "Provides certification of the learner’s conduct based on school records and adviser or guidance validation.",
    whoMayAvail:
      "Currently enrolled learners, former learners, parents, guardians, or authorized representatives.",
    requirements: [
      "Learner’s complete name",
      "Grade level and section or last school year attended",
      "Purpose of request",
      "Valid ID or authorization, if applicable",
    ],
    process: [
      "Submit request to the school office, guidance office, or designated personnel.",
      "School validates learner information and conduct records.",
      "Certificate is prepared, reviewed, signed, and released.",
    ],
    office: "Guidance Office / School Office / Records Personnel",
    fees: "None",
    processingTime: "Subject to school validation and availability of signatories.",
  },
  {
    category: "School Records",
    title: "Request for Certification of Completion or Graduation",
    description:
      "Provides certification that a learner has completed Junior High School, Senior High School, or graduated from the school based on official records.",
    whoMayAvail:
      "Completers, graduates, parents, guardians, receiving schools, employers, or authorized representatives.",
    requirements: [
      "Complete name of learner",
      "School year completed or graduated",
      "Purpose of request",
      "Valid ID and authorization, if applicable",
    ],
    process: [
      "Submit request and required information to the school office.",
      "Records personnel verifies completion or graduation records.",
      "Certification is prepared, reviewed, signed, and released.",
    ],
    office: "School Office / Records Personnel",
    fees: "None",
    processingTime: "Subject to availability and verification of records.",
  },
  {
    category: "Public Assistance",
    title: "Public Assistance and Inquiry Handling",
    description:
      "Covers walk-in, phone, email, or official social media inquiries related to school services, enrollment, records, schedules, and general school concerns.",
    whoMayAvail:
      "Learners, parents, guardians, alumni, stakeholders, partner agencies, and the general public.",
    requirements: [
      "Complete name of requester",
      "Contact information",
      "Clear statement of concern or inquiry",
      "Supporting document or screenshot, if applicable",
    ],
    process: [
      "Submit inquiry through official school channels or visit the school office.",
      "Concern is received, logged, and routed to the appropriate personnel.",
      "Requester is advised of the next step, required documents, or response timeline.",
    ],
    office: "School Office / Public Assistance Desk / Designated Personnel",
    fees: "None",
    processingTime:
      "Simple inquiries may be addressed immediately; concerns requiring verification may take longer.",
  },
  {
    category: "Communications",
    title: "Receiving and Releasing of Communications and Documents",
    description:
      "Covers receiving, routing, recording, and releasing of official letters, communications, requests, endorsements, and school-related documents.",
    whoMayAvail:
      "Parents, guardians, learners, partner agencies, LGUs, NGOs, private stakeholders, and the general public.",
    requirements: [
      "Original communication or document",
      "Complete contact details of sender",
      "Supporting attachments, if applicable",
      "Receiving copy, if acknowledgment is requested",
    ],
    process: [
      "Submit the communication or document to the school office.",
      "School personnel receives, records, and routes the document to the concerned office or personnel.",
      "Requester receives acknowledgment or update, when applicable.",
    ],
    office: "School Office / Receiving Personnel",
    fees: "None",
    processingTime:
      "Receiving may be immediate; action or response depends on the nature of the document.",
  },
];

const reminders = [
  "Bring a valid ID when requesting school records or certifications.",
  "For representatives, bring an authorization letter and valid ID of both requester and representative.",
  "Processing may take longer when records require verification, retrieval, or approval of authorized signatories.",
  "Avoid sending sensitive learner information through public comment sections.",
  "For urgent concerns, coordinate directly with the school office through official channels.",
];

const quickLinks = [
  {
    label: "Enrollment Guide",
    href: "/enrollment",
  },
  {
    label: "School Memos",
    href: "/memos",
  },
  {
    label: "Contact the School",
    href: "/#contact",
  },
];

export default function CitizenCharterPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-950">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-white to-yellow-50 px-6 pb-20 pt-36 text-slate-950">
          <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-yellow-200/60 blur-3xl" />

          <div className="relative mx-auto max-w-7xl text-center">
            <BrandHeader />

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]"
            >
              Transparency and Public Service
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mx-auto mt-4 max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl"
            >
              Citizen&apos;s Charter
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mx-auto mt-5 max-w-3xl text-lg leading-7 text-slate-700"
            >
              A public guide to common school services, documentary
              requirements, processing offices, and service reminders for
              learners, parents, alumni, and stakeholders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              {quickLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-xl bg-white px-6 py-3 font-black text-[#0F4C5C] shadow-sm transition hover:-translate-y-1 hover:bg-yellow-300 hover:text-slate-950"
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SERVICE NOTE */}
        <section className="bg-white px-6 py-16">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm"
            >
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                Purpose
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Clear school service guide
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                This page helps clients know where to go, what to prepare, and
                what to expect when requesting common school services.
              </p>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="rounded-2xl border border-slate-200 bg-[#ECFDF5] p-6 shadow-sm"
            >
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                Scope
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Common public school services
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                Services listed are generic school-level frontline services
                commonly applicable to public schools.
              </p>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="rounded-2xl border border-slate-200 bg-yellow-50 p-6 shadow-sm"
            >
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                Reminder
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Final validation is required
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                Actual requirements and timelines may vary depending on official
                DepEd issuances, school records, and the nature of the request.
              </p>
            </motion.article>
          </div>
        </section>

        {/* SERVICES */}
        <section className="bg-[#F8FAFC] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
                Frontline Services
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl">
                Common School Services and Processes
              </h2>
              <p className="mx-auto mt-4 max-w-3xl leading-7 text-slate-600">
                The following services are arranged for easy public reference.
                Clients are encouraged to coordinate with the school office for
                specific instructions and updates.
              </p>
            </div>

            <div className="grid gap-6">
              {frontlineServices.map((service, index) => (
                <motion.article
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="border-b border-slate-200 bg-white p-6">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                      <div>
                        <span className="inline-flex rounded-lg bg-[#ECFDF5] px-3 py-2 text-xs font-black uppercase tracking-widest text-[#0F4C5C]">
                          {service.category}
                        </span>

                        <h3 className="mt-4 text-2xl font-black leading-tight text-slate-950 md:text-3xl">
                          {service.title}
                        </h3>

                        <p className="mt-3 max-w-4xl leading-7 text-slate-600">
                          {service.description}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-yellow-50 p-4 lg:min-w-[260px]">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                          Fees
                        </p>
                        <p className="mt-1 text-lg font-black text-slate-950">
                          {service.fees}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-0 lg:grid-cols-2">
                    <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Who May Avail
                      </p>
                      <p className="mt-3 leading-7 text-slate-700">
                        {service.whoMayAvail}
                      </p>

                      <p className="mt-6 text-xs font-black uppercase tracking-widest text-slate-500">
                        Processing Office
                      </p>
                      <p className="mt-3 font-bold leading-7 text-slate-800">
                        {service.office}
                      </p>

                      <p className="mt-6 text-xs font-black uppercase tracking-widest text-slate-500">
                        Processing Time
                      </p>
                      <p className="mt-3 leading-7 text-slate-700">
                        {service.processingTime}
                      </p>
                    </div>

                    <div className="p-6">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Basic Requirements
                      </p>

                      <ul className="mt-4 space-y-3">
                        {service.requirements.map((item) => (
                          <li key={item} className="flex gap-3 text-slate-700">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F4C5C] text-xs font-black text-white">
                              ✓
                            </span>
                            <span className="font-semibold">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="mt-6 text-xs font-black uppercase tracking-widest text-slate-500">
                        General Process
                      </p>

                      <ol className="mt-4 space-y-3">
                        {service.process.map((step, stepIndex) => (
                          <li key={step} className="flex gap-3 text-slate-700">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-300 text-xs font-black text-slate-950">
                              {stepIndex + 1}
                            </span>
                            <span className="font-semibold">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* REMINDERS */}
        <section className="bg-[#0F4C5C] px-6 py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-black uppercase tracking-widest text-yellow-300">
                Client Reminders
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                Prepare complete documents and use official channels.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-teal-50">
                To avoid delays, clients are advised to prepare identification
                documents, authorization documents if needed, and complete
                learner information before requesting school services.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur"
            >
              <h3 className="text-2xl font-black">Important Reminders</h3>

              <ul className="mt-6 space-y-4">
                {reminders.map((item) => (
                  <li key={item} className="flex gap-3 leading-7 text-teal-50">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-300 text-sm font-black text-slate-950">
                      !
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* FEEDBACK */}
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-[#F8FAFC] p-8 text-center shadow-sm">
            <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
              Feedback and Assistance
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950">
              Need help with a school service?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              For questions, clarifications, records concerns, or service
              feedback, please coordinate through the official communication
              channels of Tabunoc National High School.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/#contact"
                className="rounded-xl bg-[#0F4C5C] px-6 py-3 font-black text-white transition hover:-translate-y-1 hover:bg-[#0B3B48]"
              >
                Contact the School
              </a>

              <a
                href="https://m.me/tabunocnatlhs"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#0F4C5C]/30 bg-white px-6 py-3 font-black text-[#0F4C5C] transition hover:-translate-y-1 hover:bg-[#ECFDF5]"
              >
                Chat on Messenger
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}