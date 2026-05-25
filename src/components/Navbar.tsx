"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type NavbarProps = {
  brandMode?: "always" | "afterScroll";
};

type DropdownItem = {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
};

type NavItem = {
  label: string;
  href: string;
  items?: DropdownItem[];
};

const depedLogo =
  "https://depedph.com/wp-content/uploads/2024/01/deped-logo-philippines-1536x783.png";

const schoolLogo =
  "https://github.com/tr56seeker/tabunocnatlhs/blob/main/TabunocNHSLOGO%E2%80%94NEW.png?raw=true";

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "School",
    href: "/organization",
    items: [
      {
        label: "School Profile",
        href: "/organization",
        description: "Administration, personnel, and school organization",
      },
      {
        label: "Citizen's Charter",
        href: "/citizen-charter",
        description: "Public service standards and frontline services",
      },
    ],
  },
  {
    label: "Services",
    href: "/#services",
    items: [
      {
        label: "Enrollment Guide",
        href: "/enrollment",
        description: "Requirements and step-by-step enrollment process",
      },
      {
        label: "SHS Offerings",
        href: "/shs-offerings",
        description: "Senior High School programs and learning pathways",
      },
      {
        label: "School MIS",
        href: "https://smis.tabunocnatlhs.com",
        description: "Authorized school management information system",
        external: true,
      },
    ],
  },
  {
    label: "Community",
    href: "/alumni",
    items: [
      {
        label: "Alumni Community",
        href: "/alumni",
        description: "Alumni information and school community updates",
      },
      {
        label: "Official Facebook Page",
        href: "https://facebook.com/tabunocnatlhs",
        description: "Follow official school announcements",
        external: true,
      },
    ],
  },
  {
    label: "Updates",
    href: "/memos",
    items: [
      {
        label: "School Memos",
        href: "/memos",
        description: "Public memoranda, advisories, and issuances",
      },
      {
        label: "Enrollment Updates",
        href: "/enrollment",
        description: "Enrollment reminders and school-year information",
      },
    ],
  },
];

function isInternalActive(pathname: string, href: string) {
  if (href.startsWith("http")) return false;
  if (href === "/") return pathname === "/";
  if (href.includes("#")) return false;
  return pathname.startsWith(href);
}

function isItemActive(pathname: string, item: NavItem) {
  const parentActive = isInternalActive(pathname, item.href);
  const childActive = item.items?.some((child) =>
    isInternalActive(pathname, child.href)
  );

  return parentActive || childActive;
}

function ChevronDownIcon() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-200 group-hover/navitem:rotate-180"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 5h5v5M10 14 19 5M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropdownLink({ item }: { item: DropdownItem }) {
  const className =
    "group/dropitem block rounded-2xl px-4 py-3 text-left transition hover:bg-[#ffdf20] hover:text-[#071E29]";

  const content = (
    <>
      <span className="flex items-center justify-between gap-3 text-sm font-black">
        {item.label}
        {item.external && <ExternalIcon />}
      </span>

      {item.description && (
        <span className="mt-1 block text-xs font-semibold leading-5 text-white/60 group-hover/dropitem:text-[#071E29]/75">
          {item.description}
        </span>
      )}
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
}

export default function Navbar({ brandMode = "always" }: NavbarProps) {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 130);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showBrand = brandMode === "always" || hasScrolled;
  const centerMenu = brandMode === "afterScroll" && !hasScrolled;

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#0a0d0c]/80 text-white shadow-sm backdrop-blur-xl">
      <nav className="relative mx-auto flex h-20 w-full items-center px-6 md:px-10 xl:px-[120px] 2xl:px-[190px]">
        <Link
          href="/"
          aria-label="Tabunoc National High School Homepage"
          className={`absolute left-6 top-1/2 flex -translate-y-1/2 items-center gap-3 transition-all duration-500 md:left-10 xl:left-[120px] 2xl:left-[190px] ${
            showBrand
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none -translate-x-5 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <img
              src={depedLogo}
              alt="Department of Education logo"
              className="h-10 w-auto object-contain"
            />

            <div className="h-9 w-px bg-white/25" />

            <img
              src={schoolLogo}
              alt="Tabunoc National High School logo"
              className="h-11 w-11 rounded-full object-contain"
            />
          </div>

          <div className="hidden leading-tight sm:block">
            <p className="text-lg font-black tracking-tight">
              Tabunoc National High School
            </p>
            <p className="text-xs font-bold text-white/75">
              School ID: 303111
            </p>
          </div>
        </Link>

        <div
          className={`absolute top-1/2 hidden -translate-y-1/2 items-center gap-2 transition-all duration-500 ease-out lg:flex ${
            centerMenu
              ? "left-1/2 -translate-x-1/2"
              : "right-6 translate-x-0 md:right-10 xl:right-[120px] 2xl:right-[190px]"
          }`}
        >
          {navItems.map((item) => {
            const active = isItemActive(pathname, item);
            const highlighted =
              hoveredHref === item.href || (!hoveredHref && active);
            const hasDropdown = Boolean(item.items?.length);

            return (
              <div
                key={item.label}
                className="group/navitem relative"
                onMouseEnter={() => setHoveredHref(item.href)}
                onMouseLeave={() => setHoveredHref(null)}
              >
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-black transition-all duration-200 ${
                    highlighted
                      ? "bg-[#ffdf20] text-[#071E29]"
                      : "text-white/85 hover:bg-[#ffdf20] hover:text-[#071E29]"
                  }`}
                >
                  {item.label}
                  {hasDropdown && <ChevronDownIcon />}
                </Link>

                {hasDropdown && (
                  <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[310px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover/navitem:pointer-events-auto group-hover/navitem:translate-y-0 group-hover/navitem:opacity-100">
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a0d0c]/95 p-2 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
                      {item.items?.map((dropdownItem) => (
                        <DropdownLink
                          key={`${item.label}-${dropdownItem.label}`}
                          item={dropdownItem}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href="/contact"
            className="ml-3 rounded-xl bg-[#0F4C5C] px-7 py-3 text-sm font-black text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#146577]"
          >
            Contact
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setMenuOpen((current) => !current)}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-white lg:hidden"
        >
          <span className="sr-only">Menu</span>
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#0a0d0c]/95 px-6 pb-5 pt-3 backdrop-blur-xl lg:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => {
              const active = isItemActive(pathname, item);

              return (
                <div key={item.label} className="rounded-xl">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-black transition ${
                      active
                        ? "bg-[#ffdf20] text-[#071E29]"
                        : "text-white/85 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>

                  {item.items && (
                    <div className="mt-1 grid gap-1 pl-3">
                      {item.items.map((dropdownItem) =>
                        dropdownItem.external ? (
                          <a
                            key={`${item.label}-${dropdownItem.label}`}
                            href={dropdownItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMenuOpen(false)}
                            className="rounded-xl px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white"
                          >
                            {dropdownItem.label}
                          </a>
                        ) : (
                          <Link
                            key={`${item.label}-${dropdownItem.label}`}
                            href={dropdownItem.href}
                            onClick={() => setMenuOpen(false)}
                            className="rounded-xl px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white"
                          >
                            {dropdownItem.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-[#0F4C5C] px-4 py-3 text-sm font-black text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}