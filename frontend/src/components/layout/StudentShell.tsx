import { DashboardShell } from "./DashboardShell";
import type { NavItem } from "./DashboardShell";
import { ROUTES } from "@/constants";
import { NavIcon } from "@/constants/nav-icons";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types";
import { getTranslations } from "next-intl/server";

function withIcon(items: Omit<NavItem, "icon">[]): NavItem[] {
  return items.map((item) => ({
    ...item,
    icon: <NavIcon href={item.href} />,
  }));
}

async function buildStudentNav(userId?: string): Promise<NavItem[]> {
  const t = await getTranslations("dashboard");
  let unread = 0;

  if (userId) {
    const supabase = await createClient();
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);
    unread = count ?? 0;
  }

  return withIcon([
    { href: "/dashboard", label: t("overview"), section: t("mainSection") },
    { href: "/dashboard/applications", label: t("applications") },
    { href: "/dashboard/documents", label: t("documents") },
    { href: "/dashboard/consultations", label: t("consultations") },
    {
      href: "/dashboard/notifications",
      label: t("notifications"),
      badgeCount: unread,
    },
  ]);
}

export async function StudentShell({
  children,
  userName,
  userRole,
  avatarUrl,
  userId,
}: {
  children: React.ReactNode;
  userName?: string;
  userRole?: UserRole;
  avatarUrl?: string | null;
  userId?: string;
}) {
  const t = await getTranslations("dashboard");
  const navItems = await buildStudentNav(userId);

  return (
    <DashboardShell
      title={t("studentTitle")}
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
