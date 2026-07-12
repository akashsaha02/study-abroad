import {
  Award01Icon,
  Globe02Icon,
  HeadsetIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Container } from "../common/Container";

const items: { icon: IconSvgElement; title: string; subtitle: string }[] = [
  {
    icon: UserGroupIcon,
    title: "Expert counselors",
    subtitle: "Certified guidance",
  },
  {
    icon: Globe02Icon,
    title: "15+ destinations",
    subtitle: "Global coverage",
  },
  {
    icon: Award01Icon,
    title: "98% visa success",
    subtitle: "Proven track record",
  },
  {
    icon: HeadsetIcon,
    title: "End-to-end support",
    subtitle: "From start to visa",
  },
];

export function TrustBar() {
  return (
    <section className="border-y bg-muted/40">
      <Container className="py-6">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
          {items.map((item) => (
            <li key={item.title} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary ring-1 ring-foreground/10">
                <HugeiconsIcon icon={item.icon} className="size-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
