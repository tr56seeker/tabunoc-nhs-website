"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const schoolLogo = "/images/tabunoc-nhs-logo-512.png";

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

type NavGroup = {
  label: string;
  links: NavLink[];
};

const navGroups: NavGroup[] = [
  {
    label: "School",
    links: [
      { label: "School Directory", href: "/organization" },
      { label: "Citizen's Charter", href: "/citizen-charter" },
    ],
  },
  {
    label: "Services",
    links: [
      { label: "Enrollment Guide", href: "/enrollment" },
      { label: "SHS Offerings", href: "/shs-offerings" },
      {
        label: "School MIS",
        href: "https://smis.tabunocnatlhs.com",
        external: true,
      },
    ],
  },
  {
    label: "Community",
    links: [
      { label: "Alumni", href: "/alumni" },
      {
        label: "Facebook Page",
        href: "https://facebook.com/tabunocnatlhs",
        external: true,
      },
      {
        label: "Messenger",
        href: "https://m.me/tabunocnatlhs",
        external: true,
      },
    ],
  },
  {
    label: "Updates",
    links: [{ label: "School Memos", href: "/memos" }],
  },
];

function isExternalLink(href: string) {
  return href.startsWith("http");
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (isExternalLink(href)) return false;

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, group: NavGroup) {
  return group.links.some((link) => isActivePath(pathname, link.href));
}

function getActiveNavItem(pathname: string) {
  if (pathname === "/") return "Home";

  const activeGroup = navGroups.find((group) => isGroupActive(pathname, group));
  return activeGroup?.label ?? null;
}

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);

  const homeIsActive = pathname === "/";
  const activeNavItem = getActiveNavItem(pathname);
  const visuallyActiveItem = hoveredNavItem ?? activeNavItem;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/70 shadow-sm backdrop-blur-xl dark:border-[#292624] dark:bg-[#171614]/75">
      <nav className="flex w-full items-center justify-between px-6 py-3 text-slate-900 dark:text-white md:px-10 xl:px-[120px] 2xl:px-[190px]">
        {/* BRAND */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src={schoolLogo}
            alt="Tabunoc National High School Logo"
            width={56}
            height={56}
            priority
            className="h-11 w-11 shrink-0 object-contain md:h-12 md:w-12"
          />

          <div className="min-w-0">
            <p className="truncate text-base font-black leading-tight text-slate-950 dark:text-white md:hidden">
              Tabunoc NHS
            </p>

            <p className="hidden text-lg font-black leading-tight text-slate-950 dark:text-white md:block">
              Tabunoc National High School
            </p>

            <p className="mt-0.5 text-xs font-semibold text-slate-600 dark:text-stone-100">
              School ID: 303111
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div
          className="hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setHoveredNavItem(null)}
        >
          <Link
            href="/"
            onMouseEnter={() => setHoveredNavItem("Home")}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              visuallyActiveItem === "Home"
                ? "bg-[#ffdf20] text-slate-950"
                : "text-slate-700 hover:text-slate-950 dark:text-stone-200 dark:hover:text-white"
            }`}
          >
            Home
          </Link>

          {navGroups.map((group) => {
            const open = openDesktopGroup === group.label;

            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => {
                  setHoveredNavItem(group.label);
                  setOpenDesktopGroup(group.label);
                }}
                onMouseLeave={() => setOpenDesktopGroup(null)}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-bold transition ${
                    visuallyActiveItem === group.label
                      ? "bg-[#ffdf20] text-slate-950"
                      : "text-slate-700 hover:text-slate-950 dark:text-stone-200 dark:hover:text-white"
                  }`}
                  aria-expanded={open}
                >
                  {group.label}
                </button>

                {open && (
                  <div className="absolute left-0 top-full z-50 min-w-[230px] pt-2">
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white py-2 text-slate-900 shadow-xl dark:border-[#292624] dark:bg-[#171614] dark:text-white dark:shadow-black/20">
                      {group.links.map((link) => {
                        const linkActive = isActivePath(pathname, link.href);

                        if (link.external) {
                          return (
                            <a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#ffdf20] hover:text-slate-950 dark:text-stone-200"
                            >
                              {link.label}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={link.label}
                            href={link.href}
                            className={`block px-4 py-3 text-sm font-semibold transition ${
                              linkActive
                                ? "bg-[#ffdf20] text-slate-950"
                                : "text-slate-700 hover:bg-[#ffdf20] hover:text-slate-950 dark:text-stone-200"
                            }`}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href="/#contact"
            className="ml-2 rounded-lg bg-[#0F4C5C] px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-[#0B3B48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C] dark:bg-[#0F4C5C] dark:hover:bg-[#0B3B48]"
          >
            Contact
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="rounded-xl border border-slate-200/80 px-4 py-2 text-sm font-black text-slate-800 transition hover:text-[#0F4C5C] dark:border-[#292624] dark:text-white dark:hover:text-white lg:hidden"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {/* MOBILE NAV */}
      {mobileOpen && (
        <div className="mx-6 mb-3 rounded-2xl border border-slate-200 bg-white/95 p-3 text-slate-900 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-[#292624] dark:bg-[#171614]/95 dark:text-white dark:shadow-black/20 md:mx-10 xl:mx-[120px] 2xl:mx-[190px] lg:hidden">
          <div className="grid gap-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                homeIsActive
                  ? "bg-[#ffdf20] text-slate-950"
                  : "text-slate-700 hover:bg-[#ffdf20] hover:text-slate-950 dark:text-stone-100"
              }`}
            >
              Home
            </Link>

            {navGroups.map((group) => {
              const active = isGroupActive(pathname, group);
              const open = openMobileGroup === group.label;

              return (
                <div
                  key={group.label}
                  className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#292624]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMobileGroup((current) =>
                        current === group.label ? null : group.label
                      )
                    }
                    className={`flex w-full items-center px-4 py-3 text-left text-sm font-bold transition ${
                      active
                        ? "bg-[#ffdf20] text-slate-950"
                        : "bg-white/50 text-slate-700 hover:bg-[#ffdf20] hover:text-slate-950 dark:bg-[#171614] dark:text-stone-100"
                    }`}
                  >
                    {group.label}
                  </button>

                  {open && (
                    <div className="grid gap-1 bg-white/80 p-2 dark:bg-[#171614]">
                      {group.links.map((link) => {
                        const linkActive = isActivePath(pathname, link.href);

                        if (link.external) {
                          return (
                            <a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#ffdf20] hover:text-slate-950 dark:text-stone-200"
                            >
                              {link.label}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                              linkActive
                                ? "bg-[#ffdf20] text-slate-950"
                                : "text-slate-700 hover:bg-[#ffdf20] hover:text-slate-950 dark:text-stone-200"
                            }`}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl bg-[#0F4C5C] px-4 py-3 text-center text-sm font-black text-white transition hover:bg-[#0B3B48] dark:bg-[#0F4C5C] dark:hover:bg-[#0B3B48]"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
