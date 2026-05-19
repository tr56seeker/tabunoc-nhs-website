"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Organization", href: "/organization" },
  { label: "Enrollment", href: "#enrollment" },
  { label: "SHS Offerings", href: "#programs" },
  { label: "Announcements", href: "#announcements" },
  { label: "DRRM", href: "#drrm" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-4 py-4">
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/15 bg-slate-950/70 px-5 py-3 text-white shadow-xl backdrop-blur-xl"
      >
        <a href="/" className="flex items-center gap-3">
          <img
            src="https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true"
            alt="Tabunoc National High School Logo"
            className="h-11 w-11 rounded-full bg-white object-contain p-1"
/>

          <div className="leading-tight">
            <p className="text-sm font-black md:text-base">Tabunoc NHS</p>
            <p className="hidden text-xs text-slate-300 sm:block">
              School ID: 303111
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white hover:text-slate-950"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-3 max-w-7xl rounded-3xl border border-white/15 bg-slate-950/90 p-4 text-white shadow-xl backdrop-blur-xl lg:hidden"
          >
            <div className="grid gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white hover:text-slate-950"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}