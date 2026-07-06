import { DashboardShell } from "./DashboardShell";

const studentNav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/applications", label: "Applications" },
  { href: "/dashboard/documents", label: "Documents" },
  { href: "/dashboard/consultations", label: "Consultations" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function StudentShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string;
}) {
  return (
    <DashboardShell
      title="Student Dashboard"
      navItems={studentNav}
      userName={userName}
    >
      {children}
    </DashboardShell>
  );
}
