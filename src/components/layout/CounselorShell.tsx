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

const counselorNav = withIcon([
  { href: "/counselor", label: "Overview", section: "Main" },
  { href: "/counselor/leads", label: "Leads" },
  { href: "/counselor/students", label: "Students" },
  { href: "/counselor/applications", label: "Applications" },
  { href: "/counselor/tasks", label: "Tasks" },
  { href: "/counselor/notes", label: "Notes" },
]);

export function CounselorShell({
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
      title="Counselor Dashboard"
      navItems={counselorNav}
      userName={userName}
      userRole={userRole}
    >
      {children}
    </DashboardShell>
  );
}
