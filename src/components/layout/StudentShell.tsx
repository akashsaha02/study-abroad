import { DashboardShell } from "./DashboardShell";
import type { NavItem } from "./DashboardShell";
import { NavIcon } from "@/constants/nav-icons";
import type { UserRole } from "@/types";
import { getTranslations } from "next-intl/server";

function withIcon(items: Omit<NavItem, "icon">[]): NavItem[] {
  return items.map((item) => ({
    ...item,
    icon: <NavIcon href={item.href} />,
  }));
}

async function buildStudentNav(): Promise<NavItem[]> {
  const t = await getTranslations("dashboard");

  return withIcon([
    { href: "/dashboard", label: t("overview"), section: "Main" },
    { href: "/dashboard/profile", label: t("profile") },
    { href: "/dashboard/applications", label: t("applications") },
    { href: "/dashboard/documents", label: t("documents") },
    { href: "/dashboard/consultations", label: t("consultations") },
    { href: "/dashboard/notifications", label: t("notifications") },
  ]);
}

export async function StudentShell({
  children,
  userName,
  userRole,
  avatarUrl,
}: {
  children: React.ReactNode;
  userName?: string;
  userRole?: UserRole;
  avatarUrl?: string | null;
}) {
  const t = await getTranslations("dashboard");
  const navItems = await buildStudentNav();

  return (
    <DashboardShell
      title={t("studentTitle")}
      navItems={navItems}
      userName={userName}
      userRole={userRole}
      avatarUrl={avatarUrl}
    >
      {children}
    </DashboardShell>
  );
}
