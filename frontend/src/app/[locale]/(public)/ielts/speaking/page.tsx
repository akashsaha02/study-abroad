import { IeltsSkillGuide } from "@/features/ielts/public/SkillGuide";
import { buildMetadata } from "@/components/seo/PageSEO";

export const metadata = buildMetadata({
  title: "IELTS Speaking",
  description: "Part 1–3 cue cards and private recordings. No fake AI band scores.",
  path: "/ielts/speaking",
});

export default function Page() {
  return <IeltsSkillGuide skill="speaking" />;
}
