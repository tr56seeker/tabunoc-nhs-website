"use client";

import { motion } from "framer-motion";
import type { Personnel } from "@/data/organization";

type PersonnelCardProps = {
  person: Personnel;
  compact?: boolean;
  onClick?: (person: Personnel) => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

function getAdvisoryText(person: Personnel) {
  if (!person.advisory || person.advisory.length === 0) return "";

  return person.advisory
    .map((item) => item.section)
    .filter(Boolean)
    .join(", ");
}

export default function PersonnelCard({
  person,
  compact = false,
  onClick,
}: PersonnelCardProps) {
  const initials = getInitials(person.name);
  const advisoryText = getAdvisoryText(person);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      onClick={() => onClick?.(person)}
      className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-xl"
    >
      <div className="flex items-center gap-4">
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            className={`aspect-[3/4] rounded-lg object-cover ${
              compact ? "h-16 w-12" : "h-24 w-[72px]"
            }`}
          />
        ) : (
          <div
            className={`flex aspect-[3/4] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-900 to-yellow-500 font-black text-white ${
              compact ? "h-16 w-12 text-sm" : "h-24 w-[72px] text-xl"
            }`}
          >
            {initials}
          </div>
        )}

        <div>
          <h3
            className={`font-black leading-tight text-slate-950 ${
              compact ? "text-base" : "text-xl"
            }`}
          >
            {person.name}
          </h3>

          <p className="mt-1 text-sm font-semibold text-blue-800">
            {person.position}
          </p>

          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">
            {person.roles.join(", ")}
          </p>

          {advisoryText && (
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-yellow-700">
              {advisoryText}
            </p>
          )}

          <p className="mt-3 text-xs font-bold text-yellow-700 opacity-0 transition group-hover:opacity-100">
            View Profile →
          </p>
        </div>
      </div>

      {person.description && !compact && (
        <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">
          {person.description}
        </p>
      )}
    </motion.article>
  );
}