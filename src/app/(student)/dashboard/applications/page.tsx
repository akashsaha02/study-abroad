import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ApplicationTimeline } from "@/components/dashboard/ApplicationTimeline";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { emptyStateIcons } from "@/constants/empty-state-icons";
import { getUser } from "@/lib/auth/get-user";
import { getStudentApplications, getStudentByProfileId } from "@/lib/services/students";
import type { ApplicationStatus } from "@/types";

export default async function StudentApplicationsPage() {
  const user = await getUser();
  const student = user ? await getStudentByProfileId(user.id) : null;
  const applications = student ? await getStudentApplications(student.id) : [];

  return (
    <div>
      <PageHeader title="Applications" description="Track your university applications." />
      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Your counselor will create applications for you."
          icon={emptyStateIcons.applications}
        />
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {(app.universities as { name?: string })?.name ?? "Application"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {(app.countries as { name?: string })?.name} · Intake: {app.intake ?? "TBD"}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                {app.student_note && (
                  <p className="mt-4 rounded-lg bg-muted p-3 text-sm">{app.student_note}</p>
                )}
                <div className="mt-6">
                  <ApplicationTimeline currentStatus={app.status as ApplicationStatus} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
