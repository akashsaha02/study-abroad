import { DecorativeBackground } from "@/components/common/DecorativeBackground";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import type { Testimonial } from "@/types";
import { Message01Icon } from "@hugeicons/core-free-icons";
import { getTranslations } from "next-intl/server";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export async function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const t = await getTranslations("home.testimonials");

  if (testimonials.length === 0) return null;

  return (
    <DecorativeBackground variant="muted" className="py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          eyebrowIcon={Message01Icon}
          title={t("title")}
          description={t("description")}
        />
        <TestimonialsCarousel testimonials={testimonials} />
      </Container>
    </DecorativeBackground>
  );
}
