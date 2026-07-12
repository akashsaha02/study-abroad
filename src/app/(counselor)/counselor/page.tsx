import { PageHeader } from "@/components/common/PageHeader";
import { PanelCard } from "@/components/common/PanelCard";
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
import { getUser } from "@/lib/auth/get-user";
import { getCounselorDashboardData } from "@/lib/services/dashboard";
import Link from "next/link";

export default async function CounselorDashboardPage() {
  const user = await getUser();
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

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome${user?.profile?.full_name ? `, ${user.profile.full_name}` : ""}`}
        description="Your assigned leads, students, and applications."
      >
        {user?.profile?.role && <RoleBadge role={user.profile.role} />}
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Assigned Leads" value={data.stats.assignedLeads} icon={UserMultiple02Icon} tone="sky" />
        <StatCard title="Assigned Students" value={data.stats.assignedStudents} icon={UserGroupIcon} tone="success" />
        <StatCard title="Applications" value={data.stats.applications} icon={FileValidationIcon} tone="violet" />
        <StatCard title="Pending Reviews" value={data.stats.pendingDocReviews} description="Documents" icon={File01Icon} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PanelCard
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
                <div
                  key={lead.id}
                  className="flex items-center justify-between rounded-xl border bg-muted/20 p-3"
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.phone}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              ))}
            </div>
          )}
        </PanelCard>

        <PanelCard title="Students Needing Attention">
          {data.attentionDocuments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No documents need updates or resubmission.
            </p>
          ) : (
            <div className="space-y-3">
              {data.attentionDocuments.map((doc) => (
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
    </div>
  );
}
