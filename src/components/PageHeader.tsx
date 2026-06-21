import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
  variant?: "standard" | "feature" | "minimal";
  align?: "center" | "left";
  children?: ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  variant = "standard",
  align = "center",
  children,
}: PageHeaderProps) {
  const feature = variant === "feature";
  const minimal = variant === "minimal";
  const centered = align === "center";
  const titleClass = `${centered ? "mx-auto" : ""} max-w-5xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl ${feature ? "text-white" : "text-[#24313e]"}`;

  return (
    <section
      className={`relative overflow-hidden px-5 sm:px-8 ${
        feature
          ? "border-b-[6px] border-[#ffdf20] bg-[#24313e] pb-14 pt-32 text-white lg:pb-16 lg:pt-36"
          : minimal
            ? "border-b border-slate-200 bg-[#f5f5f7] pb-10 pt-28 sm:pb-12 sm:pt-32"
            : "border-b border-slate-200 bg-gradient-to-br from-[#f5f5f7] via-white to-slate-50 pb-14 pt-32 sm:pb-16 sm:pt-36"
      }`}
    >
      {feature && (
        <div
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[56px] border-white/[0.04]"
          aria-hidden="true"
        />
      )}

      <div
        className={`relative mx-auto max-w-7xl ${
          centered ? "text-center" : "text-left"
        }`}
      >
        {(badge || eyebrow) && (
          <p
            className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
              feature
                ? "border border-white/15 bg-white/10 text-[#ffdf20]"
                : "border border-slate-200 bg-white text-[#24313e] shadow-sm"
            }`}
          >
            {badge ?? eyebrow}
          </p>
        )}

        <h1 className={`${badge || eyebrow ? "mt-5" : ""} ${titleClass}`}>
          {title}
        </h1>

        {description && (
          <p
            className={`${centered ? "mx-auto" : ""} mt-5 max-w-3xl text-base leading-relaxed sm:text-lg ${
              feature ? "text-slate-200" : "text-[#6e6e73]"
            }`}
          >
            {description}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
