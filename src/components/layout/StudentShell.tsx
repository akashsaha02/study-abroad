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

const studentNav = withIcon([
  { href: "/dashboard", label: "Overview", section: "Main" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/applications", label: "Applications" },
  { href: "/dashboard/documents", label: "Documents" },
  { href: "/dashboard/consultations", label: "Consultations" },
  { href: "/dashboard/notifications", label: "Notifications" },
]);

export function StudentShell({
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
      title="Student Dashboard"
      navItems={studentNav}
      userName={userName}
      userRole={userRole}
    >
      {children}
    </DashboardShell>
  );
}
