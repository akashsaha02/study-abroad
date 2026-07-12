import { AdminShell } from "@/components/layout/AdminShell";
import { getUser } from "@/lib/auth/get-user";

export const dynamic = "force-dynamic";

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
      avatarUrl={user?.profile?.avatar_url}
    >
      {children}
    </AdminShell>
  );
}
