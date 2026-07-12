import { IconBadge } from "@/components/common/IconBadge";
import { SectionHeader } from "@/components/common/SectionHeader";
import {
  Calendar01Icon,
  FileValidationIcon,
  GraduationScrollIcon,
  PassportIcon,
  RocketIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Section } from "../common/Section";

type Tone = "sky" | "violet" | "success" | "amber";

const steps: {
  step: string;
  title: string;
  description: string;
  icon: IconSvgElement;
  tone: Tone;
}[] = [
  {
    step: "01",
    title: "Check eligibility",
    description:
      "Use our free tool to see which countries and programs match your profile.",
    icon: FileValidationIcon,
    tone: "sky",
  },
  {
    step: "02",
    title: "Free consultation",
    description:
      "Meet an expert counselor to plan your study abroad journey.",
    icon: Calendar01Icon,
    tone: "violet",
  },
  {
    step: "03",
    title: "Apply & get offer",
    description:
      "We handle applications, documents, and university communications.",
    icon: GraduationScrollIcon,
    tone: "success",
  },
  {
    step: "04",
    title: "Visa & departure",
    description:
      "Complete the visa process with pre-departure support until you fly.",
    icon: PassportIcon,
    tone: "amber",
  },
];

export function HowItWorks() {
  return (
    <Section variant="muted">
      <SectionHeader
        eyebrow="How it works"
        eyebrowIcon={RocketIcon}
        title="Your path abroad in 4 simple steps"
        description="A clear, guided process so you always know exactly what comes next."
      />

      <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Connecting rail (desktop) */}
        <div
          className="absolute left-0 right-0 top-[2.6rem] hidden h-px bg-border lg:block"
          aria-hidden
        />
        {steps.map((item) => (
          <div
            key={item.step}
            className="relative flex flex-col rounded-2xl border bg-card p-6 ring-1 ring-foreground/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <IconBadge icon={item.icon} tone={item.tone} />
              <span className="text-2xl font-bold text-primary/15">
                {item.step}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
