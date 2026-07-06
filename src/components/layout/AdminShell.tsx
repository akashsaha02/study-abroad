import { DashboardShell } from "./DashboardShell";

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/counselors", label: "Counselors" },
  { href: "/admin/countries", label: "Countries" },
  { href: "/admin/universities", label: "Universities" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/scholarships", label: "Scholarships" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string;
}) {
  return (
    <DashboardShell title="Admin Dashboard" navItems={adminNav} userName={userName}>
      {children}
    </DashboardShell>
  );
}
