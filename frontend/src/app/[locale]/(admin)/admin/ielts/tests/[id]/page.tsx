import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { TestBuilderForm } from "@/features/ielts/admin/TestBuilderForm";

export default async function AdminIeltsTestEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PageStack>
      <PageHeader compact title="Edit IELTS test" />
      <TestBuilderForm initialId={id} />
    </PageStack>
  );
}
