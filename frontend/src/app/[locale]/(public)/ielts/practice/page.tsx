import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { PracticeStartForm } from "@/features/ielts/practice/PracticeStartForm";
import { getUser } from "@/infrastructure/auth/get-user";
import { Link } from "@/i18n/navigation";
import { Button } from "antd";
import { buildMetadata } from "@/components/seo/PageSEO";

export const metadata = buildMetadata({
  title: "IELTS practice",
  description: "Practice IELTS question types by skill, difficulty, and topic.",
  path: "/ielts/practice",
});

export default async function PublicPracticePage() {
  const user = await getUser();
  return (
    <PageLayout>
      <PageHeader
        eyebrow="IELTS"
        title="Practice"
        description="Choose a skill and question type. Answers are stored on your account."
      />
      {user ? (
        <PracticeStartForm />
      ) : (
        <Link href="/login?redirect=/dashboard/ielts/practice">
          <Button type="primary">Sign in to practice</Button>
        </Link>
      )}
    </PageLayout>
  );
}
