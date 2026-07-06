import { StudentShell } from "@/components/layout/StudentShell";
import { getUser } from "@/lib/auth/get-user";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <StudentShell userName={user?.profile?.full_name ?? undefined}>
      {children}
    </StudentShell>
  );
}
