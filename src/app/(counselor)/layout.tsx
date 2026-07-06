import { CounselorShell } from "@/components/layout/CounselorShell";
import { getUser } from "@/lib/auth/get-user";

export default async function CounselorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <CounselorShell userName={user?.profile?.full_name ?? undefined}>
      {children}
    </CounselorShell>
  );
}
