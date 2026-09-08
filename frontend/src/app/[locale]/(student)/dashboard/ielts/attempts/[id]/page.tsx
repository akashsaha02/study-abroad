import { ExamWorkspace } from "@/features/ielts/components/ExamWorkspace";

export default async function StudentAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExamWorkspace attemptId={id} />;
}
