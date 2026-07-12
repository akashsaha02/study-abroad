import { DashboardShell } from "./DashboardShell";
import type { NavItem } from "./DashboardShell";
import { ROUTES } from "@/constants";
import { NavIcon } from "@/constants/nav-icons";
import type { UserRole } from "@/types";
import { getTranslations } from "next-intl/server";

function withIcon(items: Omit<NavItem, "icon">[]): NavItem[] {
  return items.map((item) => ({
    ...item,
    icon: <NavIcon href={item.href} />,
  }));
}

async function buildCounselorNav(): Promise<NavItem[]> {
  const t = await getTranslations("admin");
  const tDash = await getTranslations("dashboard");

  return withIcon([
    { href: "/counselor", label: tDash("overview"), section: tDash("mainSection") },
    { href: "/counselor/leads", label: t("leads") },
    { href: "/counselor/students", label: t("students") },
    { href: "/counselor/applications", label: t("applications") },
    { href: "/counselor/tasks", label: t("tasks") },
    { href: "/counselor/notes", label: t("notes") },
  ]);
}

export async function CounselorShell({
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
  const tDash = await getTranslations("dashboard");
  const navItems = await buildCounselorNav();

  return (
    <DashboardShell
      title={tDash("counselorTitle")}
      navItems={navItems}
      profileHref={ROUTES.accountProfile}
      userName={userName}
      userRole={userRole}
      avatarUrl={avatarUrl}
    >
      {children}
    </DashboardShell>
  );
}
