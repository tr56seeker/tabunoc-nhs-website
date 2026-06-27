import AdminShell from "@/components/admin/AdminShell";
import HighlightsManager from "@/components/admin/HighlightsManager";
import { requireAdminUser } from "@/lib/adminAuth";

export default async function AdminHighlightsPage() {
  const adminUser = await requireAdminUser();

  return (
    <AdminShell adminUser={adminUser} title="Homepage Highlights">
      <HighlightsManager />
    </AdminShell>
  );
}
