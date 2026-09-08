import { IeltsSkillGuide } from "@/features/ielts/public/SkillGuide";
import { buildMetadata } from "@/components/seo/PageSEO";

export const metadata = buildMetadata({
  title: "IELTS Listening",
  description: "Practice IELTS Listening with audio, timers, and stored results.",
  path: "/ielts/listening",
});

export default function Page() {
  return <IeltsSkillGuide skill="listening" />;
}
