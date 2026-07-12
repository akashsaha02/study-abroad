import { PageHeader } from "@/components/common/PageHeader";
import { PanelCard } from "@/components/common/PanelCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { RoleBadge } from "@/components/common/RoleBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ArrowRight01Icon,
  Briefcase01Icon,
  Calendar01Icon,
  File01Icon,
  FileValidationIcon,
  UserGroupIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { getUser } from "@/lib/auth/get-user";
import { getLeads } from "@/lib/services/leads";
import { getAdminDashboardData } from "@/lib/services/dashboard";

export default async function AdminDashboardPage() {
  const user = await getUser();
  const [{ stats, recentApplications, pendingDocuments }, leads] = await Promise.all([
    getAdminDashboardData(),
    getLeads(),
  ]);

  const isSuperAdmin = user?.profile?.role === "super_admin";

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome${user?.profile?.full_name ? `, ${user.profile.full_name}` : ""}`}
        description="Platform statistics and recent activity."
      >
        {user?.profile?.role && <RoleBadge role={user.profile.role} />}
      </PageHeader>

      {isSuperAdmin && (
        <PanelCard className="border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/20">
          <p className="font-medium">Super Admin access</p>
          <p className="text-sm text-muted-foreground">
            You have full platform access including user management and system settings.
          </p>
        </PanelCard>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard title="Total Leads" value={stats.totalLeads} icon={UserMultiple02Icon} tone="sky" />
        <StatCard title="New Leads" value={stats.newLeads} icon={UserMultiple02Icon} tone="amber" />
        <StatCard title="Active Students" value={stats.activeStudents} icon={UserGroupIcon} tone="success" />
        <StatCard title="Active Applications" value={stats.activeApplications} icon={FileValidationIcon} tone="violet" />
        <StatCard title="Pending Documents" value={stats.pendingDocuments} icon={File01Icon} tone="rose" />
        <StatCard title="Consultations" value={stats.scheduledConsultations} description="Scheduled" icon={Calendar01Icon} tone="sky" />
        <StatCard title="Counselors" value={stats.totalCounselors} icon={Briefcase01Icon} tone="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PanelCard
          title="Recent Leads"
          action={
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              View all
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Link>
          }
        >
          {leads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between rounded-xl border bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.phone}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </Link>
              ))}
            </div>
          )}
        </PanelCard>

        <PanelCard
          title="Recent Applications"
          action={
            <Link href="/admin/applications" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              View all
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Link>
          }
        >
          {recentApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <Link
                  key={app.id}
                  href={`/admin/applications/${app.id}`}
                  className="flex items-center justify-between rounded-xl border bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                >
                  <div>
                    <p className="font-medium">
                      {(app.students as { profiles?: { full_name?: string } })?.profiles
                        ?.full_name ?? "Student"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(app.universities as { name?: string })?.name ?? "University"} ·{" "}
                      {(app.countries as { name?: string })?.name ?? ""}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </Link>
              ))}
            </div>
          )}
        </PanelCard>
      </div>

      <PanelCard
        title="Pending Document Reviews"
        action={
          <Link href="/admin/documents" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            View all
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Link>
        }
      >
        {pendingDocuments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents awaiting review.</p>
        ) : (
          <div className="space-y-3">
            {pendingDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-xl border bg-muted/20 p-3"
              >
                <div>
                  <p className="font-medium">{doc.document_type}</p>
                  <p className="text-sm text-muted-foreground">
                    {(doc.students as { profiles?: { full_name?: string } })?.profiles
                      ?.full_name ?? "Student"}
                  </p>
                </div>
                <StatusBadge status={doc.status} />
              </div>
            ))}
          </div>
        )}
      </PanelCard>
    </div>
  );
}
