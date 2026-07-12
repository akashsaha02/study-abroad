import { Button } from "antd";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { PanelCard } from "@/components/common/PanelCard";
import { RoleBadge } from "@/components/common/RoleBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";

import { ROUTES } from "@/constants";
import { emptyStateIcons } from "@/constants/empty-state-icons";
import {
  ArrowRight01Icon,
  Calendar01Icon,
  File01Icon,
  FileValidationIcon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getUser } from "@/lib/auth/get-user";
import {
  getStudentApplications,
  getStudentByProfileId,
  getStudentConsultations,
  getStudentDocuments,
  getStudentNotifications,
} from "@/lib/services/students";
import { Link } from "@/i18n/navigation";

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

      <div className="flex flex-wrap gap-2">
        <Link href={ROUTES.accountProfile}>
          <Button  size="small">Update profile</Button>
        </Link>
        <Link href={ROUTES.dashboardDocuments}>
          <Button  size="small">Upload documents</Button>
        </Link>
        <Link href={ROUTES.dashboardApplications}>
          <Button size="small">View applications</Button>
        </Link>
      </div>

      {!student ? (
        <EmptyState
          title="Complete your profile"
          description="Your student profile is being set up. Contact your counselor if you need help."
          actionLabel="Update profile"
          actionHref={ROUTES.accountProfile}
          icon={emptyStateIcons.profile}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Applications" value={applications.length} icon={FileValidationIcon} tone="violet" />
            <StatCard title="Pending documents" value={pendingDocs.length} icon={File01Icon} tone="amber" />
            <StatCard title="Consultations" value={consultations.length} icon={Calendar01Icon} tone="sky" />
            <StatCard title="Notifications" value={unreadNotifications.length} description="Unread" icon={Notification01Icon} tone="primary" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <PanelCard title="Account summary">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium">{user?.profile?.email ?? user?.email ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="font-medium">{user?.profile?.phone ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Member since</dt>
                  <dd className="font-medium">
                    {user?.profile?.created_at
                      ? new Date(user.profile.created_at).toLocaleDateString()
                      : "—"}
                  </dd>
                </div>
                {student.preferred_country && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Target country</dt>
                    <dd className="font-medium">{student.preferred_country}</dd>
                  </div>
                )}
              </dl>
            </PanelCard>

            <PanelCard
              title="Recent notifications"
              action={
                <Link
                  href={ROUTES.dashboardNotifications}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  View all
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Link>
              }
            >
              {unreadNotifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No unread notifications.</p>
              ) : (
                <div className="space-y-3">
                  {unreadNotifications.slice(0, 3).map((n) => (
                    <div key={n.id} className="rounded-xl border bg-muted/30 p-3">
                      <p className="font-medium">{n.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </PanelCard>
          </div>

          <PanelCard title="Upcoming consultation">
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
          </PanelCard>

          {applications.length > 0 && (
            <PanelCard title="Latest application">
              <div className="flex items-center justify-between">
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
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all applications
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Link>
            </PanelCard>
          )}
        </>
      )}
    </div>
  );
}
