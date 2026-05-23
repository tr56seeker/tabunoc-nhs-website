"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const schoolLogo = "/images/tabunoc-nhs-logo-512.png";

const depedLogo = "/images/deped-logo.png";

export default function BrandHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-8 flex flex-col items-center justify-center gap-4"
    >
      <div className="flex items-center justify-center gap-4 sm:gap-5">
        <Image
          src={depedLogo}
          alt="Department of Education Logo"
          width={141}
          height={72}
          className="h-14 w-auto object-contain sm:h-16 md:h-[72px]"
        />

        <div className="h-12 w-px bg-slate-300 sm:h-14" />

        <Image
          src={schoolLogo}
          alt="Tabunoc National High School Logo"
          width={80}
          height={80}
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
