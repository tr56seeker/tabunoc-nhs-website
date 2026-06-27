import AdminShell from "@/components/admin/AdminShell";
import MapCalibrationManager from "@/components/admin/MapCalibrationManager";
import { requireAdminUser } from "@/lib/adminAuth";

export default async function AdminMapCalibrationPage() {
  const adminUser = await requireAdminUser();

  return (
    <AdminShell adminUser={adminUser} title="Map Calibration">
      <MapCalibrationManager />
    </AdminShell>
  );
}
