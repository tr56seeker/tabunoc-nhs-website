import Link from "next/link";

type GradientFeatureCardProps = {
  title: string;
  description: string;
  href: string;
  eyebrow?: string;
  external?: boolean;
  accent?: "teal" | "yellow" | "mint";
};

const accentStyles = {
  teal: "from-[#0F4C5C] to-[#0B2A36] text-white",
  yellow:
    "from-[#ECFDF5] to-white text-slate-950 dark:from-[#171614] dark:to-[#171614]/80 dark:text-white",
  mint:
    "from-[#ECFDF5] to-white text-slate-950 dark:from-[#171614] dark:to-[#171614]/80 dark:text-white",
};

export default function GradientFeatureCard({
  title,
  description,
  href,
  eyebrow,
  external = false,
  accent = "mint",
}: GradientFeatureCardProps) {
  const className = `group block h-full rounded-2xl border border-slate-200 bg-gradient-to-br ${accentStyles[accent]} p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.01] dark:border-[#292624] dark:shadow-black/20`;

  const content = (
    <>
      {eyebrow ? (
        <p
          className={`text-xs font-black uppercase tracking-[0.18em] ${
            accent === "teal"
              ? "text-stone-100"
              : "text-[#0F4C5C] dark:text-stone-100"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h3 className="mt-3 text-xl font-black leading-tight transition group-hover:text-[#0F4C5C] dark:group-hover:text-white">{title}</h3>
      <p
        className={`mt-3 text-sm font-medium leading-6 ${
          accent === "teal" ? "text-teal-50" : "text-slate-600 dark:text-stone-300"
        }`}
      >
        {description}
      </p>
      <span
        className={`mt-5 inline-flex text-sm font-black ${
          accent === "teal"
            ? "text-stone-100"
            : "text-[#0F4C5C] dark:text-stone-100"
        }`}
      >
        Open service
        <span className="ml-2 transition group-hover:translate-x-1">-&gt;</span>
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
