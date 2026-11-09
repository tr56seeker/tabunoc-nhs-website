import AdminShell from "@/components/admin/AdminShell";
import MemosManager from "@/components/admin/MemosManager";
import { requireAdminUser } from "@/lib/adminAuth";

export default async function AdminMemosPage() {
  const adminUser = await requireAdminUser();

  return (
    <AdminShell adminUser={adminUser} title="Memo Manager">
      <MemosManager />
    </AdminShell>
  );
}
