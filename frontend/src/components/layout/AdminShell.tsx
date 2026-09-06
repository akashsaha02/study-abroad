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

async function buildAdminNav(userRole?: UserRole): Promise<NavItem[]> {
  const t = await getTranslations("admin");
  const tDash = await getTranslations("dashboard");

  const items: Omit<NavItem, "icon">[] = [
    { href: "/admin", label: tDash("overview"), section: t("crm") },
    { href: "/admin/leads", label: t("leads") },
    { href: "/admin/students", label: t("students") },
    { href: "/admin/applications", label: t("applications") },
    { href: "/admin/documents", label: t("documents") },
    { href: "/admin/consultations", label: t("consultations") },
    { href: "/admin/service-orders", label: "Service orders" },
    { href: "/admin/counselors", label: t("counselors") },
    { href: "/admin/countries", label: t("countries"), section: t("content") },
    { href: "/admin/universities", label: t("universities") },
    { href: "/admin/courses", label: t("courses") },
    { href: "/admin/scholarships", label: t("scholarships") },
    { href: "/admin/blog", label: t("blog") },
    { href: "/admin/faqs", label: t("faqs") },
    { href: "/admin/services", label: "Services" },
    { href: "/admin/testimonials", label: t("testimonials") },
    { href: "/admin/settings", label: tDash("settings"), section: t("system") },
  ];

  if (userRole === "super_admin") {
    items.splice(7, 0, { href: "/admin/users", label: t("users") });
  }

  return withIcon(items);
}

export async function AdminShell({
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
  const navItems = await buildAdminNav(userRole);

  return (
    <DashboardShell
      title={tDash("adminTitle")}
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
