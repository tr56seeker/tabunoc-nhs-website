import AdminShell from "@/components/admin/AdminShell";
import { requireAdminUser } from "@/lib/adminAuth";
import { CSM_MONITORING_URL } from "@/lib/csm";

const modules = [
  {
    title: "Homepage Highlights",
    description: "Create, publish, reorder, and archive homepage highlight cards.",
    href: "/admin/highlights",
  },
  {
    title: "Memo Manager",
    description: "Upload official memo PDFs, review drafts, publish, and archive records.",
    href: "/admin/memos",
  },
  {
    title: "Calendar Events",
    description: "Add, update, publish, and archive events on the public school calendar.",
    href: "/admin/calendar-events",
  },
  {
    title: "FAQ Manager",
    description: "Maintain published frequently asked questions by category.",
    href: "/admin/faq",
  },
  {
    title: "Community Questions",
    description: "Review submitted questions, answer them, and publish when ready.",
    href: "/admin/community-questions",
  },
  {
    title: "Map Calibration",
    description: "Edit evacuation map pins and route calibration data.",
    href: "/admin/map-calibration",
  },
  {
    title: "SDO CSM Monitoring",
    description: "Open the unified SDO ICTO dashboard for authorized CSM monitoring.",
    href: CSM_MONITORING_URL,
    external: true,
  },
];

export default async function AdminDashboardPage() {
  const adminUser = await requireAdminUser();

  return (
    <AdminShell adminUser={adminUser} title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <a
            key={module.href}
            href={module.href}
            target={module.external ? "_blank" : undefined}
            rel={module.external ? "noopener noreferrer" : undefined}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-teal/30 hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-brand-navy">
              {module.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {module.description}
            </p>
          </a>
        ))}
      </div>
    </AdminShell>
  );
}
