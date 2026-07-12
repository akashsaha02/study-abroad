import { AdminShell } from "@/components/layout/AdminShell";
import { getUser } from "@/lib/auth/get-user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <AdminShell
      userName={user?.profile?.full_name ?? undefined}
      userRole={user?.profile?.role}
    >
      {children}
    </AdminShell>
  );
}
