"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const schoolLogo = "/images/tabunoc-nhs-logo.png";

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
      { label: "Citizen’s Charter", href: "/citizen-charter" },
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

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 20) {
        setShowNavbar(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setShowNavbar(false);
        setMobileOpen(false);
        setOpenDesktopGroup(null);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const homeIsActive = pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 -mb-20 w-full text-white transition-transform duration-300 ease-in-out sm:-mb-24 lg:-mb-28 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* NAVBAR PNG BACKGROUND */}
      <div className="relative overflow-visible bg-[url('/images/nav-torn-edge.png')] bg-cover bg-top bg-center bg-no-repeat pb-20 sm:pb-24 lg:pb-28">
        <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-4 pt-4 pb-3 md:px-6">
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
              className="h-12 w-12 shrink-0 object-contain md:h-14 md:w-14"
            />

            <div className="min-w-0">
              <p className="truncate text-base font-black leading-tight text-white md:hidden">
                Tabunoc National High School
              </p>

              <p className="hidden text-lg font-black leading-tight text-white md:block">
                Tabunoc National High School
              </p>

              <p className="mt-0.5 text-xs font-medium text-teal-100">
                School ID: 303111
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                homeIsActive
                  ? "bg-yellow-300 text-slate-950"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Home
            </Link>

            {navGroups.map((group) => {
              const active = isGroupActive(pathname, group);
              const open = openDesktopGroup === group.label;

              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenDesktopGroup(group.label)}
                  onMouseLeave={() => setOpenDesktopGroup(null)}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-bold transition ${
                      active
                        ? "bg-yellow-300 text-slate-950"
                        : "text-white hover:bg-white/10"
                    }`}
                    aria-expanded={open}
                  >
                    {group.label}
                    <span className="text-xs">▾</span>
                  </button>

                  {open && (
                    <div className="absolute left-0 top-full z-50 min-w-[230px] pt-2">
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white py-2 text-slate-950 shadow-xl">
                        {group.links.map((link) => {
                          const linkActive = isActivePath(pathname, link.href);

                          if (link.external) {
                            return (
                              <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#ECFDF5] hover:text-[#0F4C5C]"
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
                                  ? "bg-[#ECFDF5] text-[#0F4C5C]"
                                  : "text-slate-700 hover:bg-[#ECFDF5] hover:text-[#0F4C5C]"
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
              className="ml-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2 text-sm font-black text-white transition hover:bg-yellow-300 hover:text-slate-950"
            >
              Contact
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10 lg:hidden"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </nav>
      </div>

      {/* MOBILE NAV */}
      {mobileOpen && (
        <div className="-mt-20 border-t border-white/10 bg-[#0B3B48] px-4 pt-24 pb-4 shadow-xl sm:-mt-24 sm:pt-28 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                homeIsActive
                  ? "bg-yellow-300 text-slate-950"
                  : "text-white hover:bg-white/10"
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
                  className="overflow-hidden rounded-xl border border-white/10"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMobileGroup((current) =>
                        current === group.label ? null : group.label
                      )
                    }
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold transition ${
                      active
                        ? "bg-yellow-300 text-slate-950"
                        : "bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {group.label}
                    <span>{open ? "−" : "+"}</span>
                  </button>

                  {open && (
                    <div className="grid gap-1 bg-[#071E29] p-2">
                      {group.links.map((link) => {
                        const linkActive = isActivePath(pathname, link.href);

                        if (link.external) {
                          return (
                            <a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg px-4 py-3 text-sm font-semibold text-teal-50 transition hover:bg-white/10"
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
                                ? "bg-[#ECFDF5] text-[#0F4C5C]"
                                : "text-teal-50 hover:bg-white/10"
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
              className="mt-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-yellow-300 hover:text-slate-950"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}