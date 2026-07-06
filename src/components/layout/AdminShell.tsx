import { DashboardShell } from "./DashboardShell";
import type { NavItem } from "./DashboardShell";
import { NavIcon } from "@/constants/nav-icons";
import type { UserRole } from "@/types";

function withIcon(items: Omit<NavItem, "icon">[]): NavItem[] {
  return items.map((item) => ({
    ...item,
    icon: <NavIcon href={item.href} />,
  }));
}

function buildAdminNav(userRole?: UserRole): NavItem[] {
  const items: Omit<NavItem, "icon">[] = [
    { href: "/admin", label: "Overview", section: "CRM" },
    { href: "/admin/leads", label: "Leads" },
    { href: "/admin/students", label: "Students" },
    { href: "/admin/applications", label: "Applications" },
    { href: "/admin/documents", label: "Documents" },
    { href: "/admin/consultations", label: "Consultations" },
    { href: "/admin/counselors", label: "Counselors" },
    { href: "/admin/countries", label: "Countries", section: "Content" },
    { href: "/admin/universities", label: "Universities" },
    { href: "/admin/courses", label: "Courses" },
    { href: "/admin/scholarships", label: "Scholarships" },
    { href: "/admin/blog", label: "Blog" },
    { href: "/admin/faqs", label: "FAQs" },
    { href: "/admin/testimonials", label: "Testimonials" },
    { href: "/admin/settings", label: "Settings", section: "System" },
  ];

  if (userRole === "super_admin") {
    items.splice(7, 0, { href: "/admin/users", label: "Users" });
  }

  return withIcon(items);
}

export function AdminShell({
  children,
  userName,
  userRole,
}: {
  children: React.ReactNode;
  userName?: string;
  userRole?: UserRole;
}) {
  return (
    <DashboardShell
      title="Admin Dashboard"
      navItems={buildAdminNav(userRole)}
      userName={userName}
      userRole={userRole}
    >
      {children}
    </DashboardShell>
  );
}
