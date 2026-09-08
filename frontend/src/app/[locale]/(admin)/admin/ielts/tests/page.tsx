import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { TestBuilderForm } from "@/features/ielts/admin/TestBuilderForm";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "antd";

export default async function AdminIeltsTestsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ielts_tests")
    .select("id, title, skill, kind, status, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <PageStack>
      <PageHeader compact title="IELTS tests" description="Build skill tests and full mocks from the question bank." />
      <ul className="mb-6 space-y-2">
        {(data ?? []).map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded border p-3">
            <div>
              <p className="font-medium">{t.title}</p>
              <p className="text-sm text-muted-foreground">
                {t.skill} · {t.kind} · {t.status}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/ielts/tests/${t.id}`}>
                <Button size="small">Edit</Button>
              </Link>
              <Link href={`/admin/ielts/tests/${t.id}/analytics`}>
                <Button size="small">Analytics</Button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-semibold">New test</h2>
      <TestBuilderForm />
    </PageStack>
  );
}
