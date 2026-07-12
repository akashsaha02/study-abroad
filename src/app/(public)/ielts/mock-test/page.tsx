import { MockTest } from "@/components/ielts/MockTest";
import { buildMetadata } from "@/components/seo/PageSEO";

export const metadata = buildMetadata({
  title: "IELTS Mock Test",
  description: "A distraction-free, computer-delivered IELTS mock test.",
  path: "/ielts/mock-test",
});

export default function MockTestPage() {
  // MockTest renders a full-screen overlay (z-60) so it covers the site
  // navigation for a genuinely distraction-free exam experience.
  return <MockTest />;
}
