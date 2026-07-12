import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { PanelCard } from "@/components/common/PanelCard";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildMetadata } from "@/components/seo/PageSEO";
import { POPULAR_COUNTRIES } from "@/constants";
import { getPublishedCountries } from "@/lib/services/content";
import {
  Location01Icon,
  Mail01Icon,
  Message01Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("public.contact");
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/contact",
  });
}

export default async function ContactPage() {
  const t = await getTranslations("public.contact");
  const published = await getPublishedCountries();
  const countries =
    published.length > 0
      ? published.map((c) => ({ id: c.id, name: c.name }))
      : POPULAR_COUNTRIES.map((c, i) => ({ id: String(i), name: c.name }));

  const contactItems = [
    { icon: Location01Icon, title: t("office"), value: t("officeValue") },
    { icon: SmartPhone01Icon, title: t("phone"), value: "+880 1XXX-XXXXXX" },
    { icon: Mail01Icon, title: t("email"), value: "info@abroadly.com" },
  ];

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={Message01Icon}
        title={t("title")}
        description={t("description")}
      />
      <div className="grid gap-8 lg:grid-cols-5">
        <PanelCard title={t("formTitle")} className="lg:col-span-3">
          <ContactForm countries={countries} />
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
