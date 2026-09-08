import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/constants";
import { Button } from "antd";

const SKILLS = [
  { slug: "listening", title: "Listening", desc: "Audio, forms, maps, and completion tasks." },
  { slug: "reading", title: "Reading", desc: "Passages with headings, TFNG, and completion." },
  { slug: "writing", title: "Writing", desc: "Task 1 and Task 2 with word count and drafts." },
  { slug: "speaking", title: "Speaking", desc: "Cue cards and recorded responses — scored by reviewers." },
] as const;

export function IeltsSkillGuide({
  skill,
}: {
  skill: (typeof SKILLS)[number]["slug"];
}) {
  const item = SKILLS.find((s) => s.slug === skill)!;
  return (
    <PageLayout>
      <PageHeader
        eyebrow="IELTS"
        title={item.title}
        description={item.desc}
      />
      <SurfaceCard hover={false} className="mb-6">
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>Learn the question types for this skill.</li>
          <li>Practice filtered sets from the question bank.</li>
          <li>Sit a timed skill test.</li>
          <li>Review explanations and weak types.</li>
        </ol>
      </SurfaceCard>
      <div className="flex flex-wrap gap-2">
        <Link href={ROUTES.ieltsPractice}>
          <Button type="primary">Practice {item.title}</Button>
        </Link>
        <Link href={ROUTES.ieltsMockTests}>
          <Button>Mock tests</Button>
        </Link>
        <Link href="/register">
          <Button>Create account</Button>
        </Link>
      </div>
    </PageLayout>
  );
}

export { SKILLS };
