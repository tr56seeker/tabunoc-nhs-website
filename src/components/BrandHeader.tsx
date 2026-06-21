"use client";

import Image from "next/image";
import { motion } from "motion/react";

const schoolLogo = "/images/tabunoc-nhs-logo-512.png";

const depedLogo = "/images/deped-logo.png";

type BrandHeaderProps = {
  compact?: boolean;
};

export default function BrandHeader({ compact = false }: BrandHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className={`flex flex-col items-center justify-center ${
        compact ? "mb-5 gap-2.5" : "mb-8 gap-4"
      }`}
    >
      <div
        className={`flex items-center justify-center ${
          compact ? "gap-3 sm:gap-4" : "gap-4 sm:gap-5"
        }`}
      >
        <Image
          src={depedLogo}
          alt="Department of Education Logo"
          width={141}
          height={72}
          className={
            compact
              ? "h-12 w-auto object-contain sm:h-14 md:h-16"
              : "h-14 w-auto object-contain sm:h-16 md:h-[72px]"
          }
        />

        <div
          className={`w-px bg-[#45b3c2] dark:bg-[#45b3c2]/60 ${
            compact ? "h-10 sm:h-12" : "h-12 sm:h-14"
          }`}
        />

        <Image
          src={schoolLogo}
          alt="Tabunoc National High School Logo"
          width={80}
          height={80}
          className={
            compact
              ? "h-14 w-14 object-contain sm:h-16 sm:w-16"
              : "h-16 w-16 object-contain sm:h-20 sm:w-20"
          }
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#24313E] dark:text-stone-100">
          Department of Education
        </p>
        <p
          className={`${
            compact ? "mt-0.5 text-sm sm:text-base" : "mt-1 text-base sm:text-lg"
          } font-bold text-slate-700 dark:text-stone-200`}
        >
          Tabunoc National High School - School ID: 303111
        </p>
      </div>
    </motion.div>
  );
}
