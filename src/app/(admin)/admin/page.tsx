import { PageHeader } from "@/components/common/PageHeader";
import { RoleBadge } from "@/components/common/RoleBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  ArrowRight01Icon,
  File01Icon,
  FileValidationIcon,
  StatIcon,
  UserGroupIcon,
  UserMultiple02Icon,
  Calendar01Icon,
  Briefcase01Icon,
} from "@/constants/nav-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getUser } from "@/lib/auth/get-user";
import { getLeads } from "@/lib/services/leads";
import { getAdminDashboardData } from "@/lib/services/dashboard";
import { HugeiconsIcon } from "@hugeicons/react";

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
        <Card className="border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20">
          <CardContent className="p-4 text-sm">
            <p className="font-medium">Super Admin access</p>
            <p className="text-muted-foreground">
              You have full platform access including user management and system settings.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={<StatIcon icon={UserMultiple02Icon} />}
          iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        />
        <StatCard
          title="New Leads"
          value={stats.newLeads}
          icon={<StatIcon icon={UserMultiple02Icon} />}
          iconClassName="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon={<StatIcon icon={UserGroupIcon} />}
          iconClassName="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
        />
        <StatCard
          title="Active Applications"
          value={stats.activeApplications}
          icon={<StatIcon icon={FileValidationIcon} />}
          iconClassName="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
        />
        <StatCard
          title="Pending Documents"
          value={stats.pendingDocuments}
          icon={<StatIcon icon={File01Icon} />}
          iconClassName="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
        />
        <StatCard
          title="Consultations"
          value={stats.scheduledConsultations}
          description="Scheduled"
          icon={<StatIcon icon={Calendar01Icon} />}
          iconClassName="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
        />
        <StatCard
          title="Counselors"
          value={stats.totalCounselors}
          icon={<StatIcon icon={Briefcase01Icon} />}
          iconClassName="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Leads
              <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-normal text-primary">
                View all
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leads yet.</p>
            ) : (
              <div className="space-y-3">
                {leads.slice(0, 5).map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Applications
              <Link href="/admin/applications" className="inline-flex items-center gap-1 text-sm font-normal text-primary">
                View all
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications yet.</p>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/admin/applications/${app.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Pending Document Reviews
            <Link href="/admin/documents" className="inline-flex items-center gap-1 text-sm font-normal text-primary">
              View all
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingDocuments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents awaiting review.</p>
          ) : (
            <div className="space-y-3">
              {pendingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border p-3"
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
        </CardContent>
      </Card>
    </div>
  );
}
