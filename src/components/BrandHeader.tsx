"use client";

import { motion } from "framer-motion";

const schoolLogo =
  "https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true";

const depedLogo =
  "https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png";

export default function BrandHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-8 flex flex-col items-center justify-center gap-4"
    >
      <div className="flex items-center justify-center gap-4 sm:gap-5">
        <img
          src={depedLogo}
          alt="Department of Education Logo"
          className="h-14 w-auto object-contain sm:h-16 md:h-[72px]"
        />

        <div className="h-12 w-px bg-slate-300 sm:h-14" />

        <img
          src={schoolLogo}
          alt="Tabunoc National High School Logo"
          className="h-16 w-16 object-contain sm:h-20 sm:w-20"
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-black uppercase tracking-widest text-[#0F4C5C]">
          Department of Education
        </p>
        <p className="mt-1 text-base font-bold text-slate-700 sm:text-lg">
          Tabunoc National High School · School ID: 303111
        </p>
      </div>
    </motion.div>
  );
}