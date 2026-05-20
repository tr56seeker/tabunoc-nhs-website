"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const schoolLogo =
  "https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true";

const navGroups = [
  {
    label: "School",
    links: [
      { label: "About", href: "/#about" },
      { label: "Admin & Staff", href: "/organization" },
    ],
  },
  {
    label: "Services",
    links: [
      { label: "Enrollment", href: "/#enrollment" },
      { label: "SHS Offerings", href: "/#programs" },
    ],
  },
  {
    label: "Community",
    links: [
      { label: "Alumni", href: "/alumni" },
      { label: "Stakeholders", href: "/#contact" },
      { label: "Brigada Eskwela", href: "/#announcements" },
    ],
  },
  {
    label: "Updates",
    links: [
      { label: "Announcements", href: "/#announcements" },
      { label: "Memos", href: "/memos" },
      { label: "SDRRM", href: "/#drrm" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-4 py-4">
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#0F4C5C]/95 px-5 py-3 text-white shadow-xl backdrop-blur-xl"
      >
        <a href="/" className="flex min-w-fit items-center gap-3">
          <img
            src={schoolLogo}
            alt="Tabunoc National High School Logo"
            className="h-12 w-12 object-contain"
          />

          <div className="leading-tight">
            <p className="text-base font-black">Tabunoc NHS</p>
            <p className="hidden text-xs text-teal-50/80 sm:block">
              School ID: 303111
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="/"
            className="rounded-xl px-4 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-[#0F4C5C]"
          >
            Home
          </a>

          {navGroups.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(group.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="rounded-xl px-4 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-[#0F4C5C]">
                {group.label} ▾
              </button>

              <AnimatePresence>
                {openDropdown === group.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 text-slate-950 shadow-2xl"
                  >
                    {group.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="block rounded-xl px-4 py-3 text-sm font-bold transition hover:bg-[#ECFDF5] hover:text-[#0F4C5C]"
                      >
                        {link.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <a
            href="/#contact"
            className="rounded-xl bg-yellow-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-yellow-200"
          >
            Contact
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl border border-white/30 px-4 py-2 text-sm font-bold lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-3 max-w-7xl rounded-2xl border border-slate-200 bg-white p-4 text-slate-950 shadow-xl lg:hidden"
          >
            <div className="grid gap-2">
              <a
                href="/"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-black transition hover:bg-[#ECFDF5] hover:text-[#0F4C5C]"
              >
                Home
              </a>

              {navGroups.map((group) => (
                <div
                  key={group.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="mb-2 px-1 text-xs font-black uppercase tracking-widest text-[#0F4C5C]">
                    {group.label}
                  </p>

                  <div className="grid gap-1">
                    {group.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-bold transition hover:bg-white hover:text-[#0F4C5C]"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              <a
                href="/#contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-yellow-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-yellow-200"
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}