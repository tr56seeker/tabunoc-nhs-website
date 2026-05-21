"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const schoolLogo =
  "https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true";
const depedLogo =
  "https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png";
const facebookGroupMembers = 1250;

export default function AlumniPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50 to-amber-100 px-6 pb-24 pt-36">
        <div className="absolute left-8 top-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute right-8 top-28 h-80 w-80 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle,_rgba(255,255,255,0.9),_transparent_60%)]" />

        <div className="relative mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-10 flex flex-col items-center gap-4 rounded-[2rem] border border-amber-200 bg-white/95 px-8 py-6 shadow-2xl shadow-amber-200/20 backdrop-blur-xl sm:flex-row"
          >
            <img
              src={depedLogo}
              alt="Department of Education Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="h-16 w-px bg-white/20" />
            <img
              src={schoolLogo}
              alt="Tabunoc National High School Logo"
              className="h-14 w-auto object-contain"
            />
            <div className="h-16 w-px bg-white/20" />
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-[0.38em] text-amber-600">
                Knowledge, Legacy, Leadership
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                Tabunoc National High School Alumni Community
              </p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="mx-auto max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl"
          >
            Students & Alumni Community
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700"
          >
            A knowledge-driven platform for graduates and learners to reconnect,
            celebrate achievement, and support the next generation of Tabunoc leaders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#overview"
              className="rounded-full bg-amber-400 px-8 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-300/30 transition hover:bg-amber-300"
            >
              Discover Alumni Programs
            </a>
            <a
              href="https://web.facebook.com/groups/TabunokNatlHSAlumniAndStudentsCommunity"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-amber-400 bg-white px-8 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-50"
            >
              Join the Network
            </a>
          </motion.div>
        </div>
      </section>

      <section id="overview" className="bg-white px-6 py-20 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <p className="text-sm font-black uppercase tracking-widest text-amber-500">
                Alumni Knowledge Hub
              </p>
              <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
                A trusted alumni space with clear purpose and thoughtful structure.
              </h2>
              <p className="max-w-3xl text-lg leading-8 text-slate-700">
                The Alumni page blends the same modern Tabunoc identity with a knowledge-first palette.
                It organizes the alumni experience into clear categories, high-level programs, and activation pathways
                for learning, leadership, and community impact.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-5"
            >
              <div className="rounded-[2rem] border border-amber-300/30 bg-amber-50/80 p-8 shadow-2xl shadow-amber-950/15">
                <p className="text-sm font-bold uppercase tracking-widest text-amber-700">
                  Alumni at a Glance
                </p>
                <div className="mt-6 grid gap-4 text-slate-950 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/50">
                    <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                      Facebook group members
                    </p>
                    <p className="mt-3 text-3xl font-black text-amber-600">
                      {facebookGroupMembers.toLocaleString()}+
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                      Updated when join requests are approved
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/50">
                    <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                      Programs
                    </p>
                    <p className="mt-3 text-3xl font-black text-amber-700">18</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-16 grid gap-6 lg:grid-cols-3"
          >
            <div className="rounded-[2rem] border border-amber-200/60 bg-white p-8 shadow-xl shadow-amber-950/10">
              <p className="text-sm font-bold uppercase tracking-widest text-amber-500">
                Knowledge
              </p>
              <h3 className="mt-4 text-2xl font-black text-slate-950">Learning Continuity</h3>
              <p className="mt-4 leading-7 text-slate-700">
                Alumni-led seminars, workshops, and mentoring sessions that keep school knowledge active and accessible.
              </p>
            </div>
            <div className="rounded-[2rem] border border-amber-200/60 bg-white p-8 shadow-xl shadow-amber-950/10">
              <p className="text-sm font-bold uppercase tracking-widest text-amber-500">
                Legacy
              </p>
              <h3 className="mt-4 text-2xl font-black text-slate-950">Shared Impact</h3>
              <p className="mt-4 leading-7 text-slate-700">
                Highlighting alumni successes, support projects, and stories that inspire current learners.
              </p>
            </div>
            <div className="rounded-[2rem] border border-amber-200/60 bg-white p-8 shadow-xl shadow-amber-950/10">
              <p className="text-sm font-bold uppercase tracking-widest text-amber-500">
                Leadership
              </p>
              <h3 className="mt-4 text-2xl font-black text-slate-950">Structured Growth</h3>
              <p className="mt-4 leading-7 text-slate-700">
                Clear pathways for alumni to mentor, collaborate, and lead initiatives within the Tabunoc community.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-14 rounded-[2rem] border border-amber-200/50 bg-white p-8 shadow-2xl shadow-amber-950/10"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              Community Links
            </p>
            <h3 className="mt-4 text-3xl font-black text-slate-950">
              Quick access to alumni and school Facebook channels.
            </h3>
            <p className="mt-4 max-w-3xl text-slate-700 leading-7">
              Use these official pages to join the group, follow updates, and support school outreach.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <a
                href="https://web.facebook.com/groups/TabunokNatlHSAlumniAndStudentsCommunity"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[1.75rem] border border-amber-300/20 bg-amber-50 p-6 text-left transition hover:border-amber-400 hover:bg-amber-100"
              >
                <p className="text-xs font-black uppercase tracking-widest text-amber-500">
                  Join the network
                </p>
                <p className="mt-3 text-lg font-black text-slate-950">Facebook Group</p>
                <p className="mt-3 text-sm text-slate-600">
                  Request to join and stay connected with alumni and current students.
                </p>
              </a>
              <a
                href="https://web.facebook.com/tabunocnatlhsAlumni/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[1.75rem] border border-amber-200/60 bg-white p-6 text-left transition hover:border-amber-300 hover:bg-amber-50"
              >
                <p className="text-xs font-black uppercase tracking-widest text-amber-500">
                  Like and support
                </p>
                <p className="mt-3 text-lg font-black text-slate-950">Alumni Facebook Page</p>
                <p className="mt-3 text-sm text-slate-600">
                  Help us grow audience support and celebrate alumni achievements.
                </p>
              </a>
              <a
                href="https://web.facebook.com/tabunocnatlhs"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[1.75rem] border border-amber-200/60 bg-white p-6 text-left transition hover:border-amber-300 hover:bg-amber-50"
              >
                <p className="text-xs font-black uppercase tracking-widest text-amber-500">
                  Follow school news
                </p>
                <p className="mt-3 text-lg font-black text-slate-950">Tabunoc NHS Facebook Page</p>
                <p className="mt-3 text-sm text-slate-600">
                  Stay updated on school announcements, events, and community initiatives.
                </p>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="connect" className="bg-[#F8FAFC] px-6 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-emerald-200/60 bg-white p-10 shadow-2xl shadow-emerald-950/10">
            <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
              Get Involved
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              A clear alumni journey with knowledge-led milestones.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Alumni participation is best when it is organized, purposeful, and aligned to the school&apos;s mission.
              These steps make it easy to take part in community, support, and learning initiatives.
            </p>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {[
                {
                  step: "01",
                  title: "Reconnect",
                  description:
                    "Update your alumni profile, verify your batch details, and join our network of mentors and volunteers.",
                },
                {
                  step: "02",
                  title: "Collaborate",
                  description:
                    "Participate in school events, career talks, and project-based programs that support learners and teachers.",
                },
                {
                  step: "03",
                  title: "Contribute",
                  description:
                    "Support scholarships, educational resources, and community outreach through gifts, grants, and time.",
                },
                {
                  step: "04",
                  title: "Celebrate",
                  description:
                    "Share graduation stories, recognition highlights, and alumni achievements that inspire everyone.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-[1.75rem] border border-slate-200 bg-slate-100/90 p-8 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-300 text-xl font-black text-slate-950">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-5 text-slate-700 leading-7">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-24 text-slate-100">
        <div className="mx-auto max-w-7xl border border-emerald-500/10 bg-slate-900/80 p-10 shadow-2xl shadow-emerald-950/15">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-sm font-black uppercase tracking-widest text-amber-300">
                Alumni Support
              </p>
              <h2 className="text-4xl font-black leading-tight text-white md:text-5xl">
                Connect with the alumni office and start your legacy pathway.
              </h2>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                Whether you are a graduate, teacher, or partner, the alumni network offers a structured way to stay involved,
                share knowledge, and invest in the school&apos;s future.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.75rem] bg-slate-900/90 p-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
                  Email
                </p>
                <p className="mt-4 text-2xl font-black text-white">alumni@tabunocnhs.edu.ph</p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-900/90 p-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
                  Phone
                </p>
                <p className="mt-4 text-2xl font-black text-white">(032) 123-4567</p>
              </div>
              <div className="rounded-[1.75rem] bg-slate-900/90 p-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
                  Location
                </p>
                <p className="mt-4 text-2xl font-black text-white">Sangi Road, Tabunok, Talisay City</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
