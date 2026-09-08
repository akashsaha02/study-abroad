import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/components/seo/PageSEO";

export const metadata = buildMetadata({
  title: "IELTS resources",
  description: "Band descriptors, Academic vs General, and how Abroadly scores Listening and Reading.",
  path: "/ielts/resources",
});

export default function IeltsResourcesPage() {
  return (
    <PageLayout>
      <PageHeader
        eyebrow="IELTS"
        title="Resources"
        description="How scoring works in Abroadly and what we do not claim."
      />
      <ul className="space-y-3 text-sm leading-6">
        <li>
          <strong>Listening and Reading</strong> use configurable raw-to-band tables. They are estimates, not official IDP/British Council results.
        </li>
        <li>
          <strong>Writing and Speaking</strong> are stored for reviewer evaluation. There is no automatic AI band unless a real evaluator is connected.
        </li>
        <li>
          Academic and General Training Reading use different conversion tables.
        </li>
      </ul>
      <p className="mt-6">
        <Link href="/ielts">Back to IELTS</Link>
      </p>
    </PageLayout>
  );
}
