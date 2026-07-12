import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { PanelCard } from "@/components/common/PanelCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { emptyStateIcons } from "@/constants/empty-state-icons";
import { getUser } from "@/lib/auth/get-user";
import { getStudentByProfileId, getStudentConsultations } from "@/lib/services/students";

export default async function StudentConsultationsPage() {
  const user = await getUser();
  const student = user ? await getStudentByProfileId(user.id) : null;
  const consultations = student ? await getStudentConsultations(student.id) : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Consultations" description="View and schedule consultations with your counselor." />
      {consultations.length === 0 ? (
        <EmptyState
          title="No consultations"
          description="Request a consultation through your counselor."
          icon={emptyStateIcons.consultations}
        />
      ) : (
        <div className="space-y-4">
          {consultations.map((c) => (
            <PanelCard key={c.id}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {c.scheduled_at
                      ? new Date(c.scheduled_at).toLocaleString()
                      : c.requested_date ?? "Pending"}
                  </p>
                  {c.meeting_link && (
                    <a href={c.meeting_link} className="text-sm font-medium text-primary hover:underline">
                      Join meeting
                    </a>
                  )}
                </div>
                <StatusBadge status={c.status} />
              </div>
            </PanelCard>
          ))}
        </div>
      )}
    </div>
  );
}
