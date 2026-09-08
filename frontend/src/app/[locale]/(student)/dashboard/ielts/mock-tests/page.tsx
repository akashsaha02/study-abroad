import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { IeltsStudentNav } from "@/features/ielts/components/IeltsStudentNav";
import { StartTestButton } from "@/features/ielts/practice/StartTestButton";
import { getPublishedIeltsTests } from "@/features/ielts/queries";
import { Link } from "@/i18n/navigation";
import { Button } from "antd";

export default async function StudentMockTestsPage() {
  const tests = await getPublishedIeltsTests();
  return (
    <PageStack>
      <IeltsStudentNav />
      <PageHeader compact title="IELTS mock tests" description="Published tests from the question bank. The public sample remains available without an account." />
      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((t) => (
          <SurfaceCard key={t.id} hover={false}>
            <h2 className="font-semibold">{t.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
            <p className="mt-2 text-xs uppercase text-muted-foreground">
              {t.skill} · {Math.round(t.duration_seconds / 60)} min
            </p>
            <div className="mt-3">
              <StartTestButton testId={t.id} />
            </div>
          </SurfaceCard>
        ))}
      </div>
      <Link href="/ielts/mock-test">
        <Button>Open sample demo (no account)</Button>
      </Link>
    </PageStack>
  );
}
