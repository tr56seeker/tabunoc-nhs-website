"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HelpCircle,
  Home,
  Images,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

import type { AdminUser } from "@/lib/adminAuth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/highlights", label: "Homepage Highlights", icon: Images },
  { href: "/admin/faq", label: "FAQ Manager", icon: HelpCircle },
  {
    href: "/admin/community-questions",
    label: "Community Questions",
    icon: MessageSquareText,
  },
  { href: "/admin/map-calibration", label: "Map Calibration", icon: Map },
];

const sidebarPreferenceKey = "tabunoc-admin-sidebar-collapsed";

export default function AdminShell({
  adminUser,
  title,
  children,
}: {
  adminUser: AdminUser;
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedValue = window.localStorage.getItem(sidebarPreferenceKey);
    setIsSidebarCollapsed(savedValue === "true");
  }, []);

  function toggleSidebar() {
    setIsSidebarCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(sidebarPreferenceKey, String(next));
      return next;
    });
  }

  async function logout() {
    await fetch("/api/admin/auth/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  function renderSidebar({ collapsed }: { collapsed: boolean }) {
    return (
    <aside
      className={`flex h-full flex-col bg-[#24313e] text-white transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-[280px]"
      }`}
    >
      <div className={`border-b border-white/10 py-5 ${collapsed ? "px-3" : "px-5"}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between gap-3"}`}>
          <Link
            href="/admin"
            title="Tabunoc NHS Admin Dashboard"
            onClick={() => setMobileOpen(false)}
            className={`flex min-w-0 items-center gap-3 ${
              collapsed ? "justify-center" : ""
            }`}
          >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffdf20] text-[#24313e]">
            <Home className="h-5 w-5" />
          </span>
          {!collapsed && (
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Tabunoc NHS</span>
            <span className="block text-xs text-slate-300">Admin Dashboard</span>
          </span>
          )}
        </Link>
          {!collapsed && (
            <button
              type="button"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              onClick={toggleSidebar}
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-200 transition hover:bg-white/10 hover:text-white lg:inline-flex"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            type="button"
            title="Expand sidebar"
            aria-label="Expand sidebar"
            onClick={toggleSidebar}
            className="mx-auto mt-4 hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-200 transition hover:bg-white/10 hover:text-white lg:flex"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className={`flex-1 space-y-1 py-4 ${collapsed ? "px-2" : "px-3"}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center rounded-xl py-3 text-sm font-semibold transition ${
                active
                  ? "bg-[#ffdf20] text-[#24313e]"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              } ${collapsed ? "justify-center px-2" : "gap-3 px-3"}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-white/10 ${collapsed ? "p-3" : "p-4"}`}>
        {!collapsed && (
          <>
        <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
          Signed in
        </p>
        <p className="mt-1 truncate text-sm font-semibold">
          {adminUser.fullName || adminUser.email}
        </p>
          </>
        )}
        <button
          type="button"
          title="Logout"
          aria-label="Logout"
          onClick={logout}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 ${
            collapsed ? "" : "mt-4"
          }`}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-950">
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block transition-[width] duration-300 ease-in-out ${
          isSidebarCollapsed ? "lg:w-20" : "lg:w-[280px]"
        }`}
      >
        {renderSidebar({ collapsed: isSidebarCollapsed })}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            className="absolute inset-0 bg-slate-950/45"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-[280px] max-w-[85vw]">
            {renderSidebar({ collapsed: false })}
          </div>
        </div>
      )}

      <div
        className={`transition-[padding] duration-300 ease-in-out ${
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-[280px]"
        }`}
      >
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0F4C5C]">
                School Administration
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#24313e]">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                title={isSidebarCollapsed ? "Expand sidebar" : "Focus mode"}
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                onClick={toggleSidebar}
                className="hidden h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#24313e] shadow-sm transition hover:border-[#0F4C5C]/30 hover:bg-slate-50 lg:inline-flex"
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
                <span>{isSidebarCollapsed ? "Expand" : "Focus mode"}</span>
              </button>
              <button
                type="button"
                aria-label="Open admin menu"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#24313e] shadow-sm lg:hidden"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
