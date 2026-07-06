import { EligibilityCTA } from "@/components/sections/EligibilityCTA";
import { FAQSection } from "@/components/sections/FAQSection";
import { FeaturedUniversities } from "@/components/sections/FeaturedUniversities";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PopularDestinations } from "@/components/sections/PopularDestinations";
import { ScholarshipsCTA } from "@/components/sections/ScholarshipsCTA";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { buildMetadata } from "@/components/seo/PageSEO";
import {
  FALLBACK_COUNTRIES,
  FALLBACK_FAQS,
  FALLBACK_TESTIMONIALS,
  FALLBACK_UNIVERSITIES,
  SERVICES,
} from "@/data/fallback";
import { createClient } from "@/lib/supabase/server";

export const metadata = buildMetadata({
  title: "Study Abroad with Confidence",
  description:
    "Find the right country, university, scholarship, and application path with expert guidance from start to visa.",
  path: "/",
});

async function getHomeData() {
  const supabase = await createClient();

  const [countriesRes, universitiesRes, testimonialsRes, faqsRes] =
    await Promise.all([
      supabase.from("countries").select("*").eq("is_published", true).limit(6),
      supabase
        .from("universities")
        .select("*")
        .eq("is_published", true)
        .eq("is_featured", true)
        .limit(3),
      supabase
        .from("testimonials")
        .select("*, countries(name), universities(name)")
        .eq("is_published", true)
        .limit(3),
      supabase
        .from("faqs")
        .select("*")
        .eq("is_published", true)
        .order("sort_order")
        .limit(6),
    ]);

  return {
    countries: countriesRes.data?.length
      ? countriesRes.data
      : FALLBACK_COUNTRIES,
    universities: universitiesRes.data?.length
      ? universitiesRes.data
      : FALLBACK_UNIVERSITIES,
    testimonials: testimonialsRes.data?.length
      ? testimonialsRes.data
      : FALLBACK_TESTIMONIALS,
    faqs: faqsRes.data?.length ? faqsRes.data : FALLBACK_FAQS,
  };
}

export default async function HomePage() {
  const { countries, universities, testimonials, faqs } = await getHomeData();

  return (
    <>
      <HeroSection />
      <TrustBar />
      <PopularDestinations countries={countries} />
      <HowItWorks />
      <ServicesSection services={[...SERVICES]} />
      <EligibilityCTA />
      <FeaturedUniversities universities={universities} />
      <ScholarshipsCTA />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <FinalCTA />
    </>
  );
}
