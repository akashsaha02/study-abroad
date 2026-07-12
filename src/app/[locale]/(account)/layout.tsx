import { AdminShell } from "@/components/layout/AdminShell";
import { CounselorShell } from "@/components/layout/CounselorShell";
import { StudentShell } from "@/components/layout/StudentShell";
import { getUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const shellProps = {
    userName: user.profile?.full_name ?? undefined,
    userRole: user.profile?.role,
    avatarUrl: user.profile?.avatar_url,
  };

  const role = user.profile?.role;

  if (role === "counselor") {
    return <CounselorShell {...shellProps}>{children}</CounselorShell>;
  }

  if (role === "admin" || role === "super_admin") {
    return <AdminShell {...shellProps}>{children}</AdminShell>;
  }

  return <StudentShell {...shellProps}>{children}</StudentShell>;
}
