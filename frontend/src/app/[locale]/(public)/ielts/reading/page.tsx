import { IeltsSkillGuide } from "@/features/ielts/public/SkillGuide";
import { buildMetadata } from "@/components/seo/PageSEO";

export const metadata = buildMetadata({
  title: "IELTS Reading",
  description: "Split-screen passages, question types, and estimated bands.",
  path: "/ielts/reading",
});

export default function Page() {
  return <IeltsSkillGuide skill="reading" />;
}
