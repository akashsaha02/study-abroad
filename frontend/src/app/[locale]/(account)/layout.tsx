import { AdminShell } from "@/components/layout/AdminShell";
import { CounselorShell } from "@/components/layout/CounselorShell";
import { StudentShell } from "@/components/layout/StudentShell";
import { getUser } from "@/infrastructure/auth/get-user";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect({ href: "/login", locale: await getLocale() });
    return null;
  }

  const shellProps = {
    userName: user.profile?.full_name ?? undefined,
    userRole: user.profile?.role,
    avatarUrl: user.profile?.avatar_url,
    userId: user.id,
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
