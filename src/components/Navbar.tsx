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
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

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

const depedLogo = "/images/deped-logo.png";

const schoolLogo = "/images/tabunoc-nhs-logo-512.png";

const schoolContact = {
  email: "303111@deped.gov.ph",
  phone: "+63324020803",
  facebook: "https://facebook.com/tabunocnatlhs",
  messenger: "https://m.me/tabunocnatlhs",
};

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
        label: "Evacuation Map",
        href: "/evacuation-map",
        description: "Interactive school evacuation routes and assembly areas",
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

function updateNavbarHoverOrigin(
  event: ReactMouseEvent<HTMLElement>,
  target?: HTMLElement
) {
  const element = target ?? event.currentTarget;
  const rect = element.getBoundingClientRect();

  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  element.style.setProperty(
    "--nav-hover-x",
    `${Math.min(100, Math.max(0, x))}%`
  );
  element.style.setProperty(
    "--nav-hover-y",
    `${Math.min(100, Math.max(0, y))}%`
  );
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
            ? "bg-[#F8FAFC] text-[#24313E]"
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
            ? "text-slate-500"
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
  brandMode = "afterScroll",
  autoHideOnMobileScroll = false,
}: NavbarProps) {
  const pathname = usePathname();

  const [hasScrolled, setHasScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const [desktopOpenGroup, setDesktopOpenGroup] = useState<string | null>(null);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const contactRef = useRef<HTMLDivElement | null>(null);

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
      const showNavbarTimer = window.setTimeout(() => {
        setNavbarVisible(true);
      }, 0);

      return () => window.clearTimeout(showNavbarTimer);
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
      setContactOpen(false);
    }, 0);

    return () => window.clearTimeout(closeMenuTimer);
  }, [pathname]);

  useEffect(() => {
    if (!contactOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!contactRef.current?.contains(event.target as Node)) {
        setContactOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContactOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [contactOpen]);

  const showBrand = brandMode === "always" || hasScrolled;
  const centerMenu = brandMode === "afterScroll" && !hasScrolled;
  const contactActive = pathname.startsWith("/contact");

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[100] w-full border-b border-white/10 bg-[#34495e]/95 pt-[env(safe-area-inset-top)] text-white shadow-sm backdrop-blur-xl transition-transform duration-300 ease-out ${
          navbarVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
      <nav className="relative mx-auto flex h-20 w-full items-center px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-[120px]">
        <Link
          href="/"
          aria-label="Tabunoc National High School Homepage"
          className={`absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-3 transition-all duration-500 md:left-6 lg:left-8 xl:left-12 2xl:left-[120px] ${
            showBrand
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none -translate-x-5 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <Image
              src={depedLogo}
              alt="Department of Education logo"
              width={141}
              height={72}
              className="h-9 w-auto object-contain 2xl:h-10"
            />

            <div className="h-9 w-px bg-white/30" />

            <Image
              src={schoolLogo}
              alt="Tabunoc National High School logo"
              width={44}
              height={44}
              className="h-10 w-10 rounded-full object-contain 2xl:h-11 2xl:w-11"
            />
          </div>

          <div className="hidden max-w-[250px] leading-tight sm:block lg:max-w-[210px] xl:max-w-[250px] 2xl:max-w-[300px]">
            <p className="truncate text-sm font-black tracking-tight xl:text-base 2xl:text-lg">
              Tabunoc National High School
            </p>
            <p className="truncate text-xs font-bold text-white/75">
              Division of Talisay City, Cebu
            </p>
          </div>
        </Link>

        <div
          className={`absolute top-1/2 hidden -translate-y-1/2 items-center gap-1 transition-all duration-500 ease-out lg:flex 2xl:gap-2 ${
            centerMenu
              ? "left-1/2 -translate-x-1/2"
              : "right-4 translate-x-0 md:right-6 lg:right-8 xl:right-12 2xl:right-[120px]"
          }`}
        >
          {navItems.map((item) => {
            const active = isItemActive(pathname, item);
            const hasDropdown = Boolean(item.items?.length);
            const desktopDropdownOpen = desktopOpenGroup === item.label;

            const navItemClassName = `inline-flex h-20 items-center gap-1.5 px-3 text-[13px] font-black transition-all duration-200 xl:px-4 xl:text-sm 2xl:gap-2 2xl:px-6 ${
              active
                ? "bg-white text-[#24313E]"
                : "navbar-cloth-hover text-white/90"
            }`;

            return (
              <div
                key={item.label}
                className="navbar-menu-group group/navitem relative"
                onMouseEnter={() => setHoveredHref(item.href)}
                onMouseLeave={(event) => {
                  const trigger = event.currentTarget.querySelector<HTMLElement>(
                    ":scope > a, :scope > button"
                  );

                  if (trigger) {
                    updateNavbarHoverOrigin(event, trigger);
                  }

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
                    onMouseEnter={(event) => updateNavbarHoverOrigin(event)}
                    onMouseLeave={(event) => updateNavbarHoverOrigin(event)}
                    className={navItemClassName}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className="relative z-10 transition-transform duration-200 group-hover/navitem:rotate-180">
                      <ChevronDownIcon open={desktopDropdownOpen} />
                    </span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onMouseEnter={(event) => updateNavbarHoverOrigin(event)}
                    onMouseLeave={(event) => updateNavbarHoverOrigin(event)}
                    className={navItemClassName}
                  >
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                )}

                <AnimatePresence>
                  {hasDropdown &&
                    (desktopDropdownOpen || hoveredHref === item.href) && (
                      <motion.div
                        key={`${item.label}-desktop-dropdown`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute left-1/2 top-full z-[1001] -translate-x-1/2"
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
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            );
          })}

          <div
            ref={contactRef}
            className="navbar-menu-group group/contact relative ml-1 2xl:ml-3"
            onMouseLeave={() => setContactOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={contactOpen}
              onClick={() => setContactOpen((open) => !open)}
              onMouseEnter={(event) => updateNavbarHoverOrigin(event)}
              onMouseLeave={(event) => updateNavbarHoverOrigin(event)}
              className={`relative rounded-xl px-5 py-3 text-sm font-black transition-all duration-200 2xl:px-7 ${
                contactActive
                  ? "bg-white text-[#24313E]"
                  : "navbar-cloth-hover bg-[#0F4C5C] text-white hover:-translate-y-0.5"
              }`}
            >
              <span className="relative z-10">Contact</span>
            </button>

            <AnimatePresence>
              {contactOpen && (
                <motion.div
                  key="desktop-contact-popover"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute right-0 top-full z-[1001]"
                >
                  <div className="w-[250px] overflow-hidden border-t-4 border-[#ffdf20] bg-white p-2 text-[#24313E] shadow-2xl shadow-black/25">
                    <a
                      href={`mailto:${schoolContact.email}`}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-black transition hover:bg-[#ffdf20]"
                    >
                      <span aria-hidden="true" className="text-base">
                        ✉
                      </span>
                      <span>Email the School</span>
                    </a>

                    <a
                      href={`tel:${schoolContact.phone}`}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-black transition hover:bg-[#ffdf20]"
                    >
                      <span aria-hidden="true" className="text-base">
                        ☎
                      </span>
                      <span>Call the School</span>
                    </a>

                    <a
                      href={schoolContact.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-black transition hover:bg-[#ffdf20]"
                    >
                      <span
                        aria-hidden="true"
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#24313E] text-xs font-black text-white"
                      >
                        f
                      </span>
                      <span>Facebook Page</span>
                    </a>

                    <a
                      href={schoolContact.messenger}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-black transition hover:bg-[#ffdf20]"
                    >
                      <span aria-hidden="true" className="text-base">
                        💬
                      </span>
                      <span>Messenger</span>
                    </a>

                    <div className="mt-1 border-t border-slate-200 px-4 py-3">
                      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                        Office Hours
                      </p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                        Monday to Friday, 8:00 AM – 5:00 PM
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
          className="relative z-[1001] ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
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

      <AnimatePresence>
      {menuOpen && (
        <motion.div
          key="mobile-navigation"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed left-0 top-[calc(5rem+env(safe-area-inset-top))] z-[1000] max-h-[calc(100dvh-5rem-env(safe-area-inset-top))] w-full overflow-y-auto border-t border-white/10 bg-[#34495e]/95 px-6 pb-6 pt-4 text-white shadow-2xl shadow-black/40 backdrop-blur-xl lg:hidden"
        >
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

                  <AnimatePresence initial={false}>
                    {hasDropdown && openGroup && (
                      <motion.div
                        key={`${item.label}-mobile-dropdown`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>
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
        </motion.div>
      )}
      </AnimatePresence>
      </header>

    </>
  );
}
