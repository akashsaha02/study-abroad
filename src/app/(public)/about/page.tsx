import { IconBadge } from "@/components/common/IconBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { PanelCard } from "@/components/common/PanelCard";
import { Section } from "@/components/common/Section";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import {
  Award01Icon,
  CheckmarkCircle02Icon,
  Globe02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const metadata = buildMetadata({
  title: "About Abroadly",
  description:
    "Learn about Abroadly — your trusted study abroad partner with 5,000+ successful placements.",
  path: "/about",
});

const WHY_US = [
  "Free eligibility assessment and first consultation",
  "Experienced counselors with country-specific expertise",
  "End-to-end application and visa support",
  "Scholarship guidance and financial planning",
  "98% visa success rate",
];

const STATS = [
  { icon: UserGroupIcon, value: "5,000+", label: "Students placed" },
  { icon: Globe02Icon, value: "200+", label: "Partner universities" },
  { icon: Award01Icon, value: "98%", label: "Visa success rate" },
];

export default function AboutPage() {
  return (
    <Section className="bg-mesh">
      <PageHeader
        eyebrow="About us"
        title="Your trusted study abroad partner"
        description="We help students find the right country, university, and path to study abroad."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        {STATS.map((stat) => (
          <SurfaceCard key={stat.label} hover={false} className="items-center text-center">
            <IconBadge icon={stat.icon} tone="primary" size="lg" />
            <p className="mt-4 text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </SurfaceCard>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <PanelCard title="Our mission">
          <p className="text-muted-foreground leading-relaxed">
            Abroadly is a full-service study abroad consultancy dedicated to helping
            students from Bangladesh and beyond achieve their international education
            dreams. With over 5,000 successful placements and partnerships with 200+
            universities worldwide, we provide end-to-end support from eligibility
            assessment to visa approval.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            To make quality international education accessible through expert guidance,
            transparent processes, and personalized support at every step.
          </p>
        </PanelCard>

        <PanelCard title="Why choose us">
          <ul className="space-y-3">
            {WHY_US.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                />
                {item}
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>
    </Section>
  );
}
