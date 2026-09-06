import { CounselorShell } from "@/components/layout/CounselorShell";
import { getUser } from "@/infrastructure/auth/get-user";

export default async function CounselorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <CounselorShell
      userName={user?.profile?.full_name ?? undefined}
      userRole={user?.profile?.role}
      avatarUrl={user?.profile?.avatar_url}
    >
      {children}
    </CounselorShell>
  );
}
