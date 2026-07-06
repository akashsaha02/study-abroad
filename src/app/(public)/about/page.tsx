import { PageHeader } from "@/components/common/PageHeader";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Section } from "@/components/common/Section";

export const metadata = buildMetadata({
  title: "About Abroadly",
  description: "Learn about Abroadly — your trusted study abroad partner with 5,000+ successful placements.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Section>
        <PageHeader
          title="About Abroadly"
          description="We help students find the right country, university, and path to study abroad."
        />
        <div className="prose prose-neutral max-w-3xl dark:prose-invert">
          <p>
            Abroadly is a full-service study abroad consultancy dedicated to helping
            students from Bangladesh and beyond achieve their international education
            dreams. With over 5,000 successful placements and partnerships with 200+
            universities worldwide, we provide end-to-end support from eligibility
            assessment to visa approval.
          </p>
          <h3>Our Mission</h3>
          <p>
            To make quality international education accessible through expert guidance,
            transparent processes, and personalized support at every step.
          </p>
          <h3>Why Choose Us</h3>
          <ul>
            <li>Free eligibility assessment and first consultation</li>
            <li>Experienced counselors with country-specific expertise</li>
            <li>End-to-end application and visa support</li>
            <li>Scholarship guidance and financial planning</li>
            <li>98% visa success rate</li>
          </ul>
        </div>
      </Section>
    </>
  );
}
