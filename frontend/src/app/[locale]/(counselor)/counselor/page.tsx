import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { GlassPanelCard } from "@/components/common/GlassCard";
import { AdminCharts } from "@/components/dashboard/AdminCharts";
import { RoleBadge } from "@/components/common/RoleBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  ArrowRight01Icon,
  File01Icon,
  FileValidationIcon,
  UserGroupIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@/i18n/navigation";
import { getUser } from "@/lib/auth/get-user";
import {
  getCounselorChartData,
  getCounselorDashboardData,
} from "@/lib/services/dashboard";
import { getLocale } from "next-intl/server";

export default async function CounselorDashboardPage() {
  const user = await getUser();
  const locale = await getLocale();
  const data = user?.id
    ? await getCounselorDashboardData(user.id)
    : {
        stats: {
          assignedLeads: 0,
          assignedStudents: 0,
          applications: 0,
          pendingDocReviews: 0,
        },
        recentLeads: [],
        attentionDocuments: [],
      };
  const chartData = user?.id
    ? await getCounselorChartData(user.id)
    : {
        leadsTrend: [],
        leadStatus: [],
        leadSource: [],
        applicationStatus: [],
        documentStatus: [],
      };

  return (
    <PageStack>
      <PageHeader
        compact
        title={`Welcome${user?.profile?.full_name ? `, ${user.profile.full_name}` : ""}`}
        description="Your assigned leads, students, and applications."
      >
        {user?.profile?.role && <RoleBadge role={user.profile.role} />}
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Assigned Leads" value={data.stats.assignedLeads} icon={UserMultiple02Icon} tone="sky" variant="glass" />
        <StatCard title="Assigned Students" value={data.stats.assignedStudents} icon={UserGroupIcon} tone="success" variant="glass" />
        <StatCard title="Applications" value={data.stats.applications} icon={FileValidationIcon} tone="violet" variant="glass" />
        <StatCard title="Pending Reviews" value={data.stats.pendingDocReviews} description="Documents" icon={File01Icon} tone="amber" variant="glass" />
      </div>

      <AdminCharts {...chartData} locale={locale} />

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanelCard
          title="Recent Assigned Leads"
          action={
            <Link href="/counselor/leads" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              View all
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Link>
          }
        >
          {data.recentLeads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assigned leads yet.</p>
          ) : (
            <div className="space-y-3">
              {data.recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between rounded-xl border border-foreground/5 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
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
        </GlassPanelCard>

        <GlassPanelCard title="Students Needing Attention">
          {data.attentionDocuments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No documents need updates or resubmission.
            </p>
          ) : (
            <div className="space-y-3">
              {data.attentionDocuments.map((doc) => {
                const student = doc.students as { id?: string; profiles?: { full_name?: string } } | null;
                const studentId = student?.id;
                const content = (
                  <>
                    <div>
                      <p className="font-medium">{doc.document_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {student?.profiles?.full_name ?? "Student"}
                      </p>
                    </div>
                    <StatusBadge status={doc.status} />
                  </>
                );
                return studentId ? (
                  <Link
                    key={doc.id}
                    href={`/admin/students/${studentId}`}
                    className="flex items-center justify-between rounded-xl border border-foreground/5 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl border border-foreground/5 bg-muted/20 p-3"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          )}
        </GlassPanelCard>
      </div>
    </PageStack>
  );
}
