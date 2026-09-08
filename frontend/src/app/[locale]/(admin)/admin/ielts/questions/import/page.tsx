import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { QuestionImportClient } from "@/features/ielts/admin/QuestionImportClient";

export default function AdminIeltsImportPage() {
  return (
    <PageStack>
      <PageHeader
        compact
        title="Import IELTS questions"
        description="Validate CSV/XLSX, fix errors, then import only valid rows."
      />
      <QuestionImportClient />
    </PageStack>
  );
}
