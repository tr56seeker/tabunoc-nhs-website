import AdminShell from "@/components/admin/AdminShell";
import { requireAdminUser } from "@/lib/adminAuth";

const modules = [
  {
    title: "Homepage Highlights",
    description: "Create, publish, reorder, and archive homepage highlight cards.",
    href: "/admin/highlights",
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
];

export default async function AdminDashboardPage() {
  const adminUser = await requireAdminUser();

  return (
    <AdminShell adminUser={adminUser} title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <a
            key={module.href}
            href={module.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#0F4C5C]/30 hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-[#24313e]">
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
