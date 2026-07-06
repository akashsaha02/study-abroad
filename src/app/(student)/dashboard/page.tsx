import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { RoleBadge } from "@/components/common/RoleBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth/get-user";
import {
  getStudentApplications,
  getStudentByProfileId,
  getStudentConsultations,
  getStudentDocuments,
  getStudentNotifications,
} from "@/lib/services/students";
import { ROUTES } from "@/constants";
import { emptyStateIcons } from "@/constants/empty-state-icons";
import {
  ArrowRight01Icon,
  Calendar01Icon,
  File01Icon,
  FileValidationIcon,
  Notification01Icon,
  StatIcon,
} from "@/constants/nav-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

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
  const upcomingConsultation = consultations.find(
    (c) => c.status === "scheduled" && c.scheduled_at
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome${user?.profile?.full_name ? `, ${user.profile.full_name}` : ""}`}
        description="Your study abroad journey at a glance."
      >
        {user?.profile?.role && <RoleBadge role={user.profile.role} />}
      </PageHeader>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href={ROUTES.dashboardProfile}>Update Profile</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={ROUTES.dashboardDocuments}>Upload Documents</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={ROUTES.dashboardApplications}>View Applications</Link>
        </Button>
      </div>

      {!student ? (
        <EmptyState
          title="Complete your profile"
          description="Your student profile is being set up. Contact your counselor if you need help."
          actionLabel="Update Profile"
          actionHref={ROUTES.dashboardProfile}
          icon={emptyStateIcons.profile}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Applications"
              value={applications.length}
              icon={<StatIcon icon={FileValidationIcon} />}
              iconClassName="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            />
            <StatCard
              title="Pending Documents"
              value={pendingDocs.length}
              icon={<StatIcon icon={File01Icon} />}
              iconClassName="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
            />
            <StatCard
              title="Consultations"
              value={consultations.length}
              icon={<StatIcon icon={Calendar01Icon} />}
              iconClassName="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
            />
            <StatCard
              title="Notifications"
              value={unreadNotifications.length}
              description="Unread"
              icon={<StatIcon icon={Notification01Icon} />}
              iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  {user?.profile?.email ?? user?.email ?? "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {user?.profile?.phone ?? "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Member since:</span>{" "}
                  {user?.profile?.created_at
                    ? new Date(user.profile.created_at).toLocaleDateString()
                    : "—"}
                </p>
                {student.preferred_country && (
                  <p>
                    <span className="text-muted-foreground">Target country:</span>{" "}
                    {student.preferred_country}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Notifications
                  <Link
                    href={ROUTES.dashboardNotifications}
                    className="inline-flex items-center gap-1 text-sm font-normal text-primary"
                  >
                    View all
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unreadNotifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No unread notifications.</p>
                ) : (
                  <div className="space-y-3">
                    {unreadNotifications.slice(0, 3).map((n) => (
                      <div key={n.id} className="rounded-lg border p-3">
                        <p className="font-medium">{n.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Consultation</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingConsultation ? (
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {upcomingConsultation.scheduled_at
                      ? new Date(upcomingConsultation.scheduled_at).toLocaleString()
                      : "Scheduled"}
                  </p>
                  {upcomingConsultation.meeting_link && (
                    <Link
                      href={upcomingConsultation.meeting_link}
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Join meeting →
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming consultations.{" "}
                  <Link href={ROUTES.dashboardConsultations} className="text-primary hover:underline">
                    Request one →
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>

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
                  className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  View all applications
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
