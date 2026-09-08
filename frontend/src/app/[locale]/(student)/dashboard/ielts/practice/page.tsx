import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { IeltsStudentNav } from "@/features/ielts/components/IeltsStudentNav";
import { PracticeStartForm } from "@/features/ielts/practice/PracticeStartForm";

export default async function StudentIeltsPracticePage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string; question_type?: string; difficulty?: string }>;
}) {
  const defaults = await searchParams;
  return (
    <PageStack>
      <IeltsStudentNav />
      <PageHeader
        compact
        title="IELTS practice"
        description="Filter by skill and question type. Results use stored answers, not sample scores."
      />
      <PracticeStartForm defaults={defaults} />
    </PageStack>
  );
}
