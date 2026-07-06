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
} from "@/constants/nav-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth/get-user";
import { getCounselorDashboardData } from "@/lib/services/dashboard";
import { HugeiconsIcon } from "@hugeicons/react";
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
        <StatCard
          title="Assigned Leads"
          value={data.stats.assignedLeads}
          icon={<StatIcon icon={UserMultiple02Icon} />}
          iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        />
        <StatCard
          title="Assigned Students"
          value={data.stats.assignedStudents}
          icon={<StatIcon icon={UserGroupIcon} />}
          iconClassName="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
        />
        <StatCard
          title="Applications"
          value={data.stats.applications}
          icon={<StatIcon icon={FileValidationIcon} />}
          iconClassName="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
        />
        <StatCard
          title="Pending Reviews"
          value={data.stats.pendingDocReviews}
          description="Documents"
          icon={<StatIcon icon={File01Icon} />}
          iconClassName="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Assigned Leads
              <Link href="/counselor/leads" className="inline-flex items-center gap-1 text-sm font-normal text-primary">
                View all
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assigned leads yet.</p>
            ) : (
              <div className="space-y-3">
                {data.recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between rounded-lg border p-3"
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students Needing Attention</CardTitle>
          </CardHeader>
          <CardContent>
            {data.attentionDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents need updates or resubmission.
              </p>
            ) : (
              <div className="space-y-3">
                {data.attentionDocuments.map((doc) => (
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
    </div>
  );
}
