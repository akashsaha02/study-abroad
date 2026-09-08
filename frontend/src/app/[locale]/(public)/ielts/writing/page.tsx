import { IeltsSkillGuide } from "@/features/ielts/public/SkillGuide";
import { buildMetadata } from "@/components/seo/PageSEO";

export const metadata = buildMetadata({
  title: "IELTS Writing",
  description: "Task 1 and Task 2 editor with word count. Scoring is reviewer-based.",
  path: "/ielts/writing",
});

export default function Page() {
  return <IeltsSkillGuide skill="writing" />;
}
