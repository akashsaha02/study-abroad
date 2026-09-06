import { FAQSection } from "@/components/sections/FAQSection";
import { FeaturedUniversities } from "@/components/sections/FeaturedUniversities";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ByTheNumbersSection } from "@/components/sections/ByTheNumbersSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PopularDestinations } from "@/components/sections/PopularDestinations";
import { StudyJourneyTimeline } from "@/components/sections/StudyJourneyTimeline";
import { ServiceCoverageSection } from "@/components/sections/ServiceCoverageSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { buildMetadata } from "@/components/seo/PageSEO";
import {
  FALLBACK_COUNTRIES,
  FALLBACK_FAQS,
  FALLBACK_TESTIMONIALS,
  FALLBACK_UNIVERSITIES,
} from "@/data/fallback";
import { getLocalizedFallbackFaqs } from "@/lib/fallback-i18n";
import { getPublishedTestimonials } from "@/lib/services/content";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("metadata");
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/",
  });
}

async function getHomeData() {
  const supabase = await createClient();

  const [countriesRes, faqsRes, testimonials, universitiesRes] = await Promise.all([
    supabase.from("countries").select("*").eq("is_published", true).limit(6),
    supabase
      .from("faqs")
      .select("*")
      .eq("is_published", true)
      .order("sort_order")
      .limit(4),
    getPublishedTestimonials(),
    supabase
      .from("universities")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .limit(3),
  ]);

  const usingFallbackCountries = !countriesRes.data?.length;
  const usingFallbackFaqs = !faqsRes.data?.length;
  const usingFallbackTestimonials = !testimonials.length;
  const usingFallbackUniversities = !universitiesRes.data?.length;

  return {
    countries: countriesRes.data?.length ? countriesRes.data : FALLBACK_COUNTRIES,
    faqs: faqsRes.data?.length ? faqsRes.data : FALLBACK_FAQS,
    testimonials: testimonials.length ? testimonials : FALLBACK_TESTIMONIALS,
    universities: universitiesRes.data?.length
      ? universitiesRes.data
      : FALLBACK_UNIVERSITIES,
    usingFallbackCountries,
    usingFallbackFaqs,
    usingFallbackTestimonials,
    usingFallbackUniversities,
  };
}

export default async function HomePage() {
  const {
    countries,
    faqs,
    testimonials,
    universities,
    usingFallbackCountries,
    usingFallbackFaqs,
  } = await getHomeData();

  const tFaqs = await getTranslations("fallback.faqs");
  const displayFaqs = usingFallbackFaqs
    ? getLocalizedFallbackFaqs((key) =>
        tFaqs(key as "q1" | "a1" | "q2" | "a2" | "q3" | "a3" | "q4" | "a4")
      )
    : faqs;

  return (
    <div className="relative">
      <div className="relative">
        <HeroSection />
        <ByTheNumbersSection />
        <HowItWorks />
        <StudyJourneyTimeline />
        <ServiceCoverageSection />
        <PopularDestinations
          countries={countries}
          useFallbackDescriptions={usingFallbackCountries}
        />
        <TestimonialsSection testimonials={testimonials} />
        <FeaturedUniversities universities={universities} />
        <FAQSection faqs={displayFaqs} />
        <FinalCTA />
      </div>
    </div>
  );
}
