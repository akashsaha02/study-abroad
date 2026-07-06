import { Section } from "../common/Section";

const steps = [
  {
    step: "01",
    title: "Check Eligibility",
    description: "Use our free tool to see which countries and programs match your profile.",
  },
  {
    step: "02",
    title: "Free Consultation",
    description: "Meet with an expert counselor to plan your study abroad journey.",
  },
  {
    step: "03",
    title: "Apply & Get Offer",
    description: "We handle applications, documents, and university communications.",
  },
  {
    step: "04",
    title: "Visa & Departure",
    description: "Complete visa process and pre-departure support until you fly.",
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
            <span className="text-3xl font-bold text-primary/30">{item.step}</span>
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
