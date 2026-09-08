import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { StaffManager } from "@/features/ielts/admin/StaffManager";

export default function AdminIeltsStaffPage() {
  return (
    <PageStack>
      <PageHeader
        compact
        title="IELTS contributors"
        description="Editors create drafts. Reviewers approve. Managers publish. Platform admins assign these roles."
      />
      <StaffManager />
    </PageStack>
  );
}
