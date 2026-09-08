import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import {
  ACADEMIC_READING_BAND_TABLE,
  GENERAL_READING_BAND_TABLE,
  LISTENING_BAND_TABLE,
} from "@abroadly/shared/ielts";

function Table({ title, rows }: { title: string; rows: { min: number; band: number }[] }) {
  return (
    <section>
      <h2 className="mb-2 font-semibold">{title}</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Min correct</th>
            <th className="p-2">Band</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.min}-${row.band}`} className="border-b">
              <td className="p-2">{row.min}</td>
              <td className="p-2">{row.band}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function AdminIeltsSettingsPage() {
  return (
    <PageStack>
      <PageHeader
        compact
        title="IELTS settings"
        description="Band conversion tables used for Listening and Reading. Writing and Speaking are never auto-scored."
      />
      <p className="text-sm text-muted-foreground">
        These defaults can be overridden in <code>ielts_band_tables</code>. They are estimates, not official IDP/British Council results.
      </p>
      <div className="grid gap-8 md:grid-cols-3">
        <Table title="Listening" rows={LISTENING_BAND_TABLE} />
        <Table title="Academic Reading" rows={ACADEMIC_READING_BAND_TABLE} />
        <Table title="General Reading" rows={GENERAL_READING_BAND_TABLE} />
      </div>
    </PageStack>
  );
}
