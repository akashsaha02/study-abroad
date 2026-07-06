import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/lib/auth/get-user";
import {
  getStudentApplications,
  getStudentByProfileId,
  getStudentConsultations,
  getStudentDocuments,
  getStudentNotifications,
} from "@/lib/services/students";
import Link from "next/link";
import { ROUTES } from "@/constants";

export default async function StudentDashboardPage() {
  const user = await getUser();
  const student = user ? await getStudentByProfileId(user.id) : null;

  const [applications, documents, consultations, notifications] = student
    ? await Promise.all([
        getStudentApplications(student.id),
        getStudentDocuments(student.id),
        getStudentConsultations(student.id),
        getStudentNotifications(user!.id),
      ])
    : [[], [], [], []];

  const pendingDocs = documents.filter(
    (d) => d.status === "needs_update" || d.status === "rejected"
  );
  const unreadNotifications = notifications.filter((n) => !n.is_read);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome${user?.profile?.full_name ? `, ${user.profile.full_name}` : ""}`}
        description="Your study abroad journey at a glance."
      />

      {!student ? (
        <EmptyState
          title="Complete your profile"
          description="Your student profile is being set up. Contact your counselor if you need help."
          actionLabel="Update Profile"
          actionHref={ROUTES.dashboardProfile}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Pending Documents</p>
                <p className="text-2xl font-bold">{pendingDocs.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Consultations</p>
                <p className="text-2xl font-bold">{consultations.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Notifications</p>
                <p className="text-2xl font-bold">{unreadNotifications.length}</p>
              </CardContent>
            </Card>
          </div>

          {applications.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold">Latest Application</h3>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {(applications[0].universities as { name?: string })?.name ?? "Application"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(applications[0].countries as { name?: string })?.name}
                    </p>
                  </div>
                  <StatusBadge status={applications[0].status} />
                </div>
                <Link
                  href={ROUTES.dashboardApplications}
                  className="mt-4 inline-block text-sm text-primary hover:underline"
                >
                  View all applications →
                </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
