import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { EmptyState } from "@/components/common/EmptyState";
import { PanelCard } from "@/components/common/PanelCard";
import { emptyStateIcons } from "@/constants/empty-state-icons";
import { getUser } from "@/lib/auth/get-user";
import { getStudentNotifications } from "@/lib/services/students";
import { cn } from "@/lib/utils";

export default async function StudentNotificationsPage() {
  const user = await getUser();
  const notifications = user ? await getStudentNotifications(user.id) : [];

  return (
    <PageStack>
      <PageHeader
        compact
        title="Notifications"
        description="Stay updated on your application progress."
      />
      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You're all caught up!"
          icon={emptyStateIcons.notifications}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <PanelCard
              key={n.id}
              className={cn(!n.is_read && "border-primary/30 bg-primary/5")}
            >
              <p className="font-medium">{n.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </PanelCard>
          ))}
        </div>
      )}
    </PageStack>
  );
}
