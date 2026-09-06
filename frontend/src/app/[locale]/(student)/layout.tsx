import { StudentShell } from "@/components/layout/StudentShell";
import { getUser } from "@/infrastructure/auth/get-user";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <StudentShell
      userName={user?.profile?.full_name ?? undefined}
      userRole={user?.profile?.role}
      avatarUrl={user?.profile?.avatar_url}
      userId={user?.id}
    >
      {children}
    </StudentShell>
  );
}
