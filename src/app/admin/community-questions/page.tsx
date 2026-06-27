import AdminShell from "@/components/admin/AdminShell";
import CommunityQuestionsManager from "@/components/admin/CommunityQuestionsManager";
import { requireAdminUser } from "@/lib/adminAuth";

export default async function AdminCommunityQuestionsPage() {
  const adminUser = await requireAdminUser();

  return (
    <AdminShell adminUser={adminUser} title="Community Questions">
      <CommunityQuestionsManager />
    </AdminShell>
  );
}
