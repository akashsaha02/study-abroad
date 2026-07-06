import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export default function CounselorTasksPage() {
  return (
    <div>
      <PageHeader title="Tasks" description="Your pending tasks and follow-ups." />
      <EmptyState
        title="No pending tasks"
        description="Tasks will appear here when assigned."
      />
    </div>
  );
}
