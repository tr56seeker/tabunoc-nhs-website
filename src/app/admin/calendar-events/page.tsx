import AdminShell from "@/components/admin/AdminShell";
import CalendarEventsManager from "@/components/admin/CalendarEventsManager";
import { requireAdminUser } from "@/lib/adminAuth";

export default async function AdminCalendarEventsPage() {
  const adminUser = await requireAdminUser();

  return (
    <AdminShell adminUser={adminUser} title="Calendar Events">
      <CalendarEventsManager />
    </AdminShell>
  );
}
