import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PopularDestinations } from "@/components/sections/PopularDestinations";
import { buildMetadata } from "@/components/seo/PageSEO";
import { FALLBACK_COUNTRIES, FALLBACK_FAQS } from "@/data/fallback";
import { getLocalizedFallbackFaqs } from "@/lib/fallback-i18n";
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

  const [countriesRes, faqsRes] = await Promise.all([
    supabase.from("countries").select("*").eq("is_published", true).limit(6),
    supabase
      .from("faqs")
      .select("*")
      .eq("is_published", true)
      .order("sort_order")
      .limit(4),
  ]);

  const usingFallbackCountries = !countriesRes.data?.length;
  const usingFallbackFaqs = !faqsRes.data?.length;

  return {
    countries: countriesRes.data?.length ? countriesRes.data : FALLBACK_COUNTRIES,
    faqs: faqsRes.data?.length ? faqsRes.data : FALLBACK_FAQS,
    usingFallbackCountries,
    usingFallbackFaqs,
  };
}

export default async function HomePage() {
  const { countries, faqs, usingFallbackCountries, usingFallbackFaqs } =
    await getHomeData();

  const tFaqs = await getTranslations("fallback.faqs");
  const displayFaqs = usingFallbackFaqs
    ? getLocalizedFallbackFaqs((key) => tFaqs(key as "q1" | "a1" | "q2" | "a2" | "q3" | "a3" | "q4" | "a4"))
    : faqs;

  return (
    <>
      <HeroSection />
      <HowItWorks />
      <PopularDestinations
        countries={countries}
        useFallbackDescriptions={usingFallbackCountries}
      />
      <FAQSection faqs={displayFaqs} />
      <FinalCTA />
    </>
  );
}
