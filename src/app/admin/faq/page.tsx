import AdminShell from "@/components/admin/AdminShell";
import FaqManager from "@/components/admin/FaqManager";
import { requireAdminUser } from "@/lib/adminAuth";

export default async function AdminFaqPage() {
  const adminUser = await requireAdminUser();

  return (
    <AdminShell adminUser={adminUser} title="FAQ Manager">
      <FaqManager />
    </AdminShell>
  );
}
