import { DashboardShell } from "./DashboardShell";

const counselorNav = [
  { href: "/counselor", label: "Overview" },
  { href: "/counselor/leads", label: "Leads" },
  { href: "/counselor/students", label: "Students" },
  { href: "/counselor/applications", label: "Applications" },
  { href: "/counselor/tasks", label: "Tasks" },
  { href: "/counselor/notes", label: "Notes" },
];

export function CounselorShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string;
}) {
  return (
    <DashboardShell
      title="Counselor Dashboard"
      navItems={counselorNav}
      userName={userName}
    >
      {children}
    </DashboardShell>
  );
}
