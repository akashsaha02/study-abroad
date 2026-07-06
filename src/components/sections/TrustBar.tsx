import { Section } from "../common/Section";

const stats = [
  { value: "5,000+", label: "Students Placed" },
  { value: "200+", label: "Partner Universities" },
  { value: "15+", label: "Countries" },
  { value: "98%", label: "Visa Success Rate" },
];

export function TrustBar() {
  return (
    <Section variant="muted" className="py-8 md:py-12">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-primary md:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
