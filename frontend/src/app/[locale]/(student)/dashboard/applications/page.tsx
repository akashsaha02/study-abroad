import { PageHeader } from "@/components/common/PageHeader";
import { PageStack, SectionStack } from "@/components/common/PageStack";
import { EmptyState } from "@/components/common/EmptyState";
import { PanelCard } from "@/components/common/PanelCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ApplicationPipeline } from "@/features/applications/components/ApplicationPipeline";
import {
  ApplicationsBoard,
  type BoardApplication,
} from "@/features/applications/components/ApplicationsBoard";
import { emptyStateIcons } from "@/constants/empty-state-icons";
import { getUser } from "@/infrastructure/auth/get-user";
import { getStudentApplications, getStudentByProfileId } from "@/features/student/queries";
import type { ApplicationStatus } from "@/types";

export default async function StudentApplicationsPage() {
  const user = await getUser();
  const student = user ? await getStudentByProfileId(user.id) : null;
  const applications = student ? await getStudentApplications(student.id) : [];

  const boardItems: BoardApplication[] = applications.map((app) => ({
    id: app.id,
    status: app.status as ApplicationStatus,
    universityName:
      (app.universities as { name?: string })?.name ?? "Application",
    countryName: (app.countries as { name?: string })?.name,
    intake: app.intake,
  }));

  return (
    <PageStack>
      <PageHeader
        compact
        title="Applications"
        description="Track every university application across your pipeline."
      />

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Your counselor will create applications for you once your profile is ready."
          icon={emptyStateIcons.applications}
        />
      ) : (
        <>
          <PanelCard title="Pipeline overview">
            <ApplicationsBoard applications={boardItems} />
          </PanelCard>

          <SectionStack>
            {applications.map((app) => (
              <PanelCard key={app.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      {(app.universities as { name?: string })?.name ?? "Application"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {(app.countries as { name?: string })?.name} · Intake:{" "}
                      {app.intake ?? "TBD"}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                {app.student_note && (
                  <p className="mt-4 rounded-xl bg-muted/40 p-3 text-sm">{app.student_note}</p>
                )}

                <div className="mt-6 rounded-xl border bg-muted/20 p-4 sm:p-6">
                  <ApplicationPipeline currentStatus={app.status as ApplicationStatus} />
                </div>
              </PanelCard>
            ))}
          </SectionStack>
        </>
      )}
    </PageStack>
  );
}
