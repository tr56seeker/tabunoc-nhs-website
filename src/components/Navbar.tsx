"use client";

/**
 * FILE_ID: TABUNOC_NAVBAR_COMPONENT
 * PATH: src/components/Navbar.tsx
 * PURPOSE: Main responsive navigation bar for Tabunoc National High School website.
 * NOTES:
 * - Controls desktop/tablet navbar spacing.
 * - Controls dropdown menus.
 * - Controls mobile menu behavior.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type NavbarProps = {
  brandMode?: "always" | "afterScroll";
  autoHideOnMobileScroll?: boolean;
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
        label: "Faculty & Staff",
        href: "/organization",
        description: "Administration, faculty, personnel, and school organization",
      },
      {
        label: "Learner Population",
        href: "/learner-population",
        description: "School-level aggregate enrollment information",
      },
      {
        label: "Citizen's Charter",
        href: "/citizen-charter",
        description: "Frontline service standards and public assistance",
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
      {
        label: "Frequently Asked Questions",
        href: "/faq",
        description: "Common questions about enrollment, services, and school information",
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

function ChevronDownIcon({ open = false }: { open?: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
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

function DropdownLink({
  item,
  onClick,
  variant = "mobile",
  active = false,
}: {
  item: DropdownItem;
  onClick?: () => void;
  variant?: "desktop" | "mobile";
  active?: boolean;
}) {
  const className =
    variant === "desktop"
      ? `group/dropitem flex items-center justify-between gap-4 px-5 py-4 text-left transition ${
          active
            ? "bg-[#2f3c48] text-white"
            : "text-slate-600 hover:bg-[#2f3c48] hover:text-white"
        }`
      : "group/dropitem block rounded-2xl px-4 py-3 text-left transition hover:bg-[#ffdf20] hover:text-[#071E29]";

  const labelClass =
    variant === "desktop"
      ? "text-sm font-black"
      : "flex items-center justify-between gap-3 text-sm font-black";

  const descriptionClass =
    variant === "desktop"
      ? `mt-1 block line-clamp-2 text-xs font-semibold leading-5 ${
          active
            ? "text-white/75"
            : "text-slate-400 group-hover/dropitem:text-white/75"
        }`
      : "mt-1 block text-xs font-semibold leading-5 text-white/60 group-hover/dropitem:text-[#071E29]/75";

  const content = (
    <>
      <span className="min-w-0">
        <span className={labelClass}>
          {item.label}
          {item.external && variant === "mobile" && <ExternalIcon />}
        </span>

        {item.description && (
          <span className={descriptionClass}>{item.description}</span>
        )}
      </span>

      {variant === "desktop" && (
        <span className="shrink-0 text-lg font-black opacity-0 transition group-hover/dropitem:translate-x-1 group-hover/dropitem:opacity-100">
          ›
        </span>
      )}

      {item.external && variant === "desktop" && (
        <span className="shrink-0">
          <ExternalIcon />
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
        onClick={onClick}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} onClick={onClick} className={className}>
      {content}
    </Link>
  );
}

export default function Navbar({
  brandMode = "always",
  autoHideOnMobileScroll = false,
}: NavbarProps) {
  const pathname = usePathname();

  const [hasScrolled, setHasScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const [desktopOpenGroup, setDesktopOpenGroup] = useState<string | null>(null);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 130);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!autoHideOnMobileScroll) {
      setNavbarVisible(true);
      return;
    }

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    let lastScrollY = window.scrollY;

    const handleScrollVisibility = () => {
      if (!mobileQuery.matches) {
        setNavbarVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;

      if (currentScrollY < 40) {
        setNavbarVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      if (Math.abs(scrollDifference) < 8) {
        return;
      }

      if (scrollDifference > 0) {
        setNavbarVisible(false);
        setMenuOpen(false);
      } else {
        setNavbarVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    const handleViewportChange = () => {
      if (!mobileQuery.matches) {
        setNavbarVisible(true);
      }
    };

    window.addEventListener("scroll", handleScrollVisibility, {
      passive: true,
    });
    mobileQuery.addEventListener("change", handleViewportChange);

    handleViewportChange();

    return () => {
      window.removeEventListener("scroll", handleScrollVisibility);
      mobileQuery.removeEventListener("change", handleViewportChange);
    };
  }, [autoHideOnMobileScroll]);

  useEffect(() => {
    const closeMenuTimer = window.setTimeout(() => {
      setMenuOpen(false);
      setMobileOpenGroup(null);
    }, 0);

    return () => window.clearTimeout(closeMenuTimer);
  }, [pathname]);

  const showBrand = brandMode === "always" || hasScrolled;
  const centerMenu = brandMode === "afterScroll" && !hasScrolled;

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[100] w-full border-b border-white/10 bg-[#24313E]/95 pt-[env(safe-area-inset-top)] text-white shadow-sm backdrop-blur-xl transition-transform duration-300 ease-out ${
          navbarVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
      <nav className="relative mx-auto flex h-20 w-full items-center px-5 md:px-8 xl:px-[90px] 2xl:px-[170px]">
        <Link
          href="/"
          aria-label="Tabunoc National High School Homepage"
          className={`absolute left-5 top-1/2 flex -translate-y-1/2 items-center gap-3 transition-all duration-500 md:left-8 xl:left-[90px] 2xl:left-[170px] ${
            showBrand
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none -translate-x-5 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <img
              src={depedLogo}
              alt="Department of Education logo"
              className="h-9 w-auto object-contain 2xl:h-10"
            />

            <div className="h-9 w-px bg-white/30" />

            <img
              src={schoolLogo}
              alt="Tabunoc National High School logo"
              className="h-10 w-10 rounded-full object-contain 2xl:h-11 2xl:w-11"
            />
          </div>

          <div className="hidden max-w-[250px] leading-tight sm:block xl:max-w-[300px]">
            <p className="truncate text-base font-black tracking-tight 2xl:text-lg">
              Tabunoc National High School
            </p>
            <p className="truncate text-xs font-bold text-white/75">
              Division of Talisay City, Cebu
            </p>
          </div>
        </Link>

        <div
          className={`absolute top-1/2 hidden -translate-y-1/2 items-center gap-1 transition-all duration-500 ease-out xl:flex 2xl:gap-2 ${
            centerMenu
              ? "left-1/2 -translate-x-1/2"
              : "right-5 translate-x-0 xl:right-[90px] 2xl:right-[170px]"
          }`}
        >
          {navItems.map((item) => {
            const active = isItemActive(pathname, item);
            const highlighted =
              hoveredHref === item.href ||
              desktopOpenGroup === item.label ||
              (!hoveredHref && !desktopOpenGroup && active);
            const hasDropdown = Boolean(item.items?.length);
            const desktopDropdownOpen = desktopOpenGroup === item.label;

            const navItemClassName = `inline-flex h-20 items-center gap-1.5 px-4 text-sm font-black transition-all duration-200 2xl:gap-2 2xl:px-6 ${
              highlighted
                ? "bg-white text-[#24313E]"
                : "text-white/90 hover:bg-white hover:text-[#24313E]"
            }`;

            return (
              <div
                key={item.label}
                className="group/navitem relative"
                onMouseEnter={() => setHoveredHref(item.href)}
                onMouseLeave={() => {
                  setHoveredHref(null);
                  setDesktopOpenGroup(null);
                }}
              >
                {hasDropdown ? (
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={desktopDropdownOpen}
                    onClick={() =>
                      setDesktopOpenGroup(
                        desktopDropdownOpen ? null : item.label
                      )
                    }
                    className={navItemClassName}
                  >
                    {item.label}
                    <span className="transition-transform duration-200 group-hover/navitem:rotate-180">
                      <ChevronDownIcon open={desktopDropdownOpen} />
                    </span>
                  </button>
                ) : (
                  <Link href={item.href} className={navItemClassName}>
                    {item.label}
                  </Link>
                )}

                {hasDropdown && (
                  <div
                    className={`pointer-events-none absolute left-1/2 top-full z-[1001] -translate-x-1/2 opacity-0 transition-all duration-200 group-hover/navitem:pointer-events-auto group-hover/navitem:opacity-100 ${
                      desktopDropdownOpen ? "pointer-events-auto opacity-100" : ""
                    }`}
                  >
                    <div className="w-[300px] overflow-hidden border-t-4 border-[#ffdf20] bg-white py-2 text-[#24313E] shadow-2xl shadow-black/25">
                      {item.items?.map((dropdownItem) => (
                        <DropdownLink
                          key={`${item.label}-${dropdownItem.label}`}
                          item={dropdownItem}
                          variant="desktop"
                          active={isInternalActive(pathname, dropdownItem.href)}
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
            className="ml-1 rounded-xl bg-[#0F4C5C] px-5 py-3 text-sm font-black text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#146577] 2xl:ml-3 2xl:px-7"
          >
            Contact
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
          className="relative z-[1001] ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:bg-white/10 xl:hidden"
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
        <div className="fixed left-0 top-[calc(5rem+env(safe-area-inset-top))] z-[1000] max-h-[calc(100dvh-5rem-env(safe-area-inset-top))] w-full overflow-y-auto border-t border-white/10 bg-[#24313E]/95 px-6 pb-6 pt-4 text-white shadow-2xl shadow-black/40 backdrop-blur-xl xl:hidden">
          <div className="mx-auto grid max-w-3xl gap-2">
            {navItems.map((item) => {
              const active = isItemActive(pathname, item);
              const hasDropdown = Boolean(item.items?.length);
              const openGroup = mobileOpenGroup === item.label;

              return (
                <div key={item.label} className="rounded-2xl">
                  <div className="flex items-center gap-2">
                    {hasDropdown ? (
                      <button
                        type="button"
                        aria-expanded={openGroup}
                        onClick={() =>
                          setMobileOpenGroup(openGroup ? null : item.label)
                        }
                        className={`flex-1 rounded-xl px-4 py-3 text-left text-sm font-black transition ${
                          active
                            ? "bg-[#ffdf20] text-[#071E29]"
                            : "text-white/90 hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => {
                          setMenuOpen(false);
                          setMobileOpenGroup(null);
                        }}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition ${
                          active
                            ? "bg-[#ffdf20] text-[#071E29]"
                            : "text-white/90 hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}

                    {hasDropdown && (
                      <button
                        type="button"
                        aria-label={`Toggle ${item.label} submenu`}
                        aria-expanded={openGroup}
                        onClick={() =>
                          setMobileOpenGroup(openGroup ? null : item.label)
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                      >
                        <ChevronDownIcon open={openGroup} />
                      </button>
                    )}
                  </div>

                  {hasDropdown && openGroup && (
                    <div className="mt-2 grid gap-1 rounded-2xl border border-white/10 bg-[#1B2A35]/80 p-2">
                      {item.items?.map((dropdownItem) => (
                        <DropdownLink
                          key={`${item.label}-${dropdownItem.label}`}
                          item={dropdownItem}
                          onClick={() => {
                            setMenuOpen(false);
                            setMobileOpenGroup(null);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/contact"
              onClick={() => {
                setMenuOpen(false);
                setMobileOpenGroup(null);
              }}
              className="mt-2 rounded-xl bg-[#0F4C5C] px-4 py-3 text-center text-sm font-black text-white transition hover:bg-[#146577]"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
      </header>

    </>
  );
}
