"use client";

import { GlassFeatureCard } from "@/components/common/GlassCard";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import {
  Globe02Icon,
  GraduationScrollIcon,
  PassportIcon,
  RocketIcon,
} from "@hugeicons/core-free-icons";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  { key: "discover" as const, icon: Globe02Icon, tone: "sky" as const },
  { key: "apply" as const, icon: GraduationScrollIcon, tone: "violet" as const },
  { key: "visa" as const, icon: PassportIcon, tone: "amber" as const },
  { key: "depart" as const, icon: RocketIcon, tone: "success" as const },
];

export function StudyJourneyTimeline() {
  const t = useTranslations("home.journey");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      requestAnimationFrame(() => setVisible(true));
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          eyebrowIcon={RocketIcon}
          title={t("title")}
          description={t("description")}
        />
        <div ref={ref} className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-linear-to-r from-transparent via-primary/20 to-transparent lg:block"
            aria-hidden
          />
          {STEPS.map((step, index) => (
            <div
              key={step.key}
              className="transition-all duration-500 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <GlassFeatureCard
                icon={step.icon}
                tone={step.tone}
                title={t(`${step.key}Title`)}
                description={t(`${step.key}Desc`)}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
