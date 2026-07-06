import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { emptyStateIcons } from "@/constants/empty-state-icons";
import { getUser } from "@/lib/auth/get-user";
import { getStudentByProfileId, getStudentConsultations } from "@/lib/services/students";

export default async function StudentConsultationsPage() {
  const user = await getUser();
  const student = user ? await getStudentByProfileId(user.id) : null;
  const consultations = student ? await getStudentConsultations(student.id) : [];

  return (
    <div>
      <PageHeader title="Consultations" description="View and schedule consultations." />
      {consultations.length === 0 ? (
        <EmptyState
          title="No consultations"
          description="Request a consultation through your counselor."
          icon={emptyStateIcons.consultations}
        />
      ) : (
        <div className="space-y-3">
          {consultations.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">
                    {c.scheduled_at
                      ? new Date(c.scheduled_at).toLocaleString()
                      : c.requested_date ?? "Pending"}
                  </p>
                  {c.meeting_link && (
                    <a href={c.meeting_link} className="text-sm text-primary hover:underline">
                      Join meeting
                    </a>
                  )}
                </div>
                <StatusBadge status={c.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
