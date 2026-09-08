import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { StartTestButton } from "@/features/ielts/practice/StartTestButton";
import { getPublishedIeltsTests } from "@/features/ielts/queries";
import { getUser } from "@/infrastructure/auth/get-user";
import { Link } from "@/i18n/navigation";
import { Button } from "antd";
import { buildMetadata } from "@/components/seo/PageSEO";

export const metadata = buildMetadata({
  title: "IELTS mock tests",
  description: "Published IELTS mock tests and a sample demo you can try without an account.",
  path: "/ielts/mock-tests",
});

export default async function PublicMockTestsPage() {
  const tests = await getPublishedIeltsTests();
  const user = await getUser();
  return (
    <PageLayout>
      <PageHeader
        eyebrow="IELTS"
        title="Mock tests"
        description="Sit published tests with autosave and estimated Listening/Reading bands."
      />
      <div className="mb-6">
        <Link href="/ielts/mock-test">
          <Button>Try the sample demo (no account)</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((t) => (
          <SurfaceCard key={t.id} hover={false}>
            <h2 className="font-semibold">{t.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
            {user ? (
              <div className="mt-3">
                <StartTestButton testId={t.id} />
              </div>
            ) : (
              <Link href="/login?redirect=/dashboard/ielts/mock-tests">
                <Button className="mt-3">Sign in to start</Button>
              </Link>
            )}
          </SurfaceCard>
        ))}
      </div>
    </PageLayout>
  );
}
