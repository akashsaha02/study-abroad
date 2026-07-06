import { Section } from "../common/Section";
import {
  Calendar01Icon,
  FileValidationIcon,
  GraduationScrollIcon,
  PassportIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const steps = [
  {
    step: "01",
    title: "Check Eligibility",
    description: "Use our free tool to see which countries and programs match your profile.",
    icon: FileValidationIcon,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    step: "02",
    title: "Free Consultation",
    description: "Meet with an expert counselor to plan your study abroad journey.",
    icon: Calendar01Icon,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    step: "03",
    title: "Apply & Get Offer",
    description: "We handle applications, documents, and university communications.",
    icon: GraduationScrollIcon,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    step: "04",
    title: "Visa & Departure",
    description: "Complete visa process and pre-departure support until you fly.",
    icon: PassportIcon,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
];

export function HowItWorks() {
  return (
    <Section variant="muted">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="mt-2 text-muted-foreground">
          Your path to studying abroad in 4 simple steps
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((item) => (
          <div key={item.step} className="rounded-xl bg-background p-6 shadow-sm">
            <div
              className={`mb-4 flex size-11 items-center justify-center rounded-lg ${item.color}`}
            >
              <HugeiconsIcon icon={item.icon} className="size-5" strokeWidth={1.75} />
            </div>
            <span className="text-sm font-semibold text-primary/50">{item.step}</span>
            <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
