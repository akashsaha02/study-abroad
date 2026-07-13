import { EligibilityCheckerForm } from "@/components/forms/EligibilityCheckerForm";
import { buildMetadata } from "@/components/seo/PageSEO";
import { POPULAR_COUNTRIES } from "@/constants";
import { getUser } from "@/lib/auth/get-user";
import { getPublishedCountries } from "@/lib/services/content";
import { getStudentByProfileId } from "@/lib/services/students";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("public.eligibility");
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/eligibility-checker",
  });
}

export default async function EligibilityCheckerPage() {
  const user = await getUser();
  const [countries, student] = await Promise.all([
    getPublishedCountries(),
    user ? getStudentByProfileId(user.id) : Promise.resolve(null),
  ]);

  const countryOptions =
    countries.length > 0
      ? countries.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
      : POPULAR_COUNTRIES.map((c, i) => ({ id: String(i), name: c.name, slug: c.slug }));

  const initialValues = {
    name: user?.profile?.full_name ?? undefined,
    phone: user?.profile?.phone ?? undefined,
    email: user?.profile?.email ?? user?.email ?? undefined,
    education_level: student?.highest_education ?? undefined,
    english_test_type: student?.english_test_type ?? undefined,
    english_test_score: student?.english_test_score ?? undefined,
    preferred_country_id: student?.preferred_country_ids?.[0] ?? student?.preferred_country_id ?? undefined,
    preferred_subject: student?.preferred_subject ?? undefined,
    budget: student?.budget != null ? String(student.budget) : undefined,
  };

  return (
    <EligibilityCheckerForm countries={countryOptions} initialValues={initialValues} />
  );
}
