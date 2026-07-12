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

export const metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with Abroadly counselors for free study abroad consultation.",
  path: "/contact",
});

export default async function ContactPage() {
  const published = await getPublishedCountries();
  const countries =
    published.length > 0
      ? published.map((c) => ({ id: c.id, name: c.name }))
      : POPULAR_COUNTRIES.map((c, i) => ({ id: String(i), name: c.name }));

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Get in touch"
        eyebrowIcon={Message01Icon}
        title="Contact us"
        description="Book a free consultation or send us a message. We typically respond within 24 hours."
      />
      <div className="grid gap-8 lg:grid-cols-5">
        <PanelCard title="Send a message" className="lg:col-span-3">
          <ContactForm countries={countries} />
        </PanelCard>
        <div className="space-y-5 lg:col-span-2">
          {[
            {
              icon: Location01Icon,
              title: "Office",
              value: "Dhaka, Bangladesh",
            },
            {
              icon: SmartPhone01Icon,
              title: "Phone / WhatsApp",
              value: "+880 1XXX-XXXXXX",
            },
            {
              icon: Mail01Icon,
              title: "Email",
              value: "info@abroadly.com",
            },
          ].map((item) => (
            <SurfaceCard key={item.title} hover={false}>
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={item.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.value}
                  </p>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
