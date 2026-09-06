import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { PanelCard } from "@/components/common/PanelCard";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { ConsultationRequestForm } from "@/components/forms/ConsultationRequestForm";
import { buildMetadata } from "@/components/seo/PageSEO";
import { POPULAR_COUNTRIES } from "@/constants";
import { getUser } from "@/lib/auth/get-user";
import { resolveLeadContextFromSlugs } from "@/lib/leads/context";
import { getPublishedCountries } from "@/lib/services/content";
import {
  Calendar01Icon,
  Location01Icon,
  Mail01Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("public.consultation");
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/book-consultation",
  });
}

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BookConsultationPage({ searchParams }: Props) {
  const t = await getTranslations("public.consultation");
  const params = await searchParams;
  const published = await getPublishedCountries();
  const countries =
    published.length > 0
      ? published.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
      : POPULAR_COUNTRIES.map((c, i) => ({ id: String(i), name: c.name, slug: c.slug }));

  const user = await getUser();
  const context = await resolveLeadContextFromSlugs({
    university: typeof params.university === "string" ? params.university : null,
    course: typeof params.course === "string" ? params.course : null,
    service: typeof params.service === "string" ? params.service : null,
    country: typeof params.country === "string" ? params.country : null,
    message: typeof params.message === "string" ? params.message : null,
  });

  const defaults = {
    ...context,
    name: user?.profile?.full_name ?? context.name,
    email: user?.profile?.email ?? user?.email ?? context.email,
    phone: user?.profile?.phone ?? context.phone,
  };

  const contactItems = [
    { icon: Location01Icon, title: t("office"), value: t("officeValue") },
    { icon: SmartPhone01Icon, title: t("phoneInfo"), value: "+880 1XXX-XXXXXX" },
    { icon: Mail01Icon, title: t("emailInfo"), value: "info@abroadly.com" },
  ];

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={Calendar01Icon}
        title={t("title")}
        description={t("description")}
      />
      <div className="grid gap-8 lg:grid-cols-5">
        <PanelCard title={t("formTitle")} className="lg:col-span-3">
          <ConsultationRequestForm countries={countries} defaults={defaults} />
        </PanelCard>
        <div className="space-y-5 lg:col-span-2">
          {contactItems.map((item) => (
            <SurfaceCard key={item.title} hover={false}>
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={item.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
