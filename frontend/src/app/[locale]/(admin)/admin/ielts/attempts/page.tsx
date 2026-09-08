import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { createClient } from "@/lib/supabase/server";
import { relatedOne } from "@abroadly/shared/ielts";

export default async function AdminIeltsAttemptsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ielts_attempts")
    .select("id, started_at, status, estimated_band, raw_score, max_score, ielts_tests(title)")
    .order("started_at", { ascending: false })
    .limit(100);

  return (
    <PageStack>
      <PageHeader compact title="IELTS attempts" />
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Test</th>
              <th className="p-2">Status</th>
              <th className="p-2">Score</th>
              <th className="p-2">Band</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row) => (
              <tr key={row.id} className="border-b">
                <td className="p-2">{new Date(row.started_at).toLocaleString()}</td>
                <td className="p-2">
                  {relatedOne(
                    row.ielts_tests as { title?: string } | { title?: string }[] | null
                  )?.title ?? "Practice"}
                </td>
                <td className="p-2">{row.status}</td>
                <td className="p-2">
                  {row.raw_score != null ? `${row.raw_score}/${row.max_score}` : "—"}
                </td>
                <td className="p-2">{row.estimated_band ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageStack>
  );
}
